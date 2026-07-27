const fs = require('fs');
const html = fs.readFileSync('C:/Users/seven/Downloads/pagina inical/produtos/index.html', 'utf8');
const mainContent = html.substring(html.indexOf('<main'), html.indexOf('</main>') + 7);
console.log(mainContent.substring(0, 800));
