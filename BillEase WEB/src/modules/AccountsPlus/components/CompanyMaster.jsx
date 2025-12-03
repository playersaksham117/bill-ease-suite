import React, { useState, useEffect } from 'react'
import { Building2, Upload, Save, Plus, Edit, Trash2, X, Calendar, FileText, Percent, MapPin, CheckCircle } from 'lucide-react'
import { useCompany } from '../../../context/CompanyContext'
import './CompanyMaster.css'

const CompanyMaster = () => {
  const {
    companies,
    activeCompany,
    addCompany,
    updateCompany,
    deleteCompany,
    addBranch,
    updateBranch,
    deleteBranch,
    setCompanies
  } = useCompany()
  
  const [activeTab, setActiveTab] = useState('companies')
  const [defaultCompanies] = useState([
    {
      id: 1,
      name: 'ABC Enterprises',
      gstin: '27ABCDE1234F1Z5',
      pan: 'ABCDE1234F',
      financialYearStart: '2024-04-01',
      financialYearEnd: '2025-03-31',
      logo: null,
      address: '123 Business Street, Mumbai, Maharashtra 400001',
      phone: '+91 98765 43210',
      email: 'info@abcenterprises.com',
      website: 'www.abcenterprises.com',
      isActive: true,
      branches: [
        { id: 1, name: 'Mumbai Branch', code: 'MBR', address: '123 Business Street, Mumbai', isActive: true },
        { id: 2, name: 'Delhi Branch', code: 'DBR', address: '456 Trade Avenue, Delhi', isActive: true }
      ]
    }
  ])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [companyForm, setCompanyForm] = useState({
    name: '',
    gstin: '',
    pan: '',
    financialYearStart: '',
    financialYearEnd: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: null
  })
  const [branchForm, setBranchForm] = useState({
    name: '',
    code: '',
    address: '',
    isActive: true
  })
  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: 'INV',
    numberFormat: 'INV-{YYYY}-{MM}-{####}',
    terms: 'Payment due within 30 days',
    footer: 'Thank you for your business!',
    showLogo: true,
    showSignature: true
  })
  const [gstSettings, setGstSettings] = useState({
    gstApplicable: true,
    compositionScheme: false,
    gstRate: 18,
    hsnCode: '',
    sacCode: '',
    placeOfSupply: 'Maharashtra'
  })

  // Initialize companies if empty
  useEffect(() => {
    if (companies.length === 0 && defaultCompanies.length > 0) {
      setCompanies(defaultCompanies)
    }
  }, [companies.length, defaultCompanies, setCompanies])

  const handleCompanySubmit = (e) => {
    e.preventDefault()
    if (selectedCompany) {
      // Update existing company
      updateCompany(selectedCompany.id, companyForm)
    } else {
      // Add new company
      addCompany({
        ...companyForm,
        isActive: true,
        branches: []
      })
    }
    setShowCompanyModal(false)
    setSelectedCompany(null)
    resetCompanyForm()
  }

  const handleBranchSubmit = (e) => {
    e.preventDefault()
    if (!selectedCompany) return

    if (editingBranch) {
      // Update existing branch
      updateBranch(selectedCompany.id, editingBranch.id, branchForm)
    } else {
      // Add new branch
      addBranch(selectedCompany.id, branchForm)
    }
    setShowBranchModal(false)
    setEditingBranch(null)
    resetBranchForm()
  }

  const handleEditCompany = (company) => {
    setSelectedCompany(company)
    setCompanyForm({
      name: company.name,
      gstin: company.gstin,
      pan: company.pan,
      financialYearStart: company.financialYearStart,
      financialYearEnd: company.financialYearEnd,
      address: company.address,
      phone: company.phone,
      email: company.email,
      website: company.website,
      logo: company.logo
    })
    setShowCompanyModal(true)
  }

  const handleEditBranch = (branch) => {
    setEditingBranch(branch)
    setBranchForm({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      isActive: branch.isActive
    })
    setShowBranchModal(true)
  }

  const handleDeleteCompany = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(companyId)
      if (selectedCompany?.id === companyId) {
        setSelectedCompany(null)
      }
    }
  }

  const handleDeleteBranch = (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      if (selectedCompany) {
        deleteBranch(selectedCompany.id, branchId)
      }
    }
  }

  const resetCompanyForm = () => {
    setCompanyForm({
      name: '',
      gstin: '',
      pan: '',
      financialYearStart: '',
      financialYearEnd: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      logo: null
    })
  }

  const resetBranchForm = () => {
    setBranchForm({
      name: '',
      code: '',
      address: '',
      isActive: true
    })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCompanyForm({ ...companyForm, logo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveSettings = () => {
    // Save invoice and GST settings to selected company
    if (selectedCompany) {
      updateCompany(selectedCompany.id, {
        invoiceSettings,
        gstSettings
      })
      alert('Settings saved successfully!')
    }
  }

  return (
    <div className="company-master">
      <div className="company-header">
        <h2>Company & Firm Master</h2>
        <button className="btn-primary" onClick={() => {
          setSelectedCompany(null)
          resetCompanyForm()
          setShowCompanyModal(true)
        }}>
          <Plus size={18} />
          Add Company
        </button>
      </div>

      <div className="company-tabs">
        <button
          className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          <Building2 size={18} />
          Companies
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          disabled={!selectedCompany}
        >
          <FileText size={18} />
          Default Settings
        </button>
      </div>

      <div className="company-content">
        {activeTab === 'companies' && (
          <div className="companies-list">
            {companies.map(company => (
              <div
                key={company.id}
                className={`company-card ${selectedCompany?.id === company.id ? 'selected' : ''}`}
                onClick={() => setSelectedCompany(company)}
              >
                <div className="company-card-header">
                  <div className="company-info">
                    {company.logo && (
                      <img src={company.logo} alt={company.name} className="company-logo-small" />
                    )}
                    <div>
                      <h3>{company.name}</h3>
                      <div className="company-meta">
                        <span>GSTIN: {company.gstin}</span>
                        <span>PAN: {company.pan}</span>
                      </div>
                    </div>
                  </div>
                  <div className="company-actions">
                    <button
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCompany(company)
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCompany(company.id)
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="company-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>FY: {company.financialYearStart} to {company.financialYearEnd}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{company.address}</span>
                  </div>
                  <div className="branches-section">
                    <div className="branches-header">
                      <span>Branches ({company.branches.length})</span>
                      {selectedCompany?.id === company.id && (
                        <button
                          className="btn-small"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingBranch(null)
                            resetBranchForm()
                            setShowBranchModal(true)
                          }}
                        >
                          <Plus size={14} />
                          Add Branch
                        </button>
                      )}
                    </div>
                    {company.branches.length > 0 && (
                      <div className="branches-list">
                        {company.branches.map(branch => (
                          <div key={branch.id} className="branch-item">
                            <div>
                              <strong>{branch.name}</strong>
                              <span className="branch-code">{branch.code}</span>
                            </div>
                            <div className="branch-actions">
                              <button
                                className="icon-btn-small"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditBranch(branch)
                                }}
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                className="icon-btn-small danger"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteBranch(branch.id)
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && selectedCompany && (
          <div className="settings-content">
            <div className="settings-section">
              <h3>Default Invoice Settings</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Invoice Prefix</label>
                  <input
                    type="text"
                    value={invoiceSettings.prefix}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, prefix: e.target.value })}
                    placeholder="INV"
                  />
                </div>
                <div className="form-group">
                  <label>Number Format</label>
                  <input
                    type="text"
                    value={invoiceSettings.numberFormat}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, numberFormat: e.target.value })}
                    placeholder="INV-{YYYY}-{MM}-{####}"
                  />
                  <small>Use {'{YYYY}'}, {'{MM}'}, {'{####}'} for dynamic values</small>
                </div>
                <div className="form-group">
                  <label>Terms & Conditions</label>
                  <textarea
                    rows="3"
                    value={invoiceSettings.terms}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, terms: e.target.value })}
                    placeholder="Payment due within 30 days"
                  />
                </div>
                <div className="form-group">
                  <label>Footer Text</label>
                  <textarea
                    rows="2"
                    value={invoiceSettings.footer}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, footer: e.target.value })}
                    placeholder="Thank you for your business!"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={invoiceSettings.showLogo}
                      onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showLogo: e.target.checked })}
                    />
                    Show Company Logo on Invoice
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={invoiceSettings.showSignature}
                      onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showSignature: e.target.checked })}
                    />
                    Show Signature on Invoice
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Default GST Settings</h3>
              <div className="settings-form">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={gstSettings.gstApplicable}
                      onChange={(e) => setGstSettings({ ...gstSettings, gstApplicable: e.target.checked })}
                    />
                    GST Applicable
                  </label>
                </div>
                {gstSettings.gstApplicable && (
                  <>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={gstSettings.compositionScheme}
                          onChange={(e) => setGstSettings({ ...gstSettings, compositionScheme: e.target.checked })}
                        />
                        Composition Scheme
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Default GST Rate (%)</label>
                      <input
                        type="number"
                        value={gstSettings.gstRate}
                        onChange={(e) => setGstSettings({ ...gstSettings, gstRate: parseFloat(e.target.value) })}
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label>Default HSN Code</label>
                      <input
                        type="text"
                        value={gstSettings.hsnCode}
                        onChange={(e) => setGstSettings({ ...gstSettings, hsnCode: e.target.value })}
                        placeholder="e.g., 8471"
                      />
                    </div>
                    <div className="form-group">
                      <label>Default SAC Code</label>
                      <input
                        type="text"
                        value={gstSettings.sacCode}
                        onChange={(e) => setGstSettings({ ...gstSettings, sacCode: e.target.value })}
                        placeholder="e.g., 998314"
                      />
                    </div>
                    <div className="form-group">
                      <label>Place of Supply</label>
                      <input
                        type="text"
                        value={gstSettings.placeOfSupply}
                        onChange={(e) => setGstSettings({ ...gstSettings, placeOfSupply: e.target.value })}
                        placeholder="e.g., Maharashtra"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn-primary" onClick={handleSaveSettings}>
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Company Modal */}
      {showCompanyModal && (
        <div className="modal-overlay" onClick={() => {
          setShowCompanyModal(false)
          setSelectedCompany(null)
          resetCompanyForm()
        }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCompany ? 'Edit Company' : 'Add New Company'}</h3>
              <button className="close-btn" onClick={() => {
                setShowCompanyModal(false)
                setSelectedCompany(null)
                resetCompanyForm()
              }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCompanySubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="form-group">
                  <label>Company Logo</label>
                  <div className="logo-upload">
                    {companyForm.logo ? (
                      <div className="logo-preview">
                        <img src={companyForm.logo} alt="Company logo" />
                        <button
                          type="button"
                          className="btn-small"
                          onClick={() => setCompanyForm({ ...companyForm, logo: null })}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label">
                        <Upload size={20} />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GSTIN</label>
                  <input
                    type="text"
                    value={companyForm.gstin}
                    onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value.toUpperCase() })}
                    placeholder="27ABCDE1234F1Z5"
                    maxLength="15"
                  />
                </div>
                <div className="form-group">
                  <label>PAN</label>
                  <input
                    type="text"
                    value={companyForm.pan}
                    onChange={(e) => setCompanyForm({ ...companyForm, pan: e.target.value.toUpperCase() })}
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
                    required
                    value={companyForm.financialYearStart}
                    onChange={(e) => setCompanyForm({ ...companyForm, financialYearStart: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Financial Year End *</label>
                  <input
                    type="date"
                    required
                    value={companyForm.financialYearEnd}
                    onChange={(e) => setCompanyForm({ ...companyForm, financialYearEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  rows="3"
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  placeholder="Enter company address"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    placeholder="info@company.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="www.company.com"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowCompanyModal(false)
                  setSelectedCompany(null)
                  resetCompanyForm()
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={18} />
                  {selectedCompany ? 'Update' : 'Create'} Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && selectedCompany && (
        <div className="modal-overlay" onClick={() => {
          setShowBranchModal(false)
          setEditingBranch(null)
          resetBranchForm()
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h3>
              <button className="close-btn" onClick={() => {
                setShowBranchModal(false)
                setEditingBranch(null)
                resetBranchForm()
              }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleBranchSubmit} className="modal-body">
              <div className="form-group">
                <label>Branch Name *</label>
                <input
                  type="text"
                  required
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="Enter branch name"
                />
              </div>
              <div className="form-group">
                <label>Branch Code *</label>
                <input
                  type="text"
                  required
                  value={branchForm.code}
                  onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value.toUpperCase() })}
                  placeholder="MBR"
                  maxLength="10"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  rows="3"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  placeholder="Enter branch address"
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={branchForm.isActive}
                    onChange={(e) => setBranchForm({ ...branchForm, isActive: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowBranchModal(false)
                  setEditingBranch(null)
                  resetBranchForm()
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={18} />
                  {editingBranch ? 'Update' : 'Create'} Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyMaster
