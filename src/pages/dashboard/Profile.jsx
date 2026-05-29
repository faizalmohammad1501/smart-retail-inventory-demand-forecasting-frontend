import { useMemo, useState } from 'react'
import { User, KeyRound, Phone, Mail, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { profileService } from '../../services/api'
import { validateEmail, validateName, validatePassword } from '../../utils/validation'
import SettingSection from '../../components/settings/SettingSection'
import FeedbackBanner from '../../components/settings/FeedbackBanner'

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
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and account security.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700">
          Profile completion: <span className="text-primary">{profileCompletion}%</span>
        </div>
      </div>

      <FeedbackBanner type={feedback.type} message={feedback.message} />

      <SettingSection title="Personal Information" description="Update account owner details used across the platform.">
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Store Name</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={profileData.storeName}
                onChange={(e) => handleProfileChange('storeName', e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.storeName && <p className="mt-1 text-xs text-red-600">{errors.storeName}</p>}
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </SettingSection>

      <SettingSection title="Change Password" description="Use a strong password with uppercase, lowercase, and numbers.">
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handlePasswordSubmit}>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {passwordErrors.currentPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.currentPassword}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {passwordErrors.newPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {passwordErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.confirmPassword}</p>}
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={updatingPassword} className="btn-primary">
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </SettingSection>
    </div>
  )
}

export default Profile
