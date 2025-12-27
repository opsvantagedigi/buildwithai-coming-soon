import { handle } from "./utils/router.js";
import { error as jsonError } from "./utils/response.js";
import { handleOptions, corsHeaders } from "./middleware/cors.js";
import { startLog, endLog } from "./middleware/logging.js";
import { auth } from "./middleware/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";

export default {
  async fetch(request, env) {
    const logMeta = startLog(request);

    // Handle OPTIONS early (CORS preflight)
    const opt = handleOptions(request);
    if (opt) return opt;

    // Auth middleware (may return Response)
    const authResp = await auth(request, env);
    if (authResp) return appendCors(authResp);

    // Rate limiting (may return Response)
    const rlResp = await rateLimit(request, env);
    if (rlResp) return appendCors(rlResp);

    try {
      const res = await handle(request, env);
      const withCors = appendCors(res);
      endLog(logMeta);
      return withCors;
    } catch (err) {
      endLog(logMeta);
      return jsonError(err?.message || "Internal error", err?.status || 500);
    }
  },
};

function appendCors(response) {
  const headers = corsHeaders();
  for (const k of Object.keys(headers)) {
    if (!response.headers.has(k)) response.headers.set(k, headers[k]);
  }
  return response;
}
