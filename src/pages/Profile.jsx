import { BookHeart, Clock3, History, LogOut, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, signOut, supabaseReady } = useAuth()
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [history, setHistory] = useState([])

  useEffect(() => {
    async function load() {
      if (!user || !supabase) return
      const [{ count }, { data }] = await Promise.all([
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('mood_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ])
      setFavoriteCount(count || 0)
      setHistory(data || [])
    }
    load()
  }, [user])

  if (!user) {
    return (
      <section className="page-section section-shell">
        <div className="empty-state large"><UserRound size={28} /><h2>No profile session yet</h2><p>{supabaseReady ? 'Use the Sign in button in the navigation bar to access your personal profile.' : 'Add your Supabase credentials to .env, then use the navigation Sign in button.'}</p><Link className="button primary" to="/archive">Browse as guest</Link></div>
      </section>
    )
  }

  return (
    <section className="page-section section-shell profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar"><UserRound size={30} /></div>
        <div><span className="eyebrow">Personal profile</span><h1>{user.email}</h1><p>Your saved recipes and recent mood matches live here.</p></div>
        <button className="button ghost" onClick={signOut}><LogOut size={17} /> Sign out</button>
      </div>

      <div className="profile-stat-grid">
        <Link to="/favorites" className="profile-stat"><BookHeart size={23} /><strong>{favoriteCount}</strong><span>Saved recipes</span></Link>
        <div className="profile-stat"><History size={23} /><strong>{history.length}</strong><span>Recent mood matches</span></div>
        <div className="profile-stat"><Clock3 size={23} /><strong>∞</strong><span>Future cozy nights</span></div>
      </div>

      <section className="history-card">
        <div className="section-heading row-heading"><div><span className="eyebrow">Mood history</span><h2>Recent recommendations</h2></div></div>
        {history.length ? history.map((item) => (
          <div className="history-row" key={item.id}>
            <div><strong>{item.result?.film || 'Recommendation'}</strong><p>{item.prompt}</p></div>
            <span>{new Date(item.created_at).toLocaleDateString()}</span>
          </div>
        )) : <div className="empty-inline">No saved mood matches yet.</div>}
      </section>
    </section>
  )
}
