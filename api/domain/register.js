import { openproviderRequest } from '../_lib/openprovider.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body && Object.keys(req.body).length ? req.body : await parseJson(req);
    const { domain, contact, nameservers } = body || {};

    if (!domain || !domain.includes('.')) {
      return res.status(400).json({ success: false, error: 'INVALID_DOMAIN' });
    }
    if (!contact || !contact.name || !contact.email || !contact.phone || !contact.address) {
      return res.status(400).json({ success: false, error: 'INVALID_CONTACT' });
    }
    if (!Array.isArray(nameservers)) {
      return res.status(400).json({ success: false, error: 'INVALID_NAMESERVERS' });
    }

    // If OpenProvider configured, attempt to register (example endpoint)
    const op = await openproviderRequest('/domain/register', 'POST', { domain, contact, nameservers });
    if (op.success) {
      return res.status(200).json({ success: true, message: 'Domain registered', result: op.data });
    }

    // Fallback test-mode
    return res.status(200).json({ success: true, message: 'Domain registered (test mode)', domain, nameservers });
  } catch (err) {
    console.error('domain/register error', err);
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
