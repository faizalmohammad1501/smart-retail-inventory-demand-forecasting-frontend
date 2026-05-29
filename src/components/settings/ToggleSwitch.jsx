const ToggleSwitch = ({ checked, onChange, label, description, disabled = false }) => {
  return (
    <label className={`flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 ${disabled ? 'opacity-60' : ''}`}>
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}
        aria-pressed={checked}
        disabled={disabled}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </button>
    </label>
  )
}

export default ToggleSwitch
