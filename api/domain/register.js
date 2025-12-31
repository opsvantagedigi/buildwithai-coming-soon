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

  const { domain, contact, nameservers } = body;

  if (!domain || !domain.includes('.')) {
    return error(res, 'INVALID_DOMAIN', 400);
  }

  if (!contact || !contact.name || !contact.email || !contact.phone || !contact.address) {
    return error(res, 'INVALID_CONTACT', 400);
  }

  if (!Array.isArray(nameservers)) {
    return error(res, 'INVALID_NAMESERVERS', 400);
  }

  return json(res, {
    success: true,
    message: 'Domain registered (test mode)',
    domain,
    nameservers
  });
}
