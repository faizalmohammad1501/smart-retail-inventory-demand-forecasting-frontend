import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const PageLoader = ({ message = 'Loading...', fullScreen = true }) => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 font-medium">
          {message}
          <span className="inline-block w-6">{dots}</span>
        </p>
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12 px-4">
      {content}
    </div>
  )
}

export default PageLoader
