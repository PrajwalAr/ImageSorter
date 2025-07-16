const { handleSelectCSV, handleCopyImages } = require('./ipcHandlers');

// Test handleSelectCSV
console.log('Testing CSV parsing...');
const mockEvent = {
  reply: (channel, data) => {
    console.log(`Event reply: ${channel}`, data);
  }
};

const path = require('path');

// Get absolute paths
const testCsvPath = path.join(__dirname, 'test.csv');
const testImagesDir = path.join(__dirname, 'test-images');
const copiedImagesDir = path.join(__dirname, 'copied-images');

// Test valid CSV
handleSelectCSV(mockEvent, testCsvPath)
  .then(() => {
    console.log('Valid CSV test completed');
  })
  .catch(err => {
    console.error('Valid CSV test failed:', err);
  });

// Test handleCopyImages
console.log('Testing image copying...');
const testImages = [
  { filename: 'test1.jpg', new_filename: 'copy1.jpg' },
  { filename: 'test2.png', new_filename: 'copy2.png' }
];

handleCopyImages(mockEvent, {
  csvData: testImages,
  sourceDir: testImagesDir,
  destDir: copiedImagesDir
})
.then(() => {
  console.log('Image copying test completed');
})
.catch(err => {
  console.error('Image copying test failed:', err);
});
