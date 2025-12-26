import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Globe, 
  Monitor, 
  CheckCircle, 
  ArrowRight,
  Building2
} from 'lucide-react'
import { useCompany } from '../context/CompanyContext'
import './PlatformSelection.css'

const PlatformSelection = () => {
  const navigate = useNavigate()
  const { activeCompany } = useCompany()
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  const platformOptions = [
    {
      type: 'web',
      icon: Globe,
      title: 'Web Version',
      description: 'Access BillEase Suite from any device with a web browser. No installation required.',
      features: [
        'Access from anywhere',
        'No installation needed',
        'Automatic updates',
        'Cross-platform compatibility',
        'Cloud-based data storage',
        'Real-time collaboration'
      ],
      gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      action: 'Continue with Web'
    },
    {
      type: 'desktop',
      icon: Monitor,
      title: 'Desktop Version',
      description: 'Download and install BillEase Suite on your Windows, macOS, or Linux desktop for offline access.',
      features: [
        'Offline access',
        'Faster performance',
        'Native desktop experience',
        'Local data storage',
        'System integration',
        'Enhanced security'
      ],
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: 'Download Desktop App'
    }
  ]

  const handlePlatformSelect = (platformType) => {
    setSelectedPlatform(platformType)
    
    // Store platform preference
    localStorage.setItem('selectedPlatform', platformType)
    
    // Small delay for visual feedback, then navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div className="platform-selection-page">
      <div className="platform-selection-container">
        <div className="platform-selection-header">
          <div className="company-info">
            <Building2 size={32} />
            <div>
              <h1>Welcome, {activeCompany?.name || 'User'}!</h1>
              <p>Your company has been set up successfully</p>
            </div>
          </div>
        </div>

        <div className="platform-selection-content">
          <h2 className="selection-title">Choose Your Platform</h2>
          <p className="selection-subtitle">
            Select how you want to use BillEase Suite. You can change this later in settings.
          </p>

          <div className="platform-selection-grid">
            {platformOptions.map((platform, index) => {
              const PlatformIcon = platform.icon
              const isSelected = selectedPlatform === platform.type
              
              return (
                <div 
                  key={index} 
                  className={`platform-selection-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handlePlatformSelect(platform.type)}
                >
                  <div className="platform-selection-header-card" style={{ background: platform.gradient }}>
                    <PlatformIcon size={48} />
                    <h3>{platform.title}</h3>
                  </div>
                  <div className="platform-selection-content-card">
                    <p className="platform-selection-description">{platform.description}</p>
                    <ul className="platform-selection-features-list">
                      {platform.features.map((feature, idx) => (
                        <li key={idx}>
                          <CheckCircle size={18} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="platform-selection-footer-card">
                    <button 
                      className="platform-selection-btn" 
                      style={{ background: platform.gradient }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlatformSelect(platform.type)
                      }}
                    >
                      {platform.type === 'web' ? (
                        <>
                          <Globe size={18} />
                          <span>{platform.action}</span>
                          <ArrowRight size={18} />
                        </>
                      ) : (
                        <>
                          <Monitor size={18} />
                          <span>{platform.action}</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                  {isSelected && (
                    <div className="platform-selection-checkmark">
                      <CheckCircle size={32} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="platform-selection-note">
            <p>💡 Tip: You can switch between platforms anytime. Your data will sync automatically.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformSelection

