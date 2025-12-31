(async () => {
  try {
    const base = 'http://127.0.0.1:3000';
    console.log('Testing local endpoints at', base);

    const checkRes = await fetch(`${base}/api/domain/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'example.com' })
    });
    console.log('/api/domain/check ->', await checkRes.json());

    const templatesRes = await fetch(`${base}/api/templates`);
    console.log('/api/templates ->', await templatesRes.json());

    const whoisRes = await fetch(`${base}/api/domain/whois`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'example.com' })
    });
    console.log('/api/domain/whois ->', await whoisRes.json());

    console.log('Smoke tests completed');
    process.exit(0);
  } catch (err) {
    console.error('Smoke tests failed', err);
    process.exit(1);
  }
})();
