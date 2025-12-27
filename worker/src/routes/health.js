import { json } from "../utils/response.js";

export async function get(request, env) {
  return json({ status: "ok" });
}
