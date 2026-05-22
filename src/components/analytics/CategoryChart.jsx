import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const CategoryChart = ({ data = [], title }) => {
  const defaultData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Food & Beverages', value: 20, color: '#F59E0B' },
    { name: 'Home & Garden', value: 12, color: '#EF4444' },
    { name: 'Other', value: 8, color: '#8B5CF6' },
  ]

  const chartData = data.length > 0 ? data : defaultData
  const COLORS = chartData.map(item => item.color || '#3B82F6')

  return (
    <div className="card">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryChart
