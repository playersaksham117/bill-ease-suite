import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // Multi-Firm Support
  const [firms, setFirms] = useState(() => {
    const saved = localStorage.getItem('app_firms')
    return saved ? JSON.parse(saved) : []
  })
  
  const [activeFirmId, setActiveFirmId] = useState(() => {
    return localStorage.getItem('app_activeFirmId') || null
  })

  // User Management & Roles
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('app_users')
    if (saved) return JSON.parse(saved)
    // Default admin user
    return [{
      id: 1,
      username: 'admin',
      email: 'admin@billease.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      name: 'Administrator',
      active: true,
      createdAt: new Date().toISOString()
    }]
  })

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('app_currentUser')
    if (saved) return JSON.parse(saved)
    // Default user for prototyping (no auth required)
    return {
      id: 1,
      username: 'admin',
      email: 'admin@billease.com',
      role: 'admin',
      name: 'Administrator',
      active: true
    }
  })

  // Save firms to localStorage
  useEffect(() => {
    localStorage.setItem('app_firms', JSON.stringify(firms))
  }, [firms])

  useEffect(() => {
    if (activeFirmId) {
      localStorage.setItem('app_activeFirmId', activeFirmId)
    }
  }, [activeFirmId])

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_currentUser', JSON.stringify(currentUser))
    }
  }, [currentUser])

  // Firm Management Functions
  const addFirm = (firmData) => {
    const newFirm = {
      id: Date.now(),
      ...firmData,
      createdAt: new Date().toISOString(),
      active: true
    }
    setFirms([...firms, newFirm])
    if (!activeFirmId) {
      setActiveFirmId(newFirm.id.toString())
    }
    return newFirm
  }

  const updateFirm = (firmId, firmData) => {
    setFirms(firms.map(f => f.id === firmId ? { ...f, ...firmData } : f))
  }

  const deleteFirm = (firmId) => {
    setFirms(firms.filter(f => f.id !== firmId))
    if (activeFirmId === firmId.toString()) {
      const remainingFirms = firms.filter(f => f.id !== firmId)
      if (remainingFirms.length > 0) {
        setActiveFirmId(remainingFirms[0].id.toString())
      } else {
        setActiveFirmId(null)
      }
    }
  }

  const switchFirm = (firmId) => {
    setActiveFirmId(firmId.toString())
  }

  const getActiveFirm = () => {
    return firms.find(f => f.id.toString() === activeFirmId) || null
  }

  // User Management Functions
  const addUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      active: true,
      createdAt: new Date().toISOString()
    }
    setUsers([...users, newUser])
    return newUser
  }

  const updateUser = (userId, userData) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...userData } : u))
  }

  const deleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId))
  }

  const login = (username, password) => {
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password && 
      u.active
    )
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      setCurrentUser(userWithoutPassword)
      return userWithoutPassword
    }
    return null
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('app_currentUser')
  }

  // Permission Check Functions
  const hasPermission = (permission) => {
    if (!currentUser) return false
    
    const rolePermissions = {
      admin: ['all'],
      controller: ['designer', 'reports', 'settings', 'view_all'],
      manager: ['billing', 'inventory', 'reports', 'view_all'],
      accountant: ['accounting', 'reports', 'vouchers'],
      user: ['view', 'billing']
    }

    const permissions = rolePermissions[currentUser.role] || []
    return permissions.includes('all') || permissions.includes(permission)
  }

  const canAccessDesigner = () => {
    return hasPermission('designer') || currentUser?.role === 'controller' || currentUser?.role === 'admin'
  }

  const value = {
    // Firms
    firms,
    activeFirmId,
    activeFirm: getActiveFirm(),
    addFirm,
    updateFirm,
    deleteFirm,
    switchFirm,
    
    // Users
    users,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    login,
    logout,
    
    // Permissions
    hasPermission,
    canAccessDesigner
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

