import { useState } from 'react'
import { categoryDetails, productImage } from '../../products.js'
import formatPrice from '../../utils/formatPrice.js'

function ProductDetailPage({ addToCart, navigate, product }) {
  const [quantity, setQuantity] = useState(1)
  const category = categoryDetails[product.category]

  return <section className="content-section product-detail-page">
    <nav aria-label="Breadcrumb" className="product-detail-breadcrumb">
      <button onClick={() => navigate('collections')} type="button">Men’s collection</button><span aria-hidden="true">/</span><button onClick={() => navigate(product.category)} type="button">{category.title}</button><span aria-hidden="true">/</span><span>{product.name}</span>
    </nav>
    <div className="product-detail-layout">
      <div className="product-detail-media"><span>{category.kicker}</span><img alt={product.name} fetchPriority="high" src={productImage(product.image)} /></div>
      <div className="product-detail-info">
        <p className="eyebrow">GRAND_M / {category.title}</p>
        <h1>{product.name}</h1>
        <p className="product-detail-price">{formatPrice(product.price)}</p>
        <div className="product-detail-description"><p className="eyebrow">The edit</p><p>{category.description}</p></div>
        <label className="product-detail-quantity">Quantity<select aria-label={`Quantity for ${product.name}`} onChange={(event) => setQuantity(Number(event.target.value))} value={quantity}>{[1, 2, 3, 4, 5].map((amount) => <option key={amount} value={amount}>{amount}</option>)}</select></label>
        <button className="button primary product-detail-add" onClick={() => addToCart(product, quantity)} type="button">Add to bag <span aria-hidden="true">›</span></button>
        <button className="product-detail-back" onClick={() => navigate(product.category)} type="button">Continue browsing {category.title} <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  </section>
}

export default ProductDetailPage