const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/seven/Downloads/pagina inical/produtos';
const destDir = 'C:/Users/seven/Downloads/rev-frontend/public/produtos';

// Ensure destDir exists
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

// Copy function
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy css and js
copyRecursiveSync(path.join(srcDir, 'css'), path.join(destDir, 'css'));
copyRecursiveSync(path.join(srcDir, 'js'), path.join(destDir, 'js'));

// Read and process index.html
let html = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');

// Replace StorM with REV SYSTEM
html = html.replace(/StorM/g, 'REV SYSTEM');
html = html.replace(/stormty/g, 'revsystem');
html = html.replace(/STORM/g, 'REV SYSTEM');
html = html.replace(/icon_668d8eb875c95764\.png/g, 'rev_system.mp4');

// Create Empty State HTML
const emptyStateHtml = `
<main class="pt-24 relative min-h-screen"></main>
`;

// Replace the main tag contents
html = html.replace(/<main[^>]*>[\s\S]*?<\/main>/, emptyStateHtml);

// Inject theme colors (Red) and layout fixes
html = html.replace('</head>', `
<style id="rev-system-theme">
  /* Pure black background for main containers */
  body, .min-h-screen, .bg-background, section, main {
    background-color: #000000 !important;
    background-image: none !important;
  }
  
  /* Background Ambient Glow */
  body::before {
    content: '';
    position: fixed;
    top: -20%;
    left: -10%;
    width: 120%;
    height: 100vh;
    background: radial-gradient(ellipse at top, rgba(220, 38, 38, 0.25), transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  
  /* Solid Dark Cards (Like Membros Page) */
  .bg-card, .bg-\\[#0a0a0a\\], .border-border\\/40 {
    background-color: #080808 !important; 
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    position: relative;
    z-index: 10;
  }
  
  /* The glow effect on hover for cards */
  .bg-card:hover, .bg-\\[#0a0a0a\\]:hover {
    box-shadow: 0 15px 40px -10px rgba(220, 38, 38, 0.4) !important;
    border-color: rgba(220, 38, 38, 0.5) !important;
    transform: translateY(-4px) !important;
  }
  
  /* Header without the red line */
  header {
    border-bottom: none !important;
    box-shadow: none !important;
    background-color: rgba(0, 0, 0, 0.8) !important;
  }
  
  /* Subtle red glow on the videos */
  video {
    box-shadow: 0 0 15px rgba(220, 38, 38, 0.2) !important;
  }
</style>

<style>
  :root {
    --primary: 0 84.2% 60.2%; /* Red primary */
  }
  .bg-primary { background-color: hsl(var(--primary)) !important; }
  .text-primary { color: hsl(var(--primary)) !important; }
  .border-primary { border-color: hsl(var(--primary)) !important; }
  .fill-primary { fill: hsl(var(--primary)) !important; }
</style>
<script>
  window.addEventListener('load', () => {
    // Fix logos
    document.querySelectorAll('img[alt="REV SYSTEM"]').forEach(img => {
      const v = document.createElement('video');
      v.src = '/rev_system.mp4';
      v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
      v.className = img.className;
      v.width = 32; v.height = 32;
      img.replaceWith(v);
    });
    
    // Override fetch to stop it from erroring out and removing our empty state
    const originalFetch = window.fetch;
    window.fetch = async function() {
       return new Response(JSON.stringify({}), { status: 200 });
    };
  });
</script>
</head>
`);

// Write the finalized html
fs.writeFileSync(path.join(destDir, 'index.html'), html);
console.log('Successfully built /produtos HTML with Empty State');

// Also create Next.js route for app/produtos/page.tsx
const appDir = 'C:/Users/seven/Downloads/rev-frontend/app/produtos';
if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });

const pageTsx = `"use client";
import { useEffect, useState } from 'react';

export default function Produtos() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <iframe src="/produtos/index.html" className="w-full h-full border-none outline-none" style={{ display: 'block' }} />
    </div>
  );
}
`;

fs.writeFileSync(path.join(appDir, 'page.tsx'), pageTsx);
console.log('Successfully created app/produtos/page.tsx Next.js route');
