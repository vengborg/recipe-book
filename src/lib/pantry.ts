// Common pantry staples that most kitchens already have
const PANTRY_STAPLES: string[] = [
  // Salts & Seasonings
  'salt',
  'kosher salt',
  'sea salt',
  'black pepper',
  'pepper',
  'ground pepper',
  'white pepper',
  'red pepper flakes',
  'crushed red pepper',
  'cayenne pepper',
  'cayenne',
  'paprika',
  'smoked paprika',
  'chili powder',
  'cumin',
  'ground cumin',
  'coriander',
  'turmeric',
  'cinnamon',
  'ground cinnamon',
  'nutmeg',
  'oregano',
  'dried oregano',
  'basil',
  'dried basil',
  'thyme',
  'dried thyme',
  'rosemary',
  'dried rosemary',
  'bay leaves',
  'bay leaf',
  'garlic powder',
  'onion powder',
  'italian seasoning',

  // Oils & Vinegars
  'olive oil',
  'extra virgin olive oil',
  'vegetable oil',
  'canola oil',
  'cooking spray',
  'sesame oil',
  'balsamic vinegar',
  'red wine vinegar',
  'white wine vinegar',
  'apple cider vinegar',
  'rice vinegar',
  'distilled white vinegar',

  // Pantry Basics
  'sugar',
  'granulated sugar',
  'brown sugar',
  'powdered sugar',
  'honey',
  'maple syrup',
  'all-purpose flour',
  'flour',
  'cornstarch',
  'baking powder',
  'baking soda',
  'vanilla extract',
  'vanilla',

  // Sauces & Condiments
  'soy sauce',
  'fish sauce',
  'worcestershire sauce',
  'hot sauce',
  'sriracha',
  'tomato paste',
  'dijon mustard',
  'mustard',
  'ketchup',
  'mayonnaise',

  // Staple Aromatics
  'garlic',
  'onion',
  'yellow onion',
  'white onion',

  // Dairy Basics
  'butter',
  'unsalted butter',

  // Misc
  'water',
  'ice',
];

/**
 * Check if an ingredient string is likely a pantry staple.
 * Does fuzzy matching — checks if any known staple appears in the ingredient text.
 */
export function isPantryStaple(ingredient: string): boolean {
  const lower = ingredient.toLowerCase().trim();
  return PANTRY_STAPLES.some((staple) => {
    // Check if the staple is contained as a word boundary match
    const escaped = staple.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\s|,)${escaped}(\\s|,|$)`, 'i');
    return regex.test(lower) || lower === staple;
  });
}

/**
 * Split ingredients into "need to buy" and "pantry" lists.
 */
export function categorizeIngredients(ingredients: string[]): {
  toBuy: string[];
  pantry: string[];
} {
  const toBuy: string[] = [];
  const pantry: string[] = [];

  for (const ing of ingredients) {
    if (isPantryStaple(ing)) {
      pantry.push(ing);
    } else {
      toBuy.push(ing);
    }
  }

  return { toBuy, pantry };
}
