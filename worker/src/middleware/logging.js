export function startLog(request) {
  return { method: request.method, path: new URL(request.url).pathname, start: Date.now() };
}

export function endLog(meta) {
  const duration = Date.now() - meta.start;
  console.log(`${meta.method} ${meta.path} — ${duration}ms`);
}
