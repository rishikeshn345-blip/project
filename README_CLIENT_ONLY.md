Client-only mode README

This variant runs the whole app in the browser (HTML + JS). It calls Google Generative Language (Gemini) directly from the client using an API key stored in `config.js`.

WARNING: This exposes your API key to anyone who opens the page. Only use this for local testing or quick demos. For production, use a backend proxy or service account.

Steps to run (client-only):
1. Copy `config.example.js` to `config.js` and set your Google API key:
   // config.js
   window.GOOGLE_API_KEY = 'YOUR_KEY_HERE';
   window.MODEL = 'models/text-bison-001'; // optional

   IMPORTANT: Add `config.js` to your `.gitignore` so you don't accidentally commit keys:
   # .gitignore
   config.js

2. Open `index.html` in your browser (double-click or use a static server). No Node required.

3. Select a PDF, enter a prompt, click "Send to AI". The response will be shown in `responce.html`.

Notes:
- For larger PDFs or production, use the server-based approach to avoid exposing keys and to handle chunking and costs.
- If you want me to revert to the server-side approach or add service-account-based auth, tell me and I will update the files.

Security checklist (quick):
- Add `config.js` to `.gitignore`.
- Use a restricted API key (limit by HTTP referrers or IPs) in Google Cloud Console.
- Rotate the key if it is exposed (delete and create a new one in Google Cloud Console).
