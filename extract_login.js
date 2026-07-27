const fs = require('fs');
const file = 'C:/Users/seven/Downloads/pagina inical/login/js/app/login/page-268e3f9a76d8b022.js';
if (fs.existsSync(file)) {
  const c = fs.readFileSync(file, 'utf8');
  const texts = c.match(/[\"'][^\"']{4,}?[\"']/g) || [];
  console.log(texts.join('\n').substring(0, 500));
} else {
  const dir = 'C:/Users/seven/Downloads/pagina inical/login/js/app/login';
  console.log(fs.readdirSync(dir).join(', '));
}
