import { useEffect, useState } from 'react'
import './App.css'
import { categoryDetails, products } from './products.js'
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

const loadCart = () => {
  try {
    const savedItems = JSON.parse(localStorage.getItem('grand-m-cart') || '[]')
    if (!Array.isArray(savedItems)) return []

    return savedItems.reduce((items, savedItem) => {
      if (!savedItem || typeof savedItem.id !== 'string' || !Number.isSafeInteger(savedItem.quantity) || savedItem.quantity < 1) return items
      const product = products.find((item) => item.id === savedItem.id)
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
  const [cart, setCart] = useState(loadCart)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('grand-m-theme') || 'dark')

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [route])

  useEffect(() => {
    try {
      localStorage.setItem('grand-m-cart', JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity }))))
    } catch {
      return
    }
  }, [cart])

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
        {route === 'home' && <HomePage {...pageProps} />}
        {route === 'collections' && <ShopPage {...pageProps} key="collections" title="Men’s collection" />}
        {categoryDetails[route] && <ShopPage {...pageProps} category={route} key={route} title={categoryDetails[route].title} />}
        {route === 'about' && <AboutPage navigate={navigate} />}
        {route === 'login' && <AuthPage key={route} mode="login" navigate={navigate} />}
        {route === 'signup' && <AuthPage key={route} mode="signup" navigate={navigate} />}
        {route === 'forgot-password' && <AuthPage key={route} mode="reset" navigate={navigate} />}
        {route === 'account' && <AccountPage navigate={navigate} />}
        {route === 'orders' && <OrderHistoryPage navigate={navigate} />}
        {route === 'cart' && <CartPage cart={cart} navigate={navigate} updateCart={updateCart} />}
        {route === 'checkout' && <CheckoutPage cart={cart} navigate={navigate} updateCart={updateCart} />}
        {selectedProduct && <ProductDetailPage key={selectedProduct.id} addToCart={addToCart} navigate={navigate} product={selectedProduct} />}
        {(!knownRoutes.includes(route) && !productRoute) || (productRoute && !selectedProduct) ? <NotFound navigate={navigate} /> : null}
      </main>
      {!isAuthRoute && <Footer navigate={navigate} />}
      {!isAuthRoute && <CartDrawer cart={cart} isOpen={cartOpen} onCheckout={() => { setCartOpen(false); navigate('checkout') }} onClose={() => setCartOpen(false)} onViewCart={() => { setCartOpen(false); navigate('cart') }} updateCart={updateCart} />}
    </div>
  )
}

export default App



