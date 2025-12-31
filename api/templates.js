import { openproviderRequest } from './_lib/openprovider.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const op = await openproviderRequest('/templates', 'GET');
    if (op.success && op.data) return res.status(200).json({ templates: op.data });

    // Fallback templates response
    const templates = [
      { id: 'example-1', name: 'Landing Page', description: 'Simple landing' },
      { id: 'example-2', name: 'Portfolio', description: 'Portfolio layout' }
    ];

    return res.status(200).json({ templates });
  } catch (err) {
    console.error('templates error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
