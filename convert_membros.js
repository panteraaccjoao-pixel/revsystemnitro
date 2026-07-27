const fs = require('fs');
const html = fs.readFileSync('C:/Users/seven/Downloads/pagina inical/membros/index.html', 'utf8');

let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

if (bodyMatch) {
  let content = bodyMatch[1];
  
  content = content.replace(/<img[^>]*icon_668d8eb875c95764\.png[^>]*>/g, '<video autoplay loop muted playsinline src="/rev_system.mp4" class="w-9 h-9 rounded-lg object-cover"></video>');
  
  content = content.replace(
    /<div class="animate-pulse h-8 w-8 rounded-full bg-white\/10"><\/div><div class="animate-pulse hidden h-9 w-20 rounded-md bg-white\/10 md:block"><\/div><div class="animate-pulse h-9 w-24 rounded-md bg-white\/10"><\/div>/,
    '<a href="/login" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Entrar</a><a href="/register" class="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-white h-9 px-4 py-2 text-sm font-medium transition-colors font-bold" style="background-color: var(--primary)">Cadastro</a>'
  );

  const beautifulMembros = `
    <main className="pt-24 pb-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <section className="container mx-auto px-4 py-16 relative animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Compre <span className="text-primary font-bold">Membros</span> Reais Para o Seu Servidor
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Mais engajamento, mais resultados. Leve membros reais para o seu servidor ou negócio com a REV SYSTEM.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Categoria 1 */}
          <div className="p-5 rounded-xl border bg-card/40 border-border/50 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-3 text-red-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3 className="text-sm font-medium text-foreground mb-1.5">Membros Online</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Membros reais e ativos online</p>
          </div>
          {/* Categoria 2 */}
          <div className="p-5 rounded-xl border bg-card/40 border-border/50 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-3 text-red-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3 className="text-sm font-medium text-foreground mb-1.5">Membros Offline</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Membros offline para volume</p>
          </div>
          {/* Categoria 3 */}
          <div className="p-5 rounded-xl border bg-card/40 border-border/50 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-3 text-red-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            <h3 className="text-sm font-medium text-foreground mb-1.5">Impulsionamentos</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Boosts para o servidor</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
          
          {/* Configurator (lg:col-span-2) */}
          <div className="lg:col-span-2 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
            <div className="p-8 bg-card/60 border border-border rounded-2xl">
              
              <div className="flex items-center gap-5 mb-9">
                <div className="w-15 h-15 bg-gradient-to-br from-primary to-red-600 flex items-center justify-center shadow-organic-md" style={{ borderRadius: "1.1rem", width: "3.75rem", height: "3.75rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Membros Reais para Discord</h2>
                  <p className="text-muted-foreground/80 text-[15px]">Entrega rápida e membros verificados</p>
                </div>
              </div>

              <div className="flex gap-6 mb-9">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/85">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Membros Reais</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/85">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Crescimento Orgânico e Natural</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-foreground text-sm">Quantidade de Membros</span>
                  <span className="text-xl font-semibold text-foreground">{quantity.toLocaleString('pt-BR')}</span>
                </div>
                
                {/* The Slider */}
                <div className="relative w-full h-2 mb-4 bg-secondary rounded-full flex items-center">
                  <div className="absolute h-full bg-primary rounded-full pointer-events-none" style={{ width: \`\${((quantity - 100) / (max - 100)) * 100}%\` }}></div>
                  <input 
                    type="range" 
                    min="100" 
                    max={max} 
                    step="100" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div 
                    className="absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background pointer-events-none"
                    style={{ left: \`calc(\${((quantity - 100) / (max - 100)) * 100}% - 10px)\` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground/70">
                  <span>Mín: 100</span>
                  <span>Máx: 10.000</span>
                </div>
              </div>

              <div className="p-5 bg-card/40 border border-border rounded-xl mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">{quantity.toLocaleString('pt-BR')} membros</span>
                    <span className="text-2xl font-bold text-foreground">R$ {((quantity / 100) * 4.99).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Comprar Membros
              </button>
            </div>
          </div>

          {/* Right side: Order Summary */}
          <div className="lg:col-span-1 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out delay-500">
            <div className="p-5 rounded-xl bg-card/60 border border-border sticky top-24">
              <div className="space-y-4">
                <div className="flex items-start gap-4 mb-6">
                  <video autoPlay loop muted playsInline src="/rev_system.mp4" className="w-14 h-14 rounded-xl object-cover shrink-0"></video>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">REV SYSTEM</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="text-muted-foreground">{quantity.toLocaleString('pt-BR')} online</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50"></span>
                        <span className="text-muted-foreground">23.000 membros</span>
                      </span>
                    </div>
                    <div className="text-muted-foreground/60 text-[10px] mt-1.5">Desde jan. de 2024</div>
                  </div>
                </div>
                <button className="block w-full py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors text-center">
                  Ir para o Servidor
                </button>
                <div className="mt-5 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">Veja os membros entrando em tempo real</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  `;

  // Extract EXACTLY the header and footer using regex BEFORE altering classes for JSX
  const headerMatch = content.match(/<header[^>]*>[\s\S]*?<\/header>/);
  const footerMatch = content.match(/<footer[^>]*>[\s\S]*?<\/footer>/);
  
  let headerHtml = headerMatch ? headerMatch[0] : '';
  const footerHtml = footerMatch ? footerMatch[0] : '';

  // Replace image logo with video logo in the header
  headerHtml = headerHtml.replace(/<img[^>]*src="\/rev_system\.mp4"[^>]*>/g, '<video autoplay loop muted playsinline src="/rev_system.mp4" class="w-9 h-9 rounded-lg object-cover"></video>');

  const componentCode = `"use client";
// @ts-nocheck
import { useState, useEffect } from 'react';

export default function Membros() {
  const [quantity, setQuantity] = useState(100);
  const max = 10000;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const headerHtml = \`${headerHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
  const footerHtml = \`${footerHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

  return (
    <div className="min-h-screen bg-background relative">
      <div dangerouslySetInnerHTML={{ __html: headerHtml }} />
      ${beautifulMembros}
      <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
    </div>
  );
}
`;

  fs.writeFileSync('C:/Users/seven/Downloads/rev-frontend/app/membros/page.tsx', componentCode);
  console.log('Successfully wrote app/membros/page.tsx with ALL fixes applied!');
}
