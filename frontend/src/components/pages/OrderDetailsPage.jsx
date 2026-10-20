import formatPrice from '../../utils/formatPrice.js'

function OrderDetailsPage({ navigate, order }) {
  if (!order) {
    return <section className="orders-page">
      <header className="orders-heading">
        <div>
          <p className="eyebrow">GRAND_M / Account</p>
          <h1>Order not found.</h1>
          <p>The selected order could not be found.</p>
        </div>
        <button className="orders-back-link" onClick={() => navigate('orders')} type="button"><span aria-hidden="true">←</span> Back to orders</button>
      </header>
    </section>
  }

  return <section className="orders-page">
    <header className="orders-heading">
      <div>
        <p className="eyebrow">GRAND_M / Account</p>
        <h1>Order {order.id}</h1>
        <p>Placed on {order.date} • Status: {order.status}</p>
      </div>
      <button className="orders-back-link" onClick={() => navigate('orders')} type="button"><span aria-hidden="true">←</span> Back to orders</button>
    </header>

    <div className="order-details-layout">
      <section className="account-panel">
        <div className="account-panel-heading">
          <div>
            <p className="eyebrow">Summary</p>
            <h2>Order contents</h2>
          </div>
        </div>

        <div className="checkout-summary-items">
          {order.items.map((item) => <article className="checkout-summary-item" key={`${order.id}-${item.name}`}>
            <div className="checkout-item-info">
              <h3>{item.name}</h3>
              <p>{item.quantity} × {formatPrice(item.price)}</p>
            </div>
            <strong>{formatPrice(item.quantity * item.price)}</strong>
          </article>)}
        </div>
      </section>

      <aside className="account-panel order-summary-panel">
        <div className="account-panel-heading">
          <div>
            <p className="eyebrow">Status</p>
            <h2>{order.status}</h2>
          </div>
        </div>

        <div className="checkout-totals">
          <p><span>Subtotal</span><strong>{formatPrice(order.total)}</strong></p>
          <p><span>Shipping</span><span>Calculated in checkout</span></p>
          <p className="checkout-total"><span>Total</span><strong>{formatPrice(order.total)}</strong></p>
        </div>

        <button className="button primary" onClick={() => navigate('orders')} type="button">Back to order history</button>
      </aside>
    </div>
  </section>
}

export default OrderDetailsPage
