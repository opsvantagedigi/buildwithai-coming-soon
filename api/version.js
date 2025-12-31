import { json } from './_lib/response.js';

export default async function handler(req, res) {
  return json(res, { version: '0.1.0', timestamp: Date.now() });
}
