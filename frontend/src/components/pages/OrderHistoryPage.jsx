const sampleOrders = [
  {
    id: 'ORD-1001',
    date: '2026-10-13',
    status: 'Processing',
    total: 5400,
    items: [
      { name: 'Granite Hoodie', price: 2800, quantity: 1 },
      { name: 'Aero Runner', price: 2600, quantity: 1 },
    ],
  },
  {
    id: 'ORD-1002',
    date: '2026-10-09',
    status: 'Delivered',
    total: 3100,
    items: [
      { name: 'Daily Tee', price: 1550, quantity: 2 },
    ],
  },
]

function OrderHistoryPage({ navigate, user }) {
  return <section className="orders-page">
    <header className="orders-heading">
      <div>
        <p className="eyebrow">GRAND_M / Account</p>
        <h1>{user?.name ? `${user.name.split(' ')[0]}'s` : 'Your'} order history.</h1>
        <p>Keep track of your purchases and delivery progress.</p>
      </div>
      <button className="orders-back-link" onClick={() => navigate('account')} type="button"><span aria-hidden="true">←</span> Back to account</button>
    </header>

    <div className="orders-list">
      {sampleOrders.map((order) => <article className="account-panel order-card" key={order.id}>
        <div className="account-panel-heading">
          <div>
            <p className="eyebrow">Order</p>
            <h2>{order.id}</h2>
          </div>
          <span className="order-status">{order.status}</span>
        </div>

        <div className="order-meta">
          <p><strong>Date:</strong> {order.date}</p>
          <p><strong>Items:</strong> {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
          <p><strong>Total:</strong> ${order.total / 100}</p>
        </div>

        <div className="account-form-actions">
          <button className="button primary" onClick={() => navigate(`order/${order.id}`)} type="button">View details</button>
        </div>
      </article>)}
    </div>
  </section>
}

export default OrderHistoryPage