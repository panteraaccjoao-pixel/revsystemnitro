const fs = require('fs');
let html = fs.readFileSync('C:/Users/seven/Downloads/rev-frontend/app/page.tsx', 'utf8');

// The original HTML uses Framer Motion which sets opacity:0 and some transform (e.g. translateY)
// We will replace opacity:0 with opacity:1 so the elements are visible.
html = html.replace(/opacity:0/g, 'opacity:1');
// And we also want to remove any initial transform that might offset the element
html = html.replace(/transform:[^;"']*(?:;|\b)/g, '');

fs.writeFileSync('C:/Users/seven/Downloads/rev-frontend/app/page.tsx', html);
console.log('Fixed animations in page.tsx');
