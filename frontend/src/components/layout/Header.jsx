import { useState } from 'react'
import { navItems } from '../../constants/navigation.js'
import Brand from './Brand.jsx'

function Header({ cartCount, menuOpen, navigate, onCart, onMenu, onSearch, route, theme, toggleTheme, user }) {
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
          <button aria-label={user ? 'My account' : 'Sign in'} className="round-button" onClick={() => navigate(user ? 'account' : 'login')} type="button">{user ? user.name.charAt(0).toUpperCase() : '👤'}</button>
        </div>
      </div>
    </header>
  )
}

export default Header