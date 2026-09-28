# Komorebi

### Interactive Culinary Archive & AI-Driven Mood Matcher

**Komorebi** is a calm, Ghibli-inspired web experience that combines food, film, music, and personalized recommendations in one application. The project is designed around two independent features: an interactive digital cookbook for recreating memorable animated dishes and an AI-powered mood matcher that recommends a film, comforting scene, and soundtrack based on how the user feels.

The interface follows a soft, nature-centered visual direction with spacious layouts, muted greens and blues, rounded cards, gentle transitions, and a distraction-free experience.

---

## Core Experiences

### Interactive Culinary Archive

A database-backed digital cookbook dedicated to recreating memorable food inspired by animated films.

Users can:

- Browse and search a growing recipe collection.
- View ingredients, preparation steps, cooking time, difficulty, and serving information.
- Automatically scale ingredient quantities when the serving size changes.
- Enter **Cook Mode** for a cleaner, distraction-free recipe view.
- Save favorite recipes to a personal collection.
- Access saved content from an authenticated profile.
- Continue using built-in recipe data when the database is unavailable.

Examples of recipe concepts include bacon and eggs inspired by *Howl's Moving Castle* and ramen inspired by *Ponyo*.

### AI-Driven Mood Matcher

A natural-language recommendation experience designed to connect a user's current mood or situation with a comforting film experience.

Users can describe how they feel in their own words, such as:

> “I feel tired after a long week and want something peaceful.”

The Mood Matcher can return:

- A recommended film.
- A specific comforting scene or moment.
- A matching soundtrack suggestion.
- A short explanation of why the recommendation fits the prompt.

AI requests are designed to pass through a **Supabase Edge Function**, keeping private AI credentials outside the browser. A local fallback recommendation system is also included so the feature can still present results when the AI service is unavailable.

---

## Main Features

- Responsive home page with two clearly separated experiences.
- Shared navigation across the Culinary Archive and Mood Matcher.
- Recipe search and browsing.
- Dynamic ingredient scaling.
- Distraction-free cooking mode.
- Favorite recipe collection.
- User authentication and personal profiles.
- AI-assisted mood recommendations.
- Mood recommendation history for authenticated users.
- Supabase-backed data storage.
- Row Level Security for user-specific information.
- Responsive layouts for desktop, tablet, and mobile screens.

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 |
| Build Tool | Vite |
| Routing | React Router |
| Styling | Responsive CSS |
| Icons | Lucide React |
| Backend Services | Supabase |
| Database | PostgreSQL through Supabase |
| Authentication | Supabase Auth |
| Security | Supabase Row Level Security |
| Server-side Logic | Supabase Edge Functions |
| AI Integration | AI model accessed through the Mood Matcher Edge Function |
| Deployment | Vercel-ready frontend |

---

## Application Structure

```text
Komorebi
│
├── Home
│   ├── Culinary Archive introduction
│   └── Mood Matcher introduction
│
├── Culinary Archive
│   ├── Recipe browser
│   ├── Recipe details
│   ├── Ingredient scaler
│   ├── Cook Mode
│   └── Favorites
│
├── AI Mood Matcher
│   ├── Natural-language mood prompt
│   ├── Film recommendation
│   ├── Scene recommendation
│   ├── Soundtrack recommendation
│   └── Recommendation history
│
└── User Account
    ├── Authentication
    ├── Profile
    └── Saved content
```

---

## Supabase Integration

Supabase acts as the application's backend platform and is responsible for persistent application data and authenticated user features.

The project uses the following main tables:

| Table | Purpose |
| --- | --- |
| `profiles` | Stores application profile information linked to authenticated users. |
| `recipes` | Stores recipe information used by the Culinary Archive. |
| `favorites` | Connects users with recipes they have saved. |
| `mood_history` | Stores previous Mood Matcher results for authenticated users. |

Public recipe data can be read by visitors, while profile information, favorites, and mood history are protected using **Row Level Security** so each user can access only their own private records.

---

## AI Architecture

```text
User Mood Prompt
      │
      ▼
React / Vite Frontend
      │
      ▼
Supabase Edge Function
      │
      ▼
AI Model
      │
      ▼
Film + Scene + Soundtrack Recommendation
      │
      ▼
Optional Mood History in Supabase
```

The AI credential is kept server-side through Supabase Edge Function secrets rather than being exposed in frontend code.

---

## Main Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/archive` | Interactive Culinary Archive |
| `/archive/:slug` | Recipe Details and Cook Mode |
| `/mood` | AI-Driven Mood Matcher |
| `/favorites` | Saved Recipes |
| `/profile` | User Profile and Mood History |

---

## Project Directory

```text
src/
├── components/        Reusable interface components
├── context/           Authentication state
├── data/              Local fallback recipe data
├── lib/               Supabase client configuration
├── pages/             Main application pages
├── utils/             Shared helper functions
├── App.jsx             Application routes
├── main.jsx            React entry point
└── styles.css          Main visual system and responsive styles

supabase/
├── functions/
│   └── mood-match/     AI recommendation Edge Function
├── migrations/         Database schema
└── seed.sql             Initial recipe data
```

---

## Environment Variables

The Vercel frontend uses the public Supabase project credentials:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The Supabase anonymous key is intended for client-side use together with correctly configured Row Level Security policies. Privileged credentials such as a Supabase `service_role` key or an AI provider secret must never be exposed through `VITE_*` variables.

The AI provider credential is stored separately as a **Supabase Edge Function secret**.

---

## Design Direction

Komorebi is designed to feel warm, calm, and restorative rather than like a conventional database application. Its interface combines soft landscape-inspired colors, generous spacing, rounded surfaces, subtle depth, and focused content areas to support both leisurely browsing and practical cooking.

The visual direction is inspired by calm editorial and wellness-oriented web design while remaining an original interface implementation.

---

## Project Goal

The project explores how an interactive web application can turn the emotional qualities of animated films into two useful digital experiences: **food that users can recreate** and **media recommendations that respond to how users feel**.

By combining a structured culinary database with natural-language AI recommendations, Komorebi aims to create a personal comfort space where users can discover a meal, a film, a scene, or a soundtrack that fits the moment.

---

## Disclaimer

Komorebi is an independent fan-inspired academic/project concept. Studio Ghibli, its films, characters, music, and related trademarks belong to their respective rights holders. This project is not affiliated with or endorsed by Studio Ghibli.
