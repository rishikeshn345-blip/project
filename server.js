import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({limit: '10mb'}));

// Serve static frontend files from the project root
app.use(express.static(path.join(__dirname)));

// Google Generative Language (Gemini) configuration
// Provide GOOGLE_API_KEY in .env (recommended to restrict the key in console)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = process.env.MODEL || 'models/text-bison-001'; // change to gemini model id if available
if (!GOOGLE_API_KEY) {
  console.warn('GOOGLE_API_KEY not set. Copy .env.example to .env and set GOOGLE_API_KEY.');
}

// helper to call Google Generative Language REST API using API key auth
async function callGemini(prompt, pdfText) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta2/${MODEL}:generate?key=${GOOGLE_API_KEY}`;
  const body = {
    prompt: {
      text: `PDF CONTENT:\n${pdfText}\n\nUSER PROMPT:\n${prompt}`
    },
    temperature: 0.2,
    maxOutputTokens: 800
  };

  const r = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Google API error ${r.status}: ${txt}`);
  }

  const json = await r.json();

  // Extract text from response (try several possible shapes)
  let aiText = '';
  // common location: json.candidates[0].output
  if (json?.candidates?.[0]?.output) aiText = json.candidates[0].output;
  // or newer: json?.output[0]?.content -> array of chunks {type: 'text', text: '...'}
  if (!aiText && Array.isArray(json?.output)) {
    aiText = json.output.map(block => {
      if (Array.isArray(block.content)) return block.content.map(c => c.text || c).join('');
      return block.text || '';
    }).join('\n');
  }
  // fallback: join candidate content text fields
  if (!aiText && Array.isArray(json?.candidates)) {
    const first = json.candidates[0];
    if (first?.content && Array.isArray(first.content)) aiText = first.content.map(c=>c.text||'').join('');
  }

  return aiText || '';
}

// POST /api/generate — receives { prompt, pdfText }
app.post('/api/generate', async (req, res) => {
  try {
    const {prompt, pdfText} = req.body;
    if (!prompt || !pdfText) return res.status(400).send('Missing prompt or pdfText');

    const aiText = await callGemini(prompt, pdfText);
    return res.json({response: aiText});
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
