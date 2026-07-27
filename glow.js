const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/public/produtos/index.html';
let html = fs.readFileSync(file, 'utf8');

const glowDivs = `
<div class="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_50%)] pointer-events-none z-0"></div>
<div class="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.5] pointer-events-none z-0"></div>
`;

// Remove existing glows if any to avoid duplication
html = html.replace(/<div class="fixed inset-0 bg-\[radial-gradient[^>]+><\/div>\s*/g, '');
html = html.replace(/<div class="fixed inset-0 bg-\[linear-gradient[^>]+><\/div>\s*/g, '');

html = html.replace('<div class="min-h-screen bg-background relative">', '<div class="min-h-screen bg-background relative">' + glowDivs);

fs.writeFileSync(file, html);
console.log('Glow added successfully to /produtos');
