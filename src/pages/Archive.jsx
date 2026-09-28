import { Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import RecipeCard from '../components/RecipeCard'
import { recipes as localRecipes } from '../data/recipes'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Archive() {
  const [recipes, setRecipes] = useState(localRecipes)
  const [query, setQuery] = useState('')
  const [film, setFilm] = useState('All films')
  const [favorites, setFavorites] = useState(new Set())
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      if (!supabase) return
      const { data } = await supabase.from('recipes').select('*').order('title')
      if (data?.length) {
        setRecipes(data.map((r) => ({
          ...r,
          baseServings: r.base_servings,
          duration: r.duration_minutes,
          accent: r.accent || 'green',
          emoji: r.emoji || '🍽️',
        })))
      }
    }
    load()
  }, [])

  useEffect(() => {
    async function loadFavorites() {
      if (!user || !supabase) {
        const local = JSON.parse(localStorage.getItem('komorebi-favorites') || '[]')
        setFavorites(new Set(local))
        return
      }
      const { data } = await supabase.from('favorites').select('recipe_id').eq('user_id', user.id)
      setFavorites(new Set((data || []).map((f) => f.recipe_id)))
    }
    loadFavorites()
  }, [user])

  const films = ['All films', ...new Set(recipes.map((recipe) => recipe.film))]
  const filtered = useMemo(() => recipes.filter((recipe) => {
    const matchesQuery = `${recipe.title} ${recipe.film} ${recipe.tags?.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilm = film === 'All films' || recipe.film === film
    return matchesQuery && matchesFilm
  }), [recipes, query, film])

  async function toggleFavorite(recipe) {
    const next = new Set(favorites)
    const isFavorite = next.has(recipe.id)
    if (isFavorite) next.delete(recipe.id)
    else next.add(recipe.id)
    setFavorites(next)

    if (user && supabase) {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('recipe_id', recipe.id)
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, recipe_id: recipe.id })
      }
    } else {
      localStorage.setItem('komorebi-favorites', JSON.stringify([...next]))
    }
  }

  return (
    <section className="page-section archive-page section-shell">
      <div className="page-hero compact">
        <span className="eyebrow">Interactive Culinary Archive</span>
        <h1>Recipes worth stepping into</h1>
        <p>Search by film, choose a dish, scale it for your table, then switch into a clean step-by-step cooking view.</p>
      </div>

      <div className="archive-controls">
        <div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a recipe, film, or ingredient…" /></div>
        <div className="select-wrap"><SlidersHorizontal size={17} /><select value={film} onChange={(e) => setFilm(e.target.value)}>{films.map((item) => <option key={item}>{item}</option>)}</select></div>
      </div>

      <div className="archive-results-line"><span>{filtered.length} recipes</span><span>Designed for calm, practical cooking</span></div>
      <div className="recipe-grid archive-grid">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} favorite={favorites.has(recipe.id)} onFavorite={toggleFavorite} />
        ))}
      </div>
      {!filtered.length ? <div className="empty-state">No recipes match that search yet.</div> : null}
    </section>
  )
}
