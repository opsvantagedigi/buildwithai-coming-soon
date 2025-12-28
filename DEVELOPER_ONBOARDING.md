# Developer Onboarding Guide — BUILD WITH AI

Welcome to BUILD WITH AI.  
This guide will help new developers get set up quickly and understand the architecture.

---

# 1. Prerequisites

Install:

- Node.js 20+
- Git
- Cloudflare CLI (Wrangler)  # (removed—deployment instructions sanitized)
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
Uses Worker endpoint `/generate-template`.

### Domain System  
Located in `/worker/src`  
Handles:

- Domain search  
- Domain pricing  
- Domain registration  
- WHOIS  

---

# 5. Environment Variables

Add these to Cloudflare Worker settings:

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
- Worker in dev mode  

---

# 7. Deployment Workflow

Deployment instructions have been removed to prepare this repository for a clean, fresh Worker deployment process. Add detailed deployment steps (Pages, Workers, DNS, CI) when account and domain choices are finalized.

---

# 8. Using Copilot

Copilot is configured to:

- Maintain global design system  
- Generate Worker routes  
- Extend domain integration  
- Build new pages  
- Keep code consistent  

See `COPILOT_WORKSPACE.md` for prompts.

---

# 9. Code Style

- No inline CSS or JS  
- Use `bwai-*` class system  
- Use modular Worker routes  
- Keep functions pure and testable  

---

# 10. Support

Contact Ajay (Founder & Creative Technologist) for architecture questions.
