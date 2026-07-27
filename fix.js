const fs = require('fs');
let code = fs.readFileSync('C:/Users/seven/Downloads/rev-frontend/convert_membros.js', 'utf8');
code = code.replace(/<!-- (.*?) -->/g, '{/* $1 */}');
code = code.replace(/class="/g, 'className="');
fs.writeFileSync('C:/Users/seven/Downloads/rev-frontend/convert_membros.js', code);
console.log('Fixed JSX comments and classNames in convert_membros.js');
