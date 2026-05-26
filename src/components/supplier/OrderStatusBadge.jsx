import { Clock, CheckCircle, Truck, Package as PackageIcon, XCircle } from 'lucide-react'
import { getOrderStatus } from '../../utils/supplierUtils'

const OrderStatusBadge = ({ status, size = 'md', showIcon = true }) => {
  const config = getOrderStatus(status)
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18
  }

  const icons = {
    Clock,
    CheckCircle,
    Truck,
    Package: PackageIcon,
    XCircle
  }

  const IconComponent = icons[config.icon]

  return (
    <span className={`inline-flex items-center space-x-1 font-medium rounded-full ${config.class} ${sizeClasses[size]}`}>
      {showIcon && IconComponent && <IconComponent size={iconSize[size]} />}
      <span>{config.label}</span>
    </span>
  )
}

export default OrderStatusBadge
