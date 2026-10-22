function StaffDashboardPage({ navigate, user }) {
  const departmentSummary = {
    INVENTORY: 'Stock levels and replenishment tracking',
    ORDERS: 'Order processing and fulfillment overview',
    DELIVERY: 'Dispatch and delivery progress',
    SUPPORT: 'Customer support queue and enquiries',
    FINANCE: 'Sales totals and reconciliation checks',
  }

  const dept = user?.department || 'ORDERS'

  return <section className="orders-page">
    <header className="orders-heading">
      <div>
        <p className="eyebrow">GRAND_M / Staff</p>
        <h1>Staff dashboard.</h1>
        <p>{departmentSummary[dept] || 'Operations overview for your team.'}</p>
      </div>
      <button className="orders-back-link" onClick={() => navigate('account')} type="button"><span aria-hidden="true">←</span> Back to account</button>
    </header>

    <div className="orders-list">
      <article className="account-panel order-card">
        <div className="account-panel-heading">
          <div>
            <p className="eyebrow">Access</p>
            <h2>{user?.role || 'STAFF'}</h2>
          </div>
          <span className="order-status">{dept}</span>
        </div>
        <div className="order-meta">
          <p><strong>Department:</strong> {dept}</p>
          <p><strong>Assigned tasks:</strong> Inventory review, fulfillment, and customer support queue.</p>
        </div>
      </article>
    </div>
  </section>
}

export default StaffDashboardPage
