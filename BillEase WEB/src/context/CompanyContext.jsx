import React, { createContext, useContext, useState, useEffect } from 'react'

const CompanyContext = createContext()

export const useCompany = () => {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([])
  const [activeCompany, setActiveCompany] = useState(null)
  const [activeBranch, setActiveBranch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false)

  // Load companies and active company from localStorage on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        // Check if registration is complete
        const registrationComplete = localStorage.getItem('companyRegistrationComplete') === 'true'
        setIsRegistrationComplete(registrationComplete)
        
        // Load from localStorage or API
        const savedCompanies = localStorage.getItem('companies')
        const savedActiveCompanyId = localStorage.getItem('activeCompanyId')
        const savedActiveBranchId = localStorage.getItem('activeBranchId')

        if (savedCompanies) {
          const parsedCompanies = JSON.parse(savedCompanies)
          setCompanies(parsedCompanies)

          // Set active company if saved
          if (savedActiveCompanyId) {
            const company = parsedCompanies.find(c => c.id === parseInt(savedActiveCompanyId))
            if (company) {
              setActiveCompany(company)

              // Set active branch if saved
              if (savedActiveBranchId && company.branches) {
                const branch = company.branches.find(b => b.id === parseInt(savedActiveBranchId))
                if (branch) {
                  setActiveBranch(branch)
                } else if (company.branches.length > 0) {
                  // Default to first branch if saved branch not found
                  setActiveBranch(company.branches[0])
                }
              } else if (company.branches && company.branches.length > 0) {
                // Default to first branch if no saved branch
                setActiveBranch(company.branches[0])
              }
            } else if (parsedCompanies.length > 0) {
              // Default to first company if saved company not found
              setActiveCompany(parsedCompanies[0])
              if (parsedCompanies[0].branches && parsedCompanies[0].branches.length > 0) {
                setActiveBranch(parsedCompanies[0].branches[0])
              }
            }
          } else if (parsedCompanies.length > 0) {
            // Default to first company if no saved company
            setActiveCompany(parsedCompanies[0])
            if (parsedCompanies[0].branches && parsedCompanies[0].branches.length > 0) {
              setActiveBranch(parsedCompanies[0].branches[0])
            }
          }
        } else {
          // No companies found, check registration status
          if (registrationComplete) {
            // Registration marked complete but no companies - reset registration
            setIsRegistrationComplete(false)
            localStorage.removeItem('companyRegistrationComplete')
          } else {
            setIsRegistrationComplete(false)
          }
        }
      } catch (error) {
        console.error('Error loading companies:', error)
        setIsRegistrationComplete(false)
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [])

  // Save active company and branch to localStorage when they change
  useEffect(() => {
    if (activeCompany) {
      localStorage.setItem('activeCompanyId', activeCompany.id.toString())
    }
  }, [activeCompany])

  useEffect(() => {
    if (activeBranch) {
      localStorage.setItem('activeBranchId', activeBranch.id.toString())
    }
  }, [activeBranch])

  // Save companies to localStorage when they change
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('companies', JSON.stringify(companies))
    }
  }, [companies])

  const switchCompany = (company) => {
    setActiveCompany(company)
    // Reset branch to first branch of new company or null
    if (company.branches && company.branches.length > 0) {
      setActiveBranch(company.branches[0])
    } else {
      setActiveBranch(null)
    }
  }

  const switchBranch = (branch) => {
    setActiveBranch(branch)
  }

  const addCompany = (company) => {
    const newCompany = {
      ...company,
      id: Date.now(),
      branches: company.branches || []
    }
    const updatedCompanies = [...companies, newCompany]
    setCompanies(updatedCompanies)
    
    // If no active company, set this as active
    if (!activeCompany) {
      setActiveCompany(newCompany)
      if (newCompany.branches && newCompany.branches.length > 0) {
        setActiveBranch(newCompany.branches[0])
      }
    }
    
    return newCompany
  }

  const updateCompany = (companyId, updates) => {
    const updatedCompanies = companies.map(c =>
      c.id === companyId ? { ...c, ...updates } : c
    )
    setCompanies(updatedCompanies)
    
    // Update active company if it's the one being updated
    if (activeCompany && activeCompany.id === companyId) {
      setActiveCompany({ ...activeCompany, ...updates })
    }
  }

  const deleteCompany = (companyId) => {
    const updatedCompanies = companies.filter(c => c.id !== companyId)
    setCompanies(updatedCompanies)
    
    // If deleted company was active, switch to first available company
    if (activeCompany && activeCompany.id === companyId) {
      if (updatedCompanies.length > 0) {
        setActiveCompany(updatedCompanies[0])
        if (updatedCompanies[0].branches && updatedCompanies[0].branches.length > 0) {
          setActiveBranch(updatedCompanies[0].branches[0])
        } else {
          setActiveBranch(null)
        }
      } else {
        setActiveCompany(null)
        setActiveBranch(null)
      }
    }
  }

  const addBranch = (companyId, branch) => {
    const newBranch = {
      ...branch,
      id: Date.now()
    }
    const updatedCompanies = companies.map(c =>
      c.id === companyId
        ? { ...c, branches: [...(c.branches || []), newBranch] }
        : c
    )
    setCompanies(updatedCompanies)
    
    // Update active company if it's the one being updated
    if (activeCompany && activeCompany.id === companyId) {
      const updatedBranches = [...(activeCompany.branches || []), newBranch]
      setActiveCompany({ ...activeCompany, branches: updatedBranches })
      
      // If no active branch, set new branch as active
      if (!activeBranch) {
        setActiveBranch(newBranch)
      }
    }
    
    return newBranch
  }

  const updateBranch = (companyId, branchId, updates) => {
    const updatedCompanies = companies.map(c =>
      c.id === companyId
        ? {
            ...c,
            branches: (c.branches || []).map(b =>
              b.id === branchId ? { ...b, ...updates } : b
            )
          }
        : c
    )
    setCompanies(updatedCompanies)
    
    // Update active branch if it's the one being updated
    if (activeBranch && activeBranch.id === branchId) {
      setActiveBranch({ ...activeBranch, ...updates })
    }
    
    // Update active company branches
    if (activeCompany && activeCompany.id === companyId) {
      setActiveCompany({
        ...activeCompany,
        branches: updatedCompanies.find(c => c.id === companyId).branches
      })
    }
  }

  const deleteBranch = (companyId, branchId) => {
    const updatedCompanies = companies.map(c =>
      c.id === companyId
        ? {
            ...c,
            branches: (c.branches || []).filter(b => b.id !== branchId)
          }
        : c
    )
    setCompanies(updatedCompanies)
    
    // If deleted branch was active, switch to first available branch or null
    if (activeBranch && activeBranch.id === branchId) {
      const company = updatedCompanies.find(c => c.id === companyId)
      if (company && company.branches && company.branches.length > 0) {
        setActiveBranch(company.branches[0])
      } else {
        setActiveBranch(null)
      }
    }
    
    // Update active company branches
    if (activeCompany && activeCompany.id === companyId) {
      setActiveCompany({
        ...activeCompany,
        branches: updatedCompanies.find(c => c.id === companyId).branches
      })
    }
  }

  const value = {
    companies,
    activeCompany,
    activeBranch,
    loading,
    isRegistrationComplete,
    setIsRegistrationComplete,
    switchCompany,
    switchBranch,
    addCompany,
    updateCompany,
    deleteCompany,
    addBranch,
    updateBranch,
    deleteBranch,
    setCompanies
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}
