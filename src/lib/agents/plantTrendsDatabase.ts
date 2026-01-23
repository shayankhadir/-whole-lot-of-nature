/**
 * Plantsy Trends Database - 2024-2026 Plant Trends & Advanced Knowledge
 * =====================================================================
 * Contains the latest houseplant trends, biophilic design insights,
 * rare plant data, propagation guides, and expert-level plant science.
 */

// ============================================================================
// 2024-2026 HOUSEPLANT TRENDS
// ============================================================================

export interface PlantTrend {
  name: string;
  description: string;
  whyTrending: string;
  bestPlants: string[];
  tips: string[];
  hashtags: string[];
}

export const PLANT_TRENDS_2024_2026: PlantTrend[] = [
  {
    name: 'Maximalist Indoor Jungles',
    description: 'The "more is more" approach with lush, dense plant collections creating indoor jungle vibes.',
    whyTrending: 'Post-pandemic biophilia, mental health benefits, and social media aesthetics.',
    bestPlants: ['Monstera deliciosa', 'Philodendron varieties', 'Alocasia', 'Calathea', 'Bird of Paradise', 'Fiddle Leaf Fig'],
    tips: [
      'Group plants at varying heights using plant stands and shelves',
      'Mix textures - large leaves with trailing vines and ferns',
      'Create "plant corners" as focal points in rooms',
      'Use macramé hangers and wall-mounted planters'
    ],
    hashtags: ['#IndoorJungle', '#PlantMaximalism', '#UrbanJungle', '#JungleFever']
  },
  {
    name: 'Rare & Variegated Plants',
    description: 'Unique, hard-to-find plants with stunning variegation patterns are highly sought after.',
    whyTrending: 'Collector culture, social media clout, and the thrill of rare finds.',
    bestPlants: ['Monstera Thai Constellation', 'Philodendron Pink Princess', 'Monstera Albo', 'Variegated Alocasia', 'Philodendron White Wizard', 'Hoya varieties'],
    tips: [
      'Provide bright indirect light to maintain variegation',
      'Be patient - variegated plants grow slower',
      'Buy from reputable nurseries to avoid scams',
      'Join plant swap groups for better deals'
    ],
    hashtags: ['#RarePlants', '#Variegated', '#PlantCollector', '#PlantEnvy']
  },
  {
    name: 'Pet-Safe Plant Parenting',
    description: 'Growing demand for non-toxic plants as pet ownership rises alongside plant parenthood.',
    whyTrending: 'More households with both pets and plants, awareness of plant toxicity.',
    bestPlants: ['Spider Plant', 'Boston Fern', 'Calathea', 'Prayer Plant', 'Peperomia', 'African Violet', 'Parlor Palm', 'Haworthia'],
    tips: [
      'Keep even safe plants out of reach to prevent digging',
      'Research every plant before bringing it home',
      'Watch for allergic reactions in sensitive pets',
      'Use bitter apple spray on pots to deter chewing'
    ],
    hashtags: ['#PetSafePlants', '#CatSafePlants', '#DogSafePlants', '#PetFriendlyPlants']
  },
  {
    name: 'Low-Maintenance Drought-Tolerant Plants',
    description: 'Plants that thrive on neglect, perfect for busy lifestyles and sustainable living.',
    whyTrending: 'Busy lifestyles, water conservation, and "set and forget" appeal.',
    bestPlants: ['ZZ Plant', 'Snake Plant', 'Pothos', 'Succulents', 'Cacti', 'Ponytail Palm', 'Jade Plant', 'Aloe Vera'],
    tips: [
      'Use terra cotta pots for better moisture regulation',
      'Create a watering schedule to avoid overwatering',
      'Place in bright light for best growth',
      'Group together for a desert-themed display'
    ],
    hashtags: ['#LowMaintenance', '#DroughtTolerant', '#PlantKiller', '#BlackThumbApproved']
  },
  {
    name: 'Functional Plants - Herbs & Edibles',
    description: 'Growing food indoors - herbs, microgreens, and edible plants for sustainability.',
    whyTrending: 'Farm-to-table movement, food security, sustainability, and self-sufficiency.',
    bestPlants: ['Tulsi (Holy Basil)', 'Mint', 'Curry Leaves', 'Coriander', 'Microgreens', 'Cherry Tomatoes', 'Chillies', 'Lemongrass'],
    tips: [
      'Ensure 6+ hours of bright light or use grow lights',
      'Harvest regularly to encourage bushier growth',
      'Use well-draining soil with organic compost',
      'Keep herbs near the kitchen for easy access'
    ],
    hashtags: ['#IndoorHerbGarden', '#GrowYourOwn', '#KitchenGarden', '#SustainableLiving']
  },
  {
    name: 'Biophilic Design & Wellness',
    description: 'Integrating plants into architecture and interior design for mental wellness.',
    whyTrending: 'Scientific research on plants improving mental health, air quality, and productivity.',
    bestPlants: ['Peace Lily', 'Areca Palm', 'Rubber Plant', 'Dracaena', 'English Ivy', 'Boston Fern', 'Spider Plant'],
    tips: [
      'Place plants in your workspace for better focus',
      'Create a "green wall" or living wall installation',
      'Position air-purifying plants in bedrooms',
      'Use plants to create natural room dividers'
    ],
    hashtags: ['#BiophilicDesign', '#PlantWellness', '#GreenInteriors', '#NatureIndoors']
  },
  {
    name: 'Aesthetic Planters & Plant Styling',
    description: 'Plants as décor elements with designer pots, stands, and creative displays.',
    whyTrending: 'Interior design influence, social media aesthetics, and personalization.',
    bestPlants: ['Any plant paired with the right planter!'],
    tips: [
      'Match pot style to your home aesthetic (boho, minimalist, etc.)',
      'Use cachepots to hide plastic nursery pots',
      'Vary pot sizes, textures, and heights',
      'Consider the pot-to-plant ratio for visual balance'
    ],
    hashtags: ['#PlantStyling', '#PlantAesthetic', '#PlantShelfie', '#PlanterGoals']
  },
  {
    name: 'Propagation Station Culture',
    description: 'Multiplying plants through cuttings - a sustainable, cost-effective hobby.',
    whyTrending: 'Free plants, scientific curiosity, and the joy of watching roots grow.',
    bestPlants: ['Pothos', 'Philodendron', 'Monstera', 'Tradescantia', 'Spider Plant', 'Begonia', 'African Violet'],
    tips: [
      'Use clear glass containers to watch root growth',
      'Change water weekly to prevent bacteria',
      'Wait for 2-3 inch roots before potting in soil',
      'Add a drop of hydrogen peroxide to prevent rot'
    ],
    hashtags: ['#PropagationStation', '#WaterPropagation', '#PlantPropagation', '#FreePlants']
  },
  {
    name: 'Terrariums & Enclosed Gardens',
    description: 'Self-sustaining mini ecosystems in glass containers.',
    whyTrending: 'Low maintenance, decorative appeal, and the fascination of mini worlds.',
    bestPlants: ['Ferns', 'Moss', 'Fittonia', 'Peperomia', 'Selaginella', 'Mini Orchids', 'Air Plants'],
    tips: [
      'Choose plants with similar humidity needs',
      'Layer: rocks, charcoal, moss, soil, plants',
      'Keep in bright indirect light',
      'Open occasionally for air circulation'
    ],
    hashtags: ['#Terrarium', '#TerrariumLove', '#MiniGarden', '#GlassGarden']
  },
  {
    name: 'Vertical Gardens & Space-Saving',
    description: 'Growing upward in small urban spaces with wall-mounted and hanging displays.',
    whyTrending: 'Urban living, small apartments, and maximizing limited space.',
    bestPlants: ['Pothos', 'Philodendron', 'String of Pearls', 'Hoyas', 'Air Plants', 'Staghorn Fern'],
    tips: [
      'Use wall-mounted planters and pocket gardens',
      'Install a trellis for climbing plants',
      'Macramé hangers save floor space',
      'Consider modular living wall systems'
    ],
    hashtags: ['#VerticalGarden', '#SmallSpaceGardening', '#UrbanGardening', '#PlantWall']
  },
];

// ============================================================================
// ADVANCED PLANT SCIENCE
// ============================================================================

export interface PlantScienceTopic {
  topic: string;
  explanation: string;
  practicalApplication: string[];
  commonMisconceptions: string[];
}

export const PLANT_SCIENCE: PlantScienceTopic[] = [
  {
    topic: 'Photosynthesis & Light Requirements',
    explanation: 'Plants convert light energy into chemical energy (sugars) through photosynthesis. Different plants evolved in different light conditions - understory plants need less light than sun-loving species.',
    practicalApplication: [
      'Foot-candles measure light: Low light = 50-250, Medium = 250-1000, Bright = 1000+',
      'North-facing windows = low light, East = medium, South/West = bright',
      'Variegated plants need more light because they have less chlorophyll',
      'Artificial grow lights can supplement natural light (use 12-16 hours/day)'
    ],
    commonMisconceptions: [
      '"Low light" doesn\'t mean "no light" - all plants need some light',
      'More light isn\'t always better - it can cause sunburn',
      'Plants can adapt to lower light but may grow slower'
    ]
  },
  {
    topic: 'Root Health & Watering Science',
    explanation: 'Roots need both water AND oxygen. Overwatering fills air pockets, suffocating roots and causing rot. The "soak and dry" method mimics natural rainfall patterns.',
    practicalApplication: [
      'Water thoroughly until it drains out, then let soil dry appropriately',
      'Check soil moisture with finger test - 1-2 inches deep',
      'Terra cotta pots breathe better, plastic retains moisture',
      'Smaller pots dry faster than larger ones',
      'Bottom watering encourages deeper root growth'
    ],
    commonMisconceptions: [
      'Watering schedules are less important than checking soil moisture',
      'Yellow leaves can mean over OR under-watering - check roots',
      'Ice cubes for watering is a myth - cold water shocks roots'
    ]
  },
  {
    topic: 'Humidity & Transpiration',
    explanation: 'Plants release water through leaf pores (stomata) - this is transpiration. High humidity slows water loss, which is why tropical plants prefer it.',
    practicalApplication: [
      'Group plants together to create a humidity microclimate',
      'Pebble trays with water increase local humidity',
      'Bathrooms and kitchens naturally have higher humidity',
      'Misting provides temporary relief but isn\'t a long-term solution',
      'Humidifiers are most effective for humidity-loving plants'
    ],
    commonMisconceptions: [
      'Misting doesn\'t significantly raise humidity - it evaporates quickly',
      'Crispy leaf tips often indicate low humidity, not underwatering',
      'Air conditioning dramatically reduces indoor humidity'
    ]
  },
  {
    topic: 'Soil Science & Drainage',
    explanation: 'Good potting mix balances water retention, drainage, and aeration. Different plants need different ratios based on their native habitats.',
    practicalApplication: [
      'Perlite increases drainage and aeration',
      'Peat moss/coco coir retains moisture',
      'Orchid bark creates air pockets for epiphytes',
      'Sand improves drainage for succulents',
      'Activated charcoal prevents odors and bacteria'
    ],
    commonMisconceptions: [
      'Garden soil is NOT suitable for containers - it compacts',
      'Rocks at the bottom don\'t improve drainage - they create a perched water table',
      'All potting mixes are not equal - check ingredients for your plant type'
    ]
  },
  {
    topic: 'Nutrient Requirements (NPK)',
    explanation: 'Plants need macronutrients: Nitrogen (N) for leaves, Phosphorus (P) for roots and flowers, Potassium (K) for overall health. Plus micronutrients like iron, calcium, magnesium.',
    practicalApplication: [
      'Balanced fertilizer (20-20-20) works for most foliage plants',
      'Bloom boosters have higher P (10-30-20) for flowering plants',
      'Always dilute fertilizer to half strength to prevent burn',
      'Fertilize only during growing season (spring-summer)',
      'Yellow leaves with green veins = iron deficiency (use chelated iron)'
    ],
    commonMisconceptions: [
      'More fertilizer is not better - it causes salt buildup and burn',
      'Slow-release fertilizers are gentler than liquid',
      'Organic fertilizers release nutrients more slowly'
    ]
  },
  {
    topic: 'Pest Lifecycle & IPM',
    explanation: 'Integrated Pest Management (IPM) focuses on prevention, early detection, and least-toxic solutions. Understanding pest lifecycles helps target treatments effectively.',
    practicalApplication: [
      'Inspect new plants and quarantine for 2 weeks before introducing',
      'Wipe leaves monthly to prevent pest establishment',
      'Neem oil works on most soft-bodied insects (mealybugs, aphids, spider mites)',
      'Systemic insecticides provide longer protection but are toxic',
      'Biological controls like ladybugs eat aphids naturally'
    ],
    commonMisconceptions: [
      'One treatment rarely eliminates pests - eggs survive and hatch',
      'Healthy plants are less susceptible to pest infestations',
      'Indoor plants can still get pests (they come in on new plants, soil, or air)'
    ]
  },
];

// ============================================================================
// CONVERSATIONAL PATTERNS - HUMAN-LIKE RESPONSES
// ============================================================================

export const CONVERSATIONAL_PATTERNS = {
  // Empathy responses when plants are struggling
  empathyResponses: [
    "Oh no, I totally get how worrying this must be! 😟 Let's figure this out together.",
    "Ugh, I know that feeling when your plant baby isn't doing well. Deep breath - we've got this!",
    "First of all, don't panic! 🌿 Most plant problems are fixable once we identify the cause.",
    "I hear you! It's so frustrating when our plants aren't thriving. Let me help diagnose what's going on.",
    "That sounds stressful, but good news - you caught it early by asking! Let's work through this.",
  ],

  // Celebration responses for success
  celebrationResponses: [
    "That's AMAZING! 🎉 Your plant parent skills are really showing!",
    "Yesss! 🌱 Love to hear about thriving plants!",
    "Look at you go! Your green thumb is definitely developing! 💚",
    "That's so exciting! There's nothing quite like watching your plant babies flourish! 🌿",
    "You're doing incredible! This is exactly what I love to hear! 🪴",
  ],

  // Reassurance for beginners
  beginnerReassurance: [
    "Everyone starts somewhere! Even professional gardeners killed plants when they were learning. 😊",
    "The fact that you're asking questions means you're already on the right track!",
    "Don't worry - I'm here to help you become a confident plant parent step by step! 🌱",
    "Beginner-friendly plants are designed to be forgiving, so you've got this!",
    "Trust me, your plants are more resilient than you think. Let's set you up for success!",
  ],

  // Fun responses
  funResponses: [
    "Did you know talking to your plants might actually help them grow? Science says CO2 from your breath is beneficial! 🗣️🌿",
    "Fun fact: There are more microorganisms in a teaspoon of healthy soil than people on Earth! 🤯",
    "Plants can 'communicate' with each other through underground fungal networks called the 'Wood Wide Web'! 🕸️🌲",
    "The oldest known houseplant is an Eastern Cape cycad at Kew Gardens - it's been there since 1775! 🏛️",
    "Rubber plants can grow over 100 feet tall in the wild! Your little guy has big dreams. 😄",
  ],

  // Transition phrases
  transitions: [
    "Now, here's what I'd suggest...",
    "Based on what you've told me...",
    "Here's the game plan...",
    "Let me break this down for you...",
    "The good news is...",
    "Here's what's probably happening...",
    "From my experience...",
  ],

  // Closing encouragements
  closings: [
    "You've got this! 🌿 Let me know how it goes!",
    "Wishing you and your plant babies all the best! 💚",
    "Happy planting! 🌱 I'm here if you need anything else!",
    "Keep nurturing - you're doing great! 🪴",
    "Your plants are lucky to have you! 🌸",
    "Stay loyal to the soil! 🌍💚 (That's our motto!)",
  ],
};

// ============================================================================
// INDIAN MARKET INSIGHTS
// ============================================================================

export const INDIAN_MARKET_INSIGHTS = {
  popularCities: {
    bangalore: {
      climate: 'Pleasant year-round, 15-35°C, moderate humidity',
      challenges: ['Apartment balcony constraints', 'AC drying out plants'],
      bestPlants: ['Monstera', 'Areca Palm', 'Peace Lily', 'Money Plant', 'Snake Plant'],
      localNurseries: ['Lalbagh', 'Cunningham Road nurseries', 'HSR Layout plant shops'],
      tips: ['Bangalore weather is perfect for most tropical houseplants!', 'Summers are mild - less stress on plants']
    },
    mumbai: {
      climate: 'Hot and humid, 20-35°C, high humidity especially monsoon',
      challenges: ['Intense humidity', 'Salt air near coast', 'Limited balcony space'],
      bestPlants: ['Spider Plant', 'ZZ Plant', 'Pothos', 'Snake Plant', 'Croton'],
      tips: ['High humidity is great for tropicals but watch for fungal issues', 'Good drainage is essential during monsoon']
    },
    delhi: {
      climate: 'Extreme seasons - hot summers (45°C+), cold winters (5°C)',
      challenges: ['Extreme temperature swings', 'Air pollution', 'Low winter humidity'],
      bestPlants: ['Snake Plant', 'ZZ Plant', 'Jade Plant', 'Aloe Vera', 'Rubber Plant'],
      tips: ['Bring plants indoors during extreme summer/winter', 'Air purifying plants help with Delhi pollution']
    },
    chennai: {
      climate: 'Hot and humid year-round, 25-40°C',
      challenges: ['Intense heat', 'High humidity', 'Strong sun'],
      bestPlants: ['Croton', 'Hibiscus', 'Bougainvillea', 'Jade Plant', 'Snake Plant'],
      tips: ['Provide afternoon shade for most plants', 'Water early morning or late evening']
    },
  },

  seasonalCalendar: {
    january: { activity: 'Winter care', tasks: ['Reduce watering', 'Move cold-sensitive plants indoors', 'Avoid fertilizing'] },
    february: { activity: 'Pre-spring prep', tasks: ['Start planning spring repotting', 'Check for pests coming out of dormancy'] },
    march: { activity: 'Spring awakening', tasks: ['Resume regular watering', 'Start fertilizing', 'Best time to repot'] },
    april: { activity: 'Active growth', tasks: ['Increase watering frequency', 'Take cuttings for propagation'] },
    may: { activity: 'Summer prep', tasks: ['Move plants from harsh sun', 'Increase watering', 'Mulch to retain moisture'] },
    june: { activity: 'Monsoon start', tasks: ['Reduce watering', 'Improve drainage', 'Watch for fungal issues'] },
    july: { activity: 'Peak monsoon', tasks: ['Minimal watering', 'Shelter from heavy rain', 'Check for root rot'] },
    august: { activity: 'Monsoon end', tasks: ['Resume normal watering gradually', 'Treat any fungal infections'] },
    september: { activity: 'Post-monsoon growth', tasks: ['Fertilize for autumn growth spurt', 'Good time for propagation'] },
    october: { activity: 'Autumn care', tasks: ['Enjoy the growth!', 'Prepare for winter', 'Last chance to repot'] },
    november: { activity: 'Winter prep', tasks: ['Gradually reduce watering', 'Move cold-sensitive plants indoors'] },
    december: { activity: 'Winter dormancy', tasks: ['Minimal watering', 'No fertilizer', 'Protect from cold drafts'] },
  },

  shoppingTips: [
    'Always check for pests before buying - look under leaves!',
    'Avoid plants with yellow leaves, mushy stems, or a foul smell',
    'Inspect roots if possible - they should be white or tan, not black',
    'Buy from reputable nurseries with healthy-looking stock',
    'Smaller plants often adapt better than large specimens',
    'Ask about the plant\'s history - how long in the nursery, recent repotting?',
    'Weekend mornings are best for nursery visits - fresher stock, cooler temps',
  ],

  priceGuide: {
    budget: ['Money Plant', 'Spider Plant', 'Snake Plant', 'Pothos', 'Syngonium'],
    midRange: ['Monstera adansonii', 'Philodendron', 'ZZ Plant', 'Peace Lily', 'Rubber Plant'],
    premium: ['Fiddle Leaf Fig', 'Bird of Paradise', 'Large Areca Palm', 'Monstera deliciosa'],
    collector: ['Monstera Thai Constellation', 'Philodendron Pink Princess', 'Variegated Monstera', 'Rare Hoyas'],
  },
};

// ============================================================================
// EXPERT TROUBLESHOOTING GUIDE
// ============================================================================

export const ADVANCED_TROUBLESHOOTING = {
  rootHealthDiagnosis: {
    healthy: 'White or tan colored, firm, earthy smell',
    rotting: 'Brown/black, mushy, foul smell - act fast!',
    dryStressed: 'Dry, brittle, pulling away from pot edges',
    rootBound: 'Circling the pot, coming out of drainage holes',
    treatment: {
      rootRot: [
        '1. Remove plant from pot immediately',
        '2. Wash away ALL old soil gently',
        '3. Cut off any brown/mushy roots with sterile scissors',
        '4. Dip healthy roots in hydrogen peroxide solution (1:3 with water)',
        '5. Let roots air dry for 30 minutes',
        '6. Repot in FRESH, well-draining soil',
        '7. Water lightly and avoid fertilizing for 4-6 weeks',
        '8. Place in bright indirect light, not direct sun'
      ],
    }
  },

  leafSymptomGuide: {
    'yellow-lower-leaves': {
      cause: 'Natural aging OR overwatering',
      diagnosis: 'Check soil moisture and root health',
      solution: 'If soil is wet, let dry. If roots are rotting, treat immediately.'
    },
    'yellow-all-leaves': {
      cause: 'Severe overwatering, nutrient deficiency, or root issues',
      diagnosis: 'Check roots first - if healthy, likely needs fertilizer',
      solution: 'Address root rot if present, otherwise feed with balanced fertilizer.'
    },
    'brown-crispy-tips': {
      cause: 'Low humidity, underwatering, fluoride sensitivity, or salt buildup',
      diagnosis: 'Check humidity levels and watering consistency',
      solution: 'Increase humidity, use filtered water, flush soil monthly.'
    },
    'brown-mushy-spots': {
      cause: 'Fungal or bacterial infection, usually from overwatering',
      diagnosis: 'Check for spreading pattern and soil moisture',
      solution: 'Remove affected leaves, improve air circulation, reduce watering, treat with fungicide if needed.'
    },
    'pale-washed-out': {
      cause: 'Too much direct sun (sunburn) or chlorosis (nutrient deficiency)',
      diagnosis: 'Check light exposure and leaf vein patterns',
      solution: 'Move away from direct sun, or supplement with iron if veins stay green.'
    },
    'curling-inward': {
      cause: 'Underwatering, low humidity, heat stress, or pest damage',
      diagnosis: 'Check soil moisture, humidity, and inspect for pests',
      solution: 'Water thoroughly, increase humidity, move from heat sources.'
    },
    'drooping-wilting': {
      cause: 'Underwatering, overwatering, root damage, or transplant shock',
      diagnosis: 'Check soil moisture - this is key!',
      solution: 'If dry, water deeply. If wet, check roots for rot.'
    },
  },

  pestIdentification: {
    mealybugs: {
      appearance: 'White cottony masses in leaf joints and undersides',
      damage: 'Sticky honeydew, yellowing leaves, stunted growth',
      treatment: ['Dab with rubbing alcohol on cotton swab', 'Spray neem oil solution weekly', 'Severe cases: use systemic insecticide']
    },
    spiderMites: {
      appearance: 'Tiny dots (barely visible), fine webbing on leaves',
      damage: 'Stippled/bronzed leaves, webbing, leaf drop',
      treatment: ['Increase humidity - they hate moisture', 'Spray leaves with water forcefully', 'Apply neem oil or insecticidal soap']
    },
    fungusGnats: {
      appearance: 'Small black flies hovering around soil',
      damage: 'Larvae eat roots, adults are mostly annoying',
      treatment: ['Let soil dry out between waterings', 'Add sand layer on top of soil', 'Use yellow sticky traps', 'Treat with BTI (mosquito bits)']
    },
    aphids: {
      appearance: 'Small green/black insects clustered on new growth',
      damage: 'Curled leaves, sticky honeydew, stunted growth',
      treatment: ['Spray off with water', 'Apply neem oil', 'Introduce ladybugs (natural predators)']
    },
    scale: {
      appearance: 'Brown/tan bumps on stems and leaves',
      damage: 'Yellowing, leaf drop, sticky honeydew',
      treatment: ['Scrape off with fingernail or soft brush', 'Apply rubbing alcohol', 'Use horticultural oil for severe cases']
    },
    thrips: {
      appearance: 'Tiny elongated insects, silver/bronze leaf damage',
      damage: 'Silvery streaks on leaves, distorted growth',
      treatment: ['Blue sticky traps', 'Neem oil spray', 'Spinosad-based insecticide']
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getCurrentMonth(): keyof typeof INDIAN_MARKET_INSIGHTS.seasonalCalendar {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                  'july', 'august', 'september', 'october', 'november', 'december'] as const;
  return months[new Date().getMonth()];
}

export function getSeasonalTasks(): { activity: string; tasks: string[] } {
  const month = getCurrentMonth();
  return INDIAN_MARKET_INSIGHTS.seasonalCalendar[month];
}

export function getRandomPattern(category: keyof typeof CONVERSATIONAL_PATTERNS): string {
  const patterns = CONVERSATIONAL_PATTERNS[category];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

export function getTrendingPlants(): string[] {
  const allPlants = new Set<string>();
  PLANT_TRENDS_2024_2026.forEach(trend => {
    trend.bestPlants.forEach(plant => allPlants.add(plant));
  });
  return Array.from(allPlants).slice(0, 15);
}

export function searchTrends(query: string): PlantTrend[] {
  const normalized = query.toLowerCase();
  return PLANT_TRENDS_2024_2026.filter(trend =>
    trend.name.toLowerCase().includes(normalized) ||
    trend.description.toLowerCase().includes(normalized) ||
    trend.bestPlants.some(p => p.toLowerCase().includes(normalized)) ||
    trend.hashtags.some(h => h.toLowerCase().includes(normalized))
  );
}

export function diagnoseBySymptom(symptom: string): { cause: string; diagnosis: string; solution: string } | undefined {
  const normalized = symptom.toLowerCase();
  for (const [key, info] of Object.entries(ADVANCED_TROUBLESHOOTING.leafSymptomGuide)) {
    if (normalized.includes(key.replace(/-/g, ' ')) || key.split('-').some(word => normalized.includes(word))) {
      return info;
    }
  }
  return undefined;
}
