import { useState } from 'react'
import { Menu, User, LogOut, Settings, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import NotificationPanel from '../notifications/NotificationPanel'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    removeNotification,
    clearNotifications 
  } = useNotifications()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleNotificationClick = (notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="ml-4 text-xl font-bold text-primary">
              Smart Retail Platform
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationPanel
              notifications={notifications}
              onRead={markNotificationRead}
              onReadAll={markAllNotificationsRead}
              onDelete={removeNotification}
              onClearAll={clearNotifications}
              onNotificationClick={handleNotificationClick}
            />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name || 'User'}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/users')
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Users size={16} />
                    <span>User Management</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      logout()
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
