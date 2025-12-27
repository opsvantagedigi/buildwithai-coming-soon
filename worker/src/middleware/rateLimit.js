// Simple KV-backed rate limiter (per IP per minute)
export async function rateLimit(request, env) {
  try {
    const kv = env.BUILDWITHAI_CACHE;
    if (!kv) return null; // no KV configured; skip rate limiting

    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
    const now = Math.floor(Date.now() / 60000); // minute bucket
    const key = `rl:${ip}:${now}`;
    const raw = await kv.get(key);
    const count = raw ? parseInt(raw) : 0;
    const limit = 60; // requests per minute
    if (count >= limit) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { "Content-Type": "application/json" } });
    }
    await kv.put(key, String(count + 1), { expirationTtl: 120 });
    return null;
  } catch (e) {
    // don't block on rate limit errors
    console.warn("rateLimit error", e);
    return null;
  }
}
