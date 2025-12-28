// worker/src/routes/domain-whois.js
// POST /domain/whois — OpenProvider WHOIS integration
import { openproviderRequest } from "../utils/openprovider.js";

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

    // TEST MODE WHOIS DATA
    const whois = {
      domain,
      registered: false,
      expiry: null,
      privacy: false,
      raw: {}
    };

    return Response.json({
      success: true,
      whois
    });
  }
};
