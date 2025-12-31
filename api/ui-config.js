import { json } from './_lib/response.js';

export default async function handler(req, res) {
  return json(res, { hero: { title: 'Build With AI', subtitle: 'Launch faster' }, theme: 'default', features: [] });
}
