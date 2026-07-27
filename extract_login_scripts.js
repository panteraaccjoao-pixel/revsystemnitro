const fs = require('fs');
const content = fs.readFileSync('C:/Users/seven/Downloads/pagina inical/login/index.html', 'utf8');
const scripts = content.match(/<script[^>]*src="([^"]+)"/g) || [];
console.log(scripts);
