export function json(data, status = 200) {
  if (typeof Response === 'function') {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  // Node / non-Worker fallback: return a simple shape the caller can use
  return { body: JSON.stringify(data), status, headers: { 'Content-Type': 'application/json; charset=utf-8' } };
}

export function error(message = '', status = 400) {
  return json({ error: message }, status);
}
