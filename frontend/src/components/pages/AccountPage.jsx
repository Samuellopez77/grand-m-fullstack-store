import { useState } from 'react'

function AccountPage({ navigate }) {
  const [activeSection, setActiveSection] = useState('profile')
  const [addressEditorOpen, setAddressEditorOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const showPreviewNotice = (event) => {
    event.preventDefault()
    setNotice('Account services are not connected yet. Your details were not saved.')
  }

  return <section className="account-page">
    <header className="account-heading"><div><p className="eyebrow">GRAND_M / Account</p><h1>Your account.</h1><p>Manage your profile and delivery details.</p></div><button className="account-store-link" onClick={() => navigate('collections')} type="button"><span aria-hidden="true">←</span> Continue shopping</button></header>
    <p className="account-preview-note"><span aria-hidden="true">◇</span> Account services are not connected yet. Changes on this page are preview only.</p>
    <div className="account-layout">
      <nav aria-label="Account sections" className="account-navigation">
        <button aria-current={activeSection === 'profile' ? 'page' : undefined} className={activeSection === 'profile' ? 'active' : ''} onClick={() => { setActiveSection('profile'); setNotice('') }} type="button">Profile <span aria-hidden="true">›</span></button>
        <button aria-current={activeSection === 'addresses' ? 'page' : undefined} className={activeSection === 'addresses' ? 'active' : ''} onClick={() => { setActiveSection('addresses'); setNotice('') }} type="button">Saved addresses <span aria-hidden="true">›</span></button>
        <button onClick={() => navigate('orders')} type="button">Order history <span aria-hidden="true">↗</span></button>
        <button className="account-password-link" onClick={() => navigate('forgot-password')} type="button">Change password <span aria-hidden="true">↗</span></button>
      </nav>
      <section aria-label={activeSection === 'profile' ? 'Profile details' : 'Saved addresses'} className="account-panel">
        {activeSection === 'profile' ? <>
          <div className="account-panel-heading"><div><p className="eyebrow">Personal details</p><h2>Profile</h2></div></div>
          <form className="account-form" onSubmit={showPreviewNotice}>
            <label>Full name<input autoComplete="name" maxLength="100" name="name" required /></label>
            <label>Email address<input autoComplete="email" maxLength="254" name="email" required type="email" /></label>
            <label>Phone number<input autoComplete="tel" maxLength="32" name="phone" type="tel" /></label>
            <div className="account-form-actions"><button className="button primary" type="submit">Save profile</button></div>
          </form>
        </> : <>
          <div className="account-panel-heading"><div><p className="eyebrow">Delivery</p><h2>Saved addresses</h2></div>{!addressEditorOpen && <button className="account-add-address" onClick={() => { setAddressEditorOpen(true); setNotice('') }} type="button"><span aria-hidden="true">+</span> Add address</button>}</div>
          {addressEditorOpen ? <form className="account-form" onSubmit={showPreviewNotice}>
            <label>Recipient name<input autoComplete="name" maxLength="100" name="recipient" required /></label>
            <label>Phone number<input autoComplete="tel" maxLength="32" name="phone" required type="tel" /></label>
            <label className="account-field-wide">Street address<input autoComplete="street-address" maxLength="180" name="street" required /></label>
            <label>City<input autoComplete="address-level2" maxLength="100" name="city" required /></label>
            <label>State / region<input autoComplete="address-level1" maxLength="100" name="region" required /></label>
            <label className="account-field-wide">Country<input autoComplete="country-name" maxLength="100" name="country" required /></label>
            <div className="account-form-actions"><button className="button primary" type="submit">Save address</button><button className="account-cancel" onClick={() => setAddressEditorOpen(false)} type="button">Cancel</button></div>
          </form> : <div className="account-empty-address"><span aria-hidden="true">⌖</span><h3>No saved addresses yet.</h3><p>Add a delivery address for a quicker checkout once account services are available.</p><button className="button quiet" onClick={() => setAddressEditorOpen(true)} type="button">Add your first address</button></div>}
        </>}
        {notice && <p aria-live="polite" className="account-notice" role="status">{notice}</p>}
      </section>
    </div>
  </section>
}

export default AccountPage