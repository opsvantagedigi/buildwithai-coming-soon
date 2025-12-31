import { json, error } from '../_lib/response.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return error(res, 'Method Not Allowed', 405);
  }

  let body;
  try {
    body = req.body;
  } catch (err) {
    return error(res, 'INVALID_JSON', 400);
  }

  const domain = body?.domain?.trim();
  if (!domain || !domain.includes('.')) {
    return error(res, 'INVALID_DOMAIN', 400);
  }

  const tld = domain.substring(domain.lastIndexOf('.'));
  const available = !domain.toLowerCase().includes('taken');

  return json(res, {
    success: true,
    domain,
    available,
    tld,
    price: 0,
    raw: {}
  });
}
