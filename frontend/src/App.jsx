import { useEffect, useState } from 'react'
import './App.css'
import { categoryDetails } from './products.js'
import { fetchProducts } from './api/products.js'
import { login, register, logout, restoreSession } from './api/auth.js'
import CartDrawer from './components/cart/CartDrawer.jsx'
import Footer from './components/layout/Footer.jsx'
import Header from './components/layout/Header.jsx'
import MobileMenu from './components/layout/MobileMenu.jsx'
import AboutPage from './components/pages/AboutPage.jsx'
import AuthPage from './components/pages/AuthPage.jsx'
import ShopPage from './components/pages/ShopPage.jsx'
import HomePage from './components/pages/HomePage.jsx'
import NotFound from './components/pages/NotFound.jsx'
import ProductDetailPage from './components/pages/ProductDetailPage.jsx'
import CheckoutPage from './components/pages/CheckoutPage.jsx'
import CartPage from './components/pages/CartPage.jsx'
import AccountPage from './components/pages/AccountPage.jsx'
import OrderHistoryPage from './components/pages/OrderHistoryPage.jsx'

const getRoute = () => {
  const hashRoute = window.location.hash.replace(/^#\/?/, '').split(/[?&]/, 1)[0]
  if (hashRoute.startsWith('figmacapture=')) return new URLSearchParams(window.location.search).get('route') || 'home'
  return hashRoute || 'home'
}

// Reconciles the cart saved in localStorage (just {id, quantity} pairs)
// against the real product list fetched from the API. Takes the product
// list as a param now, since it's no longer a static import available at
// module-load time.
const loadCart = (productList) => {
  try {
    const savedItems = JSON.parse(localStorage.getItem('grand-m-cart') || '[]')
    if (!Array.isArray(savedItems)) return []

    return savedItems.reduce((items, savedItem) => {
      if (!savedItem || typeof savedItem.id !== 'string' || !Number.isSafeInteger(savedItem.quantity) || savedItem.quantity < 1) return items
      const product = productList.find((item) => item.id === savedItem.id)
      if (!product) return items
      const existing = items.find((item) => item.id === product.id)
      if (existing) existing.quantity += savedItem.quantity
      else items.push({ ...product, quantity: savedItem.quantity })
      return items
    }, [])
  } catch {
    return []
  }
}

function App() {
  const [route, setRoute] = useState(getRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState(null)
  const [cart, setCart] = useState([])
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('grand-m-theme') || 'dark')

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data)
        setCart(loadCart(data))
      })
      .catch((err) => setProductsError(err.message))
      .finally(() => setProductsLoading(false))
  }, [])

  useEffect(() => {
    restoreSession()
      .then((restoredUser) => setUser(restoredUser))
      .finally(() => setAuthReady(true))
  }, [])

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [route])

  useEffect(() => {
    // Skip saving while products are still loading — otherwise this fires
    // on first render (cart still []) and overwrites a real saved cart in
    // localStorage with an empty one, before loadCart() gets a chance to run.
    if (productsLoading) return
    try {
      localStorage.setItem('grand-m-cart', JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity }))))
    } catch {
      return
    }
  }, [cart, productsLoading])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('grand-m-theme', theme)
  }, [theme])

  const navigate = (nextRoute) => {
    window.location.hash = `/${nextRoute}`
    setMenuOpen(false)
  }
  const handleLogin = async (credentials) => {
    const loggedInUser = await login(credentials)
    setUser(loggedInUser)
    navigate('account')
  }

  const handleRegister = async (details) => {
    const newUser = await register(details)
    setUser(newUser)
    navigate('account')
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('home')
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
  const pageProps = { addToCart, navigate, query, setQuery, products, handleLogin, handleRegister, handleLogout }
  const knownRoutes = ['home', 'collections', 'about', 'login', 'signup', 'forgot-password', 'account', 'orders', 'cart', 'checkout', ...Object.keys(categoryDetails)]
  const isAuthRoute = ['login', 'signup', 'forgot-password'].includes(route)
  const productRoute = route.match(/^product\/([^/]+)$/)
  const selectedProduct = productRoute ? products.find((product) => product.id === productRoute[1]) : null

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement"></div>
      {!isAuthRoute && <Header
        cartCount={cartCount}
        menuOpen={menuOpen}
        navigate={navigate}
        onCart={() => setCartOpen(true)}
        onMenu={() => setMenuOpen((open) => !open)}
        onSearch={(nextQuery) => { setQuery(nextQuery); navigate('collections') }}
        route={route}
        theme={theme}
        toggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
      />}
      {!isAuthRoute && <MobileMenu isOpen={menuOpen} navigate={navigate} route={route} />}
      <main id="main-content">
        {(productsLoading || !authReady) && <div className="content-section"><p>Loading…</p></div>}        {!productsLoading && productsError && <div className="content-section"><p>Couldn't load products: {productsError}</p></div>}
        {!productsLoading && !productsError && authReady && <>
          {route === 'home' && <HomePage {...pageProps} />}
          {route === 'collections' && <ShopPage {...pageProps} key="collections" title="Men's collection" />}
          {categoryDetails[route] && <ShopPage {...pageProps} category={route} key={route} title={categoryDetails[route].title} />}
          {route === 'about' && <AboutPage navigate={navigate} />}
          {route === 'login' && <AuthPage key={route} mode="login" navigate={navigate} onLogin={handleLogin} />}
          {route === 'signup' && <AuthPage key={route} mode="signup" navigate={navigate} onRegister={handleRegister} />}
          {route === 'account' && (user ? <AccountPage navigate={navigate} user={user} onLogout={handleLogout} /> : <AuthPage key="login-gate" mode="login" navigate={navigate} onLogin={handleLogin} />)}
          {route === 'orders' && (user ? <OrderHistoryPage navigate={navigate} /> : <AuthPage key="login-gate-orders" mode="login" navigate={navigate} onLogin={handleLogin} />)}
          {route === 'forgot-password' && <AuthPage key={route} mode="reset" navigate={navigate} />}
          {route === 'cart' && <CartPage cart={cart} navigate={navigate} updateCart={updateCart} />}
          {route === 'checkout' && <CheckoutPage cart={cart} navigate={navigate} updateCart={updateCart} />}
          {selectedProduct && <ProductDetailPage key={selectedProduct.id} addToCart={addToCart} navigate={navigate} product={selectedProduct} />}
          {(!knownRoutes.includes(route) && !productRoute) || (productRoute && !selectedProduct) ? <NotFound navigate={navigate} /> : null}
        </>}
      </main>
      {!isAuthRoute && <Footer navigate={navigate} />}
      {!isAuthRoute && <CartDrawer cart={cart} isOpen={cartOpen} onCheckout={() => { setCartOpen(false); navigate('checkout') }} onClose={() => setCartOpen(false)} onViewCart={() => { setCartOpen(false); navigate('cart') }} updateCart={updateCart} />}
    </div>
  )
}

export default App