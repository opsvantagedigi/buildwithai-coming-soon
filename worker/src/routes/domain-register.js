// worker/src/routes/domain-register.js
// POST /domain/register — OpenProvider domain registration integration
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

    const { domain, contact, nameservers } = body;

    // Basic validation
    if (!domain || !domain.includes(".")) {
      return Response.json({ success: false, error: "INVALID_DOMAIN" }, { status: 400 });
    }

    if (!contact || !contact.name || !contact.email || !contact.phone || !contact.address) {
      return Response.json({ success: false, error: "INVALID_CONTACT" }, { status: 400 });
    }

    if (!Array.isArray(nameservers)) {
      return Response.json({ success: false, error: "INVALID_NAMESERVERS" }, { status: 400 });
    }

    // TEST MODE RESPONSE
    return Response.json({
      success: true,
      message: "Domain registered (test mode)",
      domain,
      nameservers
    });
  }
};
