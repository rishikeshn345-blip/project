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
        // PHP server mode: send prompt+pdfText to server-side proxy which holds the API key
        sendBtn.disabled = true;
        sendBtn.textContent = 'Extracting...';

        const pdfText = await extractPdfText(file);

        sendBtn.textContent = 'Sending to server...';

        const res = await fetch('proxy.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, pdfText })
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error('Server error: ' + txt);
        }

        const data = await res.json();
        const aiText = data?.response || '';

        localStorage.setItem('ai_response', aiText);
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
