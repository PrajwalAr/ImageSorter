import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

function App() {
  const { toast } = useToast()
  const [csvPath, setCsvPath] = useState('')
  const [srcDir, setSrcDir] = useState('')
  const [destDir, setDestDir] = useState('')
  const [matchingMode, setMatchingMode] = useState<'flexible' | 'explicit'>('flexible')
  const [prefix, setPrefix] = useState('')
  const [extension, setExtension] = useState('.JPG')
  const [copiedFiles, setCopiedFiles] = useState<string[]>([])
  const [missingFiles, setMissingFiles] = useState<string[]>([])
  const [isCopying, setIsCopying] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleSelectCsv = async () => {
    try {
      const path = await window.electronAPI.openFileDialog({
        properties: ['openFile'],
        filters: [{ name: 'CSV Files', extensions: ['csv'] }]
      })
      if (path) setCsvPath(path)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to select CSV file', variant: 'destructive' })
    }
  }

  const handleSelectSrcDir = async () => {
    try {
      const path = await window.electronAPI.openDirectoryDialog({})
      if (path) setSrcDir(path)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to select source directory', variant: 'destructive' })
    }
  }

  const handleSelectDestDir = async () => {
    try {
      const path = await window.electronAPI.openDirectoryDialog({})
      if (path) setDestDir(path)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to select destination directory', variant: 'destructive' })
    }
  }

  const handleCopy = async () => {
    if (!csvPath) {
      toast({ title: 'Error', description: 'Please select a CSV file', variant: 'destructive' })
      return
    }
    if (!srcDir) {
      toast({ title: 'Error', description: 'Please select a source directory', variant: 'destructive' })
      return
    }
    if (!destDir) {
      toast({ title: 'Error', description: 'Please select a destination directory', variant: 'destructive' })
      return
    }

    if (matchingMode === 'explicit') {
      if (!prefix.trim()) {
        toast({ title: 'Error', description: 'Prefix is required for explicit matching', variant: 'destructive' })
        return
      }
      if (!extension.trim()) {
        toast({ title: 'Error', description: 'Extension is required for explicit matching', variant: 'destructive' })
        return
      }
    }

    setIsCopying(true)
    setProgress(0)
    setCopiedFiles([])
    setMissingFiles([])
    toast({ title: 'Starting', description: 'Copy operation initiated' })

    try {
      const result = await window.electronAPI.copyImages({
        csvPath,
        srcDir,
        destDir,
        matchingMode,
        prefix: matchingMode === 'explicit' ? prefix : '',
        extension: matchingMode === 'explicit' ? extension : ''
      })

      if (result.success) {
        setCopiedFiles(result.copiedFiles || [])
        setMissingFiles(result.missingFiles || [])
        toast({ title: 'Success', description: `Copied ${result.copiedFiles?.length || 0} files successfully` })
      } else {
        toast({ title: 'Error', description: result.error || 'Copy operation failed', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' })
    } finally {
      setIsCopying(false)
      setProgress(100)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster />
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Image Copier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* CSV File Selection */}
            <div className="flex items-center space-x-4">
              <Input value={csvPath} placeholder="CSV File Path" readOnly />
              <Button onClick={handleSelectCsv}>Select CSV File</Button>
            </div>

            {/* Source Directory Selection */}
            <div className="flex items-center space-x-4">
              <Input value={srcDir} placeholder="Source Image Directory" readOnly />
              <Button onClick={handleSelectSrcDir}>Select Source Directory</Button>
            </div>

            {/* Matching Options */}
            <Tabs value={matchingMode} onValueChange={(v) => setMatchingMode(v as 'flexible' | 'explicit')}>
              <TabsList>
                <TabsTrigger value="flexible">Flexible Matching</TabsTrigger>
                <TabsTrigger value="explicit">Explicit Matching</TabsTrigger>
              </TabsList>
              <TabsContent value="flexible">
                <p className="text-sm text-muted-foreground">
                  Matches any file containing the CSV entry (e.g., "123" matches "ABC_123_XYZ.JPG")
                </p>
              </TabsContent>
              <TabsContent value="explicit">
                <div className="flex space-x-4">
                  <Input
                    value={prefix}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrefix(e.target.value)}
                    placeholder="Prefix (e.g., AMC)"
                  />
                  <Input
                    value={extension}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setExtension(e.target.value.startsWith('.') ? e.target.value : `.${e.target.value}`)
                    }
                    placeholder="Extension (e.g., .JPG)"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Destination Directory Selection */}
            <div className="flex items-center space-x-4">
              <Input value={destDir} placeholder="Destination Directory" readOnly />
              <Button onClick={handleSelectDestDir}>Select Destination Directory</Button>
            </div>

            {/* Copy Button */}
            <Button onClick={handleCopy} disabled={isCopying} className="w-full">
              {isCopying ? 'Copying...' : 'Start Copy'}
            </Button>

            {/* Progress Indicator */}
            {isCopying && <Progress value={progress} className="w-full" />}

            {/* Results */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Successfully Copied Files</h3>
                <div className="bg-green-50 p-4 rounded max-h-60 overflow-y-auto">
                  {copiedFiles.map((file, i) => (
                    <div key={i} className="text-green-700 truncate">{file}</div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Missing Files</h3>
                <div className="bg-red-50 p-4 rounded max-h-60 overflow-y-auto">
                  {missingFiles.map((file, i) => (
                    <div key={i} className="text-red-700 truncate">{file}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
