import React, { useState } from 'react'
import { Building2, ChevronDown, Check, MapPin } from 'lucide-react'
import { useCompany } from '../context/CompanyContext'
import './CompanySwitcher.css'

const CompanySwitcher = () => {
  const { activeCompany, activeBranch, companies, switchCompany, switchBranch } = useCompany()
  const [isOpen, setIsOpen] = useState(false)

  if (!activeCompany) {
    return (
      <div className="company-switcher">
        <div className="switcher-trigger">
          <Building2 size={18} />
          <span>No Company Selected</span>
        </div>
      </div>
    )
  }

  return (
    <div className="company-switcher">
      <div
        className="switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="switcher-info">
          <Building2 size={18} />
          <div className="switcher-text">
            <span className="company-name">{activeCompany.name}</span>
            {activeBranch && (
              <span className="branch-name">
                <MapPin size={12} />
                {activeBranch.name}
              </span>
            )}
          </div>
        </div>
        <ChevronDown size={18} className={isOpen ? 'rotate' : ''} />
      </div>

      {isOpen && (
        <>
          <div className="switcher-overlay" onClick={() => setIsOpen(false)} />
          <div className="switcher-dropdown">
            <div className="dropdown-section">
              <div className="section-header">Companies</div>
              {companies.map(company => (
                <div
                  key={company.id}
                  className={`dropdown-item ${activeCompany.id === company.id ? 'active' : ''}`}
                  onClick={() => {
                    switchCompany(company)
                    setIsOpen(false)
                  }}
                >
                  <Building2 size={16} />
                  <span className="item-text">{company.name}</span>
                  {activeCompany.id === company.id && <Check size={16} />}
                </div>
              ))}
            </div>

            {activeCompany.branches && activeCompany.branches.length > 0 && (
              <div className="dropdown-section">
                <div className="section-header">Branches</div>
                {activeCompany.branches.map(branch => (
                  <div
                    key={branch.id}
                    className={`dropdown-item branch-item ${activeBranch?.id === branch.id ? 'active' : ''}`}
                    onClick={() => {
                      switchBranch(branch)
                      setIsOpen(false)
                    }}
                  >
                    <MapPin size={16} />
                    <span className="item-text">{branch.name}</span>
                    {activeBranch?.id === branch.id && <Check size={16} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default CompanySwitcher

