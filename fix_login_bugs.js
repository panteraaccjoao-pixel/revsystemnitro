const fs = require('fs');

// 1. Fix broken logo in login chunk
const chunkFile = 'C:/Users/seven/Downloads/rev-frontend/public/_next/static/chunks/app/login/page-116eb32b13d7c535_dpl=dpl_BKvSmira47BfFQzbSGohHtaPAXyy.js';
let c = fs.readFileSync(chunkFile, 'utf8');
c = c.replace(/"img",\{src:"\/icon_668d8eb875c95764\.png"/g, '"video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,src:"/rev_system.mp4"');
fs.writeFileSync(chunkFile, c);
console.log('Fixed broken logo in login chunk');

// 2. Fix auto-click script in cadastro/index.html
const cadastroHtml = 'C:/Users/seven/Downloads/rev-frontend/public/cadastro/index.html';
let html = fs.readFileSync(cadastroHtml, 'utf8');
html = html.replace(/Criar conta/g, 'Criar agora');
fs.writeFileSync(cadastroHtml, html);
console.log('Fixed auto-click script for Cadastro page');
