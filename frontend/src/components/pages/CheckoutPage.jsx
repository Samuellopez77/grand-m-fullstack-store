import { useState } from 'react'
import { productImage } from '../../products.js'
import formatPrice from '../../utils/formatPrice.js'

function CheckoutPage({ cart, navigate, updateCart }) {
  const [step, setStep] = useState(1)
  const [notice, setNotice] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [delivery, setDelivery] = useState({ name: '', email: '', phone: '', address: '', city: '', region: '', country: '', notes: '' })
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const updateDelivery = (event) => {
    const { name, value } = event.target
    setDelivery((current) => ({ ...current, [name]: value }))
  }

  const continueToPayment = (event) => {
    event.preventDefault()
    setNotice('')
    setStep(2)
  }

  const continueToReview = (event) => {
    event.preventDefault()
    if (!paymentMethod) {
      setNotice('Choose a payment method preview to continue.')
      return
    }
    setNotice('')
    setStep(3)
  }

  const submitCheckout = (event) => {
    event.preventDefault()
    setNotice('Order placement is not connected yet. Your details were not sent and no order was placed.')
  }

  const paymentOptions = [
    { id: 'card', title: 'Bank card', detail: 'Card provider setup required' },
    { id: 'mobile', title: 'Mobile payment', detail: 'Provider availability to be confirmed' },
    { id: 'delivery', title: 'Pay on delivery', detail: 'Delivery availability to be confirmed' },
  ]
  const selectedPayment = paymentOptions.find((option) => option.id === paymentMethod)

  if (!cart.length) {
    return <section className="checkout-page checkout-empty"><p className="eyebrow">Checkout</p><h1>Your bag is empty.</h1><p>Add something from the collection before continuing.</p><button className="button primary" onClick={() => navigate('collections')} type="button">Browse the collection <span aria-hidden="true">›</span></button></section>
  }

  return <section className="checkout-page">
    <div className="checkout-heading"><div><p className="eyebrow">GRAND_M / Secure checkout</p><h1>Checkout</h1></div><button className="checkout-back" onClick={() => navigate('cart')} type="button"><span aria-hidden="true">←</span> Back to bag</button></div>
    <ol aria-label="Checkout progress" className="checkout-progress">
      <li aria-current={step === 1 ? 'step' : undefined} className={step > 1 ? 'complete' : ''}><span>01</span> Delivery</li>
      <li aria-current={step === 2 ? 'step' : undefined} className={step > 2 ? 'complete' : ''}><span>02</span> Payment</li>
      <li aria-current={step === 3 ? 'step' : undefined}><span>03</span> Review</li>
    </ol>
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={step === 1 ? continueToPayment : step === 2 ? continueToReview : submitCheckout}>
        {step === 1 && <section aria-labelledby="delivery-heading" className="checkout-section">
          <div className="checkout-section-heading"><span>01</span><div><h2 id="delivery-heading">Delivery details</h2><p>Where should we send your order?</p></div></div>
          <div className="checkout-fields">
            <label className="checkout-field checkout-field-wide">Full name<input autoComplete="name" maxLength="100" name="name" onChange={updateDelivery} required value={delivery.name} /></label>
            <label className="checkout-field">Email address<input autoComplete="email" maxLength="254" name="email" onChange={updateDelivery} required type="email" value={delivery.email} /></label>
            <label className="checkout-field">Phone number<input autoComplete="tel" maxLength="32" name="phone" onChange={updateDelivery} required type="tel" value={delivery.phone} /></label>
            <label className="checkout-field checkout-field-wide">Street address<input autoComplete="street-address" maxLength="180" name="address" onChange={updateDelivery} required value={delivery.address} /></label>
            <label className="checkout-field">City<input autoComplete="address-level2" maxLength="100" name="city" onChange={updateDelivery} required value={delivery.city} /></label>
            <label className="checkout-field">State / region<input autoComplete="address-level1" maxLength="100" name="region" onChange={updateDelivery} required value={delivery.region} /></label>
            <label className="checkout-field checkout-field-wide">Country<input autoComplete="country-name" maxLength="100" name="country" onChange={updateDelivery} required value={delivery.country} /></label>
            <label className="checkout-field checkout-field-wide">Delivery notes <span>(optional)</span><textarea maxLength="500" name="notes" onChange={updateDelivery} rows="3" value={delivery.notes} /></label>
          </div>
        </section>}
        {step === 2 && <section aria-labelledby="payment-heading" className="checkout-section checkout-payment">
          <div className="checkout-section-heading"><span>02</span><div><h2 id="payment-heading">Choose a payment method</h2><p>These are preview options only; providers and availability are not configured.</p></div></div>
          <fieldset className="checkout-payment-options"><legend className="visually-hidden">Payment method preview</legend>{paymentOptions.map((option) => <label className={`checkout-payment-option ${paymentMethod === option.id ? 'selected' : ''}`} key={option.id}>
            <input checked={paymentMethod === option.id} name="paymentMethod" onChange={() => { setPaymentMethod(option.id); setNotice('') }} type="radio" value={option.id} />
            <span className="checkout-payment-radio" aria-hidden="true" />
            <span className="checkout-payment-copy"><strong>{option.title}</strong><small>{option.detail}</small></span>
            <span className="checkout-payment-preview">Preview</span>
          </label>)}</fieldset>
          <p className="checkout-setup-note"><span aria-hidden="true">◇</span> No payment details are collected and you will not be charged.</p>
        </section>}
        {step === 3 && <section aria-labelledby="review-heading" className="checkout-section checkout-review">
          <div className="checkout-section-heading"><span>03</span><div><h2 id="review-heading">Review your details</h2><p>Check your delivery and payment selection before placing an order.</p></div></div>
          <div className="checkout-review-block"><div><div><p className="eyebrow">Delivering to</p><button className="checkout-edit-link" onClick={() => setStep(1)} type="button">Edit</button></div><strong>{delivery.name}</strong><p>{delivery.address}<br />{delivery.city}, {delivery.region}<br />{delivery.country}</p><p>{delivery.email}<br />{delivery.phone}</p>{delivery.notes && <p>Note: {delivery.notes}</p>}</div></div>
          <div className="checkout-review-block"><div><div><p className="eyebrow">Payment method</p><button className="checkout-edit-link" onClick={() => setStep(2)} type="button">Edit</button></div><strong>{selectedPayment?.title}</strong><p>This is a preview selection only. No payment details were entered.</p></div></div>
          <p className="checkout-setup-note"><span aria-hidden="true">◇</span> This preview will not create an order or send your personal details.</p>
        </section>}
        <div className="checkout-step-actions">
          {step > 1 && <button className="checkout-step-back" onClick={() => { setStep(step - 1); setNotice('') }} type="button"><span aria-hidden="true">←</span> Back</button>}
          <button className="button primary checkout-submit" type="submit">{step === 1 ? 'Continue to payment' : step === 2 ? 'Review order' : 'Place order'} <span aria-hidden="true">›</span></button>
        </div>
        {notice && <p aria-live="polite" className="checkout-notice" role="status">{notice}</p>}
      </form>
      <aside aria-labelledby="summary-heading" className="checkout-summary">
        <div className="checkout-summary-heading"><h2 id="summary-heading">Your order</h2><span>{cart.reduce((total, item) => total + item.quantity, 0)} {cart.reduce((total, item) => total + item.quantity, 0) === 1 ? 'item' : 'items'}</span></div>
        <div className="checkout-summary-items">{cart.map((item) => <article className="checkout-summary-item" key={item.id}>
          <img alt={item.name} src={productImage(item.image)} />
          <div className="checkout-item-info"><h3>{item.name}</h3><p>{formatPrice(item.price)} each</p><div className="checkout-quantity"><button aria-label={`Remove one ${item.name}`} onClick={() => updateCart(item.id, -1)} type="button">−</button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => updateCart(item.id, 1)} type="button">+</button></div></div>
          <strong>{formatPrice(item.price * item.quantity)}</strong>
        </article>)}</div>
        <div className="checkout-totals"><p><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p><p><span>Delivery</span><span>Pending setup</span></p><p><span>Taxes</span><span>Pending setup</span></p><p className="checkout-total"><span>Estimated total</span><strong>After delivery setup</strong></p></div>
        <p className="checkout-summary-note">Your details are not sent, and no payment is taken on this preview.</p>
      </aside>
    </div>
  </section>
}

export default CheckoutPage