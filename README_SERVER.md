Using XAMPP + PHP proxy (no Node required)

This project includes a small PHP proxy `proxy.php` that forwards requests to Google's Generative Language API using a server-side API key. This lets you run locally with XAMPP (Apache + PHP) and keeps the API key off the browser.

Steps:
1. Install XAMPP: https://www.apachefriends.org/index.html and start Apache from the XAMPP Control Panel.
2. Copy the project folder into XAMPP's `htdocs` (for example `C:\xampp\htdocs\project`).
3. Create the server-side key file:
   - In the project folder, copy `google_key.php.example` to `google_key.php` and paste your Google API key:
     ```php
     <?php
     $GOOGLE_API_KEY = 'YOUR_REAL_KEY_HERE';
     ```
   - IMPORTANT: Do not commit `google_key.php` to source control.
4. Open in browser: http://localhost/project/index.html
5. Use the page: choose a PDF, enter a prompt, click Send. The browser will POST to `/proxy.php`, which calls Google and returns JSON.

Troubleshooting:
- If Apache won't start, change the port to 8080 in XAMPP Control Panel → Config → httpd.conf (change Listen 80 to Listen 8080) and restart. Then open http://localhost:8080/project/index.html
- If Google returns errors, ensure Generative AI API is enabled and billing is configured for the project.
- If proxy returns `Server configuration missing google_key.php`, ensure `google_key.php` exists and is readable by Apache.

This approach avoids placing the API key in the browser and requires no Node.js.
