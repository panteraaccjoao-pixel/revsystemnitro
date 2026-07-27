const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/\/cadastro/g, '/register');
fs.writeFileSync(file, c);
console.log('Fixed links in Home page to point to /register');
