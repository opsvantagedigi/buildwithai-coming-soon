export type DnsDiagnostic = {
  level: "info" | "warning" | "critical";
  message: string;
};

export function analyzeDns(rdap: any): DnsDiagnostic[] {
  const diagnostics: DnsDiagnostic[] = [];
  const nameservers = rdap.nameservers || [];

  if (!nameservers.length) {
    diagnostics.push({
      level: "critical",
      message: "No nameservers are listed; DNS is likely not configured and the domain may not resolve.",
    });
    return diagnostics;
  }

  if (nameservers.length === 1) {
    diagnostics.push({
      level: "warning",
      message: "Only one nameserver is configured; add additional nameservers for higher resilience.",
    });
  } else {
    diagnostics.push({
      level: "info",
      message: `Multiple nameservers (${nameservers.length}) are configured, which improves DNS resilience.`,
    });
  }

  const hasDnssec = !!rdap.dnssec;
  diagnostics.push({
    level: hasDnssec ? "info" : "warning",
    message: hasDnssec
      ? "DNSSEC is enabled; DNS responses are better protected against tampering."
      : "DNSSEC is not enabled; consider enabling it to protect DNS integrity.",
  });

  return diagnostics;
}

export default analyzeDns;
