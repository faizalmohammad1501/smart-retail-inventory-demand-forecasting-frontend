import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DemandChart = ({ data = [] }) => {
  const defaultData = [
    { product: 'Product A', demand: 120, stock: 100 },
    { product: 'Product B', demand: 90, stock: 110 },
    { product: 'Product C', demand: 150, stock: 130 },
    { product: 'Product D', demand: 80, stock: 95 },
    { product: 'Product E', demand: 110, stock: 90 },
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Demand vs Stock</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="demand" fill="#F59E0B" />
          <Bar dataKey="stock" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DemandChart
