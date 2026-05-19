import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const SalesChart = ({ data = [] }) => {
  const defaultData = [
    { month: 'Jan', sales: 4000, forecast: 4200 },
    { month: 'Feb', sales: 3000, forecast: 3200 },
    { month: 'Mar', sales: 5000, forecast: 4800 },
    { month: 'Apr', sales: 4500, forecast: 4600 },
    { month: 'May', sales: 6000, forecast: 5900 },
    { month: 'Jun', sales: 5500, forecast: 5700 },
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
          <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesChart
