import { ArrowRight, History, LoaderCircle, Music2, Sparkles, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const fallbackMatches = [
  {
    test: /tired|exhausted|burnout|overwhelmed|pressure|stress|stressed|busy/i,
    film: 'My Neighbor Totoro',
    scene: 'The quiet bus-stop wait in the rain, where stillness turns into wonder.',
    soundtrack: 'The Path of the Wind',
    reason: 'You sound like you need something gentle rather than demanding. The film makes room for silence, family warmth, and small moments of magic.',
    mood: 'Restorative · Gentle · Grounding',
  },
  {
    test: /lost|change|changing|new place|uncertain|future|starting over|alone/i,
    film: "Kiki's Delivery Service",
    scene: 'Kiki finding her rhythm in a new town and rebuilding confidence through ordinary work.',
    soundtrack: 'A Town with an Ocean View',
    reason: 'This match fits moments of transition: uncertain at first, but slowly becoming capable, connected, and at home in a new chapter.',
    mood: 'Hopeful · Independent · Warm',
  },
  {
    test: /love|relationship|heart|romantic|miss someone|missing|longing/i,
    film: "Howl's Moving Castle",
    scene: 'The flower-field escape: a brief pocket of beauty amid chaos and responsibility.',
    soundtrack: 'Merry-Go-Round of Life',
    reason: 'Your words point toward tenderness mixed with complexity. This story pairs emotional intensity with the possibility of choosing care over fear.',
    mood: 'Tender · Dreamlike · Reassuring',
  },
  {
    test: /sad|cry|grief|down|lonely|loneliness|hurt/i,
    film: 'Spirited Away',
    scene: 'The quiet train ride across the flooded landscape, where the story simply lets emotion breathe.',
    soundtrack: 'The Sixth Station',
    reason: 'This is a match for feelings that need space rather than fixing. The scene is reflective, patient, and gently forward-moving.',
    mood: 'Reflective · Quiet · Cathartic',
  },
]

const defaultMatch = {
  film: 'Ponyo',
  scene: 'The storm-softened homecoming and a warm bowl of ramen shared indoors.',
  soundtrack: 'Mother Sea',
  reason: 'Your prompt feels open-ended, so this match leans toward uncomplicated warmth, playfulness, and the comfort of being cared for.',
  mood: 'Bright · Cozy · Playful',
}

export default function MoodMatcher() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const chips = ['I feel overwhelmed', 'I am starting over', 'I miss someone', 'I need something hopeful']

  async function matchMood(event) {
    event?.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setError('')

    try {
      let match
      if (supabase) {
        const { data, error: invokeError } = await supabase.functions.invoke('mood-match', { body: { prompt } })
        if (invokeError) throw invokeError
        match = data
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700))
        match = fallbackMatches.find((item) => item.test.test(prompt)) || defaultMatch
      }
      setResult(match)

      if (user && supabase) {
        await supabase.from('mood_history').insert({ user_id: user.id, prompt, result: match })
      }
    } catch (err) {
      const local = fallbackMatches.find((item) => item.test.test(prompt)) || defaultMatch
      setResult(local)
      setError('AI endpoint was unavailable, so a built-in mood match was used instead.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-section mood-page section-shell">
      <div className="mood-layout">
        <div className="mood-copy-column">
          <span className="eyebrow"><Sparkles size={15} /> AI-Driven Mood Matcher</span>
          <h1>Tell me how life feels today.</h1>
          <p>Write naturally. A sentence is enough. The matcher looks for emotional tone and context, then pairs it with a film, a comforting scene, and a soundtrack.</p>
          <div className="privacy-note"><WandSparkles size={18} /><span>Your prompt is only used to make a recommendation. Save history is optional and tied to your signed-in profile.</span></div>
        </div>

        <div className="mood-tool-card">
          <form onSubmit={matchMood}>
            <label htmlFor="moodPrompt">What is on your mind?</label>
            <textarea id="moodPrompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="I have been juggling too many things lately and I just want something quiet that makes the world feel less heavy…" maxLength={1200} />
            <div className="mood-chips">
              {chips.map((chip) => <button type="button" key={chip} onClick={() => setPrompt(chip)}>{chip}</button>)}
            </div>
            <button className="button primary wide" disabled={loading || !prompt.trim()}>
              {loading ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
              {loading ? 'Finding your match…' : 'Find my match'}
              {!loading ? <ArrowRight size={17} /> : null}
            </button>
          </form>
        </div>
      </div>

      {result ? (
        <section className="match-result">
          <div className="result-art" aria-hidden="true"><span className="result-moon" /><span className="result-star rs1">✦</span><span className="result-star rs2">✧</span><div className="result-hill h1" /><div className="result-hill h2" /></div>
          <div className="result-content">
            <span className="eyebrow">Your match</span>
            <h2>{result.film}</h2>
            <div className="mood-label">{result.mood}</div>
            <p className="result-reason">{result.reason}</p>
            <div className="result-detail"><span className="result-icon">◌</span><div><small>Comforting scene</small><p>{result.scene}</p></div></div>
            <div className="result-detail"><span className="result-icon"><Music2 size={18} /></span><div><small>Soundtrack pairing</small><p>{result.soundtrack}</p></div></div>
            {error ? <div className="form-message subtle">{error}</div> : null}
          </div>
        </section>
      ) : (
        <div className="mood-placeholder"><History size={20} /><span>Your recommendation will appear here after you submit a prompt.</span></div>
      )}
    </section>
  )
}
