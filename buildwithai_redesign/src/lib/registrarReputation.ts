type RegistrarReputation = {
  namePattern: RegExp;
  score: number;
  label: string;
  notes?: string;
};

const REGISTRAR_REPUTATION_TABLE: RegistrarReputation[] = [
  {
    namePattern: /namecheap/i,
    score: 80,
    label: "Trusted mainstream registrar",
    notes: "Popular, cost-effective, widely used.",
  },
  {
    namePattern: /godaddy/i,
    score: 70,
    label: "Large mainstream registrar",
    notes: "Widely used; upsells may be frequent.",
  },
  {
    namePattern: /cloudflare/i,
    score: 90,
    label: "High-reputation registrar",
    notes: "Transparent pricing and strong DNS platform.",
  },
  {
    namePattern: /google/i,
    score: 85,
    label: "Well-known registrar",
    notes: "Strong brand and infrastructure.",
  },
];

export function scoreRegistrar(registrarName?: string) {
  if (!registrarName) {
    return {
      score: 50,
      label: "Unknown registrar",
      notes: "No specific reputation data available.",
    };
  }

  const match = REGISTRAR_REPUTATION_TABLE.find(entry =>
    entry.namePattern.test(registrarName)
  );

  if (!match) {
    return {
      score: 60,
      label: "Unclassified registrar",
      notes: "No specific reputation info; treat as neutral.",
    };
  }

  return {
    score: match.score,
    label: match.label,
    notes: match.notes,
  };
}

export default scoreRegistrar;
