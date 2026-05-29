const FeedbackBanner = ({ type = 'success', message }) => {
  if (!message) return null

  const styles = {
    success: 'border-green-200 bg-green-50 text-green-700',
    error: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-blue-200 bg-blue-50 text-blue-700',
  }

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${styles[type] || styles.info}`}>
      {message}
    </div>
  )
}

export default FeedbackBanner
