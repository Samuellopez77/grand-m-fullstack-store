function AdminDashboardPage({ navigate, user }) {
  return <section className="orders-page">
    <header className="orders-heading">
      <div>
        <p className="eyebrow">GRAND_M / Administration</p>
        <h1>Admin dashboard.</h1>
        <p>Operations overview for product, customer, staff, and order management.</p>
      </div>
      <button className="orders-back-link" onClick={() => navigate('account')} type="button"><span aria-hidden="true">←</span> Back to account</button>
    </header>

    <div className="orders-list">
      <article className="account-panel order-card">
        <div className="account-panel-heading">
          <div>
            <p className="eyebrow">Signed in as</p>
            <h2>{user?.name || 'Administrator'}</h2>
          </div>
          <span className="order-status">ADMIN</span>
        </div>
        <div className="order-meta">
          <p><strong>Product management:</strong> Create, edit, and remove store inventory.</p>
          <p><strong>User management:</strong> Review customer and staff account access.</p>
          <p><strong>Reports:</strong> Operational and sales monitoring.</p>
        </div>
      </article>
    </div>
  </section>
}

export default AdminDashboardPage
