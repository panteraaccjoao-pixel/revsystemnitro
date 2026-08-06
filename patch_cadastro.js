const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/cadastro/index.html');
if (!fs.existsSync(filePath)) {
  console.log("Arquivo cadastro/index.html não encontrado.");
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// 1. Limpar qualquer resquício de scripts anteriores que injetamos (começando com BLOQUEIO TOTAL ou INTERCEPTADOR)
content = content.replace(/<script>\s*\/\/\s*BLOQUEIO TOTAL[\s\S]*?<\/script>/gi, '');
content = content.replace(/<script>\s*\/\/\s*INTERCEPTADOR INTELIGENTE[\s\S]*?<\/script>/gi, '');
content = content.replace(/<script>\s*document\.addEventListener\('click'[\s\S]*?<\/script>/gi, '');

// 2. Injetar o BLOQUEADOR DE FETCH definitivo no HEAD (primeira linha após o head)
const fetchBlocker = `
<script>
// BLOQUEIO TOTAL de chamadas ao Supabase Auth do StorM no client-side
(function() {
  var _originalFetch = window.fetch;
  window.fetch = function(url, options) {
    var urlStr = (url || '').toString();
    // Bloqueia qualquer chamada ao auth/v1 do Supabase para evitar envio de emails ou cadastros nativos
    if (urlStr.includes('/auth/v1/') || urlStr.includes('supabase.co/auth/v1/')) {
      console.warn('[REV SYSTEM] Bloqueado fetch client-side ao Supabase Auth:', urlStr);
      return Promise.resolve(new Response(JSON.stringify({ error: 'blocked' }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }));
    }
    return _originalFetch.apply(this, arguments);
  };

  var _originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    var urlStr = (url || '').toString();
    if (urlStr.includes('/auth/v1/') || urlStr.includes('supabase.co/auth/v1/')) {
      console.warn('[REV SYSTEM] Bloqueado XHR client-side ao Supabase Auth:', urlStr);
      url = 'about:blank';
    }
    return _originalOpen.apply(this, arguments);
  };
})();
</script>
`;

// Injeta o bloqueador logo após a tag <head>
content = content.replace(/<head>/i, '<head>' + fetchBlocker);

// 3. Injetar o novo INTERCEPTADOR DO DOM nativo no final do body
const domInterceptor = `
<script>
// INTERCEPTADOR INTELIGENTE DO FORMULÁRIO NATIVO DO STORM
(function() {
  let isBinding = false;

  function setupNativeForm() {
    if (isBinding) return;
    
    const buttons = Array.from(document.querySelectorAll('button'));
    const inputs = Array.from(document.querySelectorAll('input'));
    
    // Busca tolerante a capitalização e termos
    const btnSendCode = buttons.find(b => {
      const txt = (b.textContent || '').toLowerCase();
      return txt.includes('enviar') && (txt.includes('código') || txt.includes('codigo') || txt.includes('cod'));
    });
    
    const btnCreateAccount = buttons.find(b => {
      const txt = (b.textContent || '').toLowerCase();
      return txt.includes('criar') && txt.includes('conta');
    });
    
    const emailInput = inputs.find(i => i.type === 'email');
    const passwordInputs = inputs.filter(i => i.type === 'password');
    const passInput = passwordInputs[0];
    
    // Busca do input de código de verificação
    const otpInput = inputs.find(i => {
      const ph = (i.placeholder || '').toLowerCase();
      const name = (i.name || '').toLowerCase();
      const id = (i.id || '').toLowerCase();
      return (i.type === 'text' || i.type === 'number') && 
             (ph.includes('código') || ph.includes('codigo') || ph.includes('code') || ph.includes('verif') ||
              name.includes('code') || name.includes('otp') || name.includes('verif') ||
              id.includes('code') || id.includes('otp') || id.includes('verif'));
    }) || inputs.find(i => i.type === 'text');

    if (btnSendCode && !btnSendCode.dataset.revIntercepted) {
      isBinding = true;
      console.log('[REV SYSTEM] Botão "Enviar código" nativo encontrado e interceptado!');

      // Clonar para desligar event listeners antigos do StorM
      const newBtnSend = btnSendCode.cloneNode(true);
      newBtnSend.dataset.revIntercepted = "true";
      btnSendCode.parentNode.replaceChild(newBtnSend, btnSendCode);

      newBtnSend.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!emailInput || !emailInput.value) {
          alert('Por favor, digite o seu e-mail.');
          return;
        }
        if (!passInput || !passInput.value) {
          alert('Por favor, digite a sua senha.');
          return;
        }

        const originalText = newBtnSend.textContent;
        newBtnSend.textContent = 'Enviando...';
        newBtnSend.disabled = true;

        try {
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value.trim(), password: passInput.value })
          });

          const data = await res.json();
          if (res.ok && data.otpRequired) {
            newBtnSend.textContent = 'Enviado!';
            alert('Código enviado com sucesso para o seu e-mail!');
            if (otpInput) otpInput.focus();
            
            // Cooldown de 60 segundos
            let seconds = 60;
            const timer = setInterval(() => {
              seconds--;
              if (seconds <= 0) {
                clearInterval(timer);
                newBtnSend.textContent = originalText;
                newBtnSend.disabled = false;
              } else {
                newBtnSend.textContent = \`Aguarde \${seconds}s\`;
              }
            }, 1000);
          } else {
            alert(data.error || 'Erro ao enviar código de ativação.');
            newBtnSend.textContent = originalText;
            newBtnSend.disabled = false;
          }
        } catch (err) {
          alert('Erro ao conectar ao servidor.');
          newBtnSend.textContent = originalText;
          newBtnSend.disabled = false;
        }
      });
      
      isBinding = false;
    }

    if (btnCreateAccount && !btnCreateAccount.dataset.revIntercepted) {
      isBinding = true;
      console.log('[REV SYSTEM] Botão "Criar conta" nativo encontrado e interceptado!');

      const newBtnCreate = btnCreateAccount.cloneNode(true);
      newBtnCreate.dataset.revIntercepted = "true";
      btnCreateAccount.parentNode.replaceChild(newBtnCreate, btnCreateAccount);

      newBtnCreate.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!emailInput || !emailInput.value) {
          alert('Por favor, digite o seu e-mail.');
          return;
        }
        if (!passInput || !passInput.value) {
          alert('Por favor, digite a sua senha.');
          return;
        }
        if (!otpInput || !otpInput.value) {
          alert('Por favor, insira o código de verificação recebido por e-mail.');
          return;
        }

        const originalText = newBtnCreate.textContent;
        newBtnCreate.textContent = 'Criando conta...';
        newBtnCreate.disabled = true;

        try {
          const res = await fetch('/api/register/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: emailInput.value.trim(),
              password: passInput.value,
              code: otpInput.value.trim()
            })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            alert('Cadastro realizado com sucesso! Fazendo login...');
            
            try {
              const loginRes = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value.trim(), password: passInput.value })
              });
              if (loginRes.ok) {
                window.location.href = '/produtos';
                return;
              }
            } catch (loginErr) {
              console.error('Erro no login automático:', loginErr);
            }
            window.location.href = '/login?registered=true';
          } else {
            alert(data.error || 'Código incorreto ou expirado.');
            newBtnCreate.textContent = originalText;
            newBtnCreate.disabled = false;
          }
        } catch (err) {
          alert('Erro de conexão ao criar conta.');
          newBtnCreate.textContent = originalText;
          newBtnCreate.disabled = false;
        }
      });
      
      isBinding = false;
    }
  }

  // MutationObserver para capturar os elementos assim que renderizados pelo React
  const observer = new MutationObserver((mutations) => {
    setupNativeForm();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', setupNativeForm);
  setupNativeForm();
})();

// Interceptar links do iframe
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (a && a.href.startsWith(window.location.origin)) {
    e.preventDefault();
    window.parent.location.href = a.href;
  }
});
</script>
</body>
</html>
`;

// Remover fechamento antigo do body e anexar o novo script
content = content.replace(/<\/body>\s*<\/html>/i, '');
content += domInterceptor;

fs.writeFileSync(filePath, content, 'utf8');
console.log("✓ HTML de cadastro patcheado com sucesso.");
