function NotFound({ navigate }) {
  return <section className="empty-state not-found"><p className="eyebrow">404</p><h1>This page stepped out.</h1><p>Let’s get you back to the collection.</p><button className="button primary" onClick={() => navigate('home')} type="button">Back home</button></section>
}

export default NotFound