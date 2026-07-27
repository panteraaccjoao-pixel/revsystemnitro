const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/seven/Downloads/pagina inical/cassino';
const destDir = 'C:/Users/seven/Downloads/rev-frontend/public/cassino';

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

console.log('Copying cassino folder to public/cassino...');
copyDirSync(srcDir, destDir);

// Fix index.html
const htmlPath = path.join(destDir, 'index.html');
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Replace the static logo
  html = html.replace(/<img[^>]*src="\/icon_668d8eb875c95764\.png"[^>]*>/g, '<video autoplay loop muted playsinline src="/rev_system.mp4" class="w-9 h-9 rounded-lg object-cover"></video>');
  
  // Also replace StorM if present in HTML
  html = html.replace(/StorM/g, 'REV SYSTEM');
  
  // Inject script for iframe navigation
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
  
  fs.writeFileSync(htmlPath, html);
  console.log('Updated cassino/index.html');
}

// Fix CSS (change orange to red)
function fixCSS(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixCSS(fullPath);
    } else if (entry.name.endsWith('.css')) {
      let css = fs.readFileSync(fullPath, 'utf8');
      css = css.replace(/#ff6b35/ig, '#fc413d')
               .replace(/#f46a25/ig, '#fc413d')
               .replace(/#ff8c42/ig, '#fc413d');
      // Append CSS var override just to be safe
      css += '\n:root { --primary: 350 100% 55% !important; }\n';
      fs.writeFileSync(fullPath, css);
    }
  }
}
const cssDir = path.join(destDir, 'css');
if (fs.existsSync(cssDir)) {
  fixCSS(cssDir);
  console.log('Updated CSS colors in cassino/css/');
}

// Fix JS (change StorM to REV SYSTEM and update logo URL)
function fixJS(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixJS(fullPath);
    } else if (entry.name.endsWith('.js')) {
      let js = fs.readFileSync(fullPath, 'utf8');
      
      // Replace text
      let modified = false;
      if (js.includes('StorM')) {
        js = js.replace(/StorM/g, 'REV SYSTEM');
        modified = true;
      }
      if (js.includes('oty5x6aavz.ufs.sh')) {
        js = js.replace(/https?:\/\/oty5x6aavz\.ufs\.sh\/f\/OPD92Rl4PH1gj1sRjgaN8ZqVtJSWgu61nz9QOdX7bviGTEm3/g, '/rev_system.mp4');
        modified = true;
      }
      // If the JS uses the image tag for the logo, try to swap to video if possible
      if (js.includes('"/rev_system.mp4"') && js.includes('i.default,{src:"/rev_system.mp4"')) {
         js = js.replace(/i\.default,\{src:"\/rev_system\.mp4"/g, '"video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,src:"/rev_system.mp4"');
         modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, js);
      }
    }
  }
}
const jsDir = path.join(destDir, 'js');
if (fs.existsSync(jsDir)) {
  fixJS(jsDir);
  console.log('Updated JS texts and logos in cassino/js/');
}

// Generate the Next.js page component
const pageDir = 'C:/Users/seven/Downloads/rev-frontend/app/cassino';
if (!fs.existsSync(pageDir)) {
  fs.mkdirSync(pageDir, { recursive: true });
}

const pageContent = `"use client";
import { useEffect, useState } from 'react';

export default function Cassino() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <iframe src="/cassino/index.html" className="w-full h-full border-none outline-none" style={{ display: 'block' }} />
    </div>
  );
}
`;
fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent);
console.log('Generated app/cassino/page.tsx');
