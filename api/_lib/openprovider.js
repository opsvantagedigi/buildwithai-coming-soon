// Lightweight OpenProvider client for Vercel environment
export async function openproviderRequest(endpoint, method = 'POST', body = {}) {
  const base = process.env.OPENPROVIDER_API_URL || '';
  const user = process.env.OPENPROVIDER_USERNAME || '';
  const pass = process.env.OPENPROVIDER_PASSWORD || '';

  if (!base || !user || !pass) {
    return { success: false, error: 'NO_CONFIG', details: 'OpenProvider environment variables not set' };
  }

  const url = `${base}${endpoint}`;
  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      },
      body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `HTTP ${res.status}`, details: text };
    }
    const data = await res.json().catch(() => null);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'NETWORK_ERROR', details: err.message || String(err) };
  }
}
