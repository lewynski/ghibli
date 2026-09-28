import { useState } from 'react'
import { X, LoaderCircle, Mail, LockKeyhole } from 'lucide-react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  if (!open) return null

  async function submit(event) {
    event.preventDefault()
    setMessage('')

    if (!hasSupabaseConfig) {
      setMessage('Add your Supabase URL and anon key to .env first.')
      return
    }

    setBusy(true)
    try {
      const { error } = mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
      if (error) throw error
      setMessage(mode === 'signin' ? 'Signed in successfully.' : 'Account created. Check your email if confirmation is enabled.')
      if (mode === 'signin') setTimeout(onClose, 500)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="auth-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button close-button" onClick={onClose} aria-label="Close">
          <X size={19} />
        </button>
        <div className="eyebrow">Your quiet corner</div>
        <h2>{mode === 'signin' ? 'Welcome back' : 'Create your profile'}</h2>
        <p>Save recipes, keep your favorites, and revisit mood matches.</p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Email
            <div className="input-with-icon">
              <Mail size={17} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </label>
          <label>
            Password
            <div className="input-with-icon">
              <LockKeyhole size={17} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="At least 6 characters" required />
            </div>
          </label>
          <button className="button primary wide" disabled={busy}>
            {busy ? <LoaderCircle className="spin" size={18} /> : null}
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {message ? <div className="form-message">{message}</div> : null}

        <button className="text-button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </section>
    </div>
  )
}
