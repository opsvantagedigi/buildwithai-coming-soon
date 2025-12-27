import { json } from "../utils/response.js";

export async function get(request, env) {
  try {
    if (env.BUILDWITHAI_ASSETS) {
      // R2 binding provides a bucket object
      const list = await env.BUILDWITHAI_ASSETS.list();
      const items = list.objects.map(o => ({ key: o.key, size: o.size }));
      return json({ templates: items });
    }
  } catch (e) {
    console.warn("templates get error", e);
  }
  return json({ templates: [{ id: "starter", name: "Starter" }] });
}
