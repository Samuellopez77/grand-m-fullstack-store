import { useMemo, useState } from 'react'
import { categoryDetails, products, productImage } from '../../products.js'
import CategoryImageCycler from '../products/CategoryImageCycler.jsx'
import ProductCard from '../products/ProductCard.jsx'

function ShopPage({ addToCart, category, navigate, query, setQuery, title }) {
  const [activeCategory, setActiveCategory] = useState(category || 'all')
  const [sort, setSort] = useState('featured')
  const isCollectionLanding = !category
  const collections = useMemo(() => Object.entries(categoryDetails).map(([key, details], index) => {
    const productImages = products.filter((product) => product.category === key).map((product) => productImage(product.image))
    const images = [details.cover, ...productImages.filter((image) => image !== details.cover)]
    return {
    key,
    ...details,
    images,
    count: products.filter((product) => product.category === key).length,
    index: String(index + 1).padStart(2, '0'),
    }
  }), [])
  const availableProducts = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = products.filter((product) => (activeCategory === 'all' || product.category === activeCategory) && (!term || `${product.name} ${product.category}`.toLowerCase().includes(term)))
    if (sort === 'price-low') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') return [...filtered].sort((a, b) => b.price - a.price)
    if (sort === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    return filtered
  }, [activeCategory, query, sort])

  return <section className={`content-section shop-page ${isCollectionLanding ? 'collection-page' : ''}`}>
    <div className="page-intro shop-intro"><p className="eyebrow">{category ? `GRAND_M / ${categoryDetails[category].kicker}` : 'GRAND_M / 2026 collection'}</p><div className="shop-intro-line"><div><h1>{title}</h1><p>{category ? categoryDetails[category].description : 'A considered rotation of everyday essentials, selected to move with you.'}</p></div>{isCollectionLanding && <span className="collection-edition">01 <i /> 03&nbsp; / &nbsp;{products.length} PIECES</span>}</div></div>
    {isCollectionLanding && <section aria-labelledby="collection-categories-title" className="collection-directory">
      <div className="collection-directory-heading"><div><p className="eyebrow">Shop by category</p><h2 id="collection-categories-title">Find your lane.</h2></div><span>Three edits. One point of view.</span></div>
      <div className="collection-categories">{collections.map((collection) => <button aria-pressed={activeCategory === collection.key} className={`collection-category ${activeCategory === collection.key ? 'active' : ''}`} key={collection.key} onClick={() => setActiveCategory(collection.key)} type="button">
        <CategoryImageCycler images={collection.images} />
        <span className="collection-category-wash" />
        <span className="collection-category-index">{collection.index} <i /> GRAND_M EDIT</span>
        <span className="collection-category-copy"><strong>{collection.title}</strong><span>{collection.description}</span><span className="collection-category-footer"><small>{collection.count} pieces</small><b aria-hidden="true">↗</b></span></span>
      </button>)}</div>
    </section>}
    <div className="shop-toolbar">
      <div aria-label="Filter products by category" className="filters">{['all', ...Object.keys(categoryDetails)].map((key) => <button aria-pressed={activeCategory === key} className={activeCategory === key ? 'active' : ''} key={key} onClick={() => setActiveCategory(key)} type="button"><span>{key === 'all' ? 'All pieces' : categoryDetails[key].title}</span><small>{key === 'all' ? products.length : products.filter((product) => product.category === key).length}</small></button>)}</div>
      <div className="shop-controls"><label className="filter-search">⌕<input aria-label="Filter products" onChange={(event) => setQuery(event.target.value)} placeholder="Filter products" value={query} /></label><select aria-label="Sort products" onChange={(event) => setSort(event.target.value)} value={sort}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></div>
    </div>
    <p className="result-count"><span>{activeCategory === 'all' ? 'The full edit' : categoryDetails[activeCategory].title}</span><span>{availableProducts.length} {availableProducts.length === 1 ? 'piece' : 'pieces'} available</span></p>
    {isCollectionLanding && activeCategory === 'all' && availableProducts.length ? <div className="collection-groups">{collections.map((collection) => {
      const categoryProducts = availableProducts.filter((product) => product.category === collection.key)
      if (!categoryProducts.length) return null
      return <section aria-labelledby={`collection-group-${collection.key}`} className="collection-group" key={collection.key}>
        <div className="collection-group-heading"><div><p className="eyebrow">{collection.index} / {collection.kicker}</p><h2 id={`collection-group-${collection.key}`}>{collection.title}</h2><p>{collection.description}</p></div><div className="collection-group-meta"><span>{categoryProducts.length} {categoryProducts.length === 1 ? 'piece' : 'pieces'}</span><span className="collection-carousel-hint">Swipe to explore <span aria-hidden="true">→</span></span></div></div>
        <div aria-label={`${collection.title} products`} aria-roledescription="carousel" className="product-grid collection-product-carousel" role="region" tabIndex={0}>{categoryProducts.map((product) => <ProductCard addToCart={addToCart} key={product.id} navigate={navigate} product={product} />)}</div>
      </section>
    })}</div> : availableProducts.length ? <div className="product-grid">{availableProducts.map((product) => <ProductCard addToCart={addToCart} key={product.id} navigate={navigate} product={product} />)}</div> : <div className="empty-state"><h2>No matches found</h2><p>Try a different search or browse the entire collection.</p><button className="button primary" onClick={() => { setQuery(''); setActiveCategory('all') }} type="button">Clear filters</button></div>}
  </section>
}

export default ShopPage