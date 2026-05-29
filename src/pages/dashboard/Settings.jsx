import { useState } from 'react'
import { Settings as SettingsIcon, Bell, LayoutDashboard, Store, ServerCog } from 'lucide-react'
import SettingSection from '../../components/settings/SettingSection'
import ToggleSwitch from '../../components/settings/ToggleSwitch'
import FeedbackBanner from '../../components/settings/FeedbackBanner'
import { settingsService } from '../../services/api'

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: 'Smart Retail HQ',
    currency: 'USD',
    timezone: 'UTC-05:00',
    locale: 'en-US',
    lowStockThreshold: 15,
    defaultForecastHorizon: 30,
    notifications: {
      lowStockEmail: true,
      orderStatusSms: false,
      weeklyDigest: true,
      browserAlerts: true,
    },
    dashboard: {
      showRevenue: true,
      showForecast: true,
      showLowStock: true,
      compactCards: false,
    },
    system: {
      maintenanceMode: false,
      autoBackup: true,
      auditLogs: true,
      twoFactorRequired: false,
    },
  })

  const [feedback, setFeedback] = useState({ type: 'info', message: '' })
  const [savingSection, setSavingSection] = useState('')

  const updateRootField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (group, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }))
  }

  const saveSection = async (section, payload) => {
    setSavingSection(section)
    setFeedback({ type: 'info', message: '' })

    try {
      await settingsService.update(section, payload)
      setFeedback({ type: 'success', message: `${section} settings saved successfully.` })
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || `Failed to save ${section} settings.` })
    } finally {
      setSavingSection('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="mt-1 text-gray-600">Configure store preferences, dashboard behavior, and system controls.</p>
      </div>

      <FeedbackBanner type={feedback.type} message={feedback.message} />

      <SettingSection
        title="Store Preferences"
        description="Manage base store metadata and defaults used in reports and analytics."
        actions={
          <button
            type="button"
            onClick={() => saveSection('store', {
              storeName: settings.storeName,
              currency: settings.currency,
              timezone: settings.timezone,
              locale: settings.locale,
            })}
            disabled={savingSection === 'store'}
            className="btn-primary"
          >
            {savingSection === 'store' ? 'Saving...' : 'Save Store'}
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Store Name</label>
            <div className="relative">
              <Store size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => updateRootField('storeName', e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => updateRootField('currency', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => updateRootField('timezone', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="UTC-05:00">UTC-05:00</option>
              <option value="UTC+00:00">UTC+00:00</option>
              <option value="UTC+05:30">UTC+05:30</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Locale</label>
            <select
              value={settings.locale}
              onChange={(e) => updateRootField('locale', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="en-IN">English (IN)</option>
            </select>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Notification Preferences"
        description="Set how teams receive operational alerts and daily summaries."
        actions={
          <button
            type="button"
            onClick={() => saveSection('notifications', settings.notifications)}
            disabled={savingSection === 'notifications'}
            className="btn-primary"
          >
            {savingSection === 'notifications' ? 'Saving...' : 'Save Notifications'}
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ToggleSwitch
            checked={settings.notifications.lowStockEmail}
            onChange={(value) => updateNestedField('notifications', 'lowStockEmail', value)}
            label="Low stock email alerts"
            description="Send an alert when stock falls below threshold."
          />
          <ToggleSwitch
            checked={settings.notifications.orderStatusSms}
            onChange={(value) => updateNestedField('notifications', 'orderStatusSms', value)}
            label="Order status SMS"
            description="Notify order owners when status changes."
          />
          <ToggleSwitch
            checked={settings.notifications.weeklyDigest}
            onChange={(value) => updateNestedField('notifications', 'weeklyDigest', value)}
            label="Weekly performance digest"
            description="Automatic weekly summary for leadership."
          />
          <ToggleSwitch
            checked={settings.notifications.browserAlerts}
            onChange={(value) => updateNestedField('notifications', 'browserAlerts', value)}
            label="Browser notifications"
            description="In-app real-time alerts while logged in."
          />
        </div>
      </SettingSection>

      <SettingSection
        title="Dashboard Customization"
        description="Choose what widgets appear by default for dashboard users."
        actions={
          <button
            type="button"
            onClick={() => saveSection('dashboard', settings.dashboard)}
            disabled={savingSection === 'dashboard'}
            className="btn-primary"
          >
            {savingSection === 'dashboard' ? 'Saving...' : 'Save Dashboard'}
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ToggleSwitch
            checked={settings.dashboard.showRevenue}
            onChange={(value) => updateNestedField('dashboard', 'showRevenue', value)}
            label="Revenue widget"
            description="Display revenue performance card."
          />
          <ToggleSwitch
            checked={settings.dashboard.showForecast}
            onChange={(value) => updateNestedField('dashboard', 'showForecast', value)}
            label="Forecast widget"
            description="Display AI demand forecast module."
          />
          <ToggleSwitch
            checked={settings.dashboard.showLowStock}
            onChange={(value) => updateNestedField('dashboard', 'showLowStock', value)}
            label="Low-stock alerts"
            description="Highlight low inventory products on dashboard."
          />
          <ToggleSwitch
            checked={settings.dashboard.compactCards}
            onChange={(value) => updateNestedField('dashboard', 'compactCards', value)}
            label="Compact cards"
            description="Use denser card layout for small screens."
          />
        </div>
      </SettingSection>

      <SettingSection
        title="System Configuration"
        description="Control platform-level operations and security defaults."
        actions={
          <button
            type="button"
            onClick={() => saveSection('system', settings.system)}
            disabled={savingSection === 'system'}
            className="btn-primary"
          >
            {savingSection === 'system' ? 'Saving...' : 'Save System'}
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.system.maintenanceMode}
              onChange={(value) => updateNestedField('system', 'maintenanceMode', value)}
              label="Maintenance mode"
              description="Temporarily restrict user operations."
            />
            <ToggleSwitch
              checked={settings.system.autoBackup}
              onChange={(value) => updateNestedField('system', 'autoBackup', value)}
              label="Auto backup"
              description="Perform daily encrypted data backup."
            />
          </div>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.system.auditLogs}
              onChange={(value) => updateNestedField('system', 'auditLogs', value)}
              label="Audit logging"
              description="Record role changes and system settings updates."
            />
            <ToggleSwitch
              checked={settings.system.twoFactorRequired}
              onChange={(value) => updateNestedField('system', 'twoFactorRequired', value)}
              label="Require 2FA"
              description="Enforce two-factor auth for privileged users."
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Low stock threshold</label>
            <input
              type="number"
              min={1}
              value={settings.lowStockThreshold}
              onChange={(e) => updateRootField('lowStockThreshold', Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Default forecast horizon (days)</label>
            <input
              type="number"
              min={7}
              value={settings.defaultForecastHorizon}
              onChange={(e) => updateRootField('defaultForecastHorizon', Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </SettingSection>

      <div className="card border border-blue-100 bg-blue-50">
        <div className="flex items-start gap-3">
          <SettingsIcon size={20} className="mt-0.5 text-blue-700" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Configuration impact</p>
            <p className="mt-1 text-sm text-blue-700">
              Changes to notification, dashboard, and system sections are applied instantly for new sessions and can affect role permissions behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
