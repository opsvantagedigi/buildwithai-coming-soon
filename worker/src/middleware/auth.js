export async function auth(request, env) {
  // If no API token set in env, allow by default (open API)
  const required = env.INTERNAL_API_TOKEN || env.OPENPROVIDER_API_KEY || null;
  if (!required) return null;

  const key = request.headers.get("x-api-key") || request.headers.get("authorization");
  if (!key) {
    return new Response(JSON.stringify({ error: "Missing API key" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  // If Authorization header contains Bearer TOKEN
  const token = key.startsWith("Bearer ") ? key.slice(7).trim() : key.trim();
  if (token !== required) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  return null;
}
