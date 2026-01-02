export async function runTestRedis() {
	const { createClient } = await import('redis');
	const client = createClient({ url: process.env.REDIS_URL });
	client.on('error', err => console.error('Redis Client Error', err));
	await client.connect();
	const result = await client.get('item');
	console.log({ result });
	await client.quit();
}

if (process.argv[2] === 'run') {
	// Allow manual execution: `node scripts/test-redis.mjs run`
	runTestRedis().catch(err => {
		console.error('test-redis failed:', err?.message || err)
		process.exit(1)
	})
}
