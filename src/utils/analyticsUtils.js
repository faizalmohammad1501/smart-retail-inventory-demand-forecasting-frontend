// Analytics and forecasting utility functions

export const calculateGrowthRate = (current, previous) => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const calculateAverageGrowth = (data, key) => {
  if (!data || data.length < 2) return 0
  
  let totalGrowth = 0
  for (let i = 1; i < data.length; i++) {
    const growth = calculateGrowthRate(data[i][key], data[i - 1][key])
    totalGrowth += growth
  }
  
  return totalGrowth / (data.length - 1)
}

export const predictNextValue = (data, key, periods = 1) => {
  if (!data || data.length < 2) return 0
  
  const avgGrowth = calculateAverageGrowth(data, key)
  const lastValue = data[data.length - 1][key]
  
  return lastValue * Math.pow(1 + avgGrowth / 100, periods)
}

export const getTopPerformers = (data, sortBy, limit = 5) => {
  return [...data]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, limit)
}

export const getLowPerformers = (data, sortBy, limit = 5) => {
  return [...data]
    .sort((a, b) => a[sortBy] - b[sortBy])
    .slice(0, limit)
}

export const calculateSeasonalIndex = (data, period = 12) => {
  const seasonalData = {}
  
  data.forEach((item, index) => {
    const season = index % period
    if (!seasonalData[season]) {
      seasonalData[season] = []
    }
    seasonalData[season].push(item.value)
  })
  
  const indices = {}
  Object.keys(seasonalData).forEach(season => {
    const avg = seasonalData[season].reduce((a, b) => a + b, 0) / seasonalData[season].length
    const overallAvg = data.reduce((a, b) => a + b.value, 0) / data.length
    indices[season] = (avg / overallAvg) * 100
  })
  
  return indices
}

export const categorizeProducts = (products) => {
  const categories = {}
  
  products.forEach(product => {
    const category = product.category || 'Other'
    if (!categories[category]) {
      categories[category] = {
        count: 0,
        totalValue: 0,
        totalStock: 0,
      }
    }
    categories[category].count++
    categories[category].totalValue += product.price * product.quantity
    categories[category].totalStock += product.quantity
  })
  
  return Object.entries(categories).map(([name, data]) => ({
    name,
    ...data,
    avgPrice: data.totalValue / data.totalStock || 0,
  }))
}

export const calculateForecastAccuracy = (actual, forecast) => {
  if (actual.length !== forecast.length || actual.length === 0) return 0
  
  let totalError = 0
  for (let i = 0; i < actual.length; i++) {
    totalError += Math.abs((actual[i] - forecast[i]) / actual[i])
  }
  
  return (1 - totalError / actual.length) * 100
}

export const generateDemandForecast = (historicalData, periods = 6) => {
  const forecast = []
  const avgGrowth = calculateAverageGrowth(historicalData, 'value')
  
  let lastValue = historicalData[historicalData.length - 1].value
  
  for (let i = 1; i <= periods; i++) {
    lastValue = lastValue * (1 + avgGrowth / 100)
    forecast.push({
      period: `+${i}`,
      value: Math.round(lastValue),
      confidence: Math.max(100 - (i * 5), 70) // Confidence decreases over time
    })
  }
  
  return forecast
}

export const getReorderRecommendations = (products) => {
  return products
    .filter(product => product.quantity <= product.reorderLevel)
    .map(product => ({
      ...product,
      recommendedQuantity: Math.max(
        product.reorderLevel * 2 - product.quantity,
        product.reorderLevel
      ),
      priority: product.quantity === 0 ? 'high' : 'medium',
      daysUntilStockout: product.quantity === 0 ? 0 : Math.round(product.quantity / 5) // Assuming 5 units/day consumption
    }))
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority === 'high' ? -1 : 1
      }
      return a.daysUntilStockout - b.daysUntilStockout
    })
}

export const calculateTurnoverRate = (salesData, inventory) => {
  const totalSales = salesData.reduce((sum, item) => sum + item.value, 0)
  const avgInventory = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0) / inventory.length
  
  return totalSales / avgInventory
}

export const identifyTrends = (data, threshold = 3) => {
  const trends = []
  let currentTrend = null
  let trendLength = 0
  
  for (let i = 1; i < data.length; i++) {
    const direction = data[i].value > data[i - 1].value ? 'up' : 'down'
    
    if (currentTrend === direction) {
      trendLength++
    } else {
      if (trendLength >= threshold) {
        trends.push({
          direction: currentTrend,
          length: trendLength,
          endIndex: i - 1
        })
      }
      currentTrend = direction
      trendLength = 1
    }
  }
  
  if (trendLength >= threshold) {
    trends.push({
      direction: currentTrend,
      length: trendLength,
      endIndex: data.length - 1
    })
  }
  
  return trends
}

export const formatDateRange = (preset) => {
  const today = new Date()
  let startDate, endDate
  
  switch (preset) {
    case '7days':
      startDate = new Date(today.setDate(today.getDate() - 7))
      endDate = new Date()
      break
    case '30days':
      startDate = new Date(today.setDate(today.getDate() - 30))
      endDate = new Date()
      break
    case '90days':
      startDate = new Date(today.setDate(today.getDate() - 90))
      endDate = new Date()
      break
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date()
      break
    case 'lastMonth':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    case 'thisYear':
      startDate = new Date(today.getFullYear(), 0, 1)
      endDate = new Date()
      break
    default:
      startDate = new Date(today.setDate(today.getDate() - 30))
      endDate = new Date()
  }
  
  return { startDate, endDate }
}
