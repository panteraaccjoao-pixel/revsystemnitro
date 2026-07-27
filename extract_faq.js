const fs = require('fs');
const html = fs.readFileSync('app/page.tsx', 'utf8');
const startMatch = html.match(/<section class="[^"]*">\s*<div class="[^"]*">\s*<div class="text-center"[^>]*>.*Dúvidas Frequentes/);
if (startMatch) {
    console.log("Found start at", startMatch.index);
} else {
    console.log("Could not find start");
}
