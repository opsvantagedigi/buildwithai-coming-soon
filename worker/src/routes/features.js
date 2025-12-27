import { json } from "../utils/response.js";

export async function get(request, env) {
  // Try KV first, fallback to sample
  try {
    if (env.BUILDWITHAI_CACHE) {
      const data = await env.BUILDWITHAI_CACHE.get("features", { type: "json" });
      if (data) return json(data);
    }
  } catch (e) {
    console.warn("features get error", e);
  }
  return json({ features: [
    { id: "autogen", title: "AI Website Builder", desc: "Generate websites with AI" },
    { id: "templates", title: "Templates", desc: "Pre-built templates" }
  ] });
}
