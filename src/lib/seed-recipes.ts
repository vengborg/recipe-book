import { Recipe } from './types';

export const seedRecipes: Recipe[] = [
  {
    id: 'seed-levelsio-airfryer-steak',
    title: 'Frozen Steak & Veggies (Air Fryer)',
    description:
      'The laziest good meal you\'ll ever make. Frozen steak, frozen potatoes, frozen broccoli — straight into the air fryer. 30 seconds of actual work. Via @levelsio.',
    ingredients: [
      '1 frozen free-range steak (ribeye or NY strip, ~8-10oz)',
      '1 cup frozen organic baby potatoes',
      '1 cup frozen organic broccoli florets',
      'Olive oil spray, ghee, butter, or lard',
      'Salt and pepper to taste',
    ],
    instructions: [
      'Place frozen steak, frozen potatoes, and frozen broccoli in the Ninja Crispi Pro basket. No thawing needed.',
      'Spray everything with olive oil or add small pats of ghee/butter/lard on top.',
      'Season with salt and pepper.',
      'Set to Air Crisp at 360°F. Cook for 10 minutes.',
      'Flip the steak and toss the veggies. Cook for another 10 minutes.',
      'Check steak temp — 130°F for medium-rare, 140°F for medium. Add 2-3 minutes if needed.',
      'Let steak rest 3 minutes before cutting. Serve.',
    ],
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    servings: '1',
    cookTime: '20 min',
    prepTime: '30 sec',
    totalTimeMinutes: 20,
    sourceUrl: 'https://x.com/levelsio',
    videoUrl: '',
    proteinType: 'beef',
    cookingMethod: 'air-fryer',
    nutrition: {
      calories: 580,
      protein: 48,
      carbs: 28,
      fat: 30,
      perServing: true,
    },
    createdAt: '2026-02-08T23:50:00Z',
    updatedAt: '2026-02-08T23:50:00Z',
  },
];
