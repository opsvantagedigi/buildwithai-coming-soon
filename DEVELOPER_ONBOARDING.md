# Developer Onboarding Guide — BUILD WITH AI

Welcome to BUILD WITH AI.  
This guide will help new developers get set up quickly and understand the architecture.

---

# 1. Prerequisites

Install:

- Node.js 20+
- Git
-- Vercel CLI (optional)  # use `npx vercel` or `npx vercel dev` for local serverless testing
- VS Code (recommended)
- GitHub Copilot (optional but encouraged)

---

# 2. Clone the Repository

git clone https://github.com/YOUR_ORG/buildwithai.git
cd buildwithai

Code

---

# 3. Install Dependencies

npm install

Code

---

# 4. Project Overview

### Marketing Site  
Located in `/public`  
Static HTML using global design system.

### AI Builder  
Located in `/public/builder.html`  
Uses serverless API endpoint `/api/generate-template`.

### Domain System  
Located in `/api/domain`  
Handles:

- Domain search  
- Domain pricing  
- Domain registration  
- WHOIS  

---

# 5. Environment Variables

Add these to your deployment environment variables (Vercel or other):

OPENPROVIDER_USERNAME=""
OPENPROVIDER_PASSWORD=""
OPENPROVIDER_API_URL="https://api.openprovider.eu/v1beta"

Code

---

# 6. Running Locally

npm run dev

Code

This starts:

- Local static server  
- Local serverless dev (e.g. `npx vercel dev` or `node dev-server.mjs`)

---

# 7. Deployment Workflow

This project is designed to deploy as a Vercel project using the `/api` serverless functions. Suggested steps:

- Create a Vercel project and link the repository.
- Add environment variables in the Vercel dashboard: `OPENPROVIDER_USERNAME`, `OPENPROVIDER_PASSWORD`, `OPENPROVIDER_API_URL`.
- Deploy to production and verify `/api/*` endpoints respond with JSON.

For local testing, use `npx vercel dev` or run `node dev-server.mjs` to host the `api/` handlers on `http://127.0.0.1:3000`.

---

# 8. Using Copilot

Copilot is configured to:

- Maintain the global design system
- Suggest serverless API route implementations under `api/`
- Extend domain integration
- Build new pages
- Keep code consistent

See `COPILOT_WORKSPACE.md` for prompts.

---

# 9. Code Style

- No inline CSS or JS
- Use `bwai-*` class system
- Use modular serverless API routes under `api/`
- Keep functions pure and testable

---

# 10. Support

Contact Ajay (Founder & Creative Technologist) for architecture questions.
