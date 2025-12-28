export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/domain/check") {
      const body = await request.json();
      const domain = body.domain || "";

      // Placeholder logic — Phase 2 will replace with OpenProvider API
      const available = !domain.includes("taken");

      return new Response(JSON.stringify({ domain, available }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
