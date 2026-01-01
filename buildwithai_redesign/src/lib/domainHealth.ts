import { scoreRegistrar } from "./registrarReputation";

export function computeDomainHealth(rdap: any) {
  let score = 0;
  const factors: any = {};
  const explanations: string[] = [];

  if (!rdap) {
    explanations.push("No RDAP data available to compute health.");
    return { score: 40, grade: "D", factors, explanations };
  }

  // Age
  if (rdap.created) {
    const createdAt = Date.parse(rdap.created);
    if (!isNaN(createdAt)) {
      const ageYears = (Date.now() - createdAt) / (1000 * 60 * 60 * 24 * 365);
      if (ageYears > 5) {
        score += 20;
        factors.age = "Strong";
        explanations.push("This domain has a long history, which is often seen as more trustworthy.");
      } else if (ageYears > 1) {
        score += 10;
        factors.age = "Moderate";
        explanations.push("This domain has some history but is still relatively young.");
      } else {
        factors.age = "New domain";
        explanations.push("This domain is newly registered, which may require extra trust-building.");
      }
    } else {
      explanations.push("The domain's creation date could not be parsed.");
    }
  } else {
    explanations.push("The domain's creation date is not available.");
  }

  // DNSSEC
  if (rdap.dnssec) {
    score += 15;
    factors.dnssec = "Enabled";
    explanations.push("DNSSEC is enabled, which improves integrity and security of DNS responses.");
  } else {
    factors.dnssec = "Not enabled";
    explanations.push("DNSSEC is not enabled; enabling it can improve DNS security.");
  }

  // Transfer lock
  const statusArr = Array.isArray(rdap.status) ? rdap.status.join(" ").toLowerCase() : "";
  const locked = statusArr.includes("clienttransferprohibited") || statusArr.includes("transfer prohibited") || statusArr.includes("client transfer prohibited");
  if (locked) {
    score += 10;
    factors.lock = "Locked";
    explanations.push("The domain is transfer-locked, which helps protect against unauthorized transfers.");
  } else {
    factors.lock = "Unlocked";
    explanations.push("The domain appears to be transferable; ensure registrar security is configured correctly.");
  }

  // Nameserver diversity
  if (rdap.nameservers?.length >= 2) {
    score += 10;
    factors.nameservers = "Good diversity";
    explanations.push("Multiple nameservers are configured, improving resilience and uptime.");
  } else if (rdap.nameservers?.length === 1) {
    factors.nameservers = "Single nameserver";
    explanations.push("Only one nameserver is configured; adding more can improve resilience.");
  } else {
    factors.nameservers = "None listed";
    explanations.push("No nameservers are listed; DNS may not be configured.");
  }

  // Registrar
  if (rdap.registrar) {
    score += 5;
    factors.registrar = "Known registrar";
    explanations.push("The domain is managed by a named registrar.");
  } else {
    factors.registrar = "Unknown registrar";
    explanations.push("The registrar is not clearly identified in RDAP.");
  }

  // Registrar reputation
  const registrarRep = scoreRegistrar(rdap.registrar);
  // Small influence: push score slightly up/down based on reputation
  score += Math.round((registrarRep.score - 50) / 10);
  factors.registrarReputation = registrarRep;

  if (registrarRep.label !== "Unclassified registrar" && registrarRep.label !== "Unknown registrar") {
    explanations.push(`Registrar reputation: ${registrarRep.label}. ${registrarRep.notes ?? ""}`);
  } else {
    explanations.push("Registrar reputation is neutral or unknown.");
  }

  const rawScore = Math.min(Math.max(score, 0), 100);
  const grade = rawScore > 85 ? "A" : rawScore > 70 ? "B" : rawScore > 50 ? "C" : "D";

  return {
    score: rawScore,
    grade,
    factors,
    explanations,
  };
}

export default computeDomainHealth;
