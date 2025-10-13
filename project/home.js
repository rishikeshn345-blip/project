document.addEventListener('DOMContentLoaded', () => {
  const pdfInput = document.getElementById('pdfFile');
  const fileName = document.getElementById('fileName');
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const resultText = document.getElementById('resultText');
  const promptEl = document.getElementById('prompt');

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  pdfInput.addEventListener('change', () => {
    const f = pdfInput.files[0];
    if (!f) {
      fileName.textContent = 'No file chosen';
      return;
    }
    fileName.textContent = f.name;
  });

  function showStatus(msg, isError = false) {
    status.textContent = msg;
    status.style.color = isError ? 'var(--danger)' : 'var(--muted)';
  }

  generateBtn.addEventListener('click', async () => {
    const file = pdfInput.files[0];
    const prompt = promptEl.value.trim();

    // client-side validation
    if (!file) return showStatus('Please choose a PDF file to upload.', true);
    if (file.type !== 'application/pdf') return showStatus('Only PDF files are allowed.', true);
    if (file.size > MAX_SIZE_BYTES) return showStatus('File is too large. Max 10MB.', true);
    if (!prompt) return showStatus('Please enter a prompt to continue.', true);

    showStatus('Preparing document and sending request...');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    // Mock a short async operation — replace with real upload/processing call
    try {
      await new Promise((res) => setTimeout(res, 1300));

      // Simple mocked response
      const summary = `Mock result for "${prompt}"\n\nFile: ${file.name}\nSize: ${Math.round(file.size/1024)} KB\n\nThis is a placeholder response. Replace this client-side mock with an actual upload and server-side PDF processing.`;

      resultText.textContent = summary;
      result.classList.remove('hidden');
      showStatus('Completed. See result below.');
    } catch (err) {
      showStatus('An unexpected error occurred. Please try again.', true);
      console.error(err);
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate';
    }
  });

  clearBtn.addEventListener('click', () => {
    pdfInput.value = '';
    fileName.textContent = 'No file chosen';
    promptEl.value = '';
    status.textContent = '';
    result.classList.add('hidden');
    resultText.textContent = '';
  });
});
