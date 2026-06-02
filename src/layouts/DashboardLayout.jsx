import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import ErrorBoundary from '../components/common/ErrorBoundary'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar  = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <main className="pt-16 lg:pl-64 transition-all duration-300">
        <div className="p-6">
          {/* Per-page error boundary — resets when the route changes */}
          <ErrorBoundary
            key={location.pathname}
            fallbackMessage="This page encountered an error. Please try again or navigate elsewhere."
          >
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
