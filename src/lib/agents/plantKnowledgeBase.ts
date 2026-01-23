/**
 * Plantsy Knowledge Base - Comprehensive Plant Care Encyclopedia
 * ==============================================================
 * Contains detailed care information for 60+ popular plants,
 * common problems & solutions, seasonal tips, and conversational patterns.
 */

// ============================================================================
// PLANT CARE DATABASE - Detailed info for each plant
// ============================================================================

export interface PlantCareInfo {
  name: string;
  scientificName: string;
  aliases: string[];
  category: 'indoor' | 'outdoor' | 'succulent' | 'flowering' | 'herb' | 'tree' | 'climber' | 'aquatic';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  petSafe: boolean;
  airPurifying: boolean;
  
  // Care requirements
  water: {
    frequency: string;
    amount: string;
    tips: string[];
    signs: { overwatered: string[]; underwatered: string[] };
  };
  light: {
    ideal: string;
    tolerance: string;
    tips: string[];
  };
  soil: {
    type: string;
    ph: string;
    mix: string;
  };
  humidity: {
    ideal: string;
    tips: string[];
  };
  temperature: {
    ideal: string;
    min: number;
    max: number;
    indianClimate: string;
  };
  fertilizer: {
    type: string;
    frequency: string;
    tips: string[];
  };
  
  // Advanced care
  propagation: string[];
  repotting: string;
  pruning: string;
  commonPests: string[];
  commonDiseases: string[];
  troubleshooting: Record<string, string>;
  
  // Fun facts & tips
  funFacts: string[];
  proTips: string[];
  bestFor: string[];
}

export const PLANT_DATABASE: Record<string, PlantCareInfo> = {
  // ============================================================================
  // POPULAR INDOOR PLANTS
  // ============================================================================
  
  'money-plant': {
    name: 'Money Plant',
    scientificName: 'Epipremnum aureum',
    aliases: ['pothos', 'devil\'s ivy', 'golden pothos', 'ceylon creeper'],
    category: 'indoor',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 7-10 days',
      amount: 'Moderate - let top 2 inches dry',
      tips: [
        'Water when top 2 inches of soil feel dry',
        'Yellow leaves often mean overwatering',
        'Can survive in water alone (hydroponic)',
        'Reduce watering in winter by 50%'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Mushy stems', 'Root rot smell', 'Wilting despite wet soil'],
        underwatered: ['Crispy leaf edges', 'Drooping leaves', 'Slow growth', 'Dry, pulling-away soil']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Low to bright light (very adaptable)',
      tips: [
        'Variegated varieties need more light',
        'Can tolerate low light but grows slower',
        'Avoid direct afternoon sun - causes leaf burn',
        'North or East facing windows are perfect'
      ]
    },
    soil: {
      type: 'Well-draining potting mix',
      ph: '6.1-6.5',
      mix: '60% potting soil + 20% perlite + 20% cocopeat'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Tolerates normal home humidity', 'Mist leaves weekly in summer', 'Group with other plants for humidity']
    },
    temperature: {
      ideal: '18-30°C',
      min: 10,
      max: 35,
      indianClimate: 'Thrives in most Indian climates. Protect from frost in hill stations.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer (20-20-20)',
      frequency: 'Every 2-3 weeks in growing season',
      tips: ['Dilute to half strength', 'Stop fertilizing in winter', 'Organic options: diluted compost tea']
    },
    propagation: [
      'Stem cuttings in water (easiest method)',
      'Stem cuttings in soil',
      'Division during repotting',
      'Pro tip: Cut below a node with 2-3 leaves'
    ],
    repotting: 'Every 1-2 years in spring. Go one size up only.',
    pruning: 'Trim leggy vines to encourage bushier growth. Can be done anytime.',
    commonPests: ['Mealybugs', 'Spider mites', 'Scale insects'],
    commonDiseases: ['Root rot', 'Bacterial leaf spot'],
    troubleshooting: {
      'yellow leaves': 'Usually overwatering. Check soil moisture and reduce watering.',
      'brown tips': 'Low humidity or fluoride in tap water. Use filtered water.',
      'leggy growth': 'Not enough light. Move to brighter spot.',
      'no growth': 'Needs fertilizer or is root-bound. Check roots and feed.',
      'pale leaves': 'Too much direct sun or needs nutrients.'
    },
    funFacts: [
      'NASA-approved air purifier - removes formaldehyde & benzene',
      'Considered lucky in Feng Shui and Vastu',
      'Can grow up to 20 feet in ideal conditions',
      'Native to Southeast Asia'
    ],
    proTips: [
      'Train on a moss pole for larger leaves',
      'Wipe leaves monthly to maximize photosynthesis',
      'Root hormone speeds up water propagation',
      'Perfect for bathrooms - loves humidity'
    ],
    bestFor: ['Beginners', 'Low light spaces', 'Air purification', 'Hanging baskets', 'Offices']
  },

  'snake-plant': {
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata (formerly Sansevieria)',
    aliases: ['mother-in-law\'s tongue', 'sansevieria', 'viper\'s bowstring hemp'],
    category: 'indoor',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 2-3 weeks',
      amount: 'Sparingly - let soil dry completely',
      tips: [
        'Water only when soil is bone dry',
        'Water less in winter (once a month)',
        'Avoid getting water in leaf rosettes',
        'Better to underwater than overwater'
      ],
      signs: {
        overwatered: ['Mushy base', 'Yellow/brown leaves', 'Foul smell from soil', 'Leaves falling over'],
        underwatered: ['Wrinkled leaves', 'Crispy tips', 'Leaves curling inward']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Low to bright light (extremely adaptable)',
      tips: [
        'Can survive in near darkness',
        'Variegated types need more light',
        'Handles direct sun but may bleach',
        'Perfect for windowless bathrooms'
      ]
    },
    soil: {
      type: 'Fast-draining cactus/succulent mix',
      ph: '5.5-7.5',
      mix: '50% potting soil + 30% sand + 20% perlite'
    },
    humidity: {
      ideal: '30-50%',
      tips: ['Tolerates dry air perfectly', 'No misting needed', 'Great for air-conditioned rooms']
    },
    temperature: {
      ideal: '18-27°C',
      min: 10,
      max: 40,
      indianClimate: 'Excellent for all Indian climates. Very heat tolerant.'
    },
    fertilizer: {
      type: 'Diluted balanced fertilizer',
      frequency: 'Once a month in spring/summer only',
      tips: ['Very light feeder', 'Skip fertilizer entirely if unsure', 'Too much causes leaf damage']
    },
    propagation: [
      'Leaf cuttings in soil (takes 2-3 months)',
      'Division of rhizomes (quickest)',
      'Water propagation (slow but works)',
      'Note: Variegation may be lost in leaf cuttings'
    ],
    repotting: 'Every 2-3 years. Likes being slightly root-bound.',
    pruning: 'Only remove damaged leaves at base. No regular pruning needed.',
    commonPests: ['Mealybugs', 'Spider mites (rare)'],
    commonDiseases: ['Root rot (main killer)', 'Fungal issues from overwatering'],
    troubleshooting: {
      'mushy leaves': 'Overwatering! Stop watering, check for root rot, repot in dry soil.',
      'brown tips': 'Inconsistent watering or fluoride sensitivity. Use filtered water.',
      'drooping leaves': 'Usually root rot from overwatering. Check roots immediately.',
      'slow growth': 'Normal - snake plants are slow growers. Patience!',
      'splitting leaves': 'Physical damage or extreme temperature changes.'
    },
    funFacts: [
      'Releases oxygen at night - perfect bedroom plant',
      'One of the best air purifiers (removes toxins)',
      'Can live for decades with minimal care',
      'Historically used to make bowstrings'
    ],
    proTips: [
      'Terracotta pots help prevent overwatering',
      'Perfect "set it and forget it" plant',
      'Can go months without water when dormant',
      'Clusters of plants create dramatic displays'
    ],
    bestFor: ['Absolute beginners', 'Frequent travelers', 'Low light', 'Bedrooms', 'Offices']
  },

  'monstera': {
    name: 'Monstera',
    scientificName: 'Monstera deliciosa',
    aliases: ['swiss cheese plant', 'split leaf philodendron', 'delicious monster'],
    category: 'indoor',
    difficulty: 'intermediate',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 7-10 days',
      amount: 'Thorough watering, let top 2 inches dry',
      tips: [
        'Water when top 2-3 inches feel dry',
        'Loves consistent moisture but not soggy',
        'Reduce watering in winter',
        'Leaves drip water when overwatered (guttation)'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Black spots', 'Droopy stems', 'Root rot'],
        underwatered: ['Crispy brown edges', 'Curling leaves', 'Drooping', 'Slow growth']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Medium to bright indirect',
      tips: [
        'More light = more fenestrations (holes)',
        'Avoid direct sun - causes leaf burn',
        'Low light = smaller leaves, no splits',
        'East or West windows are ideal'
      ]
    },
    soil: {
      type: 'Rich, well-draining aroid mix',
      ph: '5.5-7.0',
      mix: '40% potting soil + 30% orchid bark + 20% perlite + 10% charcoal'
    },
    humidity: {
      ideal: '60-80%',
      tips: [
        'Loves humidity but adapts to 50%',
        'Mist regularly or use humidifier',
        'Pebble tray helps in dry weather',
        'Brown tips indicate low humidity'
      ]
    },
    temperature: {
      ideal: '18-30°C',
      min: 13,
      max: 35,
      indianClimate: 'Thrives in most Indian climates. Protect from harsh afternoon sun in summer.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer or slow-release',
      frequency: 'Every 2-3 weeks during growing season',
      tips: ['Use half-strength dilution', 'Stop in winter', 'Organic compost works great']
    },
    propagation: [
      'Stem cuttings with node + aerial root',
      'Air layering for large plants',
      'Single node cuttings in sphagnum moss',
      'Pro tip: Include aerial root for faster rooting'
    ],
    repotting: 'Every 1-2 years in spring. Needs room to grow.',
    pruning: 'Trim leggy vines or damaged leaves. Can be aggressive if needed.',
    commonPests: ['Spider mites', 'Thrips', 'Mealybugs', 'Scale'],
    commonDiseases: ['Root rot', 'Bacterial leaf spot', 'Anthracnose'],
    troubleshooting: {
      'no fenestrations': 'Needs more light! Move to brighter spot.',
      'yellow leaves': 'Overwatering or natural leaf drop (old leaves).',
      'brown edges': 'Low humidity or underwatering. Mist more.',
      'leggy growth': 'Insufficient light. Needs brighter location.',
      'black spots': 'Overwatering or cold damage. Check roots.',
      'small leaves': 'Needs more light, nutrients, or humidity.'
    },
    funFacts: [
      'Fenestrations (holes) help withstand heavy rain in nature',
      'Can produce edible fruit that tastes like pineapple-banana',
      'Native to Mexican rainforests',
      'Instagram\'s most popular houseplant'
    ],
    proTips: [
      'Use a moss pole for bigger leaves and climbing',
      'Clean leaves monthly for best growth',
      'Rotate quarterly for even growth',
      'Aerial roots can be trained into soil'
    ],
    bestFor: ['Statement plant', 'Tropical vibes', 'Medium-bright rooms', 'Instagram aesthetics']
  },

  'peace-lily': {
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    aliases: ['spathiphyllum', 'white sails', 'closet plant'],
    category: 'flowering',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 5-7 days',
      amount: 'Keep soil lightly moist',
      tips: [
        'Water when leaves just start to droop',
        'Dramatic drooper but recovers fast',
        'Use room temperature water',
        'Sensitive to chlorine - use filtered water'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Brown tips', 'Mushy base'],
        underwatered: ['Dramatic drooping', 'Crispy leaves', 'No flowers']
      }
    },
    light: {
      ideal: 'Low to medium indirect light',
      tolerance: 'Thrives in low light',
      tips: [
        'Flowers more in brighter light',
        'Perfect for dark corners',
        'Avoid direct sun - burns leaves',
        'Fluorescent lights work fine'
      ]
    },
    soil: {
      type: 'Rich, well-draining potting mix',
      ph: '5.8-6.5',
      mix: '60% potting soil + 20% perlite + 20% cocopeat'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Loves humidity', 'Brown tips = needs more humidity', 'Mist regularly', 'Great for bathrooms']
    },
    temperature: {
      ideal: '18-30°C',
      min: 15,
      max: 35,
      indianClimate: 'Perfect for Indian homes. Avoid AC drafts.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Every 6-8 weeks',
      tips: ['Light feeder', 'Over-fertilizing prevents blooms', 'Use half-strength']
    },
    propagation: [
      'Division during repotting (easiest)',
      'Separate crowns with roots',
      'Best done in spring'
    ],
    repotting: 'Every 1-2 years when root-bound. Slight crowding encourages blooms.',
    pruning: 'Remove spent flowers and yellow leaves at base.',
    commonPests: ['Mealybugs', 'Spider mites', 'Aphids'],
    commonDiseases: ['Root rot', 'Leaf spot'],
    troubleshooting: {
      'no flowers': 'Needs more light or is over-fertilized.',
      'brown tips': 'Low humidity or fluoride/chlorine in water.',
      'yellow leaves': 'Overwatering, underwatering, or old age.',
      'drooping': 'Needs water! Will recover within hours.',
      'green flowers': 'Normal - white flowers turn green with age.'
    },
    funFacts: [
      'NASA top 10 air purifying plant',
      'Removes ammonia, benzene, formaldehyde',
      'Symbolizes peace and sympathy',
      'Blooms last for months'
    ],
    proTips: [
      'Slight stress (drying out) can trigger blooming',
      'Wipe leaves for better air purification',
      'Perfect gift plant - easy and elegant',
      'Bathroom humidity makes it thrive'
    ],
    bestFor: ['Low light spaces', 'Beginners', 'Air purification', 'Bathrooms', 'Offices']
  },

  'rubber-plant': {
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    aliases: ['rubber tree', 'rubber fig', 'indian rubber bush'],
    category: 'indoor',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 7-14 days',
      amount: 'Moderate - let top inch dry',
      tips: [
        'Water thoroughly then let drain',
        'Reduce significantly in winter',
        'Drooping leaves = needs water',
        'Sensitive to overwatering'
      ],
      signs: {
        overwatered: ['Yellowing lower leaves', 'Leaf drop', 'Root rot', 'Mushy stems'],
        underwatered: ['Drooping leaves', 'Curling leaves', 'Crispy edges']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Medium to bright light',
      tips: [
        'Variegated types need more light',
        'Can tolerate some direct morning sun',
        'Low light causes leggy growth',
        'Rotate for even growth'
      ]
    },
    soil: {
      type: 'Well-draining potting mix',
      ph: '5.5-7.0',
      mix: '60% potting soil + 20% perlite + 20% bark'
    },
    humidity: {
      ideal: '40-60%',
      tips: ['Tolerates normal humidity', 'Wipe leaves to prevent dust buildup', 'Misting not essential']
    },
    temperature: {
      ideal: '16-30°C',
      min: 10,
      max: 35,
      indianClimate: 'Does well in Indian climate. Protect from cold drafts.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Monthly during growing season',
      tips: ['Dilute to half-strength', 'No feeding in winter', 'Slow-release pellets work too']
    },
    propagation: [
      'Air layering (best method)',
      'Stem cuttings (harder)',
      'Single leaf with stem portion',
      'Note: Milky sap can irritate skin'
    ],
    repotting: 'Every 2-3 years or when root-bound.',
    pruning: 'Prune to control shape. New growth emerges from below cut.',
    commonPests: ['Scale', 'Mealybugs', 'Spider mites'],
    commonDiseases: ['Root rot', 'Leaf spot'],
    troubleshooting: {
      'dropping leaves': 'Environmental stress - check water, light, temperature.',
      'yellow leaves': 'Overwatering or natural leaf drop.',
      'leggy growth': 'Needs more light.',
      'brown edges': 'Low humidity or salt buildup.',
      'sticky leaves': 'Scale infestation - check undersides.'
    },
    funFacts: [
      'Used to make natural rubber historically',
      'Can grow 30+ feet outdoors',
      'Native to Southeast Asia',
      'Burgundy variety has deep purple leaves'
    ],
    proTips: [
      'Clean leaves monthly for glossy look',
      'Notching can encourage branching',
      'Stake young plants for support',
      'Great architectural statement plant'
    ],
    bestFor: ['Statement corners', 'Bright rooms', 'Air purification', 'Modern decor']
  },

  'jade-plant': {
    name: 'Jade Plant',
    scientificName: 'Crassula ovata',
    aliases: ['money tree', 'lucky plant', 'friendship plant', 'dollar plant'],
    category: 'succulent',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: false,
    water: {
      frequency: 'Every 2-3 weeks',
      amount: 'Soak and dry completely',
      tips: [
        'Let soil dry completely between waterings',
        'Water less in winter (monthly)',
        'Wrinkled leaves = needs water',
        'Overwatering is the #1 killer'
      ],
      signs: {
        overwatered: ['Mushy leaves', 'Leaf drop', 'Black stems', 'Root rot'],
        underwatered: ['Wrinkled/shriveled leaves', 'Dry soil pulling away']
      }
    },
    light: {
      ideal: 'Bright direct to indirect light',
      tolerance: 'Medium to bright',
      tips: [
        'Loves 4-6 hours of sunlight',
        'Red leaf edges indicate good light',
        'South window is perfect',
        'Leggy = needs more light'
      ]
    },
    soil: {
      type: 'Succulent/cactus mix',
      ph: '6.0-6.5',
      mix: '50% potting soil + 25% sand + 25% perlite'
    },
    humidity: {
      ideal: '30-50%',
      tips: ['Prefers dry air', 'No misting needed', 'Normal room humidity is fine']
    },
    temperature: {
      ideal: '18-24°C',
      min: 10,
      max: 35,
      indianClimate: 'Does well year-round. Can handle Bangalore winters easily.'
    },
    fertilizer: {
      type: 'Succulent fertilizer or diluted balanced',
      frequency: 'Every 2-3 months in growing season',
      tips: ['Very light feeder', 'Skip in winter', 'Over-fertilizing damages roots']
    },
    propagation: [
      'Leaf cuttings (let callus first)',
      'Stem cuttings (easiest)',
      'Let cuttings dry 2-3 days before planting'
    ],
    repotting: 'Every 2-3 years. Likes being slightly pot-bound.',
    pruning: 'Pinch tips for bushier growth. Can be shaped like bonsai.',
    commonPests: ['Mealybugs', 'Scale', 'Spider mites'],
    commonDiseases: ['Root rot', 'Powdery mildew'],
    troubleshooting: {
      'dropping leaves': 'Overwatering, underwatering, or sudden environment change.',
      'leggy growth': 'Needs more sunlight.',
      'soft leaves': 'Overwatering - let soil dry completely.',
      'shriveled leaves': 'Underwatered - give a good soak.',
      'white spots': 'Salt deposits or mealybugs. Check carefully.'
    },
    funFacts: [
      'Considered symbol of good luck and prosperity',
      'Can live for 100+ years',
      'Develops tree-like trunk with age',
      'Native to South Africa'
    ],
    proTips: [
      'Let soil dry completely - better to forget than overwater',
      'Can be grown as bonsai',
      'Terracotta pots help prevent overwatering',
      'Old plants develop beautiful thick trunks'
    ],
    bestFor: ['Sunny windowsills', 'Forgetful waterers', 'Good luck charm', 'Bonsai enthusiasts']
  },

  'aloe-vera': {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    aliases: ['aloe', 'medicinal aloe', 'burn plant', 'first aid plant'],
    category: 'succulent',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 2-3 weeks',
      amount: 'Deep watering, then let dry',
      tips: [
        'Soak thoroughly, drain completely',
        'Wait until soil is bone dry',
        'Water less in winter (monthly)',
        'Never let sit in water'
      ],
      signs: {
        overwatered: ['Mushy/translucent leaves', 'Brown soft spots', 'Root rot', 'Leaf drop'],
        underwatered: ['Thin/curling leaves', 'Brown tips', 'Leaves lose plumpness']
      }
    },
    light: {
      ideal: 'Bright indirect to direct light',
      tolerance: 'Medium to bright',
      tips: [
        'Loves sunny windowsills',
        'Gradual sun exposure prevents burn',
        'Brown/red coloring = intense sun (ok)',
        'Pale green = needs more light'
      ]
    },
    soil: {
      type: 'Cactus/succulent mix',
      ph: '7.0-8.5',
      mix: '50% potting soil + 30% sand + 20% perlite'
    },
    humidity: {
      ideal: '30-50%',
      tips: ['Prefers dry conditions', 'No misting needed', 'Good drainage is key']
    },
    temperature: {
      ideal: '13-27°C',
      min: 10,
      max: 35,
      indianClimate: 'Perfect for Indian climate. Very heat and drought tolerant.'
    },
    fertilizer: {
      type: 'Succulent fertilizer',
      frequency: 'Once in spring and once in summer',
      tips: ['Very light feeder', 'Over-fertilizing causes salt damage', 'Compost is enough usually']
    },
    propagation: [
      'Remove and pot pups/offsets (easiest)',
      'Let pups develop roots before separating',
      'Spring is best time to propagate'
    ],
    repotting: 'Every 2-3 years when root-bound or producing lots of pups.',
    pruning: 'Remove dead/damaged leaves at base. Harvest outer leaves for gel.',
    commonPests: ['Mealybugs', 'Scale (rare)'],
    commonDiseases: ['Root rot', 'Aloe rust (fungal)'],
    troubleshooting: {
      'brown mushy leaves': 'Overwatering! Reduce immediately. Check for root rot.',
      'flat thin leaves': 'Underwatered - needs a good soak.',
      'brown tips': 'Natural or too much direct sun.',
      'red/brown color': 'Stress from sun/cold - usually fine, it will recover.',
      'pale leaves': 'Needs more sunlight.'
    },
    funFacts: [
      'Gel used for burns, skincare, and digestion for 6000+ years',
      'Contains 75+ potentially active compounds',
      'Cleopatra used it for skincare',
      'Called "plant of immortality" by Egyptians'
    ],
    proTips: [
      'Harvest outer leaves first - they\'re oldest and most potent',
      'Terracotta pots prevent overwatering',
      'Produces beautiful orange flowers when mature',
      'Keep one in the kitchen for burn relief'
    ],
    bestFor: ['Sunny kitchens', 'Medicinal use', 'Beginners', 'Hot dry climates']
  },

  'spider-plant': {
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    aliases: ['airplane plant', 'ribbon plant', 'hen and chickens'],
    category: 'indoor',
    difficulty: 'beginner',
    petSafe: true,
    airPurifying: true,
    water: {
      frequency: 'Every 7-10 days',
      amount: 'Moderate - keep slightly moist',
      tips: [
        'Water when top inch is dry',
        'Fleshy roots store water',
        'Sensitive to fluoride/chlorine',
        'Use filtered or rainwater if possible'
      ],
      signs: {
        overwatered: ['Root rot', 'Yellow leaves', 'Mushy roots'],
        underwatered: ['Pale/faded leaves', 'Brown tips', 'Drooping']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Low to bright',
      tips: [
        'Variegated types need more light',
        'Tolerates low light well',
        'Avoid harsh direct sun',
        'Produces more babies in bright light'
      ]
    },
    soil: {
      type: 'Well-draining potting mix',
      ph: '6.0-7.2',
      mix: '70% potting soil + 30% perlite'
    },
    humidity: {
      ideal: '40-60%',
      tips: ['Tolerates normal humidity', 'Mist if tips turn brown', 'Bathroom friendly']
    },
    temperature: {
      ideal: '13-27°C',
      min: 7,
      max: 32,
      indianClimate: 'Thrives in Indian homes year-round.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Monthly during growing season',
      tips: ['Light feeder', 'Over-fertilizing causes brown tips', 'Dilute to half-strength']
    },
    propagation: [
      'Plant spiderettes directly in soil',
      'Root spiderettes in water first',
      'Division of main plant',
      'Pro tip: Leave baby attached until rooted'
    ],
    repotting: 'Annually or when roots escape drainage holes.',
    pruning: 'Trim brown tips. Remove runners for bushier plant.',
    commonPests: ['Aphids', 'Mealybugs', 'Spider mites', 'Whiteflies'],
    commonDiseases: ['Root rot', 'Leaf tip burn'],
    troubleshooting: {
      'brown tips': 'Fluoride in water, dry air, or over-fertilizing.',
      'pale leaves': 'Needs more light (especially variegated).',
      'no babies': 'Needs more light and maturity.',
      'floppy leaves': 'Overwatering or root rot.',
      'curling leaves': 'Underwatering or pest infestation.'
    },
    funFacts: [
      'NASA-approved air purifier',
      'Removes formaldehyde and xylene',
      'Pet safe! Perfect for cat owners',
      'Can produce oxygen at night'
    ],
    proTips: [
      'Perfect hanging basket plant',
      'Produces babies when slightly stressed',
      'Use rainwater to prevent brown tips',
      'Great for propagation practice'
    ],
    bestFor: ['Pet owners', 'Hanging baskets', 'Beginners', 'Air purification', 'Gifting']
  },

  'zz-plant': {
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    aliases: ['zanzibar gem', 'zuzu plant', 'eternity plant', 'aroid palm'],
    category: 'indoor',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 2-4 weeks',
      amount: 'Let dry completely between waterings',
      tips: [
        'Has rhizomes that store water',
        'Can go weeks without water',
        'Yellow leaves = overwatering',
        'When in doubt, don\'t water'
      ],
      signs: {
        overwatered: ['Yellow stems', 'Mushy rhizomes', 'Leaf drop', 'Root rot'],
        underwatered: ['Drooping stems', 'Wrinkled rhizomes', 'Dry soil']
      }
    },
    light: {
      ideal: 'Low to bright indirect light',
      tolerance: 'Extremely adaptable',
      tips: [
        'Thrives in near darkness',
        'Perfect for windowless rooms',
        'Can handle fluorescent lights',
        'Avoid direct sun - causes burn'
      ]
    },
    soil: {
      type: 'Well-draining potting mix',
      ph: '6.0-7.0',
      mix: '60% potting soil + 20% perlite + 20% sand'
    },
    humidity: {
      ideal: '40-50%',
      tips: ['Tolerates dry air', 'No misting needed', 'Normal home humidity is fine']
    },
    temperature: {
      ideal: '18-26°C',
      min: 15,
      max: 35,
      indianClimate: 'Perfect for Indian homes. Handles heat well.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Once in spring and summer (2x per year)',
      tips: ['Very light feeder', 'Can thrive without fertilizer', 'Less is more']
    },
    propagation: [
      'Division of rhizomes (fastest)',
      'Leaf cuttings in soil (takes 6+ months)',
      'Stem cuttings in water (slow)'
    ],
    repotting: 'Every 2-3 years. Slow grower, doesn\'t need frequent repotting.',
    pruning: 'Remove yellow/damaged stems at base. Minimal pruning needed.',
    commonPests: ['Mealybugs', 'Scale (rare)'],
    commonDiseases: ['Root rot (only from overwatering)'],
    troubleshooting: {
      'yellow leaves': 'Overwatering - reduce immediately.',
      'leaning stems': 'Reaching for light. Rotate plant.',
      'brown leaf tips': 'Low humidity or over-fertilizing.',
      'no growth': 'Normal - very slow grower. Give it time.',
      'mushy stems': 'Root rot from overwatering. May need to propagate healthy parts.'
    },
    funFacts: [
      'Can survive months of neglect',
      'Native to East African grasslands',
      'Grows from underground rhizomes',
      'New black variety (Raven) is stunning'
    ],
    proTips: [
      'The ultimate "set and forget" plant',
      'Perfect for frequent travelers',
      'Wipe glossy leaves for best look',
      'Slow growth is normal - be patient'
    ],
    bestFor: ['Beginners', 'Low light offices', 'Frequent travelers', 'Forgetful waterers']
  },

  'fiddle-leaf-fig': {
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    aliases: ['ficus lyrata', 'banjo fig', 'FLF'],
    category: 'indoor',
    difficulty: 'intermediate',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 7-10 days',
      amount: 'Thorough watering, let top 2 inches dry',
      tips: [
        'Consistent watering schedule is key',
        'Use room temperature water',
        'Drain completely - no wet feet',
        'Water less in winter'
      ],
      signs: {
        overwatered: ['Brown spots starting at center', 'Yellow leaves', 'Root rot', 'Leaf drop'],
        underwatered: ['Brown crispy edges', 'Drooping', 'Curling leaves']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Medium to bright',
      tips: [
        'Loves light - more is better',
        'South or West window ideal',
        'Rotate quarterly for even growth',
        'Low light = slow growth and leaf drop'
      ]
    },
    soil: {
      type: 'Well-draining potting mix',
      ph: '6.0-7.0',
      mix: '50% potting soil + 25% perlite + 25% bark'
    },
    humidity: {
      ideal: '50-65%',
      tips: [
        'Prefers higher humidity',
        'Mist regularly or use humidifier',
        'Group with other plants',
        'Brown edges indicate low humidity'
      ]
    },
    temperature: {
      ideal: '18-24°C',
      min: 12,
      max: 35,
      indianClimate: 'Needs protection from extreme heat. Avoid AC drafts.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Monthly during growing season',
      tips: ['Dilute to half-strength', 'Stop in winter', 'Over-fertilizing causes leaf burn']
    },
    propagation: [
      'Air layering (most successful)',
      'Stem cuttings in water or soil',
      'Single leaf cutting with stem',
      'Note: Propagation is challenging'
    ],
    repotting: 'Every 2 years in spring. Go 2 inches larger.',
    pruning: 'Prune in spring to encourage branching. Wear gloves for milky sap.',
    commonPests: ['Spider mites', 'Mealybugs', 'Scale', 'Aphids'],
    commonDiseases: ['Root rot', 'Bacterial infection', 'Leaf spot'],
    troubleshooting: {
      'brown spots in center': 'Root rot from overwatering.',
      'brown edges': 'Underwatering or low humidity.',
      'dropping leaves': 'Environmental stress - check light, water, temperature.',
      'no growth': 'Needs more light or fertilizer.',
      'leggy/sparse': 'Prune to encourage branching.',
      'red spots': 'Edema from inconsistent watering.'
    },
    funFacts: [
      'Most Instagrammed houseplant',
      'Can grow 10+ feet indoors',
      'Native to West African rainforests',
      'Leaves can reach 15 inches long'
    ],
    proTips: [
      'Find a spot and don\'t move it - hates change',
      'Clean leaves monthly for photosynthesis',
      'Notching trunk encourages branching',
      'Let it acclimate 2 weeks before repotting'
    ],
    bestFor: ['Statement corners', 'Bright rooms', 'Instagram aesthetics', 'Intermediate growers']
  },

  'pothos': {
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    aliases: ['money plant', 'devil\'s ivy', 'golden pothos', 'hunter\'s robe'],
    category: 'indoor',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 7-10 days',
      amount: 'Moderate - let top soil dry',
      tips: [
        'Water when leaves start to droop slightly',
        'Can grow in water indefinitely',
        'Yellow leaves = too much water',
        'Tolerates inconsistent watering'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Black stems'],
        underwatered: ['Wilting', 'Brown crispy leaves', 'Slow growth']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Low to bright',
      tips: [
        'Variegated varieties need more light',
        'Green varieties tolerate low light best',
        'No direct sun - causes burn',
        'Fluorescent lights work fine'
      ]
    },
    soil: {
      type: 'Standard potting mix',
      ph: '6.1-6.5',
      mix: '70% potting soil + 30% perlite'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Adapts to normal humidity', 'Loves bathroom humidity', 'Brown tips mean dry air']
    },
    temperature: {
      ideal: '18-30°C',
      min: 10,
      max: 35,
      indianClimate: 'Thrives in all Indian climates. Very adaptable.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Monthly in growing season',
      tips: ['Dilute to half-strength', 'Not needed in winter', 'Too much causes salt buildup']
    },
    propagation: [
      'Stem cuttings in water (super easy)',
      'Direct to soil cuttings',
      'Pro tip: Cut just below a node'
    ],
    repotting: 'Every 1-2 years or when root-bound.',
    pruning: 'Trim to encourage bushiness. Cuttings can be propagated.',
    commonPests: ['Mealybugs', 'Spider mites', 'Scale'],
    commonDiseases: ['Root rot', 'Leaf spot'],
    troubleshooting: {
      'yellow leaves': 'Overwatering or old age (normal for lower leaves).',
      'leggy vines': 'Needs more light.',
      'brown tips': 'Dry air or salt buildup.',
      'no variegation': 'Needs more light.',
      'slow growth': 'Feed with fertilizer or check roots.'
    },
    funFacts: [
      'Can purify air of toxins',
      'Grows towards darkness (negative phototropism)',
      'Can live 5-10 years easily',
      'Over 15 beautiful varieties'
    ],
    proTips: [
      'Trail from shelf or train on wall',
      'Moss pole creates larger leaves',
      'Different varieties have different care needs',
      'Perfect plant for water propagation practice'
    ],
    bestFor: ['Beginners', 'Low light areas', 'Trailing display', 'Offices']
  },

  'philodendron': {
    name: 'Philodendron',
    scientificName: 'Philodendron spp.',
    aliases: ['philo', 'heart leaf philodendron', 'sweetheart plant'],
    category: 'indoor',
    difficulty: 'beginner',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 7-10 days',
      amount: 'Let top inch dry between waterings',
      tips: [
        'Prefers evenly moist soil',
        'Yellow leaves = overwatering',
        'Drooping = needs water',
        'Reduce in winter'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Mushy stems'],
        underwatered: ['Drooping', 'Brown crispy leaves', 'Slow growth']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Low to bright',
      tips: [
        'Variegated types need more light',
        'Can adapt to lower light',
        'Avoid direct sun',
        'East window ideal'
      ]
    },
    soil: {
      type: 'Rich, well-draining mix',
      ph: '5.5-6.5',
      mix: '60% potting soil + 20% perlite + 20% orchid bark'
    },
    humidity: {
      ideal: '60-80%',
      tips: ['Loves high humidity', 'Mist regularly', 'Bathroom friendly', 'Brown tips = needs humidity']
    },
    temperature: {
      ideal: '18-28°C',
      min: 13,
      max: 35,
      indianClimate: 'Thrives in Indian climate. Keep away from AC.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Every 2-4 weeks in growing season',
      tips: ['Half-strength dilution', 'Monthly in winter', 'Slow-release granules work too']
    },
    propagation: [
      'Stem cuttings in water',
      'Stem cuttings in soil',
      'Air layering for large plants'
    ],
    repotting: 'Annually in spring. Use pot 1-2 inches larger.',
    pruning: 'Prune to control size and encourage bushiness.',
    commonPests: ['Aphids', 'Mealybugs', 'Spider mites'],
    commonDiseases: ['Root rot', 'Leaf spot'],
    troubleshooting: {
      'yellow leaves': 'Overwatering or natural aging.',
      'leggy growth': 'Needs more light.',
      'small leaves': 'Needs more light or fertilizer.',
      'brown tips': 'Low humidity or inconsistent watering.',
      'drooping': 'Check water - could be under or over.'
    },
    funFacts: [
      'Over 400 philodendron species exist',
      'Name means "tree loving" in Greek',
      'Excellent air purifier',
      'Native to tropical Americas'
    ],
    proTips: [
      'Climbing types love moss poles',
      'Wipe leaves for better photosynthesis',
      'Can be trained as trailing or climbing',
      'Perfect for terrariums'
    ],
    bestFor: ['Beginners', 'Tropical vibes', 'Hanging baskets', 'Offices']
  },

  'boston-fern': {
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    aliases: ['sword fern', 'nephrolepis', 'fishbone fern'],
    category: 'indoor',
    difficulty: 'intermediate',
    petSafe: true,
    airPurifying: true,
    water: {
      frequency: 'Every 2-3 days',
      amount: 'Keep soil consistently moist',
      tips: [
        'Never let soil dry completely',
        'Loves humidity more than wet soil',
        'Water from below when possible',
        'Reduce slightly in winter'
      ],
      signs: {
        overwatered: ['Yellow fronds', 'Root rot', 'Mushy base'],
        underwatered: ['Crispy brown fronds', 'Leaf drop', 'Wilting']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Medium to bright indirect',
      tips: [
        'No direct sun ever',
        'North window is ideal',
        'Tolerates some shade',
        'Filtered light through curtains'
      ]
    },
    soil: {
      type: 'Rich, moisture-retaining mix',
      ph: '5.0-5.5',
      mix: '50% peat + 30% potting soil + 20% perlite'
    },
    humidity: {
      ideal: '80%+',
      tips: [
        'Humidity is critical!',
        'Mist daily',
        'Pebble tray essential',
        'Perfect for bathrooms'
      ]
    },
    temperature: {
      ideal: '16-24°C',
      min: 10,
      max: 30,
      indianClimate: 'Struggles in hot dry summers. Keep in cool, humid spot.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Monthly in growing season',
      tips: ['Dilute to 1/4 strength', 'Sensitive to over-fertilizing', 'No feeding in winter']
    },
    propagation: [
      'Division during repotting',
      'Separate runners/stolons',
      'Best done in spring'
    ],
    repotting: 'Every 1-2 years when root-bound.',
    pruning: 'Remove dead fronds at base. Shape as needed.',
    commonPests: ['Spider mites', 'Mealybugs', 'Scale'],
    commonDiseases: ['Root rot', 'Grey mold'],
    troubleshooting: {
      'brown fronds': 'Low humidity or underwatering.',
      'yellowing': 'Overwatering or too much sun.',
      'leaf drop': 'Stress - check humidity, water, temperature.',
      'pale fronds': 'Needs fertilizer or more light.',
      'no growth': 'Too cold or needs nutrients.'
    },
    funFacts: [
      'Victorian era favorite',
      'Excellent air purifier',
      'Pet safe for cats and dogs',
      'Can live 100+ years'
    ],
    proTips: [
      'Group with other plants for humidity',
      'Keep away from heating/AC vents',
      'Soak in water monthly for deep watering',
      'Perfect hanging basket plant'
    ],
    bestFor: ['Bathrooms', 'Pet owners', 'Humid climates', 'Hanging baskets']
  },

  'english-ivy': {
    name: 'English Ivy',
    scientificName: 'Hedera helix',
    aliases: ['common ivy', 'european ivy', 'hedera'],
    category: 'climber',
    difficulty: 'intermediate',
    petSafe: false,
    airPurifying: true,
    water: {
      frequency: 'Every 5-7 days',
      amount: 'Keep slightly moist',
      tips: [
        'Let top inch dry between waterings',
        'Likes consistent moisture',
        'Reduce in winter',
        'Good drainage essential'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Black stems'],
        underwatered: ['Crispy leaves', 'Leaf drop', 'Wilting']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Low to bright',
      tips: [
        'Variegated types need more light',
        'Can grow in shade',
        'Avoid hot direct sun',
        'Fluorescent lights work'
      ]
    },
    soil: {
      type: 'Standard potting mix',
      ph: '6.0-7.8',
      mix: '70% potting soil + 30% perlite'
    },
    humidity: {
      ideal: '50-70%',
      tips: [
        'Prefers higher humidity',
        'Mist regularly',
        'Prone to spider mites in dry air'
      ]
    },
    temperature: {
      ideal: '10-21°C',
      min: 5,
      max: 30,
      indianClimate: 'Prefers cooler climates. Struggles in hot Indian summers.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Monthly in growing season',
      tips: ['Dilute to half-strength', 'Light feeder', 'Skip in winter']
    },
    propagation: [
      'Stem cuttings in water (easy)',
      'Stem cuttings in soil',
      'Layering'
    ],
    repotting: 'Every 1-2 years when root-bound.',
    pruning: 'Regular pruning encourages bushy growth. Can be aggressive.',
    commonPests: ['Spider mites (very common)', 'Aphids', 'Mealybugs', 'Scale'],
    commonDiseases: ['Leaf spot', 'Root rot'],
    troubleshooting: {
      'brown leaf edges': 'Low humidity or underwatering.',
      'yellowing leaves': 'Overwatering or too much light.',
      'leggy growth': 'Needs more light.',
      'spider mites': 'Increase humidity and spray with neem.',
      'leaf drop': 'Environmental stress or pest infestation.'
    },
    funFacts: [
      'Can live 400+ years outdoors',
      'Used in traditional medicine',
      'Symbol of fidelity',
      'NASA-approved air purifier'
    ],
    proTips: [
      'Regular misting prevents spider mites',
      'Great for topiaries',
      'Check regularly for pests',
      'Trailing or climbing versatility'
    ],
    bestFor: ['Cool climates', 'Hanging baskets', 'Topiaries', 'Air purification']
  },

  'calathea': {
    name: 'Calathea',
    scientificName: 'Calathea spp. (now Goeppertia)',
    aliases: ['prayer plant', 'zebra plant', 'peacock plant', 'rattlesnake plant'],
    category: 'indoor',
    difficulty: 'intermediate',
    petSafe: true,
    airPurifying: true,
    water: {
      frequency: 'Every 5-7 days',
      amount: 'Keep soil consistently moist',
      tips: [
        'Use filtered or rainwater only',
        'Very sensitive to tap water chemicals',
        'Never let soil dry out completely',
        'Water when top inch is slightly dry'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Mushy stems'],
        underwatered: ['Curling leaves', 'Brown crispy edges', 'Drooping']
      }
    },
    light: {
      ideal: 'Medium indirect light',
      tolerance: 'Low to medium',
      tips: [
        'No direct sun ever - causes fading',
        'North window is ideal',
        'Too much light fades patterns',
        'Low light is better than too much'
      ]
    },
    soil: {
      type: 'Well-draining moisture-retaining mix',
      ph: '6.0-6.5',
      mix: '40% potting soil + 30% perlite + 20% peat + 10% charcoal'
    },
    humidity: {
      ideal: '70-80%',
      tips: [
        'High humidity is essential',
        'Use humidifier',
        'Group with other plants',
        'Pebble tray helps'
      ]
    },
    temperature: {
      ideal: '18-24°C',
      min: 16,
      max: 29,
      indianClimate: 'Needs humidity management in dry seasons. Avoid AC rooms.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Monthly in growing season',
      tips: ['Dilute to 1/4 strength', 'Very sensitive to fertilizer burn', 'No feeding in winter']
    },
    propagation: [
      'Division during repotting only',
      'Best done in spring',
      'Each division needs roots'
    ],
    repotting: 'Every 1-2 years in spring. Handle roots gently.',
    pruning: 'Remove dead or damaged leaves at base.',
    commonPests: ['Spider mites', 'Mealybugs', 'Scale'],
    commonDiseases: ['Root rot', 'Leaf spot'],
    troubleshooting: {
      'curling leaves': 'Underwatering or low humidity.',
      'brown crispy edges': 'Tap water chemicals, low humidity, or direct sun.',
      'fading patterns': 'Too much light.',
      'yellowing leaves': 'Overwatering or cold temperatures.',
      'drooping at night': 'Normal! Leaves fold up at night (prayer position).'
    },
    funFacts: [
      'Leaves move throughout the day following light',
      'Folds leaves up at night like praying hands',
      'Over 300 species with stunning patterns',
      'Pet safe for cats and dogs'
    ],
    proTips: [
      'Filtered water is non-negotiable',
      'Perfect bathroom plant',
      'Don\'t panic about leaf movement - it\'s normal',
      'Diva plant but worth the effort'
    ],
    bestFor: ['Pet owners', 'Bathrooms', 'Pattern lovers', 'Indirect light spots']
  },

  // ============================================================================
  // SUCCULENTS & CACTI
  // ============================================================================

  'echeveria': {
    name: 'Echeveria',
    scientificName: 'Echeveria spp.',
    aliases: ['hen and chicks', 'mexican rose', 'rosette succulent'],
    category: 'succulent',
    difficulty: 'beginner',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Every 2-3 weeks',
      amount: 'Soak and dry completely',
      tips: [
        'Water only when soil is bone dry',
        'Avoid water on rosette center',
        'Water less in winter (monthly)',
        'Bottom watering works best'
      ],
      signs: {
        overwatered: ['Mushy translucent leaves', 'Leaf drop', 'Rot at base'],
        underwatered: ['Wrinkled leaves', 'Dry crispy lower leaves']
      }
    },
    light: {
      ideal: 'Full sun to bright light',
      tolerance: 'Medium to bright',
      tips: [
        'Needs 4-6 hours direct sun',
        'Colors intensify with more sun',
        'South window ideal',
        'Stretching = needs more light'
      ]
    },
    soil: {
      type: 'Fast-draining succulent mix',
      ph: '6.0-7.0',
      mix: '50% potting soil + 25% coarse sand + 25% perlite'
    },
    humidity: {
      ideal: '30-50%',
      tips: ['Prefers dry air', 'No misting ever', 'Good air circulation needed']
    },
    temperature: {
      ideal: '18-27°C',
      min: 5,
      max: 35,
      indianClimate: 'Does well in most Indian climates. Protect from monsoon rains.'
    },
    fertilizer: {
      type: 'Succulent fertilizer',
      frequency: 'Once in spring and summer',
      tips: ['Very light feeder', 'Dilute to half-strength', 'Skip fertilizer entirely if unsure']
    },
    propagation: [
      'Leaf cuttings (let callus 2-3 days)',
      'Offsets/pups',
      'Stem cuttings',
      'Pro tip: Gentle twist to remove leaves cleanly'
    ],
    repotting: 'Every 2-3 years. Loves being pot-bound.',
    pruning: 'Remove dead bottom leaves. Behead leggy plants.',
    commonPests: ['Mealybugs', 'Aphids', 'Vine weevil'],
    commonDiseases: ['Root rot', 'Fungal issues'],
    troubleshooting: {
      'stretching (etiolation)': 'Not enough light. Move to sunnier spot.',
      'soft mushy leaves': 'Overwatering. Stop water, check roots.',
      'wrinkled leaves': 'Needs water - give good soak.',
      'brown patches': 'Sunburn from sudden intense light.',
      'losing bottom leaves': 'Normal if dried/crispy. Problem if mushy.'
    },
    funFacts: [
      'Named after 18th century botanical artist',
      'Over 150 species in the genus',
      'Creates offsets called "chicks"',
      'Native to Mexico and Central America'
    ],
    proTips: [
      'Terracotta pots are perfect',
      'Acclimate slowly to direct sun',
      'Remove dead leaves to prevent rot',
      'Stunning in arrangements'
    ],
    bestFor: ['Sunny windowsills', 'Beginners', 'Arrangements', 'Rock gardens']
  },

  'haworthia': {
    name: 'Haworthia',
    scientificName: 'Haworthia spp.',
    aliases: ['zebra plant', 'pearl plant', 'star window plant'],
    category: 'succulent',
    difficulty: 'beginner',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Every 2-3 weeks',
      amount: 'Soak and dry completely',
      tips: [
        'Tolerate underwatering well',
        'Avoid water in rosette center',
        'Water less in winter',
        'Very rot prone if overwatered'
      ],
      signs: {
        overwatered: ['Mushy leaves', 'Root rot', 'Color change to brown'],
        underwatered: ['Shrinking', 'Color turning reddish', 'Crispy tips']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Medium to bright',
      tips: [
        'Can burn in direct sun',
        'East window ideal',
        'Tolerates lower light than most succulents',
        'Red/brown color = too much sun'
      ]
    },
    soil: {
      type: 'Fast-draining succulent mix',
      ph: '6.6-7.5',
      mix: '50% cactus mix + 25% perlite + 25% coarse sand'
    },
    humidity: {
      ideal: '30-50%',
      tips: ['Normal room humidity fine', 'No misting', 'Good air circulation']
    },
    temperature: {
      ideal: '18-26°C',
      min: 10,
      max: 35,
      indianClimate: 'Handles Indian climate well. Protect from intense summer sun.'
    },
    fertilizer: {
      type: 'Diluted cactus fertilizer',
      frequency: 'Once or twice per year',
      tips: ['Very light feeder', 'Over-fertilizing burns roots']
    },
    propagation: [
      'Remove and pot offsets (easiest)',
      'Leaf cuttings (slow)',
      'Seeds (very slow)'
    ],
    repotting: 'Every 2-3 years. Slow growing.',
    pruning: 'Remove dead outer leaves only.',
    commonPests: ['Mealybugs', 'Root mealybugs'],
    commonDiseases: ['Root rot'],
    troubleshooting: {
      'red/brown coloring': 'Sun stress - move to less intense light.',
      'translucent leaves': 'Overwatering. Stop watering, check roots.',
      'shrinking/shriveling': 'Underwatered - give good soak.',
      'closed up': 'Stress from light, water, or temperature.',
      'no offsets': 'Normal - be patient, comes with maturity.'
    },
    funFacts: [
      'Named after Adrian Haworth, botanist',
      'Native to South Africa',
      'Windows in leaves allow light inside',
      'Pet safe and non-toxic'
    ],
    proTips: [
      'Better in indirect light than other succulents',
      'Perfect desk plant',
      'Slow growing but long-lived',
      'Great for terrariums'
    ],
    bestFor: ['Desks', 'North windows', 'Pet owners', 'Small spaces']
  },

  // ============================================================================
  // FLOWERING PLANTS
  // ============================================================================

  'hibiscus': {
    name: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    aliases: ['china rose', 'shoe flower', 'gudhal'],
    category: 'flowering',
    difficulty: 'intermediate',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Daily in summer, every 2-3 days otherwise',
      amount: 'Keep soil moist but not waterlogged',
      tips: [
        'Heavy drinker in hot weather',
        'Reduce in winter',
        'Mulch helps retain moisture',
        'Yellow leaves often mean overwatering'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Bud drop', 'Root rot'],
        underwatered: ['Wilting', 'Bud drop', 'Leaf curling']
      }
    },
    light: {
      ideal: 'Full sun',
      tolerance: 'Full sun to partial shade',
      tips: [
        'Needs 6+ hours direct sun for blooms',
        'More sun = more flowers',
        'South facing garden ideal',
        'Can grow indoors with bright light'
      ]
    },
    soil: {
      type: 'Rich, well-draining soil',
      ph: '6.0-7.0',
      mix: '50% garden soil + 25% compost + 25% sand'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Tolerates Indian humidity well', 'Mist in dry periods', 'Good for most climates']
    },
    temperature: {
      ideal: '15-35°C',
      min: 10,
      max: 40,
      indianClimate: 'Native to tropical Asia. Perfect for Indian climate year-round.'
    },
    fertilizer: {
      type: 'High-phosphorus flowering fertilizer',
      frequency: 'Every 2 weeks in growing season',
      tips: ['Potassium boosts flowering', 'Stop fertilizing in winter', 'Banana peels work great']
    },
    propagation: [
      'Stem cuttings in monsoon season',
      'Air layering',
      'Semi-hardwood cuttings'
    ],
    repotting: 'Annually in spring for potted plants.',
    pruning: 'Prune in early spring for bushy growth and more blooms.',
    commonPests: ['Aphids', 'Whiteflies', 'Spider mites', 'Mealybugs'],
    commonDiseases: ['Leaf spot', 'Powdery mildew', 'Root rot'],
    troubleshooting: {
      'bud drop': 'Inconsistent watering, temperature change, or moving plant.',
      'no flowers': 'Not enough light or needs phosphorus fertilizer.',
      'yellow leaves': 'Overwatering, nutrient deficiency, or cold.',
      'sticky leaves': 'Pest infestation - check for aphids.',
      'curling leaves': 'Underwatering or pest damage.'
    },
    funFacts: [
      'National flower of Malaysia',
      'Flowers used for hair care in India',
      'Each bloom lasts only 1-2 days',
      'Can be trained as standard/tree form'
    ],
    proTips: [
      'Deadhead spent blooms for more flowers',
      'Prune 1/3 in spring for bushiness',
      'Grows well in containers',
      'Makes excellent hedge'
    ],
    bestFor: ['Indian gardens', 'Balconies', 'Full sun areas', 'Traditional gardens']
  },

  'jasmine': {
    name: 'Jasmine',
    scientificName: 'Jasminum spp.',
    aliases: ['mogra', 'chameli', 'mallige', 'mullai'],
    category: 'flowering',
    difficulty: 'intermediate',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Every 2-3 days in summer, weekly in winter',
      amount: 'Keep soil moist but well-drained',
      tips: [
        'Consistent moisture for best blooms',
        'Don\'t let roots sit in water',
        'Mulch to retain moisture',
        'Increase watering during flowering'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Leaf drop'],
        underwatered: ['Wilting', 'Flower drop', 'Dry crispy leaves']
      }
    },
    light: {
      ideal: 'Full sun to partial shade',
      tolerance: 'Bright light',
      tips: [
        'More sun = more fragrant flowers',
        '4-6 hours sun minimum',
        'Some varieties tolerate shade',
        'East or South facing ideal'
      ]
    },
    soil: {
      type: 'Rich, well-draining soil',
      ph: '6.0-8.0',
      mix: '50% garden soil + 30% compost + 20% sand'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Loves humidity', 'Mist in dry weather', 'Perfect for Indian climate']
    },
    temperature: {
      ideal: '15-30°C',
      min: 10,
      max: 38,
      indianClimate: 'Thrives in Indian climate. Most varieties bloom summer through monsoon.'
    },
    fertilizer: {
      type: 'Balanced or high-phosphorus fertilizer',
      frequency: 'Monthly during growing season',
      tips: ['Phosphorus boosts flowering', 'Use organic compost', 'Stop in winter']
    },
    propagation: [
      'Stem cuttings (semi-hardwood)',
      'Layering',
      'Air layering'
    ],
    repotting: 'Every 2 years for potted plants.',
    pruning: 'Prune after flowering for shape and more blooms next season.',
    commonPests: ['Aphids', 'Mealybugs', 'Spider mites', 'Whiteflies'],
    commonDiseases: ['Leaf spot', 'Powdery mildew'],
    troubleshooting: {
      'no flowers': 'Not enough light, over-fertilizing with nitrogen, or pruned at wrong time.',
      'yellow leaves': 'Overwatering or nutrient deficiency.',
      'leaf drop': 'Environmental stress or pest infestation.',
      'no fragrance': 'Some varieties have less scent. Check variety.',
      'leggy growth': 'Needs pruning and more light.'
    },
    funFacts: [
      'Used in perfumes, teas, and religious ceremonies',
      'National flower of Pakistan and Philippines',
      'Fragrance is strongest at night',
      'Traditional wedding flower in India'
    ],
    proTips: [
      'Prune after flowering, not before',
      'Provide support for climbing varieties',
      'Night-blooming varieties most fragrant',
      'Perfect for balcony gardens'
    ],
    bestFor: ['Fragrance gardens', 'Indian climates', 'Religious offerings', 'Balconies']
  },

  'marigold': {
    name: 'Marigold',
    scientificName: 'Tagetes spp.',
    aliases: ['genda', 'zendu', 'african marigold', 'french marigold'],
    category: 'flowering',
    difficulty: 'beginner',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Every 2-3 days',
      amount: 'Moderate - let topsoil dry slightly',
      tips: [
        'Water at base, not on flowers',
        'Established plants are drought tolerant',
        'Avoid overwatering',
        'Morning watering is best'
      ],
      signs: {
        overwatered: ['Root rot', 'Wilting despite wet soil', 'Yellow leaves'],
        underwatered: ['Wilting', 'Crispy leaves', 'Fewer flowers']
      }
    },
    light: {
      ideal: 'Full sun',
      tolerance: 'Full sun to partial shade',
      tips: [
        'Needs 6+ hours sun',
        'More sun = more flowers',
        'Can handle hot Indian sun',
        'Partial shade = leggy growth'
      ]
    },
    soil: {
      type: 'Well-draining garden soil',
      ph: '6.0-7.5',
      mix: 'Regular garden soil with good drainage'
    },
    humidity: {
      ideal: '40-60%',
      tips: ['Not humidity sensitive', 'Good air circulation prevents diseases', 'Handles dry conditions']
    },
    temperature: {
      ideal: '18-30°C',
      min: 10,
      max: 35,
      indianClimate: 'Perfect for Indian climate. Grows year-round in most regions.'
    },
    fertilizer: {
      type: 'Balanced fertilizer',
      frequency: 'Every 2-3 weeks',
      tips: ['Don\'t over-fertilize - reduces blooms', 'Phosphorus for flowers', 'Compost works well']
    },
    propagation: [
      'Seeds (very easy)',
      'Direct sow or transplant',
      'Self-seeds readily'
    ],
    repotting: 'Annual plant - no repotting needed.',
    pruning: 'Deadhead spent blooms to encourage more flowers.',
    commonPests: ['Aphids', 'Spider mites', 'Slugs'],
    commonDiseases: ['Powdery mildew', 'Root rot', 'Botrytis'],
    troubleshooting: {
      'no flowers': 'Too much nitrogen or not enough sun.',
      'leggy growth': 'Needs more light or pinch tips.',
      'wilting': 'Check water and root health.',
      'white powder on leaves': 'Powdery mildew - improve air circulation.'
    },
    funFacts: [
      'Used in Diwali and festival decorations',
      'Natural pest repellent in gardens',
      'Edible flowers used in cooking',
      'Traditional medicine plant'
    ],
    proTips: [
      'Pinch seedlings for bushier plants',
      'Plant near vegetables to repel pests',
      'Deadhead regularly for continuous blooms',
      'Excellent cut flower'
    ],
    bestFor: ['Beginners', 'Festivals', 'Borders', 'Companion planting']
  },

  'rose': {
    name: 'Rose',
    scientificName: 'Rosa spp.',
    aliases: ['gulab', 'hybrid tea rose', 'climbing rose', 'shrub rose'],
    category: 'flowering',
    difficulty: 'intermediate',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Every 2-3 days in summer, weekly in winter',
      amount: 'Deep watering - 1-2 inches weekly',
      tips: [
        'Water at base, not on leaves',
        'Morning watering prevents disease',
        'Mulch helps retain moisture',
        'Consistent watering prevents stress'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Black spot disease'],
        underwatered: ['Wilting', 'Bud drop', 'Crispy leaves']
      }
    },
    light: {
      ideal: 'Full sun',
      tolerance: 'Full sun (6+ hours)',
      tips: [
        'Morning sun is essential',
        'Afternoon shade ok in hot climates',
        'More sun = more blooms',
        'Good air circulation needed'
      ]
    },
    soil: {
      type: 'Rich, well-draining soil',
      ph: '6.0-6.5',
      mix: '50% garden soil + 30% compost + 20% aged manure'
    },
    humidity: {
      ideal: '50-60%',
      tips: ['Too much humidity causes disease', 'Good air flow essential', 'Avoid overhead watering']
    },
    temperature: {
      ideal: '15-28°C',
      min: 5,
      max: 35,
      indianClimate: 'Does well in most Indian climates. Blooms best in cooler months.'
    },
    fertilizer: {
      type: 'Rose-specific fertilizer',
      frequency: 'Every 2 weeks during growing season',
      tips: ['High phosphorus for blooms', 'Epsom salt helps', 'Banana peels for potassium']
    },
    propagation: [
      'Stem cuttings (semi-hardwood)',
      'Grafting',
      'Air layering'
    ],
    repotting: 'Annually for potted roses in early spring.',
    pruning: 'Prune in late winter/early spring. Remove dead wood and crossing branches.',
    commonPests: ['Aphids', 'Spider mites', 'Thrips', 'Rose chafer'],
    commonDiseases: ['Black spot', 'Powdery mildew', 'Rust', 'Rose mosaic'],
    troubleshooting: {
      'black spots on leaves': 'Fungal disease - remove affected leaves, improve air flow.',
      'no flowers': 'Not enough sun, over-pruning, or nitrogen excess.',
      'yellow leaves': 'Overwatering, nutrient deficiency, or disease.',
      'bud drop': 'Inconsistent watering or extreme temperatures.',
      'white powder': 'Powdery mildew - treat with fungicide.'
    },
    funFacts: [
      'Symbol of love worldwide',
      'Over 30,000 rose varieties exist',
      'Used in perfumes, medicine, and cooking',
      'Fossil evidence shows roses are 35 million years old'
    ],
    proTips: [
      'Prune to outward-facing buds',
      'Deadhead for continuous blooms',
      'Neem oil prevents most diseases',
      'Best planted in dormant season'
    ],
    bestFor: ['Cut flowers', 'Fragrance', 'Traditional gardens', 'Gift plants']
  },

  // ============================================================================
  // HERBS
  // ============================================================================

  'tulsi': {
    name: 'Tulsi',
    scientificName: 'Ocimum tenuiflorum',
    aliases: ['holy basil', 'sacred basil', 'krishna tulsi', 'rama tulsi'],
    category: 'herb',
    difficulty: 'beginner',
    petSafe: true,
    airPurifying: true,
    water: {
      frequency: 'Every 2-3 days',
      amount: 'Keep soil moist but not waterlogged',
      tips: [
        'Water when top inch is dry',
        'Consistent moisture for best growth',
        'Reduce in winter',
        'Don\'t let soil dry completely'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Wilting'],
        underwatered: ['Drooping', 'Crispy leaves', 'Flower drop']
      }
    },
    light: {
      ideal: 'Full sun',
      tolerance: 'Full sun to partial shade',
      tips: [
        'Needs 4-6 hours direct sun',
        'Grows well on sunny windowsills',
        'More sun = more aromatic leaves',
        'Can grow indoors with bright light'
      ]
    },
    soil: {
      type: 'Well-draining, fertile soil',
      ph: '6.0-7.5',
      mix: '60% garden soil + 20% compost + 20% sand'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Tolerates Indian humidity', 'Good drainage prevents issues', 'Mist in dry weather']
    },
    temperature: {
      ideal: '20-35°C',
      min: 10,
      max: 40,
      indianClimate: 'Perfect for all Indian climates. Protect from frost in winters.'
    },
    fertilizer: {
      type: 'Organic compost or balanced fertilizer',
      frequency: 'Monthly',
      tips: ['Light feeder', 'Vermicompost works great', 'Don\'t over-fertilize']
    },
    propagation: [
      'Seeds (easy)',
      'Stem cuttings in water or soil',
      'Self-seeds readily'
    ],
    repotting: 'Annually or when root-bound.',
    pruning: 'Pinch tips regularly for bushier growth. Harvest leaves often.',
    commonPests: ['Aphids', 'Whiteflies', 'Spider mites'],
    commonDiseases: ['Powdery mildew', 'Root rot', 'Fusarium wilt'],
    troubleshooting: {
      'yellow leaves': 'Overwatering or nutrient deficiency.',
      'leggy growth': 'Needs more light and pinching.',
      'no flowers': 'Young plant or needs more sun.',
      'drooping': 'Needs water or root issues.',
      'small leaves': 'Needs fertilizer or more light.'
    },
    funFacts: [
      'Sacred in Hinduism - worshipped daily',
      'Used in Ayurvedic medicine for 5000+ years',
      'Repels mosquitoes and insects',
      'Called "Queen of Herbs"'
    ],
    proTips: [
      'Harvest leaves before flowering for best flavor',
      'Pinch flower buds to extend leaf production',
      'Perfect for balconies and windowsills',
      'Keep near entrance to repel insects'
    ],
    bestFor: ['Indian homes', 'Medicinal use', 'Religious purposes', 'Tea making']
  },

  'mint': {
    name: 'Mint',
    scientificName: 'Mentha spp.',
    aliases: ['pudina', 'spearmint', 'peppermint'],
    category: 'herb',
    difficulty: 'beginner',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Every 1-2 days in summer',
      amount: 'Keep soil consistently moist',
      tips: [
        'Loves moisture - don\'t let dry out',
        'Can grow in water',
        'Mulch helps retain moisture',
        'More water = more leaves'
      ],
      signs: {
        overwatered: ['Root rot', 'Yellow leaves'],
        underwatered: ['Wilting', 'Crispy edges', 'Slow growth']
      }
    },
    light: {
      ideal: 'Partial shade to full sun',
      tolerance: 'Very adaptable',
      tips: [
        'Prefers morning sun, afternoon shade',
        'Can grow in full shade',
        'Direct hot sun can scorch leaves',
        'Grows well indoors'
      ]
    },
    soil: {
      type: 'Rich, moist soil',
      ph: '6.0-7.0',
      mix: '60% potting soil + 40% compost'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Loves humidity', 'Perfect for Indian monsoons', 'Mist regularly in dry periods']
    },
    temperature: {
      ideal: '18-30°C',
      min: 5,
      max: 35,
      indianClimate: 'Grows year-round in most Indian climates. May go dormant in extreme heat.'
    },
    fertilizer: {
      type: 'Compost or balanced liquid fertilizer',
      frequency: 'Monthly',
      tips: ['Light feeder', 'Too much nitrogen reduces flavor', 'Organic fertilizers best']
    },
    propagation: [
      'Stem cuttings in water (easiest)',
      'Root division',
      'Runners spread naturally'
    ],
    repotting: 'Contain in pots - spreads aggressively!',
    pruning: 'Harvest frequently to encourage bushy growth.',
    commonPests: ['Aphids', 'Spider mites', 'Whiteflies'],
    commonDiseases: ['Mint rust', 'Powdery mildew'],
    troubleshooting: {
      'leggy growth': 'Harvest more frequently.',
      'rust spots': 'Fungal disease - remove affected leaves.',
      'no flavor': 'Harvest before flowering, morning is best.',
      'taking over garden': 'Grow in containers to control spread.'
    },
    funFacts: [
      'Over 25 mint species exist',
      'Ancient Egyptians used it in tombs',
      'Repels rodents and insects',
      'Essential in Indian chutneys and drinks'
    ],
    proTips: [
      'Always grow in containers to control spread',
      'Harvest leaves before flowering',
      'Morning harvest has most oils',
      'Grows easily from supermarket cuttings'
    ],
    bestFor: ['Culinary use', 'Beverages', 'Mosquito repellent', 'Container gardening']
  },

  'curry-leaf': {
    name: 'Curry Leaf Plant',
    scientificName: 'Murraya koenigii',
    aliases: ['kadi patta', 'sweet neem', 'kariveppilai', 'karibevu'],
    category: 'herb',
    difficulty: 'intermediate',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Every 2-3 days in summer, weekly in winter',
      amount: 'Keep soil moist but not waterlogged',
      tips: [
        'Consistent moisture for best growth',
        'Reduce watering in winter',
        'Good drainage essential',
        'Yellow leaves = overwatering'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Leaf drop'],
        underwatered: ['Drooping', 'Dry crispy leaves']
      }
    },
    light: {
      ideal: 'Full sun',
      tolerance: 'Full sun to partial shade',
      tips: [
        'Needs 6+ hours direct sun',
        'More sun = more aromatic leaves',
        'Can grow indoors near sunny window',
        'Outdoor planting is ideal'
      ]
    },
    soil: {
      type: 'Well-draining, slightly acidic soil',
      ph: '6.0-7.0',
      mix: '50% garden soil + 25% compost + 25% sand'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Loves Indian humidity', 'Mist in dry winter', 'No humidity concerns in monsoon']
    },
    temperature: {
      ideal: '20-37°C',
      min: 10,
      max: 40,
      indianClimate: 'Native to India. Perfect for all Indian climates except extreme cold.'
    },
    fertilizer: {
      type: 'Nitrogen-rich fertilizer or buttermilk',
      frequency: 'Monthly in growing season',
      tips: ['Iron supplements help', 'Buttermilk water is traditional', 'Avoid over-fertilizing']
    },
    propagation: [
      'Seeds (slow, 2-4 weeks germination)',
      'Root suckers',
      'Semi-hardwood cuttings'
    ],
    repotting: 'Every 2-3 years or when root-bound.',
    pruning: 'Prune to maintain shape. Harvesting leaves is natural pruning.',
    commonPests: ['Citrus psyllid', 'Aphids', 'Scale', 'Caterpillars'],
    commonDiseases: ['Leaf spot', 'Root rot'],
    troubleshooting: {
      'yellow leaves': 'Iron deficiency or overwatering.',
      'no new growth': 'Needs warmth and fertilizer.',
      'leaf drop in winter': 'Normal dormancy - reduce water.',
      'leggy growth': 'Needs more light.',
      'pale leaves': 'Needs iron supplement (rusty nails in soil work!).'
    },
    funFacts: [
      'Essential in South Indian cooking',
      'Leaves most aromatic when fresh',
      'Medicinal uses for diabetes and hair',
      'Cannot be substituted with curry powder'
    ],
    proTips: [
      'Buttermilk water monthly keeps it healthy',
      'Add rusty nail to soil for iron',
      'Fresh leaves far superior to dried',
      'Grows into small tree if left unpruned'
    ],
    bestFor: ['Indian cooking', 'Sunny balconies', 'Kitchen gardens', 'Medicinal use']
  },

  // ============================================================================
  // OUTDOOR / GARDEN PLANTS
  // ============================================================================

  'bougainvillea': {
    name: 'Bougainvillea',
    scientificName: 'Bougainvillea spp.',
    aliases: ['paper flower', 'buganvilla', 'great bougainvillea'],
    category: 'climber',
    difficulty: 'beginner',
    petSafe: true,
    airPurifying: false,
    water: {
      frequency: 'Weekly when established',
      amount: 'Moderate - prefers to dry out between waterings',
      tips: [
        'Drought tolerant once established',
        'Less water = more flowers',
        'Overwatering reduces blooming',
        'Water more in containers'
      ],
      signs: {
        overwatered: ['No flowers', 'Leaf drop', 'Root rot'],
        underwatered: ['Wilting', 'Leaf drop']
      }
    },
    light: {
      ideal: 'Full sun',
      tolerance: 'Full sun only',
      tips: [
        'Needs 6+ hours direct sun',
        'No blooms in shade',
        'Hot, sunny location ideal',
        'South facing wall perfect'
      ]
    },
    soil: {
      type: 'Well-draining soil',
      ph: '5.5-6.0',
      mix: '60% garden soil + 20% sand + 20% compost'
    },
    humidity: {
      ideal: '50-70%',
      tips: ['Handles Indian humidity well', 'Good air circulation needed', 'Too much moisture reduces blooms']
    },
    temperature: {
      ideal: '20-35°C',
      min: 5,
      max: 40,
      indianClimate: 'Perfect for hot Indian climate. Frost sensitive.'
    },
    fertilizer: {
      type: 'High-phosphorus bloom fertilizer',
      frequency: 'Monthly during growing season',
      tips: ['Low nitrogen for more blooms', 'Bone meal works great', 'Stop in winter']
    },
    propagation: [
      'Hardwood cuttings (best)',
      'Semi-hardwood cuttings',
      'Air layering'
    ],
    repotting: 'Every 3-4 years. Likes to be slightly root-bound.',
    pruning: 'Prune after flowering. Can be pruned hard.',
    commonPests: ['Aphids', 'Caterpillars', 'Mealybugs'],
    commonDiseases: ['Leaf spot', 'Root rot'],
    troubleshooting: {
      'no flowers': 'Too much water, shade, or nitrogen. Stress it!',
      'all leaves no blooms': 'Reduce watering and nitrogen fertilizer.',
      'leaf drop': 'Normal in seasonal change or overwatering.',
      'thorns but no flowers': 'Needs more sun and less water.'
    },
    funFacts: [
      'Colorful "petals" are actually bracts',
      'True flowers are tiny white ones inside',
      'Named after French explorer Bougainville',
      'Can be trained as bonsai'
    ],
    proTips: [
      'Stress triggers blooming - let it dry out',
      'Hard pruning after flowering encourages new blooms',
      'Train on walls, pergolas, or as hedge',
      'Paper-like bracts last for months'
    ],
    bestFor: ['Hot climates', 'Walls and fences', 'Hedges', 'Balcony color']
  },

  'croton': {
    name: 'Croton',
    scientificName: 'Codiaeum variegatum',
    aliases: ['garden croton', 'variegated laurel', 'joseph\'s coat'],
    category: 'outdoor',
    difficulty: 'intermediate',
    petSafe: false,
    airPurifying: false,
    water: {
      frequency: 'Every 3-4 days in summer, weekly in winter',
      amount: 'Keep soil consistently moist',
      tips: [
        'Never let soil dry completely',
        'Loves humidity with watering',
        'Reduce in winter',
        'Mist leaves regularly'
      ],
      signs: {
        overwatered: ['Yellow leaves', 'Root rot', 'Leaf drop'],
        underwatered: ['Drooping', 'Leaf drop', 'Color fading']
      }
    },
    light: {
      ideal: 'Bright indirect to full sun',
      tolerance: 'Medium to bright',
      tips: [
        'More light = more vibrant colors',
        'Can handle some direct sun',
        'Low light causes green leaves',
        'East or South facing ideal'
      ]
    },
    soil: {
      type: 'Rich, well-draining soil',
      ph: '4.5-6.5',
      mix: '60% potting soil + 20% perlite + 20% compost'
    },
    humidity: {
      ideal: '60-80%',
      tips: [
        'Loves high humidity',
        'Mist frequently',
        'Pebble tray helps',
        'Groups with other plants'
      ]
    },
    temperature: {
      ideal: '15-30°C',
      min: 10,
      max: 35,
      indianClimate: 'Thrives in Indian climate. Protect from cold winds.'
    },
    fertilizer: {
      type: 'Balanced liquid fertilizer',
      frequency: 'Monthly in growing season',
      tips: ['Dilute to half-strength', 'Stop in winter', 'Over-fertilizing causes burn']
    },
    propagation: [
      'Stem cuttings in water or soil',
      'Air layering',
      'Pro tip: Use rooting hormone'
    ],
    repotting: 'Every 2-3 years or when root-bound.',
    pruning: 'Prune to maintain shape and encourage bushiness.',
    commonPests: ['Mealybugs', 'Spider mites', 'Scale', 'Thrips'],
    commonDiseases: ['Root rot', 'Leaf spot', 'Powdery mildew'],
    troubleshooting: {
      'leaf drop': 'Environmental stress - temperature, drafts, or watering change.',
      'fading colors': 'Needs more light.',
      'brown leaf edges': 'Low humidity or underwatering.',
      'leggy growth': 'Needs more light and pruning.',
      'green new leaves': 'Normal - colors develop with age and light.'
    },
    funFacts: [
      'Over 100 varieties with different colors',
      'Sap is toxic - wear gloves when handling',
      'Colors include red, yellow, orange, green',
      'Native to Malaysia and Pacific islands'
    ],
    proTips: [
      'Hates being moved - pick a spot and keep it there',
      'Clean leaves for vibrant colors',
      'Perfect hedge plant in gardens',
      'Dramatic focal point plant'
    ],
    bestFor: ['Color in gardens', 'Hedges', 'Tropical landscapes', 'Containers']
  },

  'areca-palm': {
    name: 'Areca Palm',
    scientificName: 'Dypsis lutescens',
    aliases: ['butterfly palm', 'golden cane palm', 'yellow palm', 'bamboo palm'],
    category: 'indoor',
    difficulty: 'intermediate',
    petSafe: true,
    airPurifying: true,
    water: {
      frequency: 'Every 5-7 days',
      amount: 'Keep soil slightly moist',
      tips: [
        'Water when top inch is dry',
        'Use filtered water if possible',
        'Sensitive to fluoride and chlorine',
        'Reduce watering in winter'
      ],
      signs: {
        overwatered: ['Yellow fronds', 'Root rot', 'Brown leaf tips'],
        underwatered: ['Brown tips', 'Crispy fronds', 'Drooping']
      }
    },
    light: {
      ideal: 'Bright indirect light',
      tolerance: 'Medium to bright',
      tips: [
        'Avoid direct sun - causes leaf burn',
        'Too little light = slow growth',
        'East or West window ideal',
        'Can grow in artificial light'
      ]
    },
    soil: {
      type: 'Well-draining potting mix',
      ph: '6.1-6.5',
      mix: '60% potting soil + 20% perlite + 20% sand'
    },
    humidity: {
      ideal: '50-70%',
      tips: [
        'Loves humidity',
        'Mist regularly',
        'Brown tips indicate low humidity',
        'Great for bathrooms'
      ]
    },
    temperature: {
      ideal: '16-27°C',
      min: 10,
      max: 35,
      indianClimate: 'Does well in Indian climate. Keep away from AC drafts.'
    },
    fertilizer: {
      type: 'Palm-specific or balanced fertilizer',
      frequency: 'Monthly in growing season',
      tips: ['Dilute to half-strength', 'Needs magnesium', 'Skip in winter']
    },
    propagation: [
      'Seed germination',
      'Division of clumps',
      'Note: Division is stressful for plant'
    ],
    repotting: 'Every 2-3 years. Go up one pot size only.',
    pruning: 'Remove only brown/dead fronds at base. Don\'t over-prune.',
    commonPests: ['Spider mites', 'Mealybugs', 'Scale', 'Whiteflies'],
    commonDiseases: ['Root rot', 'Leaf spot'],
    troubleshooting: {
      'brown tips': 'Low humidity, fluoride in water, or underwatering.',
      'yellow fronds': 'Overwatering or natural aging (lowest fronds).',
      'brown spots': 'Leaf spot disease or fertilizer burn.',
      'slow growth': 'Needs more light or fertilizer.',
      'pale fronds': 'Too much light or nutrient deficiency.'
    },
    funFacts: [
      'NASA-approved air purifier',
      'Can release 1 liter of water vapor per day',
      'Originally from Madagascar',
      'One of the most popular indoor palms'
    ],
    proTips: [
      'Use rainwater or filtered water for best results',
      'Wipe fronds monthly to remove dust',
      'Perfect natural humidifier',
      'Cluster multiple plants for tropical effect'
    ],
    bestFor: ['Living rooms', 'Air purification', 'Tropical decor', 'Pet-friendly homes']
  },
};

// ============================================================================
// PROBLEM DIAGNOSIS DATABASE
// ============================================================================

export interface PlantProblem {
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string[];
  urgency: 'low' | 'medium' | 'high';
}

export const PLANT_PROBLEMS: Record<string, PlantProblem> = {
  'yellow-leaves': {
    symptoms: ['Leaves turning yellow', 'Yellow spots on leaves', 'Lower leaves yellowing'],
    causes: [
      'Overwatering (most common)',
      'Underwatering',
      'Nutrient deficiency (nitrogen)',
      'Too much direct sunlight',
      'Natural aging of older leaves',
      'Root bound plant',
      'Temperature stress'
    ],
    solutions: [
      'Check soil moisture - if wet, let it dry before watering again',
      'If soil is bone dry, water thoroughly',
      'Feed with balanced fertilizer if nutrient issue',
      'Move away from direct sun if leaves are also crispy',
      'Remove yellow leaves to redirect energy'
    ],
    prevention: [
      'Establish consistent watering schedule',
      'Check soil before watering',
      'Ensure proper drainage',
      'Fertilize during growing season'
    ],
    urgency: 'medium'
  },

  'brown-tips': {
    symptoms: ['Brown crispy leaf tips', 'Brown edges on leaves', 'Leaf margins turning brown'],
    causes: [
      'Low humidity',
      'Underwatering',
      'Fluoride/chlorine in tap water',
      'Over-fertilizing (salt buildup)',
      'Too much direct sun',
      'Root damage'
    ],
    solutions: [
      'Increase humidity - mist, pebble tray, or humidifier',
      'Water more consistently',
      'Switch to filtered or rainwater',
      'Flush soil to remove salt buildup',
      'Move to indirect light'
    ],
    prevention: [
      'Use filtered water',
      'Maintain 50%+ humidity',
      'Don\'t let soil completely dry out',
      'Dilute fertilizer to half-strength'
    ],
    urgency: 'low'
  },

  'wilting-drooping': {
    symptoms: ['Drooping leaves', 'Wilting plant', 'Limp stems', 'Plant looks sad'],
    causes: [
      'Underwatering (most common)',
      'Overwatering (root rot)',
      'Temperature shock',
      'Transplant shock',
      'Root bound',
      'Pest infestation'
    ],
    solutions: [
      'Check soil - if dry, water thoroughly',
      'If soil is wet, check roots for rot',
      'If root rot present, trim rotted roots and repot in fresh soil',
      'Move away from drafts or heat sources',
      'Give newly repotted plants time to recover'
    ],
    prevention: [
      'Consistent watering schedule',
      'Good drainage',
      'Avoid extreme temperature changes',
      'Repot gradually'
    ],
    urgency: 'medium'
  },

  'root-rot': {
    symptoms: ['Mushy brown/black roots', 'Foul smell from soil', 'Yellow leaves', 'Wilting despite wet soil'],
    causes: [
      'Overwatering',
      'Poor drainage',
      'Pot without drainage holes',
      'Heavy soil that retains water',
      'Low light reduces water uptake'
    ],
    solutions: [
      'Remove plant from pot immediately',
      'Trim all mushy/black roots with sterile scissors',
      'Let roots dry for a few hours',
      'Repot in fresh, well-draining soil',
      'Use pot with drainage holes',
      'Reduce watering significantly'
    ],
    prevention: [
      'Never let plant sit in water',
      'Always use pots with drainage',
      'Use well-draining soil mix',
      'Water only when soil is appropriately dry'
    ],
    urgency: 'high'
  },

  'leggy-growth': {
    symptoms: ['Stretched out stems', 'Sparse leaves', 'Plant reaching toward light', 'Long gaps between leaves'],
    causes: [
      'Insufficient light',
      'Natural growth pattern',
      'Over-fertilizing with nitrogen',
      'Not pruning enough'
    ],
    solutions: [
      'Move to brighter location',
      'Prune back leggy stems to encourage bushiness',
      'Rotate plant regularly',
      'Reduce nitrogen in fertilizer'
    ],
    prevention: [
      'Provide adequate light for your plant type',
      'Regular pruning/pinching',
      'Rotate plants quarterly'
    ],
    urgency: 'low'
  },

  'pest-infestation': {
    symptoms: ['Tiny bugs on leaves', 'Sticky residue', 'White cottony masses', 'Webbing on leaves', 'Distorted new growth'],
    causes: [
      'Brought in on new plants',
      'Open windows',
      'Weakened plant immune system',
      'Dry conditions (spider mites)',
      'Poor air circulation'
    ],
    solutions: [
      'Isolate infected plant immediately',
      'Spray with neem oil solution (5ml neem + 1L water + few drops dish soap)',
      'For mealybugs: dab with alcohol-soaked cotton',
      'Shower plant to remove pests',
      'Repeat treatment weekly for 3-4 weeks'
    ],
    prevention: [
      'Quarantine new plants for 2 weeks',
      'Regular inspection of plants',
      'Maintain good humidity (discourages spider mites)',
      'Clean leaves regularly'
    ],
    urgency: 'high'
  },

  'no-flowers': {
    symptoms: ['Plant won\'t bloom', 'No flower buds', 'Buds dropping before opening'],
    causes: [
      'Insufficient light',
      'Too much nitrogen fertilizer',
      'Plant too young',
      'Wrong season',
      'Environmental stress',
      'Needs dormancy period'
    ],
    solutions: [
      'Move to brighter location',
      'Switch to phosphorus-rich fertilizer',
      'Be patient - some plants need maturity',
      'Research your plant\'s blooming season',
      'Some plants need cool period to bloom'
    ],
    prevention: [
      'Match light requirements',
      'Use appropriate fertilizer ratio',
      'Understand your plant\'s natural cycle'
    ],
    urgency: 'low'
  },

  'leaf-spots': {
    symptoms: ['Brown or black spots on leaves', 'Circular spots', 'Spots with yellow halos'],
    causes: [
      'Fungal infection',
      'Bacterial infection',
      'Water splashing on leaves',
      'Overwatering',
      'Poor air circulation'
    ],
    solutions: [
      'Remove affected leaves',
      'Improve air circulation',
      'Water at soil level, not on leaves',
      'Apply neem oil or fungicide',
      'Reduce watering'
    ],
    prevention: [
      'Water at base of plant',
      'Morning watering so leaves dry',
      'Space plants for air flow',
      'Don\'t overhead water'
    ],
    urgency: 'medium'
  },

  'mealybugs': {
    symptoms: ['White cottony masses', 'Sticky honeydew', 'Stunted growth', 'Found in leaf joints and under leaves'],
    causes: [
      'Infected new plant',
      'Attracted to weak plants',
      'Spread from other infested plants'
    ],
    solutions: [
      'Isolate plant immediately',
      'Dab mealybugs with alcohol-soaked cotton swab',
      'Spray with neem oil or insecticidal soap',
      'For severe cases, systemic insecticide',
      'Repeat treatment every 7 days for 3-4 weeks'
    ],
    prevention: [
      'Inspect new plants before bringing home',
      'Regular plant inspection',
      'Keep plants healthy with proper care'
    ],
    urgency: 'high'
  },

  'spider-mites': {
    symptoms: ['Fine webbing on leaves', 'Tiny dots on leaf undersides', 'Yellow speckling on leaves', 'Leaves looking dusty'],
    causes: [
      'Dry air conditions',
      'Hot weather',
      'Weak plant',
      'Spread from infested plants'
    ],
    solutions: [
      'Increase humidity immediately',
      'Shower plant with water to dislodge mites',
      'Apply neem oil spray',
      'Wipe leaves with damp cloth regularly',
      'For severe cases: miticide'
    ],
    prevention: [
      'Maintain humidity above 50%',
      'Regular misting',
      'Wipe leaves clean',
      'Quarantine new plants'
    ],
    urgency: 'high'
  },

  'aphids': {
    symptoms: ['Small green/black bugs clustered on new growth', 'Sticky honeydew', 'Curled or distorted leaves', 'Black sooty mold'],
    causes: [
      'Attracted to tender new growth',
      'Brought in from outside',
      'Over-fertilizing with nitrogen'
    ],
    solutions: [
      'Blast off with strong water spray',
      'Apply neem oil or insecticidal soap',
      'Introduce ladybugs (natural predator)',
      'Wipe off with soapy water',
      'Prune heavily infested areas'
    ],
    prevention: [
      'Regular inspection of new growth',
      'Avoid excessive nitrogen fertilizer',
      'Encourage beneficial insects in garden'
    ],
    urgency: 'medium'
  },

  'fungal-gnats': {
    symptoms: ['Tiny flies hovering near soil', 'Small black flies when watering', 'Larvae in soil'],
    causes: [
      'Overwatering',
      'Moist soil conditions',
      'Organic matter in soil',
      'Came with potting mix'
    ],
    solutions: [
      'Let soil dry out completely between waterings',
      'Add sand/perlite layer on top of soil',
      'Use yellow sticky traps',
      'Apply neem oil drench to soil',
      'Consider beneficial nematodes for severe cases'
    ],
    prevention: [
      'Don\'t overwater',
      'Let top inch of soil dry',
      'Use well-draining soil',
      'Bottom water instead of top watering'
    ],
    urgency: 'medium'
  }
};

// ============================================================================
// SEASONAL CARE TIPS (Indian Climate)
// ============================================================================

export const SEASONAL_CARE = {
  summer: {
    months: ['March', 'April', 'May', 'June'],
    generalTips: [
      'Increase watering frequency - plants dry out faster',
      'Move sensitive plants away from harsh afternoon sun',
      'Mulch outdoor plants to retain moisture',
      'Water early morning or late evening to reduce evaporation',
      'Group humidity-loving plants together',
      'Provide shade cloth for delicate outdoor plants',
      'Check for spider mites - they love hot, dry conditions'
    ],
    problems: ['Sunburn', 'Dehydration', 'Spider mites', 'Heat stress'],
    opportunities: ['Perfect for propagation', 'Good time to fertilize', 'Outdoor plants thrive']
  },
  monsoon: {
    months: ['July', 'August', 'September'],
    generalTips: [
      'Reduce watering - humidity is high',
      'Ensure excellent drainage to prevent root rot',
      'Protect outdoor plants from waterlogging',
      'Watch for fungal diseases - increase air circulation',
      'Perfect time to take cuttings - high humidity helps rooting',
      'Move sensitive plants under cover during heavy rain',
      'Reduce fertilizing - growth may slow'
    ],
    problems: ['Root rot', 'Fungal infections', 'Waterlogging', 'Pest increase'],
    opportunities: ['Natural humidity helps plants', 'Great for propagation', 'Rainwater collection']
  },
  autumn: {
    months: ['October', 'November'],
    generalTips: [
      'Gradually reduce watering as temperatures drop',
      'Last chance to fertilize before winter',
      'Perfect time to repot plants',
      'Clean up dead foliage and debris',
      'Prepare tender plants for winter',
      'Pest activity may increase - inspect regularly',
      'Ideal weather for most plants'
    ],
    problems: ['Pest migrations indoors', 'Temperature fluctuations'],
    opportunities: ['Best weather for plants', 'Repotting season', 'New plantings establish well']
  },
  winter: {
    months: ['December', 'January', 'February'],
    generalTips: [
      'Reduce watering significantly - most plants dormant',
      'Stop fertilizing - plants are resting',
      'Protect tender plants from cold nights',
      'Move plants away from cold windows',
      'Increase light exposure - sun is weaker',
      'Watch for dry air from heaters',
      'Perfect time for pruning deciduous plants'
    ],
    problems: ['Cold damage', 'Dry air', 'Overwatering during dormancy'],
    opportunities: ['Rest period for plants', 'Planning season', 'Pruning time']
  }
};

// ============================================================================
// CONVERSATIONAL PATTERNS
// ============================================================================

export const PLANTSY_PERSONALITY = {
  greetings: [
    "Hey there, plant friend! 🌱 What can I help you grow today?",
    "Hello! Plantsy here, ready to dig into your plant questions! 🪴",
    "Hi! Your friendly neighborhood plant doctor is in! What's growing on?",
    "Namaste! 🌿 Ready to help your green babies thrive!",
    "Hey plant parent! What's blooming in your world today?"
  ],

  acknowledgments: [
    "Great question!",
    "Ah, I get this a lot!",
    "Let me think about this...",
    "Interesting situation!",
    "I've got you covered!",
    "Here's what I know:"
  ],

  encouragements: [
    "You've got this! Plants are forgiving. 🌱",
    "Don't worry - most plant problems are fixable!",
    "Remember, every plant parent has killed a plant or two. It's part of the journey!",
    "With a little patience, your plant will bounce back!",
    "You're already being a great plant parent by asking questions!"
  ],

  closings: [
    "Hope that helps! Let me know if you need anything else. 🌿",
    "Happy growing! Come back anytime you need plant advice!",
    "May your plants always be thriving! 🪴",
    "Keep nurturing those green babies! I'm here if you need me.",
    "Good luck with your plant journey! Remember, I'm just a message away!"
  ],

  unknownResponses: [
    "Hmm, that's a tricky one! Could you tell me more about your plant and the symptoms?",
    "I want to help, but I need a bit more info. What kind of plant is it, and what's happening?",
    "Let me help you troubleshoot! Can you describe what the plant looks like and how you've been caring for it?",
    "Every plant is unique! Tell me more about the situation, and I'll do my best to help."
  ],

  funFacts: [
    "Did you know? Talking to plants isn't crazy - the CO2 you exhale actually helps them! 🌱",
    "Fun fact: A single tree can absorb up to 48 pounds of CO2 per year!",
    "Here's something cool: Plants can 'hear' water and grow their roots toward it!",
    "Did you know houseplants can boost your mood and reduce stress? Science says so!",
    "Fun fact: The tallest known tree is a coast redwood at 380 feet tall!"
  ]
};

// ============================================================================
// QUICK RESPONSE PATTERNS
// ============================================================================

export const QUICK_PATTERNS: Record<string, string> = {
  'hello|hi|hey|namaste': 'greeting',
  'thank|thanks|appreciate': 'thanks',
  'bye|goodbye|see you': 'farewell',
  'how.*water|watering|when.*water': 'watering',
  'yellow.*leaves|leaves.*yellow': 'yellow-leaves',
  'brown.*tips|tips.*brown|edges.*brown': 'brown-tips',
  'drooping|wilting|sad': 'wilting',
  'bugs|pests|insects': 'pests',
  'white.*fluffy|cotton|mealybug': 'mealybugs',
  'tiny.*spider|web.*leaves|spider.*mite': 'spider-mites',
  'root.*rot|mushy.*root': 'root-rot',
  'no.*flower|won\'t.*bloom|not.*blooming': 'no-flowers',
  'propagat|cutting|multiply': 'propagation',
  'repot|change.*pot|bigger.*pot': 'repotting',
  'fertiliz|feed|nutrient': 'fertilizing',
  'sunlight|light|bright|dark|shade': 'lighting',
  'beginner|easy|simple|low.*maintenance': 'beginner-plants',
  'pet.*safe|cat|dog|toxic': 'pet-safety',
  'air.*purif|clean.*air': 'air-purifying',
  'summer|hot|heat': 'summer-care',
  'monsoon|rain|humidity': 'monsoon-care',
  'winter|cold': 'winter-care',
  'indoor|inside|home': 'indoor-plants',
  'outdoor|outside|garden|balcony': 'outdoor-plants',
  'bangalore|india|indian': 'indian-climate'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function findPlantByName(query: string): PlantCareInfo | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  for (const [key, plant] of Object.entries(PLANT_DATABASE)) {
    if (normalizedQuery.includes(key.replace(/-/g, ' ')) ||
        normalizedQuery.includes(plant.name.toLowerCase()) ||
        normalizedQuery.includes(plant.scientificName.toLowerCase()) ||
        plant.aliases.some(alias => normalizedQuery.includes(alias.toLowerCase()))) {
      return plant;
    }
  }
  return null;
}

export function findPlantsByCategory(category: PlantCareInfo['category']): PlantCareInfo[] {
  return Object.values(PLANT_DATABASE).filter(plant => plant.category === category);
}

export function findBeginnerPlants(): PlantCareInfo[] {
  return Object.values(PLANT_DATABASE).filter(plant => plant.difficulty === 'beginner');
}

export function findPetSafePlants(): PlantCareInfo[] {
  return Object.values(PLANT_DATABASE).filter(plant => plant.petSafe === true);
}

export function findAirPurifyingPlants(): PlantCareInfo[] {
  return Object.values(PLANT_DATABASE).filter(plant => plant.airPurifying === true);
}

export function diagnoseProblem(symptoms: string): PlantProblem | null {
  const normalizedSymptoms = symptoms.toLowerCase();
  
  for (const [key, problem] of Object.entries(PLANT_PROBLEMS)) {
    if (problem.symptoms.some(symptom => normalizedSymptoms.includes(symptom.toLowerCase())) ||
        normalizedSymptoms.includes(key.replace(/-/g, ' '))) {
      return problem;
    }
  }
  return null;
}

export function getCurrentSeason(): keyof typeof SEASONAL_CARE {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 5) return 'summer';
  if (month >= 6 && month <= 8) return 'monsoon';
  if (month >= 9 && month <= 10) return 'autumn';
  return 'winter';
}
