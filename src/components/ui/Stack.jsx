const Stack = ({ direction = 'vertical', spacing = 'md', children, className = '' }) => {
  const spacings = {
    sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
  }

  const directionClasses = direction === 'vertical' ? 'flex flex-col' : 'flex flex-row flex-wrap'

  return (
    <div className={`${directionClasses} ${spacings[spacing]} ${className}`}>
      {children}
    </div>
  )
}

export default Stack
