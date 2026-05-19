const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-gray-600">Loading...</div>
      </div>
    </div>
  )
}

export default Loader
