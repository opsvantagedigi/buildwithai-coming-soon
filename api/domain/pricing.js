import { json, error } from '../_lib/response.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return error(res, 'Method Not Allowed', 405);
  }

  try {
    const pricing = [
      { tld: '.com', price: 12.99 },
      { tld: '.net', price: 14.99 },
      { tld: '.digital', price: 9.99 },
      { tld: '.co.nz', price: 22.0 }
    ];

    return json(res, { success: true, pricing });
  } catch (err) {
    return error(res, 'SERVER_ERROR', 500);
  }
}
