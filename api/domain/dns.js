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

  const { domain } = body || {};

  if (!domain || !domain.includes('.')) {
    return error(res, 'INVALID_DOMAIN', 400);
  }

  return json(res, {
    success: true,
    message: 'DNS provisioned (test mode)',
    domain,
    records: []
  });
}
