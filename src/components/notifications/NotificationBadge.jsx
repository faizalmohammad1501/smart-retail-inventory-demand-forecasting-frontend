const NotificationBadge = ({ count, size = 'md', position = 'top-right' }) => {
  if (!count || count === 0) return null

  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  }

  const positionClasses = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1'
  }

  const displayCount = count > 99 ? '99+' : count

  return (
    <span
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} flex items-center justify-center bg-red-600 text-white font-bold rounded-full ring-2 ring-white`}
    >
      {displayCount}
    </span>
  )
}

export default NotificationBadge
