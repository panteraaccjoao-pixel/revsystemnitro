const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'public/login/index.html',
  'public/cadastro/index.html',
  'public/cassino/index.html'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Substitui referências de favicon antigo por /icon.png
    content = content.replace(/href="[^"]*icon_[^"]*\.png"/g, 'href="/icon.png"');
    content = content.replace(/href="[^"]*apple-icon_[^"]*\.png"/g, 'href="/icon.png"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated favicon links in ${file} successfully.`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
