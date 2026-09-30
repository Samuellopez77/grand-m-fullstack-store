import { useRef } from 'react'
import { categoryDetails, productImage } from '../../products.js'
import formatPrice from '../../utils/formatPrice.js'

function CartPage({ cart, navigate, updateCart }) {
  const swipeStart = useRef(null)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const startItemSwipe = (event) => {
    const touch = event.changedTouches[0]
    swipeStart.current = { x: touch.clientX, y: touch.clientY }
  }
  const finishItemSwipe = (event, item) => {
    if (!swipeStart.current) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - swipeStart.current.x
    const deltaY = touch.clientY - swipeStart.current.y
    swipeStart.current = null
    if (deltaX < -72 && Math.abs(deltaX) > Math.abs(deltaY)) updateCart(item.id, -item.quantity)
  }

  if (!cart.length) {
    return <section className="cart-page cart-page-empty">
      <p className="eyebrow">GRAND_M / Your bag</p>
      <h1>Your bag is waiting.</h1>
      <p>Find a few pieces for your next rotation.</p>
      <button className="button primary" onClick={() => navigate('collections')} type="button">Browse the collection <span aria-hidden="true">›</span></button>
    </section>
  }

  return <section className="cart-page">
    <div className="cart-page-heading">
      <div><p className="eyebrow">GRAND_M / Your bag</p><h1>Your selection.</h1><p>{itemCount} {itemCount === 1 ? 'piece' : 'pieces'} selected</p></div>
      <button className="cart-page-continue" onClick={() => navigate('collections')} type="button"><span aria-hidden="true">←</span> Continue shopping</button>
    </div>
    <div className="cart-page-layout">
      <section aria-label="Items in your bag" className="cart-page-items">
        {cart.map((item) => <article className="cart-page-item" key={item.id} onTouchCancel={() => { swipeStart.current = null }} onTouchEnd={(event) => finishItemSwipe(event, item)} onTouchStart={startItemSwipe}>
          <button aria-label={`View ${item.name}`} className="cart-page-image" onClick={() => navigate(`product/${item.id}`)} type="button"><img alt={item.name} src={productImage(item.image)} /></button>
          <div className="cart-page-item-info">
            <p className="eyebrow">{categoryDetails[item.category].title}</p>
            <h2><button onClick={() => navigate(`product/${item.id}`)} type="button">{item.name}</button></h2>
            <p>{formatPrice(item.price)} each</p>
            <div className="cart-page-controls">
              <div aria-label={`Quantity for ${item.name}`} className="cart-page-quantity"><button aria-label={`Remove one ${item.name}`} onClick={() => updateCart(item.id, -1)} type="button">−</button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => updateCart(item.id, 1)} type="button">+</button></div>
              <button aria-label={`Delete ${item.name} from cart`} className="cart-page-remove" onClick={() => updateCart(item.id, -item.quantity)} type="button"><span aria-hidden="true">×</span> Delete</button>
              <span aria-hidden="true" className="cart-page-swipe-hint">or swipe left</span>
            </div>
          </div>
          <strong className="cart-page-line-total">{formatPrice(item.price * item.quantity)}</strong>
        </article>)}
      </section>
      <aside aria-labelledby="cart-summary-title" className="cart-page-summary">
        <div className="cart-page-summary-heading"><h2 id="cart-summary-title">Order summary</h2><span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span></div>
        <p className="cart-page-subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p>
        <p className="cart-page-shipping">Shipping and taxes are calculated at checkout.</p>
        <button className="button primary cart-page-checkout" onClick={() => navigate('checkout')} type="button">Proceed to checkout <span aria-hidden="true">›</span></button>
        <p className="cart-page-assurance"><span aria-hidden="true">◇</span> Review delivery costs before completing your order.</p>
      </aside>
    </div>
  </section>
}

export default CartPage