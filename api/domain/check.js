import { openproviderRequest } from '../_lib/openprovider.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body && Object.keys(req.body).length ? req.body : await parseJson(req);
    const domain = (body && String(body.domain || '').trim()) || '';

    if (!domain || !domain.includes('.')) {
      return res.status(400).json({ success: false, error: 'INVALID_DOMAIN' });
    }

    // If OpenProvider configured, attempt a lookup (example endpoint)
    const op = await openproviderRequest(`/domain/check`, 'POST', { domain });
    if (op.success) {
      // adapt to expected shape if provider returns usable info
      return res.status(200).json({ success: true, domain, available: op.data?.available ?? null, raw: op.data });
    }

    // Fallback / test mode: simple heuristic
    const available = !domain.toLowerCase().includes('taken');
    const tld = domain.substring(domain.lastIndexOf('.'));
    return res.status(200).json({ success: true, domain, available, tld, price: 0, raw: {} });
  } catch (err) {
    console.error('domain/check error', err);
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
