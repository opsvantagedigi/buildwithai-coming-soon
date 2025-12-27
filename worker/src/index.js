export default {
  async fetch(request, env, ctx) {
    return new Response("Hello from buildwithai Worker", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
};
