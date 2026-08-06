const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/page.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Vamos buscar e substituir os links do Discord.
  // Procuramos por href="http://discord.REV SYSTEMty.com/" ou links semelhantes do Discord
  const regex = /href="https?:\/\/(?:discord\.[a-z\.]+|discord\.gg)\/[a-zA-Z0-9_-]*"/g;
  
  // Vamos ver se o link está no formato do REV SYSTEMty.com
  content = content.replace(/href="http:\/\/discord\.REV SYSTEMty\.com\/?"/g, 'href="https://discord.gg/CXYS4my5YX"');
  content = content.replace(/href="http:\/\/discord\.stormty\.com\/?"/g, 'href="https://discord.gg/CXYS4my5YX"');
  content = content.replace(/href="https:\/\/discord\.gg\/[a-zA-Z0-9]+"/g, 'href="https://discord.gg/CXYS4my5YX"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Links do Discord atualizados com sucesso em app/page.tsx');
} else {
  console.log('Arquivo app/page.tsx não encontrado.');
}
