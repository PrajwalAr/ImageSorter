const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs-extra')
const csv = require('csv-parser')

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
    // For development testing of production build
    const devProdPath = path.join(__dirname, '../../renderer/dist/index.html')
    // For packaged app
    const packagedPath = path.join(process.resourcesPath, 'app/renderer/dist/index.html')
    
    const prodPath = fs.existsSync(devProdPath) ? devProdPath : packagedPath
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
      
      if (matchingMode === 'explicit') {
        const filename = `${prefix}${entry}${extension}`
        const srcPath = path.join(srcDir, filename)
        if (await fs.pathExists(srcPath)) {
          const destPath = path.join(destDir, filename)
          await fs.copy(srcPath, destPath)
          copiedFiles.push(filename)
          found = true
        }
      } else { // flexible matching
        const files = await fs.readdir(srcDir)
        const matchingFile = files.find(file => 
          file.includes(entry) && 
          ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
        )
        
        if (matchingFile) {
          const srcPath = path.join(srcDir, matchingFile)
          const destPath = path.join(destDir, matchingFile)
          await fs.copy(srcPath, destPath)
          copiedFiles.push(matchingFile)
          found = true
        }
      }
      
      if (!found) {
        missingFiles.push(entry)
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
