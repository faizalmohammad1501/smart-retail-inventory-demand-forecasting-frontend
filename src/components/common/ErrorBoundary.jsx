import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })

    // In production, report to a monitoring service here
    if (import.meta.env.VITE_APP_ENV === 'production') {
      // e.g. Sentry.captureException(error, { extra: errorInfo })
    } else {
      console.error('[ErrorBoundary]', error, errorInfo)
    }
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <AlertTriangle size={40} className="text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-500 mb-8">
                {this.props.fallbackMessage ||
                  'An unexpected error occurred. You can try refreshing the page or return to the dashboard.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn-primary inline-flex items-center gap-2 px-5 py-2.5"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
                <button
                  onClick={() => { window.location.href = '/dashboard' }}
                  className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5"
                >
                  <Home size={16} />
                  Go to Dashboard
                </button>
              </div>

              {isDev && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
                    Show error details (dev only)
                  </summary>
                  <pre className="mt-3 p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
