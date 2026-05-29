const Select = ({ error, disabled, options = [], placeholder = 'Select...', ...props }) => {
  const baseClasses =
    'w-full px-3 py-2 rounded-lg border text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white'

  return (
    <select
      {...props}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'}
        ${disabled ? 'bg-gray-50' : ''}
      `}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select
