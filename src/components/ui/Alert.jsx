const Alert = ({ variant = 'info', title, message, action, dismissible = false, onDismiss }) => {
  const variants = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    error: 'border-red-200 bg-red-50 text-red-900',
  }

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  }

  return (
    <div className={`rounded-lg border px-4 py-3 ${variants[variant]}`} role="alert">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl">{icons[variant]}</span>
          <div>
            {title && <h4 className="font-semibold">{title}</h4>}
            {message && <p className="text-sm mt-1">{message}</p>}
            {action && (
              <button
                onClick={action.onClick}
                className="mt-2 text-sm font-medium hover:underline"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="text-lg leading-none hover:opacity-75"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
