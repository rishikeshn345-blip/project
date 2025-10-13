// client.js — ES module
// - extracts text from a selected PDF using pdf.js (CDN)
// - sends { prompt, pdfText } to /api/generate via fetch
// - saves response in localStorage and navigates to responce.html

import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.min.js')
  .then(() => {
    // pdfjsLib is exported to window when loading the CDN bundle
    // ensure the workerSrc is set so pdf.js can load its worker from the CDN
    try {
      if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';
      }
    } catch (e) {
      console.warn('Could not set pdf.js workerSrc', e);
    }
    init();
  })
  .catch((err) => {
    console.error('Failed to load pdf.js', err);
    document.getElementById('status').textContent = 'Failed to load PDF library.';
  });

function init() {
  const sendBtn = document.getElementById('sendBtn');
  const pdfFile = document.getElementById('pdfFile');
  const promptEl = document.getElementById('prompt');
  const status = document.getElementById('status');

  sendBtn.addEventListener('click', async () => {
    status.textContent = '';
    const file = pdfFile.files[0];
    const prompt = promptEl.value.trim();

    if (!file) return (status.textContent = 'Please select a PDF file.');
    if (!prompt) return (status.textContent = 'Please enter a prompt.');

      try {
        if (!window.GOOGLE_API_KEY) throw new Error('Missing GOOGLE_API_KEY. Create config.js from config.example.js and add your key.');
        sendBtn.disabled = true;
        sendBtn.textContent = 'Extracting...';

        const pdfText = await extractPdfText(file);

        sendBtn.textContent = 'Calling Gemini...';

        // Call Google Generative Language directly from client (WARNING: exposing API key in browser)
        const endpoint = `https://generativelanguage.googleapis.com/v1beta2/${window.MODEL || 'models/text-bison-001'}:generate?key=${window.GOOGLE_API_KEY}`;
        const body = {
          prompt: { text: `PDF CONTENT:\n${pdfText}\n\nUSER PROMPT:\n${prompt}` },
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
          throw new Error('API error: ' + txt);
        }

        const json = await r.json();
        // try several response shapes
        let aiText = '';
        if (json?.candidates?.[0]?.output) aiText = json.candidates[0].output;
        if (!aiText && Array.isArray(json?.output)) {
          aiText = json.output.map(block => {
            if (Array.isArray(block.content)) return block.content.map(c => c.text || c).join('');
            return block.text || '';
          }).join('\n');
        }
        if (!aiText && Array.isArray(json?.candidates)) {
          const first = json.candidates[0];
          if (first?.content && Array.isArray(first.content)) aiText = first.content.map(c=>c.text||'').join('');
        }

        localStorage.setItem('ai_response', aiText || '');
        window.location.href = 'responce.html';
      } catch (err) {
        console.error(err);
        status.textContent = 'Error: ' + (err.message || err);
      } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send to AI';
      }
  });
}

// Uses pdf.js to extract text from all pages
async function extractPdfText(file) {
  // read file into array buffer
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({data: arrayBuffer}).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str || '').join(' ');
    fullText += '\n\n' + strings;
  }
  // safety: trim the extracted text to a reasonable size to avoid huge payloads
  const trimmed = fullText.trim();
  const MAX_CHARS = 120000; // ~120k characters (adjust as needed)
  if (trimmed.length > MAX_CHARS) return trimmed.slice(0, MAX_CHARS) + '\n\n...[truncated]';
  return trimmed;
}
