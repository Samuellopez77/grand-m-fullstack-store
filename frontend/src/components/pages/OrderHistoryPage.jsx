function OrderHistoryPage({ navigate }) {
  return <section className="orders-page">
    <header className="orders-heading"><div><p className="eyebrow">GRAND_M / Account</p><h1>Order history.</h1><p>Keep track of your purchases and delivery progress.</p></div><button className="orders-back-link" onClick={() => navigate('account')} type="button"><span aria-hidden="true">←</span> Back to account</button></header>
    <p className="orders-preview-note"><span aria-hidden="true">◇</span> Order history will appear here once account and order services are connected.</p>
    <div className="orders-empty">
      <div aria-hidden="true" className="orders-empty-mark"><span>01</span><i /></div>
      <p className="eyebrow">Your next chapter</p>
      <h2>No orders to show yet.</h2>
      <p>When you place an order, its items, confirmation, and delivery updates will be collected here.</p>
      <button className="button primary" onClick={() => navigate('collections')} type="button">Explore the collection <span aria-hidden="true">›</span></button>
    </div>
  </section>
}

export default OrderHistoryPage