const fs = require('fs');
const path = require('path');

const srcNext = 'C:/Users/seven/Downloads/pagina inical/www.stormty.com/_next';
const destNext = 'C:/Users/seven/Downloads/rev-frontend/public/_next';
const srcLoginHTML = 'C:/Users/seven/Downloads/pagina inical/login/index.html';
const destLoginDir = 'C:/Users/seven/Downloads/rev-frontend/public/login';

// Copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy _next assets to ensure all login chunks are present
console.log('Copying all _next assets...');
if (fs.existsSync(srcNext)) {
  copyDirSync(srcNext, destNext);
} else {
  console.log('WARNING: Source _next not found at ' + srcNext);
}

// 2. Setup public/login/index.html
if (!fs.existsSync(destLoginDir)) fs.mkdirSync(destLoginDir, { recursive: true });
const destLoginHTML = path.join(destLoginDir, 'index.html');
fs.copyFileSync(srcLoginHTML, destLoginHTML);

let html = fs.readFileSync(destLoginHTML, 'utf8');
// Fix paths
html = html.replace(/\.\.\/\.\.\/www\.stormty\.com\/_next\//g, '/_next/');
html = html.replace(/\.\.\/\.\.\/www\.REV SYSTEMty\.com\/_next\//g, '/_next/');
// Fix logo
html = html.replace(/<img[^>]*src="\/icon_668d8eb875c95764\.png"[^>]*>/g, '<video autoplay loop muted playsinline src="/rev_system.mp4" class="w-9 h-9 rounded-lg object-cover"></video>');
// Fix text
html = html.replace(/StorM/g, 'REV SYSTEM');
// Add iframe nav script
const navScript = `
<script>
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a && a.href.startsWith(window.location.origin)) {
      e.preventDefault();
      window.parent.location.href = a.href;
    }
  });
</script>
</body>`;
html = html.replace(/<\/body>/i, navScript);
fs.writeFileSync(destLoginHTML, html);
console.log('Updated public/login/index.html');

// 3. Fix CSS globally in public/_next/static/css to enforce Red Theme
function fixCSS(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixCSS(fullPath);
    } else if (entry.name.endsWith('.css')) {
      let css = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      if (css.includes('#ff6b35') || css.includes('#f46a25') || css.includes('#ff8c42')) {
        css = css.replace(/#ff6b35/ig, '#fc413d')
                 .replace(/#f46a25/ig, '#fc413d')
                 .replace(/#ff8c42/ig, '#fc413d');
        modified = true;
      }
      if (css.includes('--primary:#dc2626')) {
        css = css.replace(/--primary:#dc2626/g, '--primary:#fc413d');
        modified = true;
      }
      if (css.includes('--primary-foreground:#0a0b0f')) {
        css = css.replace(/--primary-foreground:#0a0b0f/g, '--primary-foreground:#ffffff');
        modified = true;
      }
      // Remove any injected broken tags
      if (css.includes(':root { --primary: 350 100% 55% !important; }')) {
        css = css.replace(/:root \{ --primary: 350 100% 55% !important; \}/g, '');
        modified = true;
      }
      if (modified) fs.writeFileSync(fullPath, css);
    }
  }
}
fixCSS(path.join(destNext, 'static/css'));
console.log('Updated CSS for red theme');

// 4. Fix JS texts globally in public/_next/static/chunks
function fixJS(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixJS(fullPath);
    } else if (entry.name.endsWith('.js')) {
      let js = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      if (js.includes('StorM')) {
        js = js.replace(/StorM/g, 'REV SYSTEM');
        modified = true;
      }
      if (js.includes('oty5x6aavz.ufs.sh')) {
        js = js.replace(/https?:\/\/oty5x6aavz\.ufs\.sh\/f\/OPD92Rl4PH1gj1sRjgaN8ZqVtJSWgu61nz9QOdX7bviGTEm3/g, '/rev_system.mp4');
        modified = true;
      }
      if (modified) fs.writeFileSync(fullPath, js);
    }
  }
}
fixJS(path.join(destNext, 'static/chunks'));
console.log('Updated JS chunks');

// 5. Create app/login/page.tsx
const pageDir = 'C:/Users/seven/Downloads/rev-frontend/app/login';
if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

const pageContent = `"use client";
import { useEffect, useState } from 'react';

export default function Login() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <iframe src="/login/index.html" className="w-full h-full border-none outline-none" style={{ display: 'block' }} />
    </div>
  );
}
`;
fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent);
console.log('Generated app/login/page.tsx');
