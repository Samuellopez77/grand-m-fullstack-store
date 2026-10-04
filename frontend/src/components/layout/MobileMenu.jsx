import { navItems } from '../../constants/navigation.js'

function MobileMenu({ isOpen, navigate, route }) {
  return (
    <aside aria-hidden={!isOpen} className={`mobile-menu ${isOpen ? 'is-open' : ''}`}>
      <p className="eyebrow">Explore GRAND_M</p>
      {navItems.map((item) => <button className={route === item.route ? 'active' : ''} key={item.route} onClick={() => navigate(item.route)} tabIndex={isOpen ? 0 : -1} type="button">{item.label}<span>›</span></button>)}

      <p className="eyebrow mobile-menu-divider">Account</p>
      <button className={route === 'account' ? 'active' : ''} onClick={() => navigate('account')} tabIndex={isOpen ? 0 : -1} type="button">My account<span>›</span></button>
      <button className={route === 'orders' ? 'active' : ''} onClick={() => navigate('orders')} tabIndex={isOpen ? 0 : -1} type="button">Order history<span>›</span></button>
      <button onClick={() => navigate('login')} tabIndex={isOpen ? 0 : -1} type="button">Sign in<span>›</span></button>
    </aside>
  )
}

export default MobileMenu