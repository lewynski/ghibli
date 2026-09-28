import { ArrowLeft, ChefHat, Clock3, Heart, Minus, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { recipes as localRecipes } from '../data/recipes'
import { formatQuantity } from '../utils/formatQuantity'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function RecipeDetail() {
  const { slug } = useParams()
  const fallback = localRecipes.find((r) => r.slug === slug)
  const [recipe, setRecipe] = useState(fallback)
  const [servings, setServings] = useState(fallback?.baseServings || 2)
  const [cookMode, setCookMode] = useState(false)
  const [step, setStep] = useState(0)
  const [favorite, setFavorite] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    async function loadRecipe() {
      if (!supabase) return
      const { data } = await supabase.from('recipes').select('*').eq('slug', slug).maybeSingle()
      if (data) {
        const mapped = { ...data, baseServings: data.base_servings, duration: data.duration_minutes, accent: data.accent || 'green', emoji: data.emoji || '🍽️' }
        setRecipe(mapped)
        setServings(mapped.baseServings)
      }
    }
    loadRecipe()
  }, [slug])

  useEffect(() => {
    if (!recipe) return
    async function loadFavorite() {
      if (user && supabase) {
        const { data } = await supabase.from('favorites').select('recipe_id').eq('user_id', user.id).eq('recipe_id', recipe.id).maybeSingle()
        setFavorite(Boolean(data))
      } else {
        const local = JSON.parse(localStorage.getItem('komorebi-favorites') || '[]')
        setFavorite(local.includes(recipe.id))
      }
    }
    loadFavorite()
  }, [user, recipe?.id])

  const scaledIngredients = useMemo(() => {
    if (!recipe) return []
    const ratio = servings / recipe.baseServings
    return recipe.ingredients.map((item) => ({ ...item, qty: item.qty * ratio }))
  }, [recipe, servings])

  async function toggleFavorite() {
    if (!recipe) return
    const next = !favorite
    setFavorite(next)
    if (user && supabase) {
      if (next) await supabase.from('favorites').insert({ user_id: user.id, recipe_id: recipe.id })
      else await supabase.from('favorites').delete().eq('user_id', user.id).eq('recipe_id', recipe.id)
    } else {
      const values = new Set(JSON.parse(localStorage.getItem('komorebi-favorites') || '[]'))
      next ? values.add(recipe.id) : values.delete(recipe.id)
      localStorage.setItem('komorebi-favorites', JSON.stringify([...values]))
    }
  }

  async function openCookMode() {
    setStep(0)
    setCookMode(true)
    if ('wakeLock' in navigator) {
      try { await navigator.wakeLock.request('screen') } catch { /* optional browser feature */ }
    }
  }

  if (!recipe) {
    return <section className="page-section section-shell"><div className="empty-state">Recipe not found. <Link to="/archive">Return to archive</Link>.</div></section>
  }

  return (
    <>
      <section className="page-section recipe-detail section-shell">
        <Link to="/archive" className="back-link"><ArrowLeft size={17} /> Back to archive</Link>

        <div className="recipe-detail-hero">
          <div className={`recipe-art detail-art ${recipe.accent}`}>
            <span className="food-emoji detail-emoji">{recipe.emoji}</span>
            <span className="art-cloud cloud-one" /><span className="art-cloud cloud-two" />
            <span className="art-hill hill-one" /><span className="art-hill hill-two" />
          </div>
          <div className="recipe-detail-copy">
            <span className="eyebrow">{recipe.film} · {recipe.year}</span>
            <h1>{recipe.title}</h1>
            <p className="lead-copy">{recipe.description}</p>
            <div className="detail-meta">
              <span><Clock3 size={17} /> {recipe.duration} minutes</span>
              <span><ChefHat size={17} /> {recipe.difficulty}</span>
            </div>
            <div className="detail-actions">
              <button className="button primary" onClick={openCookMode}><ChefHat size={18} /> Start cook mode</button>
              <button className={favorite ? 'button ghost favorite-button active' : 'button ghost favorite-button'} onClick={toggleFavorite}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /> {favorite ? 'Saved' : 'Save recipe'}</button>
            </div>
          </div>
        </div>

        <div className="recipe-content-grid">
          <section className="ingredient-card">
            <div className="ingredient-head">
              <div><span className="eyebrow">Ingredients</span><h2>For your table</h2></div>
              <div className="serving-control">
                <button onClick={() => setServings(Math.max(1, servings - 1))}><Minus size={15} /></button>
                <span><strong>{servings}</strong><small>servings</small></span>
                <button onClick={() => setServings(servings + 1)}><Plus size={15} /></button>
              </div>
            </div>
            <ul className="ingredient-list">
              {scaledIngredients.map((item) => (
                <li key={item.name}><span className="ingredient-qty">{formatQuantity(item.qty)} {item.unit}</span><span>{item.name}</span></li>
              ))}
            </ul>
          </section>

          <section className="steps-card">
            <span className="eyebrow">Method</span>
            <h2>Take it one step at a time</h2>
            <ol className="steps-list">
              {recipe.steps.map((text, index) => <li key={text}><span>{String(index + 1).padStart(2, '0')}</span><p>{text}</p></li>)}
            </ol>
          </section>
        </div>
      </section>

      {cookMode ? (
        <div className="cook-mode">
          <button className="cook-close" onClick={() => setCookMode(false)}><X size={20} /> Exit cook mode</button>
          <div className="cook-progress"><span style={{ width: `${((step + 1) / recipe.steps.length) * 100}%` }} /></div>
          <div className="cook-card">
            <span className="eyebrow">{recipe.title}</span>
            <div className="cook-step-number">Step {step + 1} of {recipe.steps.length}</div>
            <p>{recipe.steps[step]}</p>
            <div className="cook-nav">
              <button className="button ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><ChevronLeft size={18} /> Previous</button>
              {step < recipe.steps.length - 1 ? (
                <button className="button primary" onClick={() => setStep(step + 1)}>Next <ChevronRight size={18} /></button>
              ) : (
                <button className="button primary" onClick={() => setCookMode(false)}>Finish cooking</button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
