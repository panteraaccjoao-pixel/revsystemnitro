const fs = require('fs');
const files = [
  'C:/Users/seven/Downloads/rev-frontend/app/produtos/categoria/[id]/VariationClient.tsx',
  'C:/Users/seven/Downloads/rev-frontend/app/produtos/categoria/[id]/page.tsx',
  'C:/Users/seven/Downloads/rev-frontend/public/produtos/index.html'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace Tailwind classes
    content = content.replace(/orange-500/g, 'red-600');
    content = content.replace(/orange-400/g, 'red-500');
    
    // Replace RGB colors used for glows (rgba(249,115,22 -> orange, replace with red)
    content = content.replace(/rgba\(249,115,22,/g, 'rgba(220,38,38,');
    
    fs.writeFileSync(file, content);
    console.log(`Updated colors in ${file}`);
  }
}
