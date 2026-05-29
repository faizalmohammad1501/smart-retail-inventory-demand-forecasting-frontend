const Container = ({ children, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
  }

  return (
    <div className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export default Container
