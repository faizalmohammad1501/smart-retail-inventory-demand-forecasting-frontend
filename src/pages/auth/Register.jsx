import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import { validateEmail, validatePassword, validateName } from '../../utils/validation'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(null)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Real-time password strength check
    if (name === 'password') {
      const validation = validatePassword(value)
      setPasswordStrength(validation)
    }
    
    // Clear field error when typing
    if (fieldErrors[name]) {
      setFieldErrors({...fieldErrors, [name]: null})
    }
  }

  const validateForm = () => {
    const errors = {}
    
    const nameValidation = validateName(formData.name)
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error
    }
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      errors.password = Object.values(passwordValidation.errors).find(e => e) || 'Invalid password'
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-secondary rounded-full mb-4">
              <UserPlus size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join Smart Retail Platform</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
                placeholder="John Doe"
                required
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
                placeholder="you@example.com"
                required
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
                placeholder="••••••••"
                required
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {fieldErrors.password}
                </p>
              )}
              {passwordStrength && formData.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-700">Password strength:</p>
                  {Object.entries(passwordStrength.errors).map(([key, error]) => (
                    error ? (
                      <p key={key} className="text-xs text-red-600 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {error}
                      </p>
                    ) : (
                      <p key={key} className="text-xs text-green-600 flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        {key === 'minLength' && 'At least 8 characters'}
                        {key === 'hasUpper' && 'Contains uppercase letter'}
                        {key === 'hasLower' && 'Contains lowercase letter'}
                        {key === 'hasNumber' && 'Contains number'}
                      </p>
                    )
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
                placeholder="••••••••"
                required
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-secondary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
