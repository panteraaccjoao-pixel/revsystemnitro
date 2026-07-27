const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

const faqQuestions = [
  { q: "Como funciona a entrega dos produtos?", a: "A entrega é feita de forma 100% automática logo após a confirmação do pagamento. Você receberá as instruções diretamente no seu e-mail e também ficarão disponíveis no seu painel de cliente." },
  { q: "O pagamento é seguro?", a: "Sim! Utilizamos plataformas de pagamento reconhecidas e 100% seguras. Seus dados são processados com criptografia de ponta a ponta e a entrega é garantida." },
  { q: "Os produtos possuem garantia?", a: "Todos os nossos produtos digitais possuem garantia total de funcionamento. Caso enfrente qualquer instabilidade ou problema, basta acionar nosso suporte." },
  { q: "Quanto tempo demora para receber?", a: "Por ser um sistema integrado, a liberação ocorre em questão de segundos após a confirmação do pagamento via Pix." },
  { q: "Como entro em contato com o suporte?", a: "Nosso suporte funciona primariamente através do nosso servidor do Discord, onde temos uma equipe pronta para tirar dúvidas e resolver problemas em menos de 5 minutos." },
  { q: "Posso comprar mais de uma vez o mesmo produto?", a: "Claro! Não existe limite de compras por cliente. Você pode adquirir o mesmo produto quantas vezes precisar." }
];

let faqHtml = '<section class="relative py-20 overflow-hidden" id="faq-section"><div class="container mx-auto px-4"><div class="text-center mb-12" style="opacity:0;transform:translateY(50px)"><span class="text-xs uppercase tracking-[0.25em] text-primary font-medium">Dúvidas Frequentes</span><h2 class="text-3xl md:text-4xl font-extrabold text-foreground mt-3">FAQ</h2></div><div class="max-w-3xl mx-auto space-y-3">';

faqQuestions.forEach(item => {
    faqHtml += `<div class="" style="opacity:0;transform:translateY(50px)"><div class="rounded-xl border border-border/40 bg-card/30 overflow-hidden transition-colors hover:border-border/60"><button type="button" class="faq-button w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer" aria-expanded="false"><span class="text-sm font-semibold text-foreground pr-4">${item.q}</span><div class="shrink-0 transition-transform duration-300 faq-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-4 h-4 text-primary"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg></div></button><div class="faq-content overflow-hidden transition-all duration-300" style="height: 0px;"><div class="px-5 pb-5 pt-1 text-sm text-muted-foreground border-t border-border/10 mt-4">${item.a}</div></div></div></div>`;
});

faqHtml += '</div></div></section>';

// Find boundaries using a safe string
const faqString = '>FAQ</h2></div><div class="max-w-3xl mx-auto space-y-3">';
const faqIndex = content.indexOf(faqString);

if (faqIndex !== -1) {
  // Find the <section before the FAQ
  const sectionTag = '<section class="relative py-20 overflow-hidden">';
  const startIndex = content.lastIndexOf(sectionTag, faqIndex);
  
  if (startIndex !== -1) {
    const nextSectionIndex = content.indexOf('</section>', faqIndex);
    if (nextSectionIndex !== -1) {
      const endIndex = nextSectionIndex + '</section>'.length;
      
      // Replace HTML
      content = content.substring(0, startIndex) + faqHtml + content.substring(endIndex);
      
      // Insert the JS logic into useEffect
      const logic = `
        // FAQ logic
        setTimeout(() => {
          const faqBtns = document.querySelectorAll('.faq-button');
          faqBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            if (btn.parentNode) {
              btn.parentNode.replaceChild(newBtn, btn);
              newBtn.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('.faq-icon');
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                document.querySelectorAll('.faq-content').forEach(c => c.style.height = '0px');
                document.querySelectorAll('.faq-button').forEach(b => {
                  b.setAttribute('aria-expanded', 'false');
                  const bIcon = b.querySelector('.faq-icon');
                  if (bIcon) bIcon.style.transform = 'rotate(0deg)';
                });
                
                if (!isExpanded) {
                  this.setAttribute('aria-expanded', 'true');
                  content.style.height = content.scrollHeight + 'px';
                  if (icon) icon.style.transform = 'rotate(45deg)';
                }
              });
            }
          });
        }, 500);
      `;

      if (!content.includes('faq-button')) {
        content = content.replace('// force update 2', logic + '\n    // force update 3');
      } else {
        content = content.replace('// force update 2', logic + '\n    // force update 3');
      }

      fs.writeFileSync('app/page.tsx', content);
      console.log("FAQ Replaced successfully!");
    } else {
      console.log("Could not find end of section");
    }
  } else {
    console.log("Could not find section start");
  }
} else {
  console.log("Could not find FAQ string");
}
