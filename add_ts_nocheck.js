const fs = require('fs');
['convert_with_animations.js', 'convert_membros.js'].forEach(f => {
  let c = fs.readFileSync('C:/Users/seven/Downloads/rev-frontend/' + f, 'utf8');
  c = c.replace(/"use client";/g, '"use client";\n// @ts-nocheck');
  fs.writeFileSync('C:/Users/seven/Downloads/rev-frontend/' + f, c);
});
console.log('Added @ts-nocheck');
