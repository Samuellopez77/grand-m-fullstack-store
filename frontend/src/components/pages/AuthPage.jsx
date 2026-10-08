import { useState } from 'react'
import Brand from '../layout/Brand.jsx'

function AuthPage({ mode, navigate, onLogin, onRegister }) {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notice, setNotice] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const isLogin = mode === 'login'
  const isSignup = mode === 'signup'
  const isReset = mode === 'reset'
  const passwordChecks = [
    { label: 'At least 8 characters', passed: values.password.length >= 8 },
    { label: 'At least one letter', passed: /[A-Za-z]/.test(values.password) },
    { label: 'At least one number', passed: /\d/.test(values.password) },
  ]
  const updateValue = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const submitForm = async (event) => {
    event.preventDefault()
    if (submitting) return

    if (isReset) {
      setNotice({ type: 'info', text: 'Password reset is not connected yet.' })
      return
    }
    if (isSignup && values.password !== values.confirmPassword) {
      setNotice({ type: 'error', text: 'Your passwords do not match.' })
      return
    }

    const email = values.email.trim()
    const { name, password } = values

    setSubmitting(true)
    setNotice(null)
    try {
      if (isLogin) await onLogin({ email, password })
      else await onRegister({ name: name.trim(), email, password })
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const providerNotice = (provider) => setNotice({
    type: 'info',
    text: `${provider} sign-in is not connected yet. No account information was sent.`,
  })

  return(
    <section className="auth-page">
      <header className="auth-topbar">
        <Brand navigate={navigate} />
        <button className="auth-back-link" onClick={() => navigate('home')} type="button"><span aria-hidden="true">←</span> Back to store</button>
      </header>
      <aside className="auth-editorial">
        <div aria-hidden="true" className="basket-scene">
          <div className="basket-handle" />
          <div className="basket-products">
            <img alt="" className="basket-item basket-item-one" src="/images/tops/IMG-2.jpeg" />
            <img alt="" className="basket-item basket-item-two" src="/images/hoodies/Hoodie-2.jpeg" />
            <img alt="" className="basket-item basket-item-three" src="/images/sneakers/Sneaker.jpeg" />
          </div>
          <div className="basket-body"><img alt="" src="/images/others/Grand_M_Logo.png" /></div>
          <div className="basket-shadow" />
        </div>
        <div className="auth-editorial-copy">
          <p className="eyebrow">GRAND_M / Collections</p>
          <h2>Good pieces. Great days.</h2>
          <p>Everyday essentials with a point of view.</p>
        </div>
      </aside>
      <form className="auth-card" onSubmit={submitForm}>
        <p className="eyebrow">Your GRAND_M account</p>
        <h1>{isLogin ? 'Welcome back.' : isSignup ? 'Create your account.' : 'Reset your password.'}</h1>
        <p className="auth-subtitle">{isLogin ? 'Sign in to pick up where your style left off.' : isSignup ? 'Create an account for a smoother checkout and order updates.' : 'Enter the email linked to your account and we’ll help you get back in.'}</p>
        {isSignup && <label>Full name<input autoComplete="name" maxLength="100" minLength="2" name="name" onChange={updateValue('name')} required type="text" value={values.name} /></label>}
        <label>Email address<input autoComplete="email" maxLength="254" name="email" onChange={updateValue('email')} required type="email" value={values.email} /></label>
        {!isReset && <>
          <label>Password
            <span className="password-input">
              <input autoComplete={isLogin ? 'current-password' : 'new-password'} minLength={isLogin ? 1 : 8} name="password" onChange={updateValue('password')} pattern={isLogin ? undefined : '(?=.*[A-Za-z])(?=.*\\d).{8,}'} required title={isLogin ? undefined : 'Use at least 8 characters, including a letter and a number.'} type={showPassword ? 'text' : 'password'} value={values.password} />
              <button aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? 'Hide' : 'Show'}</button>
            </span>
          </label>
          {isSignup && <>
            <ul aria-label="Password requirements" className="password-checks">{passwordChecks.map(({ label, passed }) => <li className={passed ? 'passed' : ''} key={label}><span aria-hidden="true">{passed ? '✓' : '○'}</span>{label}</li>)}</ul>
            <label>Confirm password
              <span className="password-input">
                <input autoComplete="new-password" name="confirmPassword" onChange={updateValue('confirmPassword')} required type={showConfirmPassword ? 'text' : 'password'} value={values.confirmPassword} />
                <button aria-label={showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'} aria-pressed={showConfirmPassword} className="password-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} type="button">{showConfirmPassword ? 'Hide' : 'Show'}</button>
              </span>
            </label>
          </>}
          {isLogin && <button className="auth-inline-link auth-forgot" onClick={() => navigate('forgot-password') } disabled={submitting} type="button">Forgot password?</button>}
        </>}
        <button className="button primary auth-submit" type="submit" disabled={submitting}>
          {isLogin ? 'Sign in' : isSignup ? 'Create account' : 'Send reset instructions'}{' '}
  <span aria-hidden="true">›</span>
        </button>
        {notice && <p aria-live="polite" className={`auth-notice ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
        {!isReset && <>
          <div aria-hidden="true" className="auth-divider"><span>or continue with</span></div>
          <div className="auth-providers">
            <button className="auth-provider" onClick={() => providerNotice('Google')} type="button"><span aria-hidden="true" className="google-mark">G</span>Google</button>
            <button className="auth-provider" onClick={() => providerNotice('Apple')} type="button"><span aria-hidden="true" className="apple-mark">Apple</span>Apple</button>
          </div>
          <p className="auth-provider-note">Google sign-in can support any Google Account, including Gmail, once connected.</p>
        </>}
        <p className="auth-switch">{isLogin ? 'New to GRAND_M?' : isSignup ? 'Already have an account?' : 'Remembered your password?'} <button onClick={() => navigate(isSignup ? 'login' : 'signup')} type="button">{isLogin ? 'Create an account' : isSignup ? 'Sign in' : 'Back to sign in'}</button></p>
        <p className="auth-security-note"><span aria-hidden="true">◇</span> Your details are not sent or saved until account services are connected.</p>
      </form>
    </section>
  )
}

export default AuthPage