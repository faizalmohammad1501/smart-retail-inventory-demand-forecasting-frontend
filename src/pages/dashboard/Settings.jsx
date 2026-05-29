import { useState } from 'react'
import { Settings as SettingsIcon, Bell, LayoutDashboard, Store, ServerCog } from 'lucide-react'
import SettingSection from '../../components/settings/SettingSection'
import ToggleSwitch from '../../components/settings/ToggleSwitch'
import FeedbackBanner from '../../components/settings/FeedbackBanner'
import { settingsService } from '../../services/api'
import { Alert, FormField, Divider } from '../../components/ui'

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Configure store preferences, dashboard behavior, and system controls.</p>
      </div>

      {feedback.message && <FeedbackBanner type={feedback.type} message={feedback.message} />}

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
            className="btn-primary text-sm sm:text-base"
          >
            {savingSection === 'store' ? 'Saving...' : 'Save Store'}
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormField label="Store Name">
            <div className="relative">
              <Store size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => updateRootField('storeName', e.target.value)}
                className="form-input pl-9"
                placeholder="Store name"
              />
            </div>
          </FormField>
          <FormField label="Currency">
            <select
              value={settings.currency}
              onChange={(e) => updateRootField('currency', e.target.value)}
              className="form-input"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </FormField>
          <FormField label="Timezone">
            <select
              value={settings.timezone}
              onChange={(e) => updateRootField('timezone', e.target.value)}
              className="form-input"
            >
              <option value="UTC-05:00">UTC-05:00</option>
              <option value="UTC+00:00">UTC+00:00</option>
              <option value="UTC+05:30">UTC+05:30</option>
            </select>
          </FormField>
          <FormField label="Locale">
            <select
              value={settings.locale}
              onChange={(e) => updateRootField('locale', e.target.value)}
              className="form-input"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="en-IN">English (IN)</option>
            </select>
          </FormField>
        </div>
      </SettingSection>

      <Divider />

      <SettingSection
        title="Notification Preferences"
        description="Set how teams receive operational alerts and daily summaries."
        actions={
          <button
            type="button"
            onClick={() => saveSection('notifications', settings.notifications)}
            disabled={savingSection === 'notifications'}
            className="btn-primary text-sm sm:text-base"
          >
            {savingSection === 'notifications' ? 'Saving...' : 'Save Notifications'}
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

      <Divider />

      <SettingSection
        title="Dashboard Customization"
        description="Choose what widgets appear by default for dashboard users."
        actions={
          <button
            type="button"
            onClick={() => saveSection('dashboard', settings.dashboard)}
            disabled={savingSection === 'dashboard'}
            className="btn-primary text-sm sm:text-base"
          >
            {savingSection === 'dashboard' ? 'Saving...' : 'Save Dashboard'}
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

      <Divider />

      <SettingSection
        title="System Configuration"
        description="Control platform-level operations and security defaults."
        actions={
          <button
            type="button"
            onClick={() => saveSection('system', settings.system)}
            disabled={savingSection === 'system'}
            className="btn-primary text-sm sm:text-base"
          >
            {savingSection === 'system' ? 'Saving...' : 'Save System'}
          </button>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <FormField label="Low stock threshold">
              <input
                type="number"
                min={1}
                value={settings.lowStockThreshold}
                onChange={(e) => updateRootField('lowStockThreshold', Number(e.target.value))}
                className="form-input"
                placeholder="Enter units"
              />
            </FormField>
            <FormField label="Default forecast horizon (days)">
              <input
                type="number"
                min={7}
                value={settings.defaultForecastHorizon}
                onChange={(e) => updateRootField('defaultForecastHorizon', Number(e.target.value))}
                className="form-input"
                placeholder="Enter days"
              />
            </FormField>
          </div>
        </div>
      </SettingSection>

      <Alert 
        variant="info" 
        title="Configuration Impact"
        message="Changes to notification, dashboard, and system sections are applied instantly for new sessions and can affect role permissions behavior."
        dismissible
      />
    </div>
  )
}

export default Settings
