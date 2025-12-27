import { json, error } from "../utils/response.js";
import { generateTemplate } from "../lib/ai.js";

export default {
  async POST({ request, env }) {
    try {
      const contentType = request.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return error("Expected application/json body", 415);
      }

      const body = await request.json();
      const prompt = body?.prompt || body?.promptText || body?.q || "";
      if (!prompt || String(prompt).trim().length < 3) {
        return error("Invalid prompt", 400);
      }

      const result = await generateTemplate(prompt);
      return json(result, 200);
    } catch (e) {
      console.error("generate-template error", e);
      return error("Internal server error", 500);
    }
  }
};
