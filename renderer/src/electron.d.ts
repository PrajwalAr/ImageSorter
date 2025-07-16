declare global {
  interface Window {
    electronAPI: {
      openFileDialog: (options: Electron.OpenDialogOptions) => Promise<string | null>
      openDirectoryDialog: (options: Electron.OpenDialogOptions) => Promise<string | null>
      copyImages: (options: {
        csvPath: string
        srcDir: string
        destDir: string
        matchingMode: 'flexible' | 'explicit'
        prefix: string
        extension: string
      }) => Promise<{
        success: boolean
        copiedFiles?: string[]
        missingFiles?: string[]
        error?: string
      }>
    }
  }
}

export { }

