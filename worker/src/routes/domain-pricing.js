// worker/src/routes/domain-pricing.js
// GET /domain/pricing — OpenProvider domain pricing integration
import { openproviderRequest } from "../utils/openprovider.js";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    try {
      // TEST MODE PRICING
      const pricing = [
        { tld: ".com", price: 12.99 },
        { tld: ".net", price: 14.99 },
        { tld: ".digital", price: 9.99 },
        { tld: ".co.nz", price: 22.0 }
      ];
      return Response.json({
        success: true,
        pricing
      });
    } catch (err) {
      return Response.json(
        { success: false, error: "SERVER_ERROR", details: err.message },
        { status: 500 }
      );
    }
  }
};
