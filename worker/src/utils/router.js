import * as indexRoute from "../routes/index.js";
import * as healthRoute from "../routes/health.js";
import * as versionRoute from "../routes/version.js";
import { error as jsonError } from "./response.js";
import { NotFoundError } from "./errors.js";

const routes = new Map([
  ["/", indexRoute],
  ["/health", healthRoute],
  ["/version", versionRoute],
]);

export async function handle(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const route = routes.get(pathname);
  const method = request.method.toLowerCase();

  if (!route) {
    throw new NotFoundError("Route not found");
  }

  const handler = route[method];
  if (!handler) {
    throw new NotFoundError("Method not allowed");
  }

  try {
    const result = await handler(request, env);
    return result;
  } catch (err) {
    if (err && err.status) {
      return jsonError(err.message || "Error", err.status);
    }
    return jsonError(err?.message || "Internal error", 500);
  }
}
