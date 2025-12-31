import { openproviderRequest } from '../_lib/openprovider.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST' && req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body && Object.keys(req.body).length ? req.body : await parseJson(req);
    const domain = (body && body.domain) || (req.query && req.query.domain) || '';
    if (!domain) return res.status(400).json({ error: 'Missing domain' });

    const op = await openproviderRequest('/whois', 'POST', { domain });
    if (op.success) {
      return res.status(200).json({ success: true, whois: op.data });
    }

    const whois = { domain, registered: false, expiry: null, privacy: false, raw: {} };
    return res.status(200).json({ success: true, whois });
  } catch (err) {
    console.error('domain/whois error', err);
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
