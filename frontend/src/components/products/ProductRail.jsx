import ProductCard from './ProductCard.jsx'

function ProductRail({ addToCart, navigate, products: railProducts, route, title }) {
  return <section className="content-section rail-section"><div className="section-heading"><div><p className="eyebrow">Just in</p><h2>{title}</h2></div><button className="text-button" onClick={() => navigate(route)} type="button">Shop all ›</button></div><div className="product-rail">{railProducts.map((product) => <ProductCard addToCart={addToCart} key={product.id} navigate={navigate} product={product} />)}</div></section>
}

export default ProductRail