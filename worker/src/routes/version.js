import { json } from "../utils/response.js";

export async function get(request, env) {
  return json({ version: "1.0.0", timestamp: new Date().toISOString() });
}
