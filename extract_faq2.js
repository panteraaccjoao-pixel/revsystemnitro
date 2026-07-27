const fs = require('fs');
const html = fs.readFileSync('app/page.tsx', 'utf8');
const faqIndex = html.indexOf('>FAQ<');
if (faqIndex !== -1) {
    console.log(html.substring(faqIndex - 300, faqIndex + 300));
} else {
    console.log("FAQ not found");
}
