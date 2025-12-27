export default {
  async fetch(request, env, ctx) {
    const body = { message: "Hello from BUILD WITH AI Worker" };
    return new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  },
};
