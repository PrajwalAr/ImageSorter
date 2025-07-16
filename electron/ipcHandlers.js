import fs from 'fs-extra';
import path from 'path';

export const handleSelectCSV = async (event, filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    const rows = data.trim().split('\n');
    const headers = rows[0].split(',');
    const csvData = rows.slice(1).map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {});
    });
    event.reply('csv-data', csvData);
  } catch (error) {
    event.reply('csv-error', `Error reading CSV file: ${error.message}`);
  }
};

export const handleCopyImages = async (event, { csvData, sourceDir, destDir }) => {
  const results = { success: 0, errors: [] };
  
  // Ensure destination directory exists
  await fs.ensureDir(destDir);

  for (const row of csvData) {
    try {
      const sourcePath = path.join(sourceDir, row.filename);
      const destPath = path.join(destDir, row.new_filename || row.filename);
      await fs.copy(sourcePath, destPath);
      results.success++;
    } catch (error) {
      results.errors.push({
        filename: row.filename,
        error: error.message
      });
    }
  }

  event.reply('copy-complete', results);
};
