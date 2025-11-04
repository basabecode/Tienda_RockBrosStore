import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SimpleSearchBarProps {
  onSearch: (searchTerm: string) => void
  placeholder?: string
  className?: string
}

export const SimpleSearchBar = ({
  onSearch,
  placeholder = 'Buscar productos...',
  className = '',
}: SimpleSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)

    // Scroll a productos
    const productsSection = document.getElementById('shop')
    if (productsSection && searchTerm) {
      productsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gris-medio" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 bg-gris-medio/20 border-gris-medio/30 text-white placeholder-gris-medio focus:border-verde-neon focus:ring-verde-neon/20 w-64"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gris-medio hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  )
}

export default SimpleSearchBar
