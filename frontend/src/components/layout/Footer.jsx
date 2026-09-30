import { navItems } from '../../constants/navigation.js'
import Brand from './Brand.jsx'

function Footer({ navigate }) {
  return <footer className="site-footer"><div className="footer-brand"><Brand navigate={navigate} /><p>Curated sneakers, hoodies, and essentials for every move.</p></div><div><p>Shop</p>{navItems.slice(1, 4).map((item) => <button key={item.route} onClick={() => navigate(item.route)} type="button">{item.label}</button>)}</div><div><p>Account</p><button onClick={() => navigate('account')} type="button">My account</button><button onClick={() => navigate('login')} type="button">Sign in</button><button onClick={() => navigate('signup')} type="button">Create account</button><button onClick={() => navigate('about')} type="button">About us</button></div><small>© {new Date().getFullYear()} GRAND_M Collections</small></footer>
}

export default Footer