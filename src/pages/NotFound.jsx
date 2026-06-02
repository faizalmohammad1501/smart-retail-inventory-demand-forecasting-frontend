import { Link } from 'react-router-dom'
import { SearchX, Home } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        {/* Large 404 graphic */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-6">
            <SearchX size={48} className="text-primary-600" />
          </div>
          <h1 className="text-8xl font-extrabold text-gray-200 leading-none select-none">
            404
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/dashboard"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound
