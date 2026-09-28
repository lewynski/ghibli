# Komorebi — Interactive Culinary Archive + AI Mood Matcher

A responsive React/Vite website with two distinct experiences:

1. **Interactive Culinary Archive** — searchable film-inspired recipes, automatic serving scaling, distraction-free cook mode, favorites, and Supabase-backed recipe data.
2. **AI-Driven Mood Matcher** — natural-language mood prompts that return a film, comforting scene, soundtrack, and explanation. The production path uses a Supabase Edge Function so the AI key never ships to the browser.

The visual direction adapts a calm, nature-led, card-based aesthetic with misty blues, sage greens, warm earth tones, rounded surfaces, and soft motion. It is an original implementation rather than a pixel-for-pixel copy of the design reference.

## Stack

- React 18 + Vite
- React Router
- Supabase Auth + Postgres + Row Level Security
- Supabase Edge Functions
- Lucide React icons
- Plain responsive CSS (no Tailwind required)

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

The app works immediately in **demo mode** even without Supabase. Recipes come from `src/data/recipes.js`, favorites use `localStorage`, and the Mood Matcher uses a small built-in fallback recommender.

## Connect Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/migrations/001_schema.sql`.
3. Then run `supabase/seed.sql`.
4. Copy `.env.example` to `.env` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

5. Restart the Vite dev server.

### Authentication

The navigation bar contains a Sign in button. The included modal supports email/password sign-in and sign-up through Supabase Auth.

If email confirmation is enabled in your Supabase project, newly registered users must confirm their email before signing in.

## Deploy the AI Mood Matcher Edge Function

Install the Supabase CLI, log in, and link your project. Then:

```bash
supabase functions deploy mood-match
supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY
# Optional: choose another supported text model
supabase secrets set OPENAI_MODEL=gpt-5.6-luna
```

The frontend calls:

```js
supabase.functions.invoke('mood-match', { body: { prompt } })
```

If the Edge Function is unavailable, the UI gracefully falls back to the built-in recommendation logic.

> Important: never put `OPENAI_API_KEY` in the Vite `.env` file. Vite variables are delivered to the browser. Keep the AI key only in Supabase Edge Function secrets.

## Main routes

- `/` — shared homepage
- `/archive` — Interactive Culinary Archive
- `/archive/:slug` — recipe detail, serving scaler, cook mode
- `/mood` — AI Mood Matcher
- `/favorites` — saved recipe collection
- `/profile` — signed-in user profile and mood history

## Database tables

- `profiles`
- `recipes`
- `favorites`
- `mood_history`

Row Level Security policies allow public recipe reading while keeping favorites, profile data, and mood history private to each authenticated user.

## Build for production

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` folder to Vercel, Netlify, Cloudflare Pages, or another static host. Remember to configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your deployment environment.

## Notes

- Recipe quantities are automatically scaled from each recipe's `base_servings` value.
- Cook Mode uses the browser Wake Lock API when available to reduce accidental screen sleeping while cooking.
- All scenic artwork in the UI is built from CSS shapes/gradients and emoji, so the starter does not depend on copyrighted film stills.
