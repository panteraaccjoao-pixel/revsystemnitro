const fs = require('fs');
const file = 'C:/Users/seven/Downloads/pagina inical/cassino/js/app/cassino/page-27a2c8146fdac551.js';
const c = fs.readFileSync(file, 'utf8');
const texts = c.match(/[\"'][^\"']{4,}?[\"']/g) || [];
const uniqueTexts = [...new Set(texts)].filter(t => t.length > 6 && !t.includes('function') && !t.includes('{') && !t.includes('}'));
console.log(uniqueTexts.join('\n'));
