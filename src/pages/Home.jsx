import { ArrowRight, BookOpen, Sparkles, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { featuredRecipes } from '../data/recipes'

export default function Home() {
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-landscape" aria-hidden="true">
          <div className="sun-disc" />
          <div className="sky-cloud c1" />
          <div className="sky-cloud c2" />
          <div className="mountain m1" />
          <div className="mountain m2" />
          <div className="water-line" />
          <div className="tree t1" />
          <div className="tree t2" />
          <div className="tree t3" />
        </div>
        <div className="hero-copy">
          <div className="eyebrow"><Wind size={16} /> A softer way to revisit favorite films</div>
          <h1>Cook the comfort.<br />Follow the feeling.</h1>
          <p className="hero-lead">A cinematic sanctuary where memorable food becomes a practical cookbook, and your mood becomes a path toward the right film, scene, and soundtrack.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/archive">Explore recipes <ArrowRight size={17} /></Link>
            <Link className="button glass" to="/mood"><Sparkles size={17} /> Match my mood</Link>
          </div>
        </div>
        <div className="scroll-note">Scroll gently <span>↓</span></div>
      </section>

      <section className="section-shell feature-intro">
        <div className="section-heading centered">
          <span className="eyebrow">Two experiences, one calm home</span>
          <h2>Choose what you need today</h2>
          <p>Cook something you remember, or describe what you are feeling and let the mood matcher guide your next watch.</p>
        </div>

        <div className="feature-grid">
          <Link to="/archive" className="feature-panel archive-panel">
            <div className="feature-icon"><BookOpen size={24} /></div>
            <span className="feature-number">01</span>
            <h3>Interactive Culinary Archive</h3>
            <p>Browse film-inspired recipes, scale ingredients instantly, enter a distraction-free cook mode, and save your favorites.</p>
            <div className="feature-tags"><span>Recipe scaling</span><span>Cook mode</span><span>Favorites</span></div>
            <div className="feature-cta">Open the cookbook <ArrowRight size={17} /></div>
            <div className="panel-visual kitchen-visual" aria-hidden="true">
              <span>🍳</span><span>🥣</span><span>🌿</span>
            </div>
          </Link>

          <Link to="/mood" className="feature-panel mood-panel">
            <div className="feature-icon"><Sparkles size={24} /></div>
            <span className="feature-number">02</span>
            <h3>AI-Driven Mood Matcher</h3>
            <p>Write naturally about your mood or life situation and receive a film, comforting scene, soundtrack, and gentle explanation.</p>
            <div className="feature-tags"><span>Plain-text prompts</span><span>Scene match</span><span>Soundtrack</span></div>
            <div className="feature-cta">Describe your mood <ArrowRight size={17} /></div>
            <div className="panel-visual mood-visual" aria-hidden="true">
              <span className="moon" /><span className="star s1">✦</span><span className="star s2">✧</span><span className="star s3">·</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="section-shell featured-section">
        <div className="section-heading row-heading">
          <div>
            <span className="eyebrow">From the archive</span>
            <h2>Comfort recipes to start with</h2>
          </div>
          <Link className="text-link" to="/archive">View full archive <ArrowRight size={16} /></Link>
        </div>
        <div className="recipe-grid">
          {featuredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      </section>

      <section className="section-shell quote-section">
        <div className="quote-card">
          <div className="quote-mark">“</div>
          <p>Some days call for a warm bowl, some for a familiar scene. This space is designed for both.</p>
          <span>Komorebi</span>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <div className="brand"><span className="brand-mark">木</span><span>Komorebi</span></div>
        <p>Film-inspired comfort, thoughtfully organized.</p>
        <span>Built for Supabase</span>
      </footer>
    </>
  )
}
