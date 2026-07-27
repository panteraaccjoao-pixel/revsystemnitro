const fs = require('fs');
const content = fs.readFileSync('C:/Users/seven/Downloads/rev-frontend/public/login/index.html', 'utf8');
const scripts = content.match(/<script[^>]*src="([^"]+)"/g) || [];
console.log(scripts);
