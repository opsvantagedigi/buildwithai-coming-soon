import { openproviderRequest } from '../_lib/openprovider.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body && Object.keys(req.body).length ? req.body : await parseJson(req);
    const domain = (body && body.domain) || (req.query && req.query.domain) || '';

    // If OpenProvider configured, attempt to fetch pricing
    const op = await openproviderRequest(`/pricing`, 'GET');
    if (op.success && op.data) {
      return res.status(200).json({ success: true, pricing: op.data });
    }

    // Test-mode fallback pricing
    const pricing = [
      { tld: '.com', price: 12.99 },
      { tld: '.net', price: 14.99 },
      { tld: '.digital', price: 9.99 }
    ];
    return res.status(200).json({ success: true, pricing });
  } catch (err) {
    console.error('domain/pricing error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function parseJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { resolve({}); }
    });
    req.on('error', reject);
  });
}
