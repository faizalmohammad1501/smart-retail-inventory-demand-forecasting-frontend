import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const TrendChart = ({ data = [], title, dataKeys = [], colors = ['#3B82F6', '#10B981'] }) => {
  const defaultData = [
    { month: 'Jan', actual: 4200, forecast: 4000 },
    { month: 'Feb', actual: 3800, forecast: 4100 },
    { month: 'Mar', actual: 5200, forecast: 4900 },
    { month: 'Apr', actual: 4800, forecast: 5100 },
    { month: 'May', actual: 6200, forecast: 5800 },
    { month: 'Jun', actual: 5800, forecast: 6100 },
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <div className="card">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[1]} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors[1]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys[0] && (
            <Area 
              type="monotone" 
              dataKey={dataKeys[0]} 
              stroke={colors[0]} 
              fillOpacity={1} 
              fill="url(#colorActual)" 
            />
          )}
          {dataKeys[1] && (
            <Area 
              type="monotone" 
              dataKey={dataKeys[1]} 
              stroke={colors[1]} 
              fillOpacity={1} 
              fill="url(#colorForecast)"
              strokeDasharray="5 5"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendChart
