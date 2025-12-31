import { json } from './_lib/response.js';

export default async function handler(req, res) {
  return json(res, { announcements: [ { title: 'Welcome', message: 'Site updated', timestamp: Date.now() } ] });
}
