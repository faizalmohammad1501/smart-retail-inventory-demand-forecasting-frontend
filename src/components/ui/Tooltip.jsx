const Tooltip = ({ text, children, position = 'top' }) => {
  const positions = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        className={`absolute hidden group-hover:block ${positions[position]} left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none`}
      >
        {text}
      </div>
    </div>
  )
}

export default Tooltip
