const fs = require('fs');
const path = require('path');

const srcLoginHTML = 'C:/Users/seven/Downloads/rev-frontend/public/login/index.html';
const destCadastroDir = 'C:/Users/seven/Downloads/rev-frontend/public/cadastro';
const pageDir = 'C:/Users/seven/Downloads/rev-frontend/app/cadastro';

// 1. Create public/cadastro/index.html
if (!fs.existsSync(destCadastroDir)) fs.mkdirSync(destCadastroDir, { recursive: true });
const destCadastroHTML = path.join(destCadastroDir, 'index.html');
fs.copyFileSync(srcLoginHTML, destCadastroHTML);

let html = fs.readFileSync(destCadastroHTML, 'utf8');

// Inject script to click "Criar conta" automatically
const clickScript = `
<script>
  // Wait for React to hydrate, then click the "Criar conta" button
  window.addEventListener('load', () => {
    const tryClick = (attempts) => {
      if (attempts <= 0) return;
      const elements = Array.from(document.querySelectorAll('*'));
      const btn = elements.find(el => el.textContent && el.textContent.trim() === 'Criar conta');
      if (btn && btn.click) {
        btn.click();
        // Since React might take a few ms to swap the DOM, click it a couple of times just to be sure
      } else {
        setTimeout(() => tryClick(attempts - 1), 100);
      }
    };
    setTimeout(() => tryClick(20), 200);
  });
</script>
</body>`;

html = html.replace(/<\/body>/i, clickScript);
fs.writeFileSync(destCadastroHTML, html);
console.log('Created public/cadastro/index.html with auto-click script');

// 2. Create app/cadastro/page.tsx
if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

const pageContent = `"use client";
import { useEffect, useState } from 'react';

export default function Cadastro() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <iframe src="/cadastro/index.html" className="w-full h-full border-none outline-none" style={{ display: 'block' }} />
    </div>
  );
}
`;
fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent);
console.log('Generated app/cadastro/page.tsx');
