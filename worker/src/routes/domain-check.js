// worker/src/routes/domain-check.js
// POST /domain/check — OpenProvider domain search integration
import { openproviderRequest } from "../utils/openprovider.js";

function validateDomain(domain) {
  // Simple regex for domain validation (does not cover all cases)
  return /^[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,}$/.test(domain);
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return Response.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
    }

    const domain = body?.domain?.trim();
    if (!domain || !domain.includes(".")) {
      return Response.json({ success: false, error: "INVALID_DOMAIN" }, { status: 400 });
    }

    // Extract TLD
    const tld = domain.substring(domain.lastIndexOf("."));

    // TEST MODE LOGIC
    const available = !domain.toLowerCase().includes("taken");

    return Response.json({
      success: true,
      domain,
      available,
      tld,
      price: 0,
      raw: {}
    });
  }
};
