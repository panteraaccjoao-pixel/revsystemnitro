const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/public/_next/static/chunks/app/login/page-116eb32b13d7c535_dpl=dpl_BKvSmira47BfFQzbSGohHtaPAXyy.js';
const c = fs.readFileSync(file, 'utf8');
const idx = c.indexOf('Bem-vindo de volta');
console.log(c.substring(idx - 1000, idx));
