module.exports = {
  packagerConfig: {
    entry: 'electron/main.js'
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      config: {
        platforms: ['win32', 'darwin', 'linux']
      }
    }
  ]
};
