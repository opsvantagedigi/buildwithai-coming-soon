import { estimatePricing } from "./pricingFallback";
import rdap from "./rdap";
import { checkDomainAvailability } from './domainAvailability'

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
  return recs
}

export default generateDomainRecommendations;

export async function enrichRecommendationsWithAvailability(recs: DomainRecommendation[]) {
  const checks = await Promise.all(recs.map(r => checkDomainAvailability(r.domain)))
  return recs.map((r, i) => ({ ...r, availability: checks[i].available, availabilityReason: checks[i].reason }))
}
