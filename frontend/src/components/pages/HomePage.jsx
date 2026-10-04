import { categoryDetails } from '../../products.js'
import HeroGallery from '../home/HeroGallery.jsx'
import ProductRail from '../products/ProductRail.jsx'

function HomePage({ addToCart, navigate, products }) {
  const sneakers = products.filter((product) => product.category === 'sneakers').slice(0, 4)
  const hoodies = products.filter((product) => product.category === 'hoodies').slice(0, 4)

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">GRAND_M / 2026 collection</p>
          <h1>Designed for the way you move.</h1>
          <p>Statement sneakers, premium hoodies, and everyday pieces selected for your next chapter.</p>
          <div className="hero-actions"><button className="button primary" onClick={() => navigate('collections')} type="button">Shop the collection <span>›</span></button><button className="button quiet" onClick={() => navigate('about')} type="button">Our story</button></div>
        </div>
        <HeroGallery navigate={navigate} />
      </section>
      <section className="value-strip"><p><b>01</b> Curated essentials</p><p><b>02</b> Secure checkout</p><p><b>03</b> Easy 30-day returns</p></section>
      <section className="content-section">
        <div className="section-heading"><div><p className="eyebrow">Browse by mood</p><h2>Built around your rotation.</h2></div></div>
        <div className="category-cards">
          {Object.entries(categoryDetails).map(([key, category]) => <button className="category-card" key={key} onClick={() => navigate(key)} type="button"><img alt="" src={category.cover} /><div><p>{category.kicker}</p><strong>{category.title}</strong><em>Explore ›</em></div></button>)}
        </div>
      </section>
      <ProductRail addToCart={addToCart} navigate={navigate} products={sneakers} route="sneakers" title="Fresh sneaker energy" />
      <ProductRail addToCart={addToCart} navigate={navigate} products={hoodies} route="hoodies" title="Layers worth living in" />
      <section className="editorial-banner"><p className="eyebrow">The GRAND_M standard</p><h2>Style should feel personal, not precious.</h2><button className="text-button" onClick={() => navigate('about')} type="button">Meet the collection ›</button></section>
    </>
  )
}

export default HomePage