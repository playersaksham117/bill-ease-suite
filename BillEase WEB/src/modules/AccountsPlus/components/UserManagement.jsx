import React, { useState } from 'react'
import { Users, Plus, Edit, Trash2, X, Save, Shield, Mail, Phone, User as UserIcon, Key } from 'lucide-react'
import './UserManagement.css'

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+91 98765 43210',
      role: 'admin',
      status: 'active',
      companyAccess: ['ABC Enterprises'],
      lastLogin: '2024-01-15 10:30 AM'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+91 98765 43211',
      role: 'accountant',
      status: 'active',
      companyAccess: ['ABC Enterprises'],
      lastLogin: '2024-01-14 03:45 PM'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      phone: '+91 98765 43212',
      role: 'viewer',
      status: 'inactive',
      companyAccess: ['ABC Enterprises'],
      lastLogin: '2024-01-10 09:15 AM'
    }
  ])
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'viewer',
    status: 'active',
    companyAccess: []
  })

  const roles = [
    { id: 'admin', name: 'Administrator', description: 'Full access to all features' },
    { id: 'accountant', name: 'Accountant', description: 'Access to accounting and financial features' },
    { id: 'manager', name: 'Manager', description: 'Access to reports and viewing' },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access' }
  ]

  const handleUserSubmit = (e) => {
    e.preventDefault()
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(u =>
        u.id === selectedUser.id ? { ...u, ...userForm, lastLogin: u.lastLogin } : u
      ))
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...userForm,
        lastLogin: 'Never'
      }
      setUsers([...users, newUser])
    }
    setShowUserModal(false)
    setSelectedUser(null)
    resetUserForm()
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      companyAccess: user.companyAccess
    })
    setShowUserModal(true)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'viewer',
      status: 'active',
      companyAccess: []
    })
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-danger'
      case 'accountant':
        return 'badge-warning'
      case 'manager':
        return 'badge-info'
      default:
        return 'badge-secondary'
    }
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>User Management</h2>
        <button className="btn-primary" onClick={() => {
          setSelectedUser(null)
          resetUserForm()
          setShowUserModal(true)
        }}>
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Company Access</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No users found. Click "Add User" to create one.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="contact-item">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="role-badge-container">
                      <span className={`role-badge ${getRoleBadgeColor(user.role)}`}>
                        <Shield size={12} />
                        {roles.find(r => r.id === user.role)?.name || user.role}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="company-access">
                      {user.companyAccess.map((company, idx) => (
                        <span key={idx} className="company-tag">
                          {company}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className="last-login">{user.lastLogin}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => {
          setShowUserModal(false)
          setSelectedUser(null)
          resetUserForm()
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedUser ? 'Edit User' : 'Add New User'}</h3>
              <button className="close-btn" onClick={() => {
                setShowUserModal(false)
                setSelectedUser(null)
                resetUserForm()
              }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="user@company.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  required
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  required
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {!selectedUser && (
                <div className="form-group">
                  <label>Initial Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter initial password"
                    minLength="8"
                  />
                  <small>Password must be at least 8 characters long</small>
                </div>
              )}
              {selectedUser && (
                <div className="form-group">
                  <button type="button" className="btn-secondary">
                    <Key size={16} />
                    Reset Password
                  </button>
                </div>
              )}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowUserModal(false)
                  setSelectedUser(null)
                  resetUserForm()
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={18} />
                  {selectedUser ? 'Update' : 'Create'} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement

