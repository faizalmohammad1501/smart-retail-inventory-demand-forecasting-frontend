const PermissionMatrix = ({ permissions = {}, onToggle, readOnly = false }) => {
  const modules = [
    { key: 'inventory', label: 'Inventory' },
    { key: 'forecast', label: 'Forecast' },
    { key: 'reports', label: 'Reports' },
    { key: 'orders', label: 'Purchase Orders' },
    { key: 'suppliers', label: 'Suppliers' },
    { key: 'users', label: 'User Management' },
  ]

  const actions = ['view', 'create', 'edit', 'delete']

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[680px]">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Module</th>
            {actions.map((action) => (
              <th key={action} className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                {action}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {modules.map((module) => (
            <tr key={module.key} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{module.label}</td>
              {actions.map((action) => {
                const value = Boolean(permissions?.[module.key]?.[action])
                return (
                  <td key={`${module.key}-${action}`} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={value}
                      disabled={readOnly}
                      onChange={() => onToggle(module.key, action, !value)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PermissionMatrix
