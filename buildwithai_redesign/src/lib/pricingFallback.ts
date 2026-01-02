type TldPricingConfig = {
  price: number;
  category: 'standard' | 'premium' | 'budget' | 'ccTld' | 'niche';
  notes?: string;
};

const TLD_PRICING_TABLE: Record<string, TldPricingConfig> = {
  // Standard gTLDs
  com: { price: 14, category: 'standard', notes: 'Most common global TLD.' },
  net: { price: 14, category: 'standard' },
  org: { price: 14, category: 'standard' },

  // Tech / startup / dev
  dev: { price: 30, category: 'niche', notes: 'Developer-focused TLD.' },
  app: { price: 25, category: 'niche' },
  tech: { price: 30, category: 'niche' },
  io: { price: 60, category: 'premium', notes: 'Popular with startups/dev.' },
  ai: { price: 70, category: 'premium', notes: 'AI-focused, often premium.' },

  // Budget / marketing
  xyz: { price: 3, category: 'budget' },
  online: { price: 5, category: 'budget' },
  site: { price: 4, category: 'budget' },

  // Creative / agency
  studio: { price: 25, category: 'niche' },
  design: { price: 25, category: 'niche' },
  agency: { price: 25, category: 'niche' },
  digital: { price: 20, category: 'niche' },

  // ccTLDs (examples)
  'co.nz': { price: 28, category: 'ccTld' },
  nz: { price: 25, category: 'ccTld' },
  uk: { price: 20, category: 'ccTld' },
  co: { price: 25, category: 'ccTld' },
  de: { price: 18, category: 'ccTld' },
  fr: { price: 18, category: 'ccTld' },
  jp: { price: 25, category: 'ccTld' },
  ca: { price: 20, category: 'ccTld' },
  au: { price: 22, category: 'ccTld' },

  // More niche / brand TLDs
  cloud: { price: 40, category: 'niche' },
  ai_cc: { price: 70, category: 'premium' },
  shop: { price: 20, category: 'niche' },
  store: { price: 20, category: 'niche' },
  finance: { price: 45, category: 'niche' },
  crypto: { price: 50, category: 'niche' },
  eth: { price: 80, category: 'premium' },
  wallet: { price: 40, category: 'niche' },
};

function extractTld(domain: string) {
  const lower = domain.toLowerCase();
  const parts = lower.split('.');
  if (parts.length <= 1) return '';
  const lastTwo = parts.slice(-2).join('.');
  if (TLD_PRICING_TABLE[lastTwo]) return lastTwo;
  return parts[parts.length - 1];
}

export function estimatePricing(domain: string) {
  const tld = extractTld(domain);
  const fallbackPrice = 20;
  const cfg = tld ? TLD_PRICING_TABLE[tld] : undefined;

  const price = cfg?.price ?? fallbackPrice;
  const category = cfg?.category ?? 'standard';
  const notes = cfg?.notes ?? (tld ? `Estimated pricing for .${tld}` : 'Generic estimated pricing');

  return {
    price,
    estimated: true,
    tld,
    category,
    notes,
  };
}

export default { estimatePricing };
