import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Heart, Menu, Sparkles, UserRound, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, signOut } = useAuth()

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">木</span>
          <span>Komorebi</span>
        </NavLink>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/archive" onClick={closeMenu}>Culinary Archive</NavLink>
          <NavLink to="/mood" onClick={closeMenu} className="mood-nav"><Sparkles size={15} /> Mood Matcher</NavLink>
          <NavLink to="/favorites" onClick={closeMenu}><Heart size={15} /> Favorites</NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-nav-group">
              <NavLink to="/profile" className="icon-button" title="Profile"><UserRound size={18} /></NavLink>
              <button className="nav-signout" onClick={signOut}>Sign out</button>
            </div>
          ) : (
            <button className="button ghost small" onClick={() => setAuthOpen(true)}>Sign in</button>
          )}
          <button className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
