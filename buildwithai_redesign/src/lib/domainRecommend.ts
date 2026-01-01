import { estimatePricing } from "./pricingFallback";
import rdap from "./rdap";

export type DomainRecommendation = {
  domain: string;
  reason: string;
  similarity: number;
  suggestedUse?: string;
  price?: number | null;
  availability?: boolean | null;
};

function extractBrandAndTld(domain: string) {
  const lower = domain.toLowerCase();
  const parts = lower.split(".");
  if (parts.length < 2) return { brand: lower, tld: "" };

  const tld = parts.slice(1).join(".");
  const brand = parts[0];
  return { brand, tld };
}

export async function generateDomainRecommendations(baseDomain: string): Promise<DomainRecommendation[]> {
  const { brand, tld } = extractBrandAndTld(baseDomain);
  const recs: DomainRecommendation[] = [];

  const push = (d: string, reason: string, similarity: number, suggestedUse?: string) => {
    if (d.toLowerCase() === baseDomain.toLowerCase()) return;
    const pricing = estimatePricing(d);
    const price = pricing && typeof pricing === 'object' ? pricing.price ?? null : (typeof pricing === 'number' ? pricing : null);
    recs.push({ domain: d, reason, similarity, suggestedUse, price, availability: null });
  };

  if (brand) {
    push(`get${brand}.${tld || "com"}`, "Action-oriented brand variant", 0.9, "Landing page");
    push(`try${brand}.${tld || "com"}`, "Experimentation/early-stage variant", 0.85, "Beta/SaaS");
    push(`${brand}app.${tld || "com"}`, "App-focused naming", 0.8, "Product/app site");
    push(`${brand}hq.${tld || "com"}`, "Headquarters-style variant", 0.8, "Main company site");
    push(`${brand}studio.${tld || "studio"}`, "Creative/agency feeling", 0.75, "Creative portfolio");
    push(`${brand}.ai`, "AI-forward positioning", 0.7, "AI products/services");

    // Add a couple of theme-specific TLDs
    push(`${brand}.dev`, "Developer/tech positioning", 0.7, "Developer docs / product");
    push(`${brand}.studio`, "Studio/creative positioning", 0.65, "Portfolio / studio site");
  }

  // Perform live RDAP availability checks in parallel (best-effort)
  const availabilityChecks = recs.map(async (r) => {
    try {
      const data = await rdap.fetchRdap(r.domain)
      const norm = rdap.normalizeToCanonical(data)
      r.availability = typeof norm.registered === 'boolean' ? !norm.registered : null
    } catch (e) {
      r.availability = null
    }
  })

  await Promise.all(availabilityChecks)
  return recs
}

export default generateDomainRecommendations;
