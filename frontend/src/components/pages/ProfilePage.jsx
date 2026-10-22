function ProfilePage({ navigate, user }) {
  return <section className="account-page">
    <header className="account-heading">
      <div>
        <p className="eyebrow">GRAND_M / Account</p>
        <h1>My profile.</h1>
        <p>Review your account details and keep your information current.</p>
      </div>
      <button className="account-store-link" onClick={() => navigate('account')} type="button"><span aria-hidden="true">←</span> Back to account</button>
    </header>

    <div className="account-layout">
      <nav aria-label="Account sections" className="account-navigation">
        <button className="active" onClick={() => navigate('profile')} type="button">Profile <span aria-hidden="true">›</span></button>
        <button onClick={() => navigate('account')} type="button">Overview <span aria-hidden="true">↗</span></button>
        <button onClick={() => navigate('orders')} type="button">Order history <span aria-hidden="true">↗</span></button>
      </nav>

      <section aria-label="Profile details" className="account-panel">
        <div className="account-panel-heading">
          <div>
            <p className="eyebrow">Personal details</p>
            <h2>Account information</h2>
          </div>
        </div>

        <div className="account-summary">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.department ? <p><strong>Department:</strong> {user.department}</p> : <p><strong>Department:</strong> N/A</p>}
        </div>

        <form className="account-form" onSubmit={(event) => event.preventDefault()}>
          <label>Full name<input autoComplete="name" defaultValue={user.name} maxLength="100" name="name" readOnly /></label>
          <label>Email address<input autoComplete="email" defaultValue={user.email} maxLength="254" name="email" readOnly type="email" /></label>
          <label>Role<input defaultValue={user.role} name="role" readOnly /></label>
          <div className="account-form-actions">
            <button className="button primary" type="button" onClick={() => navigate('account')}>Return to account</button>
          </div>
        </form>
      </section>
    </div>
  </section>
}

export default ProfilePage
