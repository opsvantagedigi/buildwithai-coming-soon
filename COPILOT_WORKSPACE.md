# Copilot Workspace Configuration — BUILD WITH AI

This document defines how Copilot should behave when generating or modifying code in this repository.

---

# 1. Global Rules

Copilot must:

- Use the global design system (`layout.css`)
- Use the `bwai-*` class naming convention
- Avoid inline CSS or JS
- Keep Worker routes modular
- Use the OpenProvider REST client (`openproviderRequest`)
- Maintain consistent formatting

---

# 2. Worker Development Prompts

Use these prompts when generating Worker modules:

- MODULE 1: OpenProvider REST client  
- MODULE 2: /domain/check  
- MODULE 3: /domain/pricing  
- MODULE 4: /domain/register  
- MODULE 5: /domain/whois  
- MODULE 6: Worker router  

(See MASTER PROMPT PACK for full text.)

---

# 3. Frontend Development Prompts

Copilot should:

- Use `layout.js` for all JS logic  
- Use `bwai-*` classes  
- Keep HTML semantic  
- Maintain mobile responsiveness  

---

# 4. Page Generation Prompts

Copilot can generate:

- pricing.html  
- domains.html  
- terms.html  
- privacy.html  

Using the prompts in the MASTER PROMPT PACK.

---

# 5. Builder Integration Prompts

Copilot should maintain:

- AI modal  
- Domain purchase flow  
- DNS provisioning UI  
- Template injection logic  

---

# 6. Future Enhancements

Copilot may be asked to generate:

- Dashboard domain management  
- Subscription billing  
- AI template marketplace  
