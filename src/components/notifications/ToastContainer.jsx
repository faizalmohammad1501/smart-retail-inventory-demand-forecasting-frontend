import { createPortal } from 'react-dom'
import Toast from './Toast'

const ToastContainer = ({ toasts, onClose }) => {
  return createPortal(
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>,
    document.body
  )
}

export default ToastContainer
