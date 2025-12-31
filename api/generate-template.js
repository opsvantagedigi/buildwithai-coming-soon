import { json, error } from './_lib/response.js';
import { generateTemplate } from './_lib/ai.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return error(res, 'Method Not Allowed', 405);
  let body = {};
  try { body = req.body || await parseJson(req); } catch (e) { return error(res, 'INVALID_JSON', 400); }
  const prompt = (body && String(body.prompt || '').trim()) || '';
  if (!prompt) return error(res, 'INVALID_PROMPT', 400);
  const tpl = await generateTemplate(prompt);
  return json(res, tpl);
}

async function parseJson(req){
  return new Promise((resolve, reject)=>{
    let data=''; req.on('data',c=>data+=c); req.on('end',()=>{ try{ resolve(data?JSON.parse(data):{}); }catch(e){ resolve({}); } }); req.on('error', reject);
  });
}
