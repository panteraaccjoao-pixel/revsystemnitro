const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/public/_next/static/chunks/app/login/page-116eb32b13d7c535_dpl=dpl_BKvSmira47BfFQzbSGohHtaPAXyy.js';
const c = fs.readFileSync(file, 'utf8');
const imgs = c.match(/[\"'][^\"]+\.(png|jpg|jpeg|gif|webp)[\"']/ig) || [];
console.log(imgs);
