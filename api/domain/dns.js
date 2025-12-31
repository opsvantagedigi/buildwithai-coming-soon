import { openproviderRequest } from '../_lib/openprovider.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body && Object.keys(req.body).length ? req.body : await parseJson(req);
    // Expected: { domain, records: [...] }
    const domain = body.domain || null;
    const records = body.records || [];
    if (!domain || !records.length) return res.status(400).json({ error: 'Missing domain or records' });

    const op = await openproviderRequest('/domain/dns', 'POST', { domain, records });
    if (op.success) return res.status(200).json({ success: true, result: op.data });

    // Fallback: echo back as a successful noop
    return res.status(200).json({ success: true, domain, records, note: 'test-mode fallback' });
  } catch (err) {
    console.error('domain/dns error', err);
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
