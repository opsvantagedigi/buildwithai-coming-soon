type DomainSeoScoreResult = {
  score: number;
  grade: string;
  factors: Record<string, string>;
  explanations: string[];
};

function classifyTldForSeo(tld: string) {
  if (!tld) return { weight: 0, label: "Unknown TLD" };

  if (["com", "org", "net"].includes(tld))
    return { weight: 10, label: "Common, trusted TLD" };

  if (["ai", "io", "dev", "app"].includes(tld))
    return { weight: 5, label: "Modern, tech-aligned TLD" };

  if (["xyz", "online", "site"].includes(tld))
    return { weight: 0, label: "Less traditional TLD" };

  return { weight: 0, label: "Neutral TLD" };
}

export function scoreDomainSeo(domain: string): DomainSeoScoreResult {
  const explanations: string[] = [];
  const factors: Record<string, string> = {};
  let score = 0;

  const lower = domain.toLowerCase();
  const parts = lower.split(".");
  const sld = parts[0];
  const tld = parts.slice(1).join(".");

  // Length
  const len = sld.length;
  if (len <= 12) {
    score += 20;
    factors.length = "Short";
    explanations.push("Short domains are easier to remember and type, which can indirectly help SEO.");
  } else if (len <= 20) {
    score += 10;
    factors.length = "Moderate";
    explanations.push("Medium-length domains are acceptable, but shorter is often more brandable.");
  } else {
    factors.length = "Long";
    explanations.push("Long domains are harder to remember and may be less brandable.");
  }

  // Hyphens
  const hyphenCount = (sld.match(/-/g) || []).length;
  if (hyphenCount === 0) {
    score += 15;
    factors.hyphens = "None";
    explanations.push("No hyphens makes the domain easier to type and say aloud.");
  } else if (hyphenCount === 1) {
    score += 5;
    factors.hyphens = "Single hyphen";
    explanations.push("A single hyphen is acceptable, but avoid overusing hyphens.");
  } else {
    factors.hyphens = "Multiple hyphens";
    explanations.push("Multiple hyphens can look spammy and are harder to communicate verbally.");
  }

  // Numbers
  const hasDigits = /\d/.test(sld);
  if (!hasDigits) {
    score += 10;
    factors.digits = "No digits";
    explanations.push("No numbers make the domain clearer to say and remember.");
  } else {
    factors.digits = "Contains digits";
    explanations.push("Numbers in domains can be harder to communicate and remember.");
  }

  // TLD category
  const tldInfo = classifyTldForSeo(tld);
  score += tldInfo.weight;
  factors.tld = tldInfo.label;
  explanations.push(tldInfo.label + " is generally acceptable for SEO.");

  // Basic brandability heuristic
  const keywordyPatterns = ["best", "cheap", "free", "discount"];
  const isOverlyKeywordy = keywordyPatterns.some(k => sld.includes(k));
  if (!isOverlyKeywordy) {
    score += 10;
    factors.brandability = "Brandable or neutral";
    explanations.push("The domain does not appear overly keyword-stuffed, which is good for long-term brand building.");
  } else {
    factors.brandability = "Keyword-heavy";
    explanations.push("Very keyword-stuffed domains can look spammy; brandable names often age better.");
  }

  const finalScore = Math.min(100, score);
  const grade = finalScore > 85 ? "A"
    : finalScore > 70 ? "B"
    : finalScore > 50 ? "C"
    : "D";

  return {
    score: finalScore,
    grade,
    factors,
    explanations,
  };
}

export default scoreDomainSeo;
