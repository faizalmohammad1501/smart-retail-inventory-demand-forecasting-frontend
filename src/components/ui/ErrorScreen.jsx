import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ErrorScreen = ({ code = '500', title = 'Error', message, action, showHome = true }) => {
  const navigate = useNavigate()

  const errorMessages = {
    400: { title: 'Bad Request', message: 'The request could not be understood by the server.' },
    401: { title: 'Unauthorized', message: 'Please log in to access this resource.' },
    403: { title: 'Forbidden', message: 'You do not have permission to access this resource.' },
    404: { title: 'Not Found', message: 'The page or resource you are looking for does not exist.' },
    500: { title: 'Server Error', message: 'Something went wrong on our end. Please try again later.' },
    503: { title: 'Service Unavailable', message: 'The service is temporarily unavailable. Please try again later.' },
  }

  const errorInfo = errorMessages[code] || { title, message }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center space-y-6">
          <div className="inline-block p-4 bg-red-100 rounded-full">
            <AlertTriangle size={48} className="text-red-600" />
          </div>

          <div>
            <div className="text-5xl font-bold text-gray-800 mb-2">{code}</div>
            <h1 className="text-2xl font-bold text-gray-800">{errorInfo.title}</h1>
          </div>

          <p className="text-gray-600">{errorInfo.message}</p>

          <div className="flex flex-col gap-3">
            {action && (
              <button
                onClick={action.onClick}
                className="inline-flex items-center justify-center gap-2 btn-primary"
              >
                <RefreshCw size={18} />
                {action.label}
              </button>
            )}
            {showHome && (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Home size={18} />
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorScreen
