import { useMemo, useState } from 'react'
import { User, KeyRound, Phone, Mail, Building2, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { profileService } from '../../services/api'
import { validateEmail, validateName, validatePassword } from '../../utils/validation'
import SettingSection from '../../components/settings/SettingSection'
import FeedbackBanner from '../../components/settings/FeedbackBanner'
import { FormField, Divider } from '../../components/ui'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    storeName: user?.storeName || 'Smart Retail HQ',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: 'info', message: '' })
  const [saving, setSaving] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const profileCompletion = useMemo(() => {
    const fields = ['name', 'email', 'phone', 'storeName']
    const filled = fields.filter((field) => profileData[field]?.trim()).length
    return Math.round((filled / fields.length) * 100)
  }, [profileData])

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const validateProfile = () => {
    const nextErrors = {}
    const nameValidation = validateName(profileData.name)
    if (!nameValidation.isValid) {
      nextErrors.name = nameValidation.error
    }
    if (!validateEmail(profileData.email)) {
      nextErrors.email = 'Please enter a valid email address'
    }
    if (profileData.phone.trim().length < 8) {
      nextErrors.phone = 'Phone number should be at least 8 digits'
    }
    if (!profileData.storeName.trim()) {
      nextErrors.storeName = 'Store name is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setFeedback({ type: 'info', message: '' })

    if (!validateProfile()) {
      return
    }

    setSaving(true)
    try {
      await profileService.updateProfile(profileData)
      updateUser(profileData)
      setFeedback({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Unable to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  const validatePasswordForm = () => {
    const nextErrors = {}

    if (!passwordData.currentPassword) {
      nextErrors.currentPassword = 'Current password is required'
    }

    const result = validatePassword(passwordData.newPassword)
    if (!result.isValid) {
      nextErrors.newPassword = Object.values(result.errors).find(Boolean)
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    setPasswordErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setFeedback({ type: 'info', message: '' })

    if (!validatePasswordForm()) {
      return
    }

    setUpdatingPassword(true)
    try {
      await profileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setFeedback({ type: 'success', message: 'Password changed successfully.' })
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Password update failed.' })
    } finally {
      setUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your personal information and account security settings.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <span className="text-primary ml-2 whitespace-nowrap">{profileCompletion}%</span>
        </div>
      </div>

      {feedback.message && <FeedbackBanner type={feedback.type} message={feedback.message} />}

      <SettingSection title="Personal Information" description="Update account owner details used across the platform.">
        <form className="space-y-6" onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" error={errors.name} required>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="form-input pl-9"
                  placeholder="Enter your full name"
                />
              </div>
            </FormField>

            <FormField label="Email Address" error={errors.email} required>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="form-input pl-9"
                  placeholder="your.email@example.com"
                />
              </div>
            </FormField>

            <FormField label="Phone Number" error={errors.phone} required>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="form-input pl-9"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </FormField>

            <FormField label="Store Name" error={errors.storeName} required>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={profileData.storeName}
                  onChange={(e) => handleProfileChange('storeName', e.target.value)}
                  className="form-input pl-9"
                  placeholder="Store name"
                />
              </div>
            </FormField>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={saving} 
              className="btn-primary inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </SettingSection>

      <Divider />

      <SettingSection title="Change Password" description="Use a strong password with uppercase, lowercase, and numbers.">
        <form className="space-y-6" onSubmit={handlePasswordSubmit}>
          <FormField label="Current Password" error={passwordErrors.currentPassword} required>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                className="form-input pl-9"
                placeholder="Enter current password"
              />
            </div>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="New Password" error={passwordErrors.newPassword} required>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                className="form-input"
                placeholder="Enter new password"
              />
            </FormField>

            <FormField label="Confirm Password" error={passwordErrors.confirmPassword} required>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="form-input"
                placeholder="Confirm new password"
              />
            </FormField>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={updatingPassword} 
              className="btn-primary inline-flex items-center gap-2"
            >
              {updatingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </SettingSection>
    </div>
  )
}

export default Profile
