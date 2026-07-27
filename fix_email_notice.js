const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/public/login/index.html';
let html = fs.readFileSync(file, 'utf8');

// The original broken script
const oldScriptPattern = /<!-- SCRIPT DE AVISO DE E-MAIL.*?<\/script>/s;

const newScript = `
    <!-- SCRIPT DE AVISO DE E-MAIL (Corrigido para React) -->
    <script>
      window.addEventListener('load', () => {
        let noticeInjected = false;
        
        const observer = new MutationObserver((mutations) => {
          if (noticeInjected) return;
          
          const recaptchaIframe = document.querySelector('iframe[title="reCAPTCHA"]');
          if (recaptchaIframe) {
            const recaptchaContainer = recaptchaIframe.closest('.flex.justify-center');
            
            if (recaptchaContainer && !document.getElementById('email-confirmation-notice')) {
              const noticeDiv = document.createElement('div');
              noticeDiv.id = 'email-confirmation-notice';
              noticeDiv.className = 'hidden w-full text-center mt-3 mb-1 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium animate-in fade-in slide-in-from-top-2';
              noticeDiv.innerHTML = '<span class="flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg> E-mail de confirmação enviado! Verifique sua caixa de entrada.</span>';
              
              recaptchaContainer.insertAdjacentElement('afterend', noticeDiv);
              noticeInjected = true;
            }
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Delegação de evento de clique para pegar botões gerados pelo React
        document.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (btn) {
            const text = btn.textContent.toLowerCase();
            // Verifica se é o botão principal de Entrar ou Criar conta
            if (text.includes('entrar') || text.includes('criar') || text.includes('continuar')) {
              const noticeDiv = document.getElementById('email-confirmation-notice');
              if (noticeDiv) {
                noticeDiv.classList.remove('hidden');
                setTimeout(() => noticeDiv.classList.add('hidden'), 5000);
              }
            }
          }
        });
      });
    </script>
`;

if (oldScriptPattern.test(html)) {
  html = html.replace(oldScriptPattern, newScript);
} else {
  html = html.replace('</head>', newScript + '\n</head>');
}

fs.writeFileSync(file, html);
console.log('Successfully fixed email notice script to work with React onClick buttons');
