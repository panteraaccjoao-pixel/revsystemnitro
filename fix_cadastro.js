const fs = require('fs');

const cadastroHtml = 'C:/Users/seven/Downloads/rev-frontend/public/cadastro/index.html';
let html = fs.readFileSync(cadastroHtml, 'utf8');

// Replace the old script with a much more robust one
const robustScript = `
<script>
  window.addEventListener('load', () => {
    let attempts = 0;
    const tryClick = () => {
      attempts++;
      if (attempts > 50) return; // Stop after 10 seconds (50 * 200ms)
      
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const btn = buttons.find(el => el.textContent && el.textContent.toLowerCase().includes('criar agora'));
      
      if (btn) {
        console.log('Found registration button, clicking it!');
        btn.click();
        
        // Sometimes React needs a moment or a double dispatch
        setTimeout(() => {
            const stillLogin = document.body.textContent.includes('Bem-vindo de volta');
            if (stillLogin) btn.click();
        }, 100);
      } else {
        setTimeout(tryClick, 200);
      }
    };
    setTimeout(tryClick, 300);
  });
</script>
</body>`;

html = html.replace(/<script>\s*\/\/\s*Wait for React to hydrate[\s\S]*?<\/script>\s*<\/body>/i, robustScript);

// Fallback if regex failed
if (!html.includes('attempts > 50')) {
    html = html.replace(/<\/body>/i, robustScript);
}

fs.writeFileSync(cadastroHtml, html);
console.log('Injected robust auto-click script into Cadastro HTML');
