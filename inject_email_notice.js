const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/public/login/index.html';
let html = fs.readFileSync(file, 'utf8');

const script = `
    <!-- SCRIPT DE AVISO DE E-MAIL (Injetado via MutationObserver) -->
    <script>
      window.addEventListener('load', () => {
        let noticeInjected = false;
        
        const observer = new MutationObserver((mutations) => {
          if (noticeInjected) return;
          
          // Procurar o container do reCAPTCHA
          const recaptchaIframe = document.querySelector('iframe[title="reCAPTCHA"]');
          if (recaptchaIframe) {
            const recaptchaContainer = recaptchaIframe.closest('.flex.justify-center');
            
            if (recaptchaContainer && !document.getElementById('email-confirmation-notice')) {
              // Criar o aviso oculto
              const noticeDiv = document.createElement('div');
              noticeDiv.id = 'email-confirmation-notice';
              noticeDiv.className = 'hidden w-full text-center mt-3 mb-1 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium animate-in fade-in slide-in-from-top-2';
              noticeDiv.innerHTML = '<span class="flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg> E-mail de confirmação enviado! Verifique sua caixa de entrada.</span>';
              
              // Inserir logo abaixo do captcha
              recaptchaContainer.insertAdjacentElement('afterend', noticeDiv);
              noticeInjected = true;
              
              // Adicionar evento ao formulário (ou botão principal) para mostrar o aviso
              const form = recaptchaContainer.closest('form');
              if (form) {
                form.addEventListener('submit', (e) => {
                  e.preventDefault(); // Impedir recarregamento da página para mostrar a mensagem
                  noticeDiv.classList.remove('hidden');
                  
                  // Ocultar após 5 segundos
                  setTimeout(() => {
                    noticeDiv.classList.add('hidden');
                  }, 5000);
                });
              }
            }
          }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
      });
    </script>
`;

if (!html.includes('SCRIPT DE AVISO DE E-MAIL')) {
  html = html.replace('</head>', script + '\n</head>');
  fs.writeFileSync(file, html);
  console.log('Successfully injected email notice script into public/login/index.html');
} else {
  console.log('Email notice script already exists!');
}
