import { createServer } from 'http';
import { parse as parseUrl } from 'url';

const routes = new Map([
  ['/api/domain/check', './api/domain/check.js'],
  ['/api/domain/pricing', './api/domain/pricing.js'],
  ['/api/domain/register', './api/domain/register.js'],
  ['/api/domain/whois', './api/domain/whois.js'],
  ['/api/domain/dns', './api/domain/dns.js'],
  ['/api/templates', './api/templates.js']
]);

function createResWrapper(res) {
  return {
    status(code) {
      return {
        json(obj) {
          res.writeHead(code, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(obj));
        },
        send(txt) {
          res.writeHead(code, { 'Content-Type': 'text/plain' });
          res.end(String(txt));
        }
      };
    }
  };
}

const server = createServer(async (req, res) => {
  try {
    const parsed = parseUrl(req.url, true);
    const route = routes.get(parsed.pathname);
    if (!route) {
      res.writeHead(404);
      return res.end();
    }

    req.query = parsed.query;

    const mod = await import(route);
    const handler = mod.default;
    if (typeof handler !== 'function') {
      res.writeHead(500);
      return res.end('Handler not found');
    }

    const resWrapper = createResWrapper(res);
    // Let the handler read the raw request stream if needed
    return handler(req, resWrapper);
  } catch (err) {
    console.error('dev-server error', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'dev-server exception' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '127.0.0.1', () => console.log(`Dev API server listening on http://127.0.0.1:${PORT}`));
