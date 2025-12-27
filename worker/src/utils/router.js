import * as indexRoute from "../routes/index.js";
import * as healthRoute from "../routes/health.js";
import * as versionRoute from "../routes/version.js";
import * as featuresRoute from "../routes/features.js";
import * as uiConfigRoute from "../routes/ui-config.js";
import * as templatesRoute from "../routes/templates.js";
import * as generateTemplateRoute from "../routes/generate-template.js";
import * as announcementsRoute from "../routes/announcements.js";
import { error as jsonError } from "./response.js";
import { NotFoundError } from "./errors.js";

const routes = new Map([
  ["/", indexRoute],
  ["/health", healthRoute],
  ["/version", versionRoute],
  ["/features", featuresRoute],
  ["/ui-config", uiConfigRoute],
  ["/templates", templatesRoute],
  ["/generate-template", generateTemplateRoute],
  ["/announcements", announcementsRoute],
]);

async function parseJson(request) {
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await request.json();
    } catch (e) {
      const err = new Error("Invalid JSON body");
      err.status = 400;
      throw err;
    }
  }
  return null;
}

export async function handle(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const route = routes.get(pathname);
  const method = request.method.toLowerCase();

  if (!route) {
    throw new NotFoundError("Route not found");
  }

  // Support named exports like `export async function post(...)` as well as
  // default export objects like `export default { POST() {} }`.
  let handler = route[method];
  if (!handler && route.default) {
    handler = route.default[method] || route.default[method.toUpperCase()];
  }
  if (!handler) {
    throw new NotFoundError("Method not allowed");
  }
  // Provide a minimal context object for new-style handlers.
  const ctx = {};

  try {
    // NEW-STYLE HANDLER:
    // export default { POST({ request, env, ctx }) { ... } }
    // These always have handler.length === 1
    if (handler.length === 1) {
      return await handler({ request, env, ctx });
    }

    // LEGACY HANDLER:
    // export async function post(request, env, body)
    // These have handler.length >= 2
    const body = method === "post" ? await parseJson(request) : null;
    return await handler(request, env, body);

  } catch (err) {
    if (err && err.status) {
      return jsonError(err.message || "Error", err.status);
    }
    return jsonError(err?.message || "Internal error", 500);
  }
}
