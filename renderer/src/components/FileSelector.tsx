import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface FileSelectorProps {
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

const FileSelector = ({ label, onClick, disabled = false, loading = false }: FileSelectorProps) => {
  return (
    <Button onClick={onClick} disabled={disabled || loading} className="w-48">
      {loading ? <Loader2 data-testid="loading-spinner" className="animate-spin h-5 w-5" /> : label}
    </Button>
  )
}

export default FileSelector
