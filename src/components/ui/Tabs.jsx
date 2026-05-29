const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <div className="flex gap-2 overflow-x-auto -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.icon && <tab.icon className="inline mr-2" size={18} />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Tabs
