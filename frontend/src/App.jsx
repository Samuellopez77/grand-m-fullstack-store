import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { categoryDetails, products, productImage } from './products.js'

const navItems = [
  { label: 'Home', route: 'home' },
  { label: "Men’s collection", route: 'collections' },
  { label: 'Sneakers', route: 'sneakers' },
  { label: 'Hoodies', route: 'hoodies' },
  { label: 'About', route: 'about' },
]

const getRoute = () => window.location.hash.replace(/^#\/?/, '') || 'home'
const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 100)

function App() {
  const [route, setRoute] = useState(getRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('grand-m-theme') || 'dark')

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('grand-m-theme', theme)
  }, [theme])

  const navigate = (nextRoute) => {
    window.location.hash = `/${nextRoute}`
    setMenuOpen(false)
  }

  const addToCart = (product, quantity) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id)
      if (!existing) return [...items, { ...product, quantity }]
      return items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
    })
    setCartOpen(true)
  }

  const updateCart = (id, change) => {
    setCart((items) => items
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0))
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const pageProps = { addToCart, navigate, query, setQuery }
  const knownRoutes = ['home', 'collections', 'about', 'login', 'signup', ...Object.keys(categoryDetails)]

  return (
    <div className="site-shell">
      <p className="announcement">Complimentary shipping on orders over $75</p>
      <Header
        cartCount={cartCount}
        menuOpen={menuOpen}
        navigate={navigate}
        onCart={() => setCartOpen(true)}
        onMenu={() => setMenuOpen((open) => !open)}
        onSearch={(nextQuery) => { setQuery(nextQuery); navigate('collections') }}
        route={route}
        theme={theme}
        toggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
      />
      <MobileMenu isOpen={menuOpen} navigate={navigate} route={route} />
      <main>
        {route === 'home' && <HomePage {...pageProps} />}
        {route === 'collections' && <ShopPage {...pageProps} key="collections" title="The collection" />}
        {categoryDetails[route] && <ShopPage {...pageProps} category={route} key={route} title={categoryDetails[route].title} />}
        {route === 'about' && <AboutPage navigate={navigate} />}
        {route === 'login' && <AuthPage mode="login" navigate={navigate} />}
        {route === 'signup' && <AuthPage mode="signup" navigate={navigate} />}
        {!knownRoutes.includes(route) && <NotFound navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
      <CartDrawer cart={cart} isOpen={cartOpen} onClose={() => setCartOpen(false)} updateCart={updateCart} />
    </div>
  )
}

function Header({ cartCount, menuOpen, navigate, onCart, onMenu, onSearch, route, theme, toggleTheme }) {
  const [search, setSearch] = useState('')
  const submit = (event) => { event.preventDefault(); onSearch(search.trim()) }

  return (
    <header className="site-header">
      <div className="header-inner">
        <button aria-expanded={menuOpen} aria-label="Toggle menu" className="round-button menu-button" onClick={onMenu} type="button">{menuOpen ? '×' : '☰'}</button>
        <Brand navigate={navigate} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => <button className={route === item.route ? 'active' : ''} key={item.route} onClick={() => navigate(item.route)} type="button">{item.label}</button>)}
        </nav>
        <form className="header-search" onSubmit={submit} role="search">
          <input aria-label="Search products" onChange={(event) => setSearch(event.target.value)} placeholder="Search the collection" value={search} />
          <button aria-label="Search" type="submit">⌕</button>
        </form>
        <div className="header-actions">
          <button aria-label="Change color theme" className="round-button theme-button" onClick={toggleTheme} type="button">{theme === 'dark' ? '☀' : '◐'}</button>
          <button aria-label="Open shopping cart" className="round-button cart-button" onClick={onCart} type="button">♧{cartCount > 0 && <span>{cartCount}</span>}</button>
        </div>
      </div>
    </header>
  )
}

function Brand({ navigate }) {
  return <button className="brand" onClick={() => navigate('home')} type="button"><b>GM</b><span>GRAND_M<small>collections</small></span></button>
}

function MobileMenu({ isOpen, navigate, route }) {
  return (
    <aside aria-hidden={!isOpen} className={`mobile-menu ${isOpen ? 'is-open' : ''}`}>
      <p className="eyebrow">Explore GRAND_M</p>
      {navItems.map((item) => <button className={route === item.route ? 'active' : ''} key={item.route} onClick={() => navigate(item.route)} tabIndex={isOpen ? 0 : -1} type="button">{item.label}<span>›</span></button>)}
      <button onClick={() => navigate('login')} tabIndex={isOpen ? 0 : -1} type="button">Sign in<span>›</span></button>
    </aside>
  )
}

function HomePage({ addToCart, navigate }) {
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
        <div className="hero-art"><img alt="GRAND_M collection" src="/images/others/GRAND_M.png" /><p>New season<br />just landed</p></div>
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

function ProductRail({ addToCart, navigate, products: railProducts, route, title }) {
  return <section className="content-section rail-section"><div className="section-heading"><div><p className="eyebrow">Just in</p><h2>{title}</h2></div><button className="text-button" onClick={() => navigate(route)} type="button">Shop all ›</button></div><div className="product-rail">{railProducts.map((product) => <ProductCard addToCart={addToCart} key={product.id} product={product} />)}</div></section>
}

function ShopPage({ addToCart, category, query, setQuery, title }) {
  const [activeCategory, setActiveCategory] = useState(category || 'all')
  const [sort, setSort] = useState('featured')
  const availableProducts = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = products.filter((product) => (activeCategory === 'all' || product.category === activeCategory) && (!term || `${product.name} ${product.category}`.toLowerCase().includes(term)))
    if (sort === 'price-low') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') return [...filtered].sort((a, b) => b.price - a.price)
    if (sort === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    return filtered
  }, [activeCategory, query, sort])

  return <section className="content-section shop-page">
    <div className="page-intro"><p className="eyebrow">GRAND_M collection</p><h1>{title}</h1><p>{category ? categoryDetails[category].description : 'A considered lineup of sneakers, hoodies, and elevated tops.'}</p></div>
    <div className="shop-toolbar">
      <div className="filters">{['all', ...Object.keys(categoryDetails)].map((key) => <button className={activeCategory === key ? 'active' : ''} key={key} onClick={() => setActiveCategory(key)} type="button">{key === 'all' ? 'All' : categoryDetails[key].title}</button>)}</div>
      <div className="shop-controls"><label className="filter-search">⌕<input aria-label="Filter products" onChange={(event) => setQuery(event.target.value)} placeholder="Filter products" value={query} /></label><select aria-label="Sort products" onChange={(event) => setSort(event.target.value)} value={sort}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></div>
    </div>
    <p className="result-count">{availableProducts.length} {availableProducts.length === 1 ? 'piece' : 'pieces'} available</p>
    {availableProducts.length ? <div className="product-grid">{availableProducts.map((product) => <ProductCard addToCart={addToCart} key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>No matches found</h2><p>Try a different search or browse the entire collection.</p><button className="button primary" onClick={() => { setQuery(''); setActiveCategory('all') }} type="button">Clear filters</button></div>}
  </section>
}

function ProductCard({ addToCart, product }) {
  const [quantity, setQuantity] = useState(1)
  return <article className="product-card"><div className="product-image"><img alt={product.name} loading="lazy" src={productImage(product.image)} /><span>{categoryDetails[product.category].kicker}</span></div><div className="product-details"><div><h3>{product.name}</h3><p>{categoryDetails[product.category].title}</p></div><strong>{formatPrice(product.price)}</strong></div><div className="product-actions"><select aria-label={`Quantity for ${product.name}`} onChange={(event) => setQuantity(Number(event.target.value))} value={quantity}>{[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number}</option>)}</select><button onClick={() => addToCart(product, quantity)} type="button">Add to cart</button></div></article>
}

function AboutPage({ navigate }) {
  return <section className="about-page"><div className="content-section about-intro"><p className="eyebrow">About GRAND_M</p><h1>Make room for the pieces that make you feel like yourself.</h1><p>GRAND_M Collections brings together contemporary essentials with an eye for comfort, confidence, and individual expression.</p></div><div className="content-section about-grid"><img alt="GRAND_M collections" src="/images/others/GRAND_M.png" /><div><p className="eyebrow">Our approach</p><h2>Fewer, better choices.</h2><p>We curate versatile streetwear and footwear that earns a place in your everyday rotation—not just a spot in your wardrobe.</p><p>Every collection is designed to make getting dressed feel direct, easy, and distinctly yours.</p><button className="button primary" onClick={() => navigate('collections')} type="button">Explore the collection ›</button></div></div><div className="content-section principles">{[['01', 'Wear often', 'Products chosen for repeat wear, not one-off moments.'], ['02', 'Move freely', 'Comfort and movement are part of every decision.'], ['03', 'Own your look', 'A selection with room for your personal style.']].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
}

function AuthPage({ mode, navigate }) {
  const [submitted, setSubmitted] = useState(false)
  const isLogin = mode === 'login'
  return <section className="auth-page"><form className="auth-card" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><Brand navigate={navigate} /><p className="eyebrow">Your GRAND_M account</p><h1>{isLogin ? 'Welcome back.' : 'Create your account.'}</h1><p className="auth-subtitle">{isLogin ? 'Sign in to keep your collection close.' : 'Join us for a faster, more personal checkout.'}</p>{!isLogin && <label>Full name<input autoComplete="name" name="name" required type="text" /></label>}<label>Email address<input autoComplete="email" name="email" required type="email" /></label><label>Password<input autoComplete={isLogin ? 'current-password' : 'new-password'} minLength="6" name="password" required type="password" /></label><button className="button primary auth-submit" type="submit">{isLogin ? 'Sign in' : 'Create account'} ›</button>{submitted && <p className="form-message">Thanks—this form is ready to connect to your account API.</p>}<p className="auth-switch">{isLogin ? 'New to GRAND_M?' : 'Already have an account?'} <button onClick={() => navigate(isLogin ? 'signup' : 'login')} type="button">{isLogin ? 'Create one' : 'Sign in'}</button></p></form></section>
}

function NotFound({ navigate }) {
  return <section className="empty-state not-found"><p className="eyebrow">404</p><h1>This page stepped out.</h1><p>Let’s get you back to the collection.</p><button className="button primary" onClick={() => navigate('home')} type="button">Back home</button></section>
}

function CartDrawer({ cart, isOpen, onClose, updateCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return <><button aria-label="Close cart" className={`cart-backdrop ${isOpen ? 'visible' : ''}`} onClick={onClose} tabIndex={isOpen ? 0 : -1} type="button" /><aside aria-hidden={!isOpen} className={`cart-drawer ${isOpen ? 'is-open' : ''}`}><div className="drawer-heading"><div><p className="eyebrow">Your selection</p><h2>Shopping bag</h2></div><button aria-label="Close cart" className="round-button" onClick={onClose} type="button">×</button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id}><img alt={item.name} src={productImage(item.image)} /><div><h3>{item.name}</h3><p>{formatPrice(item.price)}</p><div className="quantity"><button aria-label={`Remove one ${item.name}`} onClick={() => updateCart(item.id, -1)} type="button">−</button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => updateCart(item.id, 1)} type="button">+</button></div></div><strong>{formatPrice(item.price * item.quantity)}</strong></article>)}</div><div className="cart-total"><div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><p>Shipping and tax are calculated at checkout.</p><button className="button primary" type="button">Checkout ›</button></div></> : <div className="empty-cart"><p className="eyebrow">Nothing here yet</p><h3>Your bag is waiting.</h3><p>Add a few pieces to make it yours.</p><button className="button primary" onClick={onClose} type="button">Keep shopping</button></div>}</aside></>
}


function Footer({ navigate }) {
  return <footer className="site-footer"><div className="footer-brand"><Brand navigate={navigate} /><p>Curated sneakers, hoodies, and essentials for every move.</p></div><div><p>Shop</p>{navItems.slice(1, 4).map((item) => <button key={item.route} onClick={() => navigate(item.route)} type="button">{item.label}</button>)}</div><div><p>Account</p><button onClick={() => navigate('login')} type="button">Sign in</button><button onClick={() => navigate('signup')} type="button">Create account</button><button onClick={() => navigate('about')} type="button">About us</button></div><small>© {new Date().getFullYear()} GRAND_M Collections</small></footer>
}

export default App




