import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt } = await req.json()
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    const model = Deno.env.get('OPENAI_MODEL') || 'gpt-5.6-luna'
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured in Supabase Edge Function secrets.')

    const system = `You are a gentle film recommendation assistant for a Studio Ghibli-inspired comfort website.
The user provides a mood or life situation. Return exactly one recommendation as strict JSON with these keys:
film, scene, soundtrack, reason, mood.
- film: choose one Studio Ghibli film.
- scene: describe a specific comforting or emotionally fitting scene without quoting dialogue.
- soundtrack: suggest one matching track title from that film when you know one; otherwise use a descriptive soundtrack cue.
- reason: 1-2 concise sentences explaining the emotional fit. Do not diagnose mental health conditions.
- mood: exactly three short adjectives separated by " · ".
Keep the tone warm and grounded, not overly therapeutic.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt.slice(0, 1200) },
        ],
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`OpenAI request failed: ${text}`)
    }

    const payload = await response.json()
    const content = payload.choices?.[0]?.message?.content
    const result = JSON.parse(content)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
