import { Clock3, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe, favorite = false, onFavorite }) {
  return (
    <article className="recipe-card">
      <Link to={`/archive/${recipe.slug}`} className={`recipe-art ${recipe.accent}`}>
        <span className="food-emoji" aria-hidden="true">{recipe.emoji}</span>
        <span className="art-cloud cloud-one" />
        <span className="art-cloud cloud-two" />
        <span className="art-hill hill-one" />
        <span className="art-hill hill-two" />
      </Link>
      <div className="recipe-card-body">
        <div className="recipe-card-topline">
          <span>{recipe.film}</span>
          {onFavorite ? (
            <button className={favorite ? 'heart-button active' : 'heart-button'} onClick={() => onFavorite(recipe)} aria-label="Toggle favorite">
              <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          ) : null}
        </div>
        <Link to={`/archive/${recipe.slug}`} className="recipe-title-link"><h3>{recipe.title}</h3></Link>
        <p>{recipe.description}</p>
        <div className="recipe-meta">
          <span><Clock3 size={15} /> {recipe.duration} min</span>
          <span>{recipe.difficulty}</span>
        </div>
      </div>
    </article>
  )
}
