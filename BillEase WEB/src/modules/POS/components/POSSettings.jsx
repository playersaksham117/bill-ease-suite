import React, { useState } from 'react'
import { Settings, Save, CreditCard, Receipt, Bell } from 'lucide-react'
import '../POS.css'

const POSSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pos_settings')
    return saved ? JSON.parse(saved) : {
      taxRate: 18,
      currency: 'INR',
      currencySymbol: '₹',
      receiptHeader: 'BillEase POS',
      receiptFooter: 'Thank you for your business!',
      autoPrint: false,
      showCustomerFields: true,
      lowStockAlert: true,
      lowStockThreshold: 10,
      paymentMethods: {
        cash: true,
        card: true,
        upi: true
      }
    }
  })

  const [activeTab, setActiveTab] = useState('general')

  const handleSave = () => {
    localStorage.setItem('pos_settings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  const handlePaymentMethodToggle = (method) => {
    setSettings({
      ...settings,
      paymentMethods: {
        ...settings.paymentMethods,
        [method]: !settings.paymentMethods[method]
      }
    })
  }

  return (
    <div className="pos-container">
      <div className="page-header">
        <h2>POS Settings</h2>
        <div className="header-actions">
          <button className="action-btn" onClick={handleSave}>
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Settings size={18} />
            General
          </button>
          <button
            className={`settings-tab ${activeTab === 'receipt' ? 'active' : ''}`}
            onClick={() => setActiveTab('receipt')}
          >
            <Receipt size={18} />
            Receipt
          </button>
          <button
            className={`settings-tab ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <CreditCard size={18} />
            Payment
          </button>
          <button
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            Notifications
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="form-group">
                <label>Tax Rate (%)</label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Currency Symbol</label>
                <input
                  type="text"
                  value={settings.currencySymbol}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.showCustomerFields}
                    onChange={(e) => handleChange('showCustomerFields', e.target.checked)}
                  />
                  Show Customer Fields in Checkout
                </label>
              </div>
            </div>
          )}

          {activeTab === 'receipt' && (
            <div className="settings-section">
              <h3>Receipt Settings</h3>
              <div className="form-group">
                <label>Receipt Header</label>
                <input
                  type="text"
                  value={settings.receiptHeader}
                  onChange={(e) => handleChange('receiptHeader', e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div className="form-group">
                <label>Receipt Footer</label>
                <textarea
                  value={settings.receiptFooter}
                  onChange={(e) => handleChange('receiptFooter', e.target.value)}
                  placeholder="Thank you message"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.autoPrint}
                    onChange={(e) => handleChange('autoPrint', e.target.checked)}
                  />
                  Auto Print Receipt After Sale
                </label>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="settings-section">
              <h3>Payment Methods</h3>
              <div className="payment-methods-settings">
                <div className="payment-method-setting">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.paymentMethods.cash}
                      onChange={() => handlePaymentMethodToggle('cash')}
                    />
                    Cash Payment
                  </label>
                </div>
                <div className="payment-method-setting">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.paymentMethods.card}
                      onChange={() => handlePaymentMethodToggle('card')}
                    />
                    Card Payment
                  </label>
                </div>
                <div className="payment-method-setting">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.paymentMethods.upi}
                      onChange={() => handlePaymentMethodToggle('upi')}
                    />
                    UPI Payment
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.lowStockAlert}
                    onChange={(e) => handleChange('lowStockAlert', e.target.checked)}
                  />
                  Enable Low Stock Alerts
                </label>
              </div>
              <div className="form-group">
                <label>Low Stock Threshold</label>
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                  min="1"
                  disabled={!settings.lowStockAlert}
                />
                <small>Alert when stock falls below this quantity</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default POSSettings

