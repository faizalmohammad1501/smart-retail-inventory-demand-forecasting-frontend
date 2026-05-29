import { useMemo, useState } from 'react'
import { Plus, Search, ShieldCheck, Users, Mail, UserCog, Trash2, Edit3 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/common/Modal'
import SettingSection from '../../components/settings/SettingSection'
import PermissionMatrix from '../../components/settings/PermissionMatrix'
import FeedbackBanner from '../../components/settings/FeedbackBanner'
import ConfirmActionDialog from '../../components/settings/ConfirmActionDialog'
import { userService } from '../../services/api'
import { validateEmail, validateName } from '../../utils/validation'

const defaultPermissions = {
  inventory: { view: true, create: false, edit: false, delete: false },
  forecast: { view: true, create: false, edit: false, delete: false },
  reports: { view: true, create: false, edit: false, delete: false },
  orders: { view: true, create: false, edit: false, delete: false },
  suppliers: { view: true, create: false, edit: false, delete: false },
  users: { view: false, create: false, edit: false, delete: false },
}

const roleTemplates = {
  Admin: {
    inventory: { view: true, create: true, edit: true, delete: true },
    forecast: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, create: true, edit: true, delete: true },
    orders: { view: true, create: true, edit: true, delete: true },
    suppliers: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
  },
  Manager: {
    inventory: { view: true, create: true, edit: true, delete: false },
    forecast: { view: true, create: true, edit: true, delete: false },
    reports: { view: true, create: true, edit: true, delete: false },
    orders: { view: true, create: true, edit: true, delete: false },
    suppliers: { view: true, create: true, edit: true, delete: false },
    users: { view: true, create: false, edit: false, delete: false },
  },
  Analyst: {
    inventory: { view: true, create: false, edit: false, delete: false },
    forecast: { view: true, create: false, edit: false, delete: false },
    reports: { view: true, create: true, edit: false, delete: false },
    orders: { view: true, create: false, edit: false, delete: false },
    suppliers: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
  Staff: defaultPermissions,
}

const UserManagement = () => {
  const { user } = useAuth()
  const currentRole = user?.role || 'Admin'
  const canManageUsers = currentRole === 'Admin' || currentRole === 'Manager'

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Faizal Mohammad',
      email: 'faizalmohammad1501@gmail.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2026-05-29 09:10',
      permissions: roleTemplates.Admin,
    },
    {
      id: 2,
      name: 'Nisha Verma',
      email: 'nisha.verma@smartretail.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2026-05-29 08:22',
      permissions: roleTemplates.Manager,
    },
    {
      id: 3,
      name: 'Arjun Nair',
      email: 'arjun.nair@smartretail.com',
      role: 'Analyst',
      status: 'Active',
      lastLogin: '2026-05-28 17:11',
      permissions: roleTemplates.Analyst,
    },
    {
      id: 4,
      name: 'Ritika Singh',
      email: 'ritika.singh@smartretail.com',
      role: 'Staff',
      status: 'Invited',
      lastLogin: 'Never',
      permissions: roleTemplates.Staff,
    },
  ])

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const [showFormModal, setShowFormModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Staff',
    status: 'Invited',
    permissions: roleTemplates.Staff,
  })
  const [formErrors, setFormErrors] = useState({})

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
    loading: false,
  })

  const [feedback, setFeedback] = useState({ type: 'info', message: '' })

  const totals = useMemo(
    () => ({
      totalUsers: users.length,
      activeUsers: users.filter((member) => member.status === 'Active').length,
      admins: users.filter((member) => member.role === 'Admin').length,
      invited: users.filter((member) => member.status === 'Invited').length,
    }),
    [users]
  )

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim()
    return users.filter((member) => {
      const matchesSearch =
        !term ||
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term)
      const matchesRole = roleFilter === 'All' || member.role === roleFilter
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Staff',
      status: 'Invited',
      permissions: roleTemplates.Staff,
    })
    setFormErrors({})
    setEditingUser(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowFormModal(true)
  }

  const openEditModal = (member) => {
    setEditingUser(member)
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      permissions: JSON.parse(JSON.stringify(member.permissions)),
    })
    setFormErrors({})
    setShowFormModal(true)
  }

  const applyRoleTemplate = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      permissions: JSON.parse(JSON.stringify(roleTemplates[role] || defaultPermissions)),
    }))
  }

  const updatePermission = (moduleKey, action, value) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleKey]: {
          ...prev.permissions[moduleKey],
          [action]: value,
        },
      },
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    const nameResult = validateName(formData.name)
    if (!nameResult.isValid) {
      nextErrors.name = nameResult.error
    }
    if (!validateEmail(formData.email)) {
      nextErrors.email = 'Enter a valid email address'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()
    setFeedback({ type: 'info', message: '' })

    if (!validateForm()) return

    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData)
        setUsers((prev) => prev.map((member) => (member.id === editingUser.id ? { ...member, ...formData } : member)))
        setFeedback({ type: 'success', message: 'User updated successfully.' })
      } else {
        const newUser = {
          ...formData,
          id: Date.now(),
          lastLogin: 'Never',
        }
        await userService.create(newUser)
        setUsers((prev) => [newUser, ...prev])
        setFeedback({ type: 'success', message: 'User invited successfully.' })
      }

      setShowFormModal(false)
      resetForm()
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Unable to save user.' })
    }
  }

  const askForDelete = (member) => {
    setConfirmState({
      open: true,
      title: 'Remove user',
      message: `Are you sure you want to remove ${member.name} from this workspace?`,
      loading: false,
      action: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }))
        try {
          await userService.delete(member.id)
          setUsers((prev) => prev.filter((item) => item.id !== member.id))
          setFeedback({ type: 'success', message: 'User removed successfully.' })
        } catch (error) {
          setFeedback({ type: 'error', message: error.response?.data?.message || 'Failed to remove user.' })
        } finally {
          setConfirmState({ open: false, title: '', message: '', action: null, loading: false })
        }
      },
    })
  }

  const statusClass = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700'
    if (status === 'Suspended') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="mt-1 text-gray-600">Manage team members, roles, permissions, and account access.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          disabled={!canManageUsers}
          className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      <FeedbackBanner type={feedback.type} message={feedback.message} />

      {!canManageUsers && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Your current role does not allow modifying user permissions. You can only view access details.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="card flex items-center gap-3">
          <Users className="text-primary" />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-semibold text-gray-900">{totals.totalUsers}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <ShieldCheck className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xl font-semibold text-gray-900">{totals.activeUsers}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <UserCog className="text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Admin Users</p>
            <p className="text-xl font-semibold text-gray-900">{totals.admins}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Mail className="text-amber-600" />
          <div>
            <p className="text-sm text-gray-500">Pending Invites</p>
            <p className="text-xl font-semibold text-gray-900">{totals.invited}</p>
          </div>
        </div>
      </div>

      <SettingSection title="Team Directory" description="Search members and adjust role-based permissions.">
        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or role"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {['All', 'Admin', 'Manager', 'Analyst', 'Staff'].map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {['All', 'Active', 'Invited', 'Suspended'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[820px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Last Login</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{member.role}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        disabled={!canManageUsers}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => askForDelete(member)}
                        disabled={!canManageUsers || member.role === 'Admin'}
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingSection>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingUser ? 'Edit User' : 'Invite User'}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleSaveUser}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => applyRoleTemplate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {['Admin', 'Manager', 'Analyst', 'Staff'].map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {['Active', 'Invited', 'Suspended'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-800">Role Permissions</h4>
            <PermissionMatrix
              permissions={formData.permissions}
              onToggle={updatePermission}
              readOnly={!canManageUsers}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!canManageUsers}>
              {editingUser ? 'Update User' : 'Send Invite'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmActionDialog
        isOpen={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel="Delete"
        onCancel={() => setConfirmState({ open: false, title: '', message: '', action: null, loading: false })}
        onConfirm={() => confirmState.action?.()}
        loading={confirmState.loading}
      />
    </div>
  )
}

export default UserManagement
