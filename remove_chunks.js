const fs = require('fs');
const path = require('path');

const files = [
  'public/cadastro/index.html',
  'public/login/index.html',
  'public/cassino/index.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove todas as tags <script src> que apontam para /_next_assets/static/chunks/
  content = content.replace(/<script\s+src="\/\_next_assets\/static\/chunks\/[^"]+"\s*[^>]*><\/script>/g, '');
  // Remove preload de scripts dos chunks
  content = content.replace(/<link\s+rel="preload"\s+as="script"[^>]*\/_next_assets\/static\/chunks\/[^>]*>/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Chunks removidos de ${file}`);
});
