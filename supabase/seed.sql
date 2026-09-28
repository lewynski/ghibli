insert into public.recipes (id, slug, title, film, year, description, base_servings, duration_minutes, difficulty, accent, emoji, tags, ingredients, steps)
values
(
  '11111111-1111-4111-8111-111111111111', 'howls-bacon-and-eggs', 'Howl''s Bacon & Eggs', 'Howl''s Moving Castle', 2004,
  'A hearty skillet breakfast inspired by the cozy moving-castle kitchen: crisp bacon, sunny eggs, and rustic bread.',
  2, 20, 'Easy', 'amber', '🍳', array['Breakfast','Comfort','Skillet'],
  '[{"name":"thick-cut bacon","qty":4,"unit":"slices"},{"name":"large eggs","qty":4,"unit":""},{"name":"country bread","qty":4,"unit":"slices"},{"name":"butter","qty":1,"unit":"tbsp"},{"name":"salt","qty":0.25,"unit":"tsp"},{"name":"black pepper","qty":0.25,"unit":"tsp"}]'::jsonb,
  '["Warm a heavy skillet over medium heat and cook the bacon until the edges are crisp.","Move the bacon to one side. Add butter to the open space in the skillet.","Crack in the eggs and cook until the whites set while the yolks stay soft.","Toast the bread in the bacon-rich pan or in a separate toaster.","Season the eggs and serve everything hot from the skillet."]'::jsonb
),
(
  '22222222-2222-4222-8222-222222222222', 'ponyos-ham-ramen', 'Ponyo''s Ham Ramen', 'Ponyo', 2008,
  'A fast, steamy bowl of noodles with ham, egg, scallions, and a simple savory broth—the ultimate rainy-day comfort meal.',
  2, 15, 'Easy', 'blue', '🍜', array['Noodles','Quick','Cozy'],
  '[{"name":"instant ramen noodles","qty":2,"unit":"packs"},{"name":"water or light chicken broth","qty":700,"unit":"ml"},{"name":"ham","qty":4,"unit":"slices"},{"name":"soft-boiled eggs","qty":2,"unit":""},{"name":"scallions, sliced","qty":2,"unit":"tbsp"},{"name":"soy sauce","qty":1,"unit":"tbsp"}]'::jsonb,
  '["Bring the broth to a gentle boil and stir in soy sauce.","Add noodles and cook until just tender.","Divide noodles and broth between bowls.","Top each bowl with ham, a halved egg, and scallions.","Serve immediately while the broth is piping hot."]'::jsonb
),
(
  '33333333-3333-4333-8333-333333333333', 'spirited-away-onigiri', 'Healing Onigiri', 'Spirited Away', 2001,
  'Warm rice balls with a simple savory filling, inspired by the quiet comfort of food offered during a difficult moment.',
  4, 35, 'Easy', 'green', '🍙', array['Rice','Snack','Portable'],
  '[{"name":"Japanese short-grain rice","qty":2,"unit":"cups"},{"name":"water","qty":2.25,"unit":"cups"},{"name":"salt","qty":1,"unit":"tsp"},{"name":"salmon flakes or tuna mayo","qty":0.5,"unit":"cup"},{"name":"nori sheets","qty":2,"unit":""}]'::jsonb,
  '["Rinse the rice until the water is mostly clear, then cook with the measured water.","Let the cooked rice rest for 10 minutes, covered.","Wet and salt your hands. Flatten a small mound of warm rice in your palm.","Add a spoonful of filling, close with more rice, and shape into a triangle or round.","Wrap with a strip of nori just before serving."]'::jsonb
),
(
  '44444444-4444-4444-8444-444444444444', 'laputas-egg-toast', 'Laputa''s Egg Toast', 'Castle in the Sky', 1986,
  'A humble toast-and-egg breakfast that feels adventurous, simple, and deeply satisfying.',
  2, 12, 'Easy', 'gold', '🍞', array['Breakfast','Budget','Quick'],
  '[{"name":"thick bread","qty":2,"unit":"slices"},{"name":"large eggs","qty":2,"unit":""},{"name":"butter","qty":1,"unit":"tbsp"},{"name":"salt","qty":0.25,"unit":"tsp"},{"name":"pepper","qty":0.25,"unit":"tsp"}]'::jsonb,
  '["Toast the bread until crisp around the edges but still soft in the center.","Melt butter in a pan and fry the eggs sunny-side up.","Season lightly with salt and pepper.","Place one egg over each slice of toast and serve at once."]'::jsonb
),
(
  '55555555-5555-4555-8555-555555555555', 'kikis-pumpkin-herring-pie', 'Kiki''s Pumpkin Fish Pie', 'Kiki''s Delivery Service', 1989,
  'A golden, homestyle savory pie with pumpkin, white fish, and creamy herbs—made for slow afternoons and shared tables.',
  6, 70, 'Medium', 'terracotta', '🥧', array['Baked','Dinner','Weekend'],
  '[{"name":"pumpkin, cubed","qty":500,"unit":"g"},{"name":"white fish fillet","qty":350,"unit":"g"},{"name":"onion, diced","qty":1,"unit":""},{"name":"cream","qty":180,"unit":"ml"},{"name":"puff pastry","qty":1,"unit":"sheet"},{"name":"egg for glaze","qty":1,"unit":""},{"name":"dill or parsley","qty":2,"unit":"tbsp"}]'::jsonb,
  '["Roast or steam the pumpkin until tender, then mash roughly.","Sauté the onion until translucent. Add fish and cook gently until just opaque.","Fold in pumpkin, cream, and herbs. Season to taste.","Transfer to a pie dish, cover with puff pastry, and brush with beaten egg.","Bake at 200°C until deeply golden, about 25–30 minutes."]'::jsonb
),
(
  '66666666-6666-4666-8666-666666666666', 'forest-garden-bento', 'Forest Garden Bento', 'My Neighbor Totoro', 1988,
  'A colorful vegetable-forward lunch box inspired by countryside gardens, rice fields, and simple family meals.',
  2, 40, 'Medium', 'sage', '🍱', array['Bento','Vegetables','Lunch'],
  '[{"name":"cooked rice","qty":2,"unit":"cups"},{"name":"broccoli florets","qty":1,"unit":"cup"},{"name":"carrot, sliced","qty":1,"unit":""},{"name":"tamago or omelet","qty":4,"unit":"slices"},{"name":"edamame","qty":0.5,"unit":"cup"},{"name":"sesame seeds","qty":1,"unit":"tbsp"}]'::jsonb,
  '["Pack warm rice into one side of each bento box.","Blanch broccoli and carrots until bright and just tender.","Arrange vegetables, omelet, and edamame in tidy sections.","Sprinkle rice and vegetables with sesame seeds.","Let cool slightly before closing the bento lid."]'::jsonb
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  ingredients = excluded.ingredients,
  steps = excluded.steps;
