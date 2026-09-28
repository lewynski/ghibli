import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import RecipeCard from '../components/RecipeCard'
import { recipes as localRecipes } from '../data/recipes'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Favorites() {
  const [items, setItems] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      if (user && supabase) {
        const { data } = await supabase.from('favorites').select('recipe_id, recipes(*)').eq('user_id', user.id)
        const mapped = (data || []).map((f) => ({
          ...f.recipes,
          baseServings: f.recipes.base_servings,
          duration: f.recipes.duration_minutes,
          accent: f.recipes.accent || 'green',
          emoji: f.recipes.emoji || '🍽️',
        }))
        setItems(mapped)
        setFavoriteIds(new Set(mapped.map((r) => r.id)))
      } else {
        const ids = new Set(JSON.parse(localStorage.getItem('komorebi-favorites') || '[]'))
        setFavoriteIds(ids)
        setItems(localRecipes.filter((r) => ids.has(r.id)))
      }
    }
    load()
  }, [user])

  async function toggleFavorite(recipe) {
    const next = new Set(favoriteIds)
    next.delete(recipe.id)
    setFavoriteIds(next)
    setItems((current) => current.filter((r) => r.id !== recipe.id))
    if (user && supabase) await supabase.from('favorites').delete().eq('user_id', user.id).eq('recipe_id', recipe.id)
    else localStorage.setItem('komorebi-favorites', JSON.stringify([...next]))
  }

  return (
    <section className="page-section section-shell favorites-page">
      <div className="page-hero compact">
        <span className="eyebrow"><Heart size={15} /> Personal collection</span>
        <h1>Your saved recipes</h1>
        <p>{user ? 'Synced to your Supabase profile.' : 'You are browsing as a guest. Favorites are stored in this browser until you connect Supabase and sign in.'}</p>
      </div>
      {items.length ? (
        <div className="recipe-grid archive-grid">{items.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} favorite onFavorite={toggleFavorite} />)}</div>
      ) : (
        <div className="empty-state large"><Heart size={26} /><h3>No favorites yet</h3><p>Open the Culinary Archive and tap the heart on a recipe you want to keep.</p></div>
      )}
    </section>
  )
}
