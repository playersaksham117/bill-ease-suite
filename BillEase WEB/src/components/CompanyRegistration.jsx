import React, { useState, useEffect } from 'react'
import { Building2, Upload, Save, Calendar, MapPin, Phone, Mail, Globe, FileText, CheckCircle } from 'lucide-react'
import { useCompany } from '../context/CompanyContext'
import { useNavigate } from 'react-router-dom'
import './CompanyRegistration.css'

const CompanyRegistration = () => {
  const { addCompany, switchCompany, setIsRegistrationComplete } = useCompany()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Company Details
    name: '',
    gstin: '',
    pan: '',
    financialYearStart: '',
    financialYearEnd: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
    email: '',
    website: '',
    logo: null,
    
    // Business Type
    businessType: '',
    industry: '',
    
    // Additional Info
    registrationNumber: '',
    taxId: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateStep = (currentStep) => {
    const newErrors = {}
    
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Company name is required'
      if (!formData.financialYearStart) newErrors.financialYearStart = 'Financial year start is required'
      if (!formData.financialYearEnd) newErrors.financialYearEnd = 'Financial year end is required'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.state.trim()) newErrors.state = 'State is required'
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
    }
    
    if (currentStep === 2) {
      if (!formData.businessType) newErrors.businessType = 'Business type is required'
      if (!formData.industry) newErrors.industry = 'Industry is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Logo size should be less than 2MB' }))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }))
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.logo
          return newErrors
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(step)) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare company data
      const companyData = {
        name: formData.name,
        gstin: formData.gstin || null,
        pan: formData.pan || null,
        financialYearStart: formData.financialYearStart,
        financialYearEnd: formData.financialYearEnd,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}, ${formData.country}`,
        phone: formData.phone,
        email: formData.email,
        website: formData.website || null,
        logo: formData.logo,
        businessType: formData.businessType,
        industry: formData.industry,
        registrationNumber: formData.registrationNumber || null,
        taxId: formData.taxId || null,
        isActive: true,
        branches: [],
        invoiceSettings: {
          prefix: 'INV',
          numberFormat: 'INV-{YYYY}-{MM}-{####}',
          terms: 'Payment due within 30 days',
          footer: 'Thank you for your business!',
          showLogo: true,
          showSignature: true
        },
        gstSettings: {
          gstApplicable: !!formData.gstin,
          compositionScheme: false,
          gstRate: 18,
          hsnCode: '',
          sacCode: '',
          placeOfSupply: formData.state
        }
      }

      // Add company using context
      const newCompany = addCompany(companyData)
      console.log('Company added:', newCompany)
      
      // Switch to the new company
      switchCompany(newCompany)
      console.log('Company switched to:', newCompany)
      
      // Mark registration as complete in localStorage
      localStorage.setItem('companyRegistrationComplete', 'true')
      localStorage.setItem('registrationDate', new Date().toISOString())
      console.log('Registration marked complete in localStorage')
      
      // Update context state immediately
      setIsRegistrationComplete(true)
      console.log('Registration state updated in context')
      
      // Use a small delay to ensure state updates propagate before navigation
      setTimeout(() => {
        console.log('Navigating to platform selection...')
        // Redirect to platform selection after registration
        navigate('/choose-platform', { replace: true })
      }, 100)
    } catch (error) {
      console.error('Error registering company:', error)
      alert('Failed to register company. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const defaultFYStart = `${currentYear}-04-01`
  const defaultFYEnd = `${currentYear + 1}-03-31`

  return (
    <div className="company-registration">
      <div className="registration-container">
        <div className="registration-header">
          <div className="logo-section">
            <Building2 size={48} />
            <h1>Welcome to BillEase Suite</h1>
            <p>Let's get your company set up</p>
          </div>
        </div>

        <div className="registration-progress">
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">{step > 1 ? <CheckCircle size={20} /> : '1'}</div>
              <span>Company Details</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">{step > 2 ? <CheckCircle size={20} /> : '2'}</div>
              <span>Business Info</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Review & Complete</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Step 1: Company Details */}
          {step === 1 && (
            <div className="form-step">
              <h2>Company Information</h2>
              <p className="step-description">Please provide your company's basic details</p>

              <div className="form-section">
                <div className="form-group">
                  <label>Company/Firm Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter company name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>GSTIN</label>
                    <input
                      type="text"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                      placeholder="27ABCDE1234F1Z5"
                      maxLength="15"
                    />
                  </div>
                  <div className="form-group">
                    <label>PAN</label>
                    <input
                      type="text"
                      value={formData.pan}
                      onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      maxLength="10"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Financial Year Start *</label>
                    <input
                      type="date"
                      value={formData.financialYearStart || defaultFYStart}
                      onChange={(e) => handleInputChange('financialYearStart', e.target.value)}
                      className={errors.financialYearStart ? 'error' : ''}
                    />
                    {errors.financialYearStart && <span className="error-message">{errors.financialYearStart}</span>}
                  </div>
                  <div className="form-group">
                    <label>Financial Year End *</label>
                    <input
                      type="date"
                      value={formData.financialYearEnd || defaultFYEnd}
                      onChange={(e) => handleInputChange('financialYearEnd', e.target.value)}
                      className={errors.financialYearEnd ? 'error' : ''}
                    />
                    {errors.financialYearEnd && <span className="error-message">{errors.financialYearEnd}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Company Logo</label>
                  <div className="logo-upload-section">
                    {formData.logo ? (
                      <div className="logo-preview">
                        <img src={formData.logo} alt="Company logo" />
                        <button
                          type="button"
                          onClick={() => handleInputChange('logo', null)}
                          className="remove-logo-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label">
                        <Upload size={24} />
                        <span>Click to upload logo</span>
                        <span className="upload-hint">PNG, JPG up to 2MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                  {errors.logo && <span className="error-message">{errors.logo}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3>Address Details</h3>
                <div className="form-group">
                  <label>Street Address *</label>
                  <textarea
                    rows="3"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter street address"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state"
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter pincode"
                      maxLength="6"
                      className={errors.pincode ? 'error' : ''}
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@company.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="www.company.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <div className="form-step">
              <h2>Business Information</h2>
              <p className="step-description">Tell us about your business</p>

              <div className="form-section">
                <div className="form-group">
                  <label>Business Type *</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className={errors.businessType ? 'error' : ''}
                  >
                    <option value="">Select business type</option>
                    <option value="sole-proprietorship">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="llp">Limited Liability Partnership (LLP)</option>
                    <option value="private-limited">Private Limited Company</option>
                    <option value="public-limited">Public Limited Company</option>
                    <option value="huf">Hindu Undivided Family (HUF)</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessType && <span className="error-message">{errors.businessType}</span>}
                </div>

                <div className="form-group">
                  <label>Industry *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={errors.industry ? 'error' : ''}
                  >
                    <option value="">Select industry</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="services">Services</option>
                    <option value="trading">Trading</option>
                    <option value="restaurant">Restaurant & Food Service</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="it-software">IT & Software</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.industry && <span className="error-message">{errors.industry}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Registration Number</label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      placeholder="Company registration number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tax ID</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      placeholder="Additional tax identification"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="form-step">
              <h2>Review Your Information</h2>
              <p className="step-description">Please review your details before completing registration</p>

              <div className="review-section">
                <div className="review-card">
                  <h3>Company Details</h3>
                  <div className="review-item">
                    <span className="review-label">Company Name:</span>
                    <span className="review-value">{formData.name}</span>
                  </div>
                  {formData.gstin && (
                    <div className="review-item">
                      <span className="review-label">GSTIN:</span>
                      <span className="review-value">{formData.gstin}</span>
                    </div>
                  )}
                  {formData.pan && (
                    <div className="review-item">
                      <span className="review-label">PAN:</span>
                      <span className="review-value">{formData.pan}</span>
                    </div>
                  )}
                  <div className="review-item">
                    <span className="review-label">Financial Year:</span>
                    <span className="review-value">{formData.financialYearStart} to {formData.financialYearEnd}</span>
                  </div>
                </div>

                <div className="review-card">
                  <h3>Address</h3>
                  <div className="review-item">
                    <span className="review-value">
                      {formData.address}, {formData.city}, {formData.state} - {formData.pincode}, {formData.country}
                    </span>
                  </div>
                </div>

                <div className="review-card">
                  <h3>Contact</h3>
                  <div className="review-item">
                    <span className="review-label">Phone:</span>
                    <span className="review-value">{formData.phone}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Email:</span>
                    <span className="review-value">{formData.email}</span>
                  </div>
                  {formData.website && (
                    <div className="review-item">
                      <span className="review-label">Website:</span>
                      <span className="review-value">{formData.website}</span>
                    </div>
                  )}
                </div>

                <div className="review-card">
                  <h3>Business Information</h3>
                  <div className="review-item">
                    <span className="review-label">Business Type:</span>
                    <span className="review-value">{formData.businessType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Industry:</span>
                    <span className="review-value">{formData.industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" className="btn-primary" onClick={handleNext} disabled={isSubmitting}>
                Next
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : (
                  <>
                    <Save size={18} />
                    Complete Registration
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanyRegistration

