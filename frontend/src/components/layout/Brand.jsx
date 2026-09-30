function Brand({ navigate }) {
  return <button className="brand" onClick={() => navigate('home')} type="button"><img className="grand_m-logo" src="/images/others/Grand_M_Logo.png" alt="GRAND_M" /><span>GRAND_M<small>collections</small></span></button>
}

export default Brand