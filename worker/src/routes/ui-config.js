import { json } from "../utils/response.js";

export async function get(request, env) {
  try {
    if (env.BUILDWITHAI_CACHE) {
      const data = await env.BUILDWITHAI_CACHE.get("ui-config", { type: "json" });
      if (data) return json(data);
    }
  } catch (e) {
    console.warn("ui-config get error", e);
  }
  return json({ hero: { title: "BUILD WITH AI", subtitle: "AI website builder launching soon" }, theme: "dark", sections: [] });
}
