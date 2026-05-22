import { Calendar } from 'lucide-react'
import { useState } from 'react'

const DateRangePicker = ({ value, onChange, presets = true }) => {
  const [showCustom, setShowCustom] = useState(false)

  const presetRanges = [
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 90 Days', value: '90days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'This Year', value: 'thisYear' },
    { label: 'Custom Range', value: 'custom' },
  ]

  const handlePresetChange = (preset) => {
    if (preset === 'custom') {
      setShowCustom(true)
    } else {
      setShowCustom(false)
      onChange({ preset })
    }
  }

  return (
    <div className="space-y-3">
      {presets && (
        <div className="flex flex-wrap gap-2">
          {presetRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handlePresetChange(range.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                value === range.value || (range.value === 'custom' && showCustom)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {showCustom && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar size={18} className="text-gray-600" />
            <input
              type="date"
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
          </div>
          <span className="text-gray-500">to</span>
          <input
            type="date"
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
