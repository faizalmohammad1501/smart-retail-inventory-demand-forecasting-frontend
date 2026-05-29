const Input = ({ error, disabled, icon: Icon, variant = 'default', ...props }) => {
  const variants = {
    default: 'border-gray-300 focus:border-primary focus:ring-primary',
    filled: 'border-none bg-gray-100 focus:bg-gray-200',
  }

  const baseClasses =
    'w-full px-3 py-2 rounded-lg border text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
      <input
        {...props}
        disabled={disabled}
        className={`
          ${baseClasses}
          ${Icon ? 'pl-9' : 'pl-3'}
          ${error ? 'border-red-500 focus:ring-red-500' : variants[variant]}
          ${disabled ? 'bg-gray-50' : ''}
        `}
      />
    </div>
  )
}

export default Input
