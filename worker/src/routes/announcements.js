import { json } from "../utils/response.js";

export async function get(request, env) {
  try {
    if (env.BUILDWITHAI_CACHE) {
      const data = await env.BUILDWITHAI_CACHE.get("announcements", { type: "json" });
      if (data) return json(data);
    }
  } catch (e) {
    console.warn("announcements get error", e);
  }
  return json({ announcements: [{ id: "1", text: "Welcome to BUILD WITH AI!" }] });
}
