const fs = require('fs');

// Update app/login/page.tsx
const loginFile = 'C:/Users/seven/Downloads/rev-frontend/app/login/page.tsx';
let loginContent = fs.readFileSync(loginFile, 'utf8');
loginContent = loginContent.replace(
  '<iframe src="/login/index.html"',
  '<iframe src={`/login/index.html?captcha=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}`}'
);
fs.writeFileSync(loginFile, loginContent);

// Update app/register/page.tsx
const registerFile = 'C:/Users/seven/Downloads/rev-frontend/app/register/page.tsx';
let registerContent = fs.readFileSync(registerFile, 'utf8');
registerContent = registerContent.replace(
  '<iframe src="/login/index.html?mode=register"',
  '<iframe src={`/login/index.html?mode=register&captcha=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}`}'
);
fs.writeFileSync(registerFile, registerContent);

// Update public/login/index.html
const indexFile = 'C:/Users/seven/Downloads/rev-frontend/public/login/index.html';
let indexContent = fs.readFileSync(indexFile, 'utf8');
const scriptToInject = `
    <!-- SCRIPT DO CAPTCHA DINÂMICO VIA .ENV -->
    <script>
      const params = new URLSearchParams(window.location.search);
      const envCaptcha = params.get('captcha');
      if (envCaptcha) {
        window.RECAPTCHA_SITE_KEY = envCaptcha;
      }
    </script>
`;
// Replace the old manual configuration block
indexContent = indexContent.replace(/<!-- CONFIGURE SEU CAPTCHA AQUI -->[\s\S]*?<\/script>/, scriptToInject);
fs.writeFileSync(indexFile, indexContent);

// Create .env.example
const envExampleContent = `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=SUA_CHAVE_DE_API_AQUI\n`;
fs.writeFileSync('C:/Users/seven/Downloads/rev-frontend/.env', envExampleContent);
fs.writeFileSync('C:/Users/seven/Downloads/rev-frontend/.env.example', envExampleContent);

console.log('Successfully configured dynamic Captcha via Next.js .env');
