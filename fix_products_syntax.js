const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/app/admin/products/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');

fs.writeFileSync(file, c);
console.log('Fixed syntax errors in products page');
