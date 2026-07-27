const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/app/page.tsx';
const c = fs.readFileSync(file, 'utf8');
const match = c.match(/href="([^"]+)"/g);
if (match) {
    console.log([...new Set(match)]);
} else {
    console.log('No links found');
}
