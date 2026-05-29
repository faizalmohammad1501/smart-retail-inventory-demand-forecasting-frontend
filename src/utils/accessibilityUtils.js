// Accessibility utilities and helpers

/**
 * Generate accessible ARIA attributes for interactive elements
 */
export const getAriaAttributes = {
  button: (label, disabled = false) => ({
    'aria-label': label,
    'aria-disabled': disabled,
  }),
  
  modal: (title) => ({
    role: 'dialog',
    'aria-labelledby': 'modal-title',
    'aria-modal': true,
  }),
  
  alert: (type = 'info') => ({
    role: 'alert',
    'aria-live': type === 'error' ? 'assertive' : 'polite',
  }),
  
  tab: (selected) => ({
    role: 'tab',
    'aria-selected': selected,
  }),
  
  combobox: (expanded) => ({
    role: 'combobox',
    'aria-expanded': expanded,
    'aria-haspopup': 'listbox',
  }),
}

/**
 * Get keyboard navigation handler
 */
export const handleKeyboardNavigation = {
  arrows: (key, currentIndex, itemCount, callback) => {
    let newIndex = currentIndex
    
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % itemCount
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + itemCount) % itemCount
    } else if (key === 'Home') {
      newIndex = 0
    } else if (key === 'End') {
      newIndex = itemCount - 1
    } else {
      return
    }
    
    callback(newIndex)
  },
  
  toggle: (key, currentState, callback) => {
    if (key === 'Enter' || key === ' ') {
      callback(!currentState)
    }
  },
}

/**
 * Skip to main content link
 */
export const SkipToMainContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only absolute top-0 left-0 p-4 bg-primary text-white font-semibold rounded-b-lg z-50"
    >
      Skip to main content
    </a>
  )
}

/**
 * Screen reader only text
 */
export const ScreenReaderText = ({ children }) => {
  return <span className="sr-only">{children}</span>
}

/**
 * Announce to screen readers
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement is read
  setTimeout(() => announcement.remove(), 1000)
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Focus first focusable element
   */
  focusFirstElement: (container) => {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length > 0) {
      focusable[0].focus()
    }
  },

  /**
   * Focus last focusable element
   */
  focusLastElement: (container) => {
    const focusable = Array.from(
      container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    )
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus()
    }
  },

  /**
   * Trap focus within container
   */
  trapFocus: (e, container) => {
    if (e.key !== 'Tab') return

    const focusable = Array.from(
      container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    )
    
    if (!focusable.length) return

    const firstElement = focusable[0]
    const lastElement = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  },
}
