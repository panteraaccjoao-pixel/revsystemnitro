const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

if (c.includes('/login?mode=register')) {
  c = c.replace(/\/login\?mode=register/g, '/cadastro');
  fs.writeFileSync(file, c);
  console.log('Fixed links in Home page to point to /cadastro');
} else {
  console.log('No links pointing to /login?mode=register found');
}
