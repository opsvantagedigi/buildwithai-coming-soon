// worker/src/routes/domain-dns.js
export async function fetch(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const { domain, records } = body;
  if (!domain || typeof domain !== 'string' || !domain.includes('.')) {
    return new Response(JSON.stringify({ error: 'Invalid domain' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!Array.isArray(records)) {
    return new Response(JSON.stringify({ error: 'Records must be an array' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // Test mode response
  return new Response(JSON.stringify({
    success: true,
    message: 'DNS provisioned (test mode)',
    domain,
    records
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
