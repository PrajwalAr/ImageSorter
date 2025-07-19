const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs-extra')
const csv = require('csv-parser')

// Helper function to resolve filenames with case insensitivity
async function resolveFilename(sourceDir, entry, matchingMode, prefix = '', extension = '') {
  const normalizedEntry = entry.trim();
  const files = await fs.readdir(sourceDir);
  
  if (matchingMode === 'explicit') {
    // Construct explicit filename
    const explicitName = `${prefix}${normalizedEntry}${extension}`;
    const match = files.find(f => f.toLowerCase() === explicitName.toLowerCase());
    return match || null;
  } 
  
  // Flexible mode - try three strategies in sequence
  // Strategy 1: Exact base name match
  const baseMatch = files.find(file => {
    const base = path.basename(file, path.extname(file));
    return base.toLowerCase() === normalizedEntry.toLowerCase();
  });
  
  if (baseMatch) return baseMatch;
  
  // Strategy 2: Common extension fallback
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  for (const ext of imageExtensions) {
    const candidate = `${normalizedEntry}${ext}`;
    if (files.some(f => f.toLowerCase() === candidate.toLowerCase())) {
      return candidate;
    }
  }
  
  // Strategy 3: Partial matching (new enhancement)
  // Find files where normalizedEntry is a substring of the base name
  const partialMatches = files.filter(file => {
    const base = path.basename(file, path.extname(file)).toLowerCase();
    return base.includes(normalizedEntry.toLowerCase());
  });

  // Handle partial matches deterministically
  if (partialMatches.length > 0) {
    // Prefer exact matches at the end of filename (e.g. "593" in "879593")
    const endMatches = partialMatches.filter(file => {
      const base = path.basename(file, path.extname(file)).toLowerCase();
      return base.endsWith(normalizedEntry.toLowerCase());
    });

    // Return end match if exists (more specific), otherwise first partial match
    return endMatches.length > 0 ? endMatches[0] : partialMatches[0];
  }
  
  return null; // No match found
}

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5174')
    mainWindow.webContents.on('did-finish-load', () => {
      if (!mainWindow.isDestroyed()) {
        mainWindow.show()
      }
    })
    mainWindow.webContents.openDevTools()
  } else {
    const prodPath = process.env.NODE_ENV === 'development' 
      ? path.join(__dirname, '../../renderer/dist/index.html')
      : path.join(process.resourcesPath, 'app/renderer/dist/index.html');

    console.log('Production path resolved to:', prodPath)
    
    mainWindow.loadFile(prodPath).catch(err => {
      console.error(`Failed to load: ${prodPath}`, err)
      dialog.showErrorBox('Load Error', `Failed to load application: ${err.message}`)
    })
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers for file operations
ipcMain.handle('open-file-dialog', async (_, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options)
  return result.filePaths[0] || null
})

ipcMain.handle('open-directory-dialog', async (_, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    ...options,
    properties: ['openDirectory']
  })
  return result.filePaths[0] || null
})

ipcMain.handle('copy-images', async (event, { csvPath, srcDir, destDir, matchingMode, prefix, extension }) => {
  const missingFiles = []
  const copiedFiles = []
  
  try {
    // Read CSV file
    const csvData = []
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv({ headers: false }))
        .on('data', (row) => {
          const values = Object.values(row)
          if (values.length > 0) {
            csvData.push(...values.filter(v => v.trim() !== ''))
          }
        })
        .on('end', resolve)
        .on('error', reject)
      })
    // Send progress updates
    const total = csvData.length
    let processed = 0
    if (mainWindow) {
      mainWindow.webContents.send('copy-progress', 0)
    }

    // Process each entry
    for (const entry of csvData) {
      let found = false
      processed++
      
      // Calculate progress percentage
      const progress = Math.floor((processed / total) * 100)
      if (mainWindow) {
        mainWindow.webContents.send('copy-progress', progress)
      }
      
      const resolvedFilename = await resolveFilename(
        srcDir, 
        entry, 
        matchingMode, 
        prefix, 
        extension
      );

      if (resolvedFilename) {
        const srcPath = path.join(srcDir, resolvedFilename);
        const destPath = path.join(destDir, resolvedFilename);
        await fs.copy(srcPath, destPath);
        copiedFiles.push(resolvedFilename);
        found = true;
      }
      
      if (!found) {
        missingFiles.push(entry);
      }
    }
    
    return { success: true, missingFiles, copiedFiles }
  } catch (error) {
    console.error('Copy error:', error)
    return { success: false, error: error.message }
  } finally {
    // Ensure progress completes even on error
    if (mainWindow) {
      mainWindow.webContents.send('copy-progress', 100)
    }
  }
})
