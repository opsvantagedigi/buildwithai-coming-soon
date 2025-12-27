import { handle } from "./utils/router.js";
import { error as jsonError } from "./utils/response.js";

export default {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (err) {
      return jsonError(err?.message || "Internal error", err?.status || 500);
    }
  },
};
