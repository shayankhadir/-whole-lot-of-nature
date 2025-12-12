/**
 * Loyalty Points System Types
 * Manages user loyalty tiers, points, and benefits
 */

/**
 * Loyalty Tier Definition
 * Bronze → Silver → Gold → Platinum progression
 */
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

/**
 * User Loyalty Points Record
 * Stores all loyalty information for a customer
 */
export interface LoyaltyPointsRecord {
  id: string;
  userId: number | string;
  email?: string;
  pointsBalance: number;
  pointsLifetime: number; // Total points earned ever
  currentTier: LoyaltyTier;
  tierStartDate: Date;
  tierProgressToNext: number; // 0-100 percentage
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tier Benefits Configuration
 */
export interface TierBenefits {
  tier: LoyaltyTier;
  minPoints: number;
  maxPoints: number;
  discountPercentage: number; // Applied on purchases
  freeshippingAbove: number; // Free shipping threshold
  pointsMultiplier: number; // 1.0 = normal, 1.5 = 50% bonus
  exclusivePerks: string[];
  badges: string[];
  birthday_discount_percentage?: number;
}

/**
 * Loyalty Transaction
 * Record of points earned or spent
 */
export interface LoyaltyTransaction {
  id: string;
  userId: string | number;
  type: 'earn' | 'redeem' | 'adjustment' | 'tier-upgrade' | 'expiry';
  points: number; // Positive for earn, negative for redeem
  reason: string; // "Purchase", "Referral", "Birthday", "Redeem coupon", etc.
  orderId?: string | number;
  relatedData?: Record<string, unknown>;
  createdAt: Date;
  expiresAt?: Date; // Some points may expire after period
}

/**
 * Redemption Option
 * What customers can redeem points for
 */
export interface RedemptionOption {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  value: number; // In rupees
  category: 'discount' | 'product' | 'shipping' | 'experience';
  available: boolean;
  terms?: string;
  icon?: string;
}

/**
 * Loyalty Status
 * Current status of user's loyalty account
 */
export interface LoyaltyStatus {
  user: LoyaltyPointsRecord;
  currentTierBenefits: TierBenefits;
  nextTierBenefits?: TierBenefits;
  pointsToNextTier: number;
  recentTransactions: LoyaltyTransaction[];
  availableRedemptions: RedemptionOption[];
}

/**
 * Tier Configuration
 * Complete tier hierarchy with benefits
 */
export const TIER_CONFIG: Record<LoyaltyTier, TierBenefits> = {
  bronze: {
    tier: 'bronze',
    minPoints: 0,
    maxPoints: 499,
    discountPercentage: 0,
    freeshippingAbove: 150,
    pointsMultiplier: 1.0,
    exclusivePerks: ['Access to sales', 'Email updates'],
    badges: ['Bronze Member'],
  },
  silver: {
    tier: 'silver',
    minPoints: 500,
    maxPoints: 1999,
    discountPercentage: 5,
    freeshippingAbove: 100,
    pointsMultiplier: 1.25,
    exclusivePerks: ['5% discount on all purchases', 'Free shipping above ₹100', 'Early sale access'],
    badges: ['Silver Member', 'Trusted Buyer'],
  },
  gold: {
    tier: 'gold',
    minPoints: 2000,
    maxPoints: 4999,
    discountPercentage: 10,
    freeshippingAbove: 50,
    pointsMultiplier: 1.5,
    exclusivePerks: [
      '10% discount on all purchases',
      'Free shipping above ₹50',
      'Early access to new products',
      'Priority customer support',
      'Birthday gift',
    ],
    badges: ['Gold Member', 'VIP'],
  },
  platinum: {
    tier: 'platinum',
    minPoints: 5000,
    maxPoints: Infinity,
    discountPercentage: 15,
    freeshippingAbove: 0, // Always free shipping
    pointsMultiplier: 2.0,
    exclusivePerks: [
      '15% discount on all purchases',
      'Free shipping on all orders',
      'VIP customer support',
      'Exclusive products access',
      'Birthday gift + bonus points',
      'Quarterly rewards',
      'Personal shopping assistant',
    ],
    badges: ['Platinum Member', 'VIP Elite', 'Exclusive'],
    birthday_discount_percentage: 20,
  },
};

/**
 * Points Earning Rules
 */
export const EARNING_RULES = {
  PURCHASE_POINTS_PER_RUPEE: 1, // 1 point per ₹1 spent
  REFERRAL_BONUS: 100, // Points for successful referral
  REVIEW_BONUS: 25, // Points for leaving a review
  FIRST_PURCHASE_BONUS: 50, // Bonus on first order
  BIRTHDAY_BONUS: 100, // Birthday bonus
  SOCIAL_SHARE_BONUS: 10, // For sharing products
} as const;

/**
 * Points Redemption Rules
 */
export const REDEMPTION_RULES = {
  MIN_POINTS_TO_REDEEM: 50,
  POINTS_PER_RUPEE_DISCOUNT: 50, // 50 points = ₹1 discount
  EXPIRY_DAYS: 365, // Points expire after 1 year of inactivity
  TIER_DOWNGRADE_DAYS: 90, // Downgrade tier after 90 days of no activity
} as const;

/**
 * UI Redemption Options
 * What users can redeem their points for
 */
export const REDEMPTION_OPTIONS: RedemptionOption[] = [
  {
    id: 'discount-100',
    name: '₹10 Off',
    description: 'Get ₹10 discount on your next purchase',
    pointsCost: 500,
    value: 10,
    category: 'discount',
    available: true,
  },
  {
    id: 'discount-250',
    name: '₹25 Off',
    description: 'Get ₹25 discount on your next purchase',
    pointsCost: 1250,
    value: 25,
    category: 'discount',
    available: true,
  },
  {
    id: 'discount-500',
    name: '₹50 Off',
    description: 'Get ₹50 discount on your next purchase',
    pointsCost: 2500,
    value: 50,
    category: 'discount',
    available: true,
  },
  {
    id: 'shipping-free',
    name: 'Free Shipping',
    description: 'Free shipping on your next order',
    pointsCost: 300,
    value: 0,
    category: 'shipping',
    available: true,
  },
  {
    id: 'exclusive-seed-pack',
    name: 'Exclusive Seed Pack',
    description: 'Get exclusive seed pack worth ₹299',
    pointsCost: 3000,
    value: 299,
    category: 'product',
    available: true,
  },
  {
    id: 'premium-guide',
    name: 'Premium Growing Guide',
    description: 'Digital premium growing guide (PDF)',
    pointsCost: 500,
    value: 99,
    category: 'experience',
    available: true,
  },
];

/**
 * API Response Types
 */
export interface LoyaltyAPIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AddPointsRequest {
  userId: string | number;
  points: number;
  reason: string;
  orderId?: string | number;
}

export interface RedeemPointsRequest {
  userId: string | number;
  pointsToRedeem: number;
  redemptionOptionId: string;
}

export interface GetLoyaltyStatusRequest {
  userId: string | number;
  email?: string;
}
