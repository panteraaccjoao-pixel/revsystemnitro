const fs = require('fs');
const chunkPath = 'C:/Users/seven/Downloads/rev-frontend/public/_next/static/chunks/app/login/page-116eb32b13d7c535_dpl=dpl_BKvSmira47BfFQzbSGohHtaPAXyy.js';
const loginHtmlPath = 'C:/Users/seven/Downloads/rev-frontend/public/login/index.html';

// 1. Patch the chunk
let chunk = fs.readFileSync(chunkPath, 'utf8');
const oldKey = '"6LfTzQUsAAAAAFa09CVVytz9LHSlLJ_ZgT5QKjgM"';
const newKey = '(window.RECAPTCHA_SITE_KEY || "6LfTzQUsAAAAAFa09CVVytz9LHSlLJ_ZgT5QKjgM")';
if (chunk.includes(oldKey) && !chunk.includes('window.RECAPTCHA_SITE_KEY')) {
    chunk = chunk.replace(oldKey, newKey);
    fs.writeFileSync(chunkPath, chunk);
    console.log('Patched JS chunk for dynamic Captcha key');
}

// 2. Inject script into login/index.html
let html = fs.readFileSync(loginHtmlPath, 'utf8');
if (!html.includes('RECAPTCHA_SITE_KEY')) {
    const scriptToInject = `
    <!-- CONFIGURE SEU CAPTCHA AQUI -->
    <script>
      // Coloque a sua chave de API (Sitekey) do Google reCAPTCHA v2 aqui embaixo!
      window.RECAPTCHA_SITE_KEY = "SUA_CHAVE_DE_API_AQUI";
    </script>
    `;
    
    // Inject right before </head>
    html = html.replace('</head>', scriptToInject + '\n</head>');
    fs.writeFileSync(loginHtmlPath, html);
    console.log('Injected Captcha config block into HTML');
}
