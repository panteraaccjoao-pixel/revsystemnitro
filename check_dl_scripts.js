const fs = require('fs');
const file = 'C:/Users/seven/Downloads/cadastro/127.0.0.1_8081/dl/index.html';
const c = fs.readFileSync(file, 'utf8');
const scripts = c.match(/<script[^>]*src="([^"]+)"/g) || [];
console.log(scripts.filter(s => s.includes('app/')).join('\n'));
