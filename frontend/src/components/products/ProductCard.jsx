import { useState } from 'react'
import { categoryDetails, productImage } from '../../products.js'
import formatPrice from '../../utils/formatPrice.js'

function ProductCard({ addToCart, navigate, product }) {
  const [quantity, setQuantity] = useState(1)
  const openProduct = () => navigate(`product/${product.id}`)

  return <article className="product-card">
    <div className="product-image">
      <button aria-label={`View ${product.name}`} className="product-image-link" onClick={openProduct} type="button">
        <img alt={product.name} loading="lazy" src={productImage(product.image)} />
      </button>
      <span>{categoryDetails[product.category].kicker}</span>
    </div>
    <div className="product-details">
      <div><h3><button className="product-title-link" onClick={openProduct} type="button">{product.name}</button></h3><p>{categoryDetails[product.category].title}</p></div>
      <strong>{formatPrice(product.price)}</strong>
    </div>
    <div className="product-actions">
      <select aria-label={`Quantity for ${product.name}`} onChange={(event) => setQuantity(Number(event.target.value))} value={quantity}>{[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number}</option>)}</select>
      <button onClick={() => addToCart(product, quantity)} type="button">Add to cart</button>
    </div>
  </article>
}

export default ProductCard