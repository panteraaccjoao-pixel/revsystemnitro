const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/app/admin/users/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/\\`/g, '`');

fs.writeFileSync(file, c);
console.log('Fixed escaped backticks');
