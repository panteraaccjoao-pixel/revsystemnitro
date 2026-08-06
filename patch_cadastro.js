const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/cadastro/index.html');
if (!fs.existsSync(filePath)) {
  console.log("Arquivo cadastro/index.html não encontrado.");
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// 1. Remover a div do modal customizada injetada anteriormente se ela existir
const modalRegex = /<div id="otp-modal"[\s\S]*?<\/div>\s*<\/div>/g;
content = content.replace(modalRegex, '');

// 2. Localizar o final da tag body e substituir o script anterior pelo novo script inteligente
const scriptBlockRegex = /<script>\s*\/\/\s*BLOQUEIO TOTAL[\s\S]*?<\/script>/g;
// Mantemos o bloqueio total no head para chamadas diretas ao Supabase
// Mas no final do body, removemos os scripts antigos que injetamos (incluindo o que tinha btnConfirmOtp) e colocamos o novo interceptor nativo
const oldScriptPattern = /const otpModal = document\.getElementById\('otp-modal'\);[\s\S]*?<\/script>/g;
content = content.replace(oldScriptPattern, '');

// Vamos limpar também outras tags de scripts que injetamos anteriormente para evitar duplicidade
content = content.replace(/<script>\s*document\.addEventListener\('click'[\s\S]*?<\/script>/g, '');
content = content.replace(/<script>\s*\/\/\s*Wait for React to hydrate[\s\S]*?<\/script>/g, '');

// Criar o novo script inteligente para rodar no final do body
const newScript = `
<script>
// INTERCEPTADOR INTELIGENTE DO FORMULÁRIO NATIVO DA PÁGINA
(function() {
  let isBinding = false;

  function setupNativeForm() {
    if (isBinding) return;
    
    // Buscar os elementos originais na página
    const buttons = Array.from(document.querySelectorAll('button'));
    const inputs = Array.from(document.querySelectorAll('input'));
    
    const btnSendCode = buttons.find(b => b.textContent && (b.textContent.includes('Enviar código') || b.textContent.includes('Enviar c'));
    const btnCreateAccount = buttons.find(b => b.textContent && b.textContent.includes('Criar conta'));
    
    const emailInput = inputs.find(i => i.type === 'email');
    const passwordInputs = inputs.filter(i => i.type === 'password');
    const passInput = passwordInputs[0];
    
    // O input do código de verificação geralmente é do tipo text e fica perto do botão de enviar
    const otpInput = inputs.find(i => i.type === 'text' && (i.placeholder?.toLowerCase().includes('código') || i.placeholder?.toLowerCase().includes('codigo') || i.placeholder?.toLowerCase().includes('verif') || i.ariaLabel?.toLowerCase().includes('código')));

    // Se encontramos os elementos e eles ainda não foram interceptados por nós
    if (btnSendCode && !btnSendCode.dataset.revIntercepted) {
      isBinding = true;
      console.log('[REV SYSTEM] Elementos nativos encontrados! Interceptando...');

      // 1. Clonar o botão de Enviar Código para remover listeners nativos do StorM
      const newBtnSend = btnSendCode.cloneNode(true);
      newBtnSend.dataset.revIntercepted = "true";
      btnSendCode.parentNode.replaceChild(newBtnSend, btnSendCode);

      // Adicionar comportamento customizado ao novo botão "Enviar código"
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
            // Focar no campo de código se existir
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
          alert('Erro de conexão com o servidor.');
          newBtnSend.textContent = originalText;
          newBtnSend.disabled = false;
        }
      });

      // 2. Clonar o botão "Criar conta" ou interceptar o submit do form
      if (btnCreateAccount && !btnCreateAccount.dataset.revIntercepted) {
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
              
              // Login automático pós-cadastro
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
      }
      
      isBinding = false;
    }
  }

  // Monitorar alterações no DOM para interceptar o formulário assim que o React renderizá-lo
  const observer = new MutationObserver((mutations) => {
    setupNativeForm();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  
  // Executar também no load inicial
  window.addEventListener('load', setupNativeForm);
  setupNativeForm();
})();

// Interceptar também cliques em links de navegação para iframe
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

// Remover a tag de fechamento body/html original e concatenar o novo script
content = content.replace(/<\/body>\s*<\/html>/i, '');
content += newScript;

fs.writeFileSync(filePath, content, 'utf8');
console.log("✓ HTML de cadastro modificado com sucesso com o novo interceptador nativo do DOM.");
