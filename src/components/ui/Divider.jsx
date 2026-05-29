const Divider = ({ variant = 'solid', spacing = 'md', className = '' }) => {
  const spacings = {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
  }

  const variants = {
    solid: 'border-t border-gray-200',
    dashed: 'border-t-2 border-dashed border-gray-300',
    dotted: 'border-t-2 border-dotted border-gray-300',
  }

  return <div className={`${variants[variant]} ${spacings[spacing]} ${className}`}></div>
}

export default Divider
