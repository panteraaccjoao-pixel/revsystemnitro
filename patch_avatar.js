const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/public/_next/static/chunks/app/login/page-116eb32b13d7c535_dpl=dpl_BKvSmira47BfFQzbSGohHtaPAXyy.js';
let c = fs.readFileSync(file, 'utf8');

const avatarUri = `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff' style='background-color:%23374151'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E`;

c = c.replace(/https:\/\/cdn\.discordapp\.com\/avatars\/1280673233347280948\/1caaf854b8f223e18054ce05e34d39f0\.png\?size=128/g, avatarUri);
c = c.replace(/Nicolas Fragoso/g, 'Lucas Almeida');

fs.writeFileSync(file, c);
console.log('Replaced avatar and name!');
