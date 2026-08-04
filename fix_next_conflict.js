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
    
    // Substitui "/_next/" por "/_next_assets/"
    content = content.replace(/\/_next\//g, '/_next_assets/');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file} successfully.`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
