import { json } from './_lib/response.js';

export default async function handler(req, res) {
  return json(res, {
    success: true,
    templates: []
  });
}
