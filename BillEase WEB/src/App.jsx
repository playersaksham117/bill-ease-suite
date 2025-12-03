import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { CompanyProvider, useCompany } from './context/CompanyContext'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import CompanyRegistration from './components/CompanyRegistration'
import PlatformSelection from './components/PlatformSelection'
import './App.css'

// Lazy load modules for better performance and code splitting
const POS = lazy(() => import('./modules/POS/POS'))
const CRM = lazy(() => import('./modules/CRM/CRM'))
const IncomeExpense = lazy(() => import('./modules/IncomeExpense/IncomeExpense'))
const Invento = lazy(() => import('./modules/Invento/Invento'))
const AccountsPlus = lazy(() => import('./modules/AccountsPlus/AccountsPlus'))

// Loading component for lazy-loaded modules
const ModuleLoader = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100vh',
    fontSize: '1.125rem',
    color: '#6c757d'
  }}>
    Loading module...
  </div>
)

// Homepage Component (accessible without registration)
const HomePage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '2rem'
    }}>
      <Dashboard />
    </div>
  )
}

// Protected Route Component (for modules that require registration)
const ProtectedRoute = ({ children, requirePlatform = false }) => {
  const { isRegistrationComplete, loading, companies, activeCompany } = useCompany()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '1.125rem',
        color: '#6c757d'
      }}>
        Loading...
      </div>
    )
  }
  
  // Check if registration is complete OR if there are companies/active company (fallback check)
  const hasCompletedRegistration = isRegistrationComplete || 
                                   (companies && companies.length > 0) || 
                                   activeCompany !== null
  
  if (!hasCompletedRegistration) {
    return <Navigate to="/register" replace />
  }

  // Check if platform selection is required
  if (requirePlatform) {
    const selectedPlatform = localStorage.getItem('selectedPlatform')
    if (!selectedPlatform) {
      return <Navigate to="/choose-platform" replace />
    }
  }
  
  return children
}

function App() {
  return (
    <AppProvider>
      <CompanyProvider>
        <Router>
          <Routes>
            {/* Homepage - accessible without registration */}
            <Route path="/" element={<HomePage />} />
            
            {/* Company Registration */}
            <Route path="/register" element={<CompanyRegistration />} />
            
            {/* Platform Selection - requires registration but not platform selection */}
            <Route path="/choose-platform" element={
              <ProtectedRoute requirePlatform={false}>
                <PlatformSelection />
              </ProtectedRoute>
            } />
            
            {/* Login route kept for future use */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            
            {/* Protected routes - require registration and platform selection */}
            <Route path="*" element={
              <ProtectedRoute requirePlatform={true}>
                <Layout>
                  <Suspense fallback={<ModuleLoader />}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/pos/*" element={<POS />} />
                      <Route path="/crm/*" element={<CRM />} />
                      <Route path="/income-expense/*" element={<IncomeExpense />} />
                      <Route path="/invento/*" element={<Invento />} />
                      <Route path="/accounts-plus/*" element={<AccountsPlus />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </CompanyProvider>
    </AppProvider>
  )
}

export default App

