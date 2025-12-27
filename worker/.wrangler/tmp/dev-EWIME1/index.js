var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/routes/index.js
var routes_exports = {};
__export(routes_exports, {
  get: () => get
});

// src/utils/response.js
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
__name(json, "json");
function error(message = "", status = 400) {
  return json({ error: message }, status);
}
__name(error, "error");

// src/routes/index.js
async function get(request, env) {
  return json({ message: "BUILD WITH AI API is live" });
}
__name(get, "get");

// src/routes/health.js
var health_exports = {};
__export(health_exports, {
  get: () => get2
});
async function get2(request, env) {
  return json({ status: "ok" });
}
__name(get2, "get");

// src/routes/version.js
var version_exports = {};
__export(version_exports, {
  get: () => get3
});
async function get3(request, env) {
  return json({ version: "1.0.0", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
}
__name(get3, "get");

// src/routes/features.js
var features_exports = {};
__export(features_exports, {
  get: () => get4
});
async function get4(request, env) {
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
__name(get4, "get");

// src/routes/ui-config.js
var ui_config_exports = {};
__export(ui_config_exports, {
  get: () => get5
});
async function get5(request, env) {
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
__name(get5, "get");

// src/routes/templates.js
var templates_exports = {};
__export(templates_exports, {
  get: () => get6
});
async function get6(request, env) {
  try {
    if (env.BUILDWITHAI_ASSETS) {
      const list = await env.BUILDWITHAI_ASSETS.list();
      const items = list.objects.map((o) => ({ key: o.key, size: o.size }));
      return json({ templates: items });
    }
  } catch (e) {
    console.warn("templates get error", e);
  }
  return json({ templates: [{ id: "starter", name: "Starter" }] });
}
__name(get6, "get");

// src/routes/announcements.js
var announcements_exports = {};
__export(announcements_exports, {
  get: () => get7
});
async function get7(request, env) {
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
__name(get7, "get");

// src/utils/errors.js
var NotFoundError = class extends Error {
  static {
    __name(this, "NotFoundError");
  }
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
};

// src/utils/router.js
var routes = /* @__PURE__ */ new Map([
  ["/", routes_exports],
  ["/health", health_exports],
  ["/version", version_exports],
  ["/features", features_exports],
  ["/ui-config", ui_config_exports],
  ["/templates", templates_exports],
  ["/announcements", announcements_exports]
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
__name(parseJson, "parseJson");
async function handle(request, env) {
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
    const body = method === "post" ? await parseJson(request) : null;
    const result = await handler(request, env, body);
    return result;
  } catch (err) {
    if (err && err.status) {
      return error(err.message || "Error", err.status);
    }
    return error(err?.message || "Internal error", 500);
  }
}
__name(handle, "handle");

// src/middleware/cors.js
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key"
  };
}
__name(corsHeaders, "corsHeaders");
function handleOptions(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  return null;
}
__name(handleOptions, "handleOptions");

// src/middleware/logging.js
function startLog(request) {
  return { method: request.method, path: new URL(request.url).pathname, start: Date.now() };
}
__name(startLog, "startLog");
function endLog(meta) {
  const duration = Date.now() - meta.start;
  console.log(`${meta.method} ${meta.path} \u2014 ${duration}ms`);
}
__name(endLog, "endLog");

// src/middleware/auth.js
async function auth(request, env) {
  const required = env.INTERNAL_API_TOKEN || env.OPENPROVIDER_API_KEY || null;
  if (!required) return null;
  const key = request.headers.get("x-api-key") || request.headers.get("authorization");
  if (!key) {
    return new Response(JSON.stringify({ error: "Missing API key" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const token = key.startsWith("Bearer ") ? key.slice(7).trim() : key.trim();
  if (token !== required) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  return null;
}
__name(auth, "auth");

// src/middleware/rateLimit.js
async function rateLimit(request, env) {
  try {
    const kv = env.BUILDWITHAI_CACHE;
    if (!kv) return null;
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
    const now = Math.floor(Date.now() / 6e4);
    const key = `rl:${ip}:${now}`;
    const raw = await kv.get(key);
    const count = raw ? parseInt(raw) : 0;
    const limit = 60;
    if (count >= limit) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { "Content-Type": "application/json" } });
    }
    await kv.put(key, String(count + 1), { expirationTtl: 120 });
    return null;
  } catch (e) {
    console.warn("rateLimit error", e);
    return null;
  }
}
__name(rateLimit, "rateLimit");

// src/index.js
var src_default = {
  async fetch(request, env) {
    const logMeta = startLog(request);
    const opt = handleOptions(request);
    if (opt) return opt;
    const authResp = await auth(request, env);
    if (authResp) return appendCors(authResp);
    const rlResp = await rateLimit(request, env);
    if (rlResp) return appendCors(rlResp);
    try {
      const res = await handle(request, env);
      const withCors = appendCors(res);
      endLog(logMeta);
      return withCors;
    } catch (err) {
      endLog(logMeta);
      return error(err?.message || "Internal error", err?.status || 500);
    }
  }
};
function appendCors(response) {
  const headers = corsHeaders();
  for (const k of Object.keys(headers)) {
    if (!response.headers.has(k)) response.headers.set(k, headers[k]);
  }
  return response;
}
__name(appendCors, "appendCors");

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-5Z2rVs/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-5Z2rVs/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
