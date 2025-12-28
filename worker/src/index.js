

import domainCheck from "./routes/domain-check.js";
import domainPricing from "./routes/domain-pricing.js";
import domainRegister from "./routes/domain-register.js";
import domainWhois from "./routes/domain-whois.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // /domain/check
    if (path === "/domain/check") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }
      return domainCheck.fetch(request, env, ctx);
    }

    // /domain/pricing
    if (path === "/domain/pricing") {
      if (request.method !== "GET") {
        return new Response("Method Not Allowed", { status: 405 });
      }
      return domainPricing.fetch(request, env, ctx);
    }

    // /domain/register
    if (path === "/domain/register") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }
      return domainRegister.fetch(request, env, ctx);
    }

    // /domain/whois
    if (path === "/domain/whois") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }
      return domainWhois.fetch(request, env, ctx);
    }

    // Default 404
    return new Response("Not Found", { status: 404 });
  }
};
