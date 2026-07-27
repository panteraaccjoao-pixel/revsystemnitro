const fs = require('fs');
const html = fs.readFileSync('C:/Users/seven/Downloads/pagina inical/assets_home/dl/index.html', 'utf8');

let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

if (bodyMatch) {
  let content = bodyMatch[1];
  
  content = content.replace(/<img[^>]*icon_668d8eb875c95764\.png[^>]*>/g, '<video autoplay loop muted playsinline src="/rev_system.mp4" class="w-9 h-9 rounded-lg object-cover"></video>');
  content = content.replace(/<span class="text-gradient inline-block py-1"/, '<span id="changing-text" class="text-gradient inline-block py-1"');
  
  content = content.replace(/<span>\+<!-- -->0<!-- -->K<\/span>/, '<span id="anim-num-1">+0K</span>');
  content = content.replace(/<span>0<!-- -->%<\/span>/, '<span id="anim-num-2">0%</span>');
  
  // Find all SVG rects that are used for chart clipping (they start with width="0px")
  content = content.replace(/<rect x="0" y="0" height="100" width="0px"><\/rect>/g, '<rect class="chart-anim-rect" x="0" y="0" height="100" width="0px" style="transition: width 2s cubic-bezier(0.16, 1, 0.3, 1)"></rect>');
  
  const marqueeIndex = content.indexOf('clientes dizem');
  if (marqueeIndex !== -1) {
    const nextFlex = content.indexOf('class="flex', marqueeIndex);
    if (nextFlex !== -1) {
      content = content.substring(0, nextFlex) + 'id="marquee-container" ' + content.substring(nextFlex);
    }
  }

  // Replace skeleton loaders in navbar with Entrar and Cadastro buttons
  content = content.replace(
    /<div class="animate-pulse h-8 w-8 rounded-full bg-white\/10"><\/div><div class="animate-pulse hidden h-9 w-20 rounded-md bg-white\/10 md:block"><\/div><div class="animate-pulse h-9 w-24 rounded-md bg-white\/10"><\/div>/,
    '<a href="/login" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Entrar</a><a href="/register" class="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-white h-9 px-4 py-2 text-sm font-medium transition-colors font-bold" style="background-color: var(--primary)">Cadastro</a>'
  );

  // Inject red glow effects in all sections
  content = content.replace(
    /<section class="relative (.*?)">/g,
    '<section class="relative $1"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>'
  );

  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  const componentCode = `"use client";
// @ts-nocheck
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          entry.target.style.opacity = '1';
          if (entry.target.style.transform) {
            entry.target.style.transform = 'none';
          }
        } else {
          // Reset when leaving screen so it animates again
          entry.target.style.transition = 'none';
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const hiddenElements = document.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]');
    hiddenElements.forEach((el) => {
      if (!el.style.transform || el.style.transform === 'none') {
        el.style.transform = 'translateY(30px)';
      }
      observer.observe(el);
    });

    const changingText = document.getElementById('changing-text');
    let intervalId;
    if (changingText) {
      const words = ['Discord', 'Streaming', 'Jogos', 'Sucesso', 'Tudo'];
      let currentIdx = 0;
      intervalId = setInterval(() => {
        changingText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        changingText.style.opacity = '0';
        changingText.style.transform = 'translateY(15px) rotateX(-90deg)';
        setTimeout(() => {
          currentIdx = (currentIdx + 1) % words.length;
          changingText.innerText = words[currentIdx];
          changingText.style.opacity = '1';
          changingText.style.transform = 'translateY(0) rotateX(0deg)';
        }, 400);
      }, 3000);
    }

    const num1 = document.getElementById('anim-num-1');
    const num2 = document.getElementById('anim-num-2');
    
    const animateValue = (obj, start, end, duration, prefix, suffix) => {
      let startTimestamp = null;
      if (obj.animationId) window.cancelAnimationFrame(obj.animationId);
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = prefix + Math.floor(progress * (end - start) + start) + suffix;
        if (progress < 1) {
          obj.animationId = window.requestAnimationFrame(step);
        }
      };
      obj.animationId = window.requestAnimationFrame(step);
    };

    const numObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'anim-num-1') {
            animateValue(entry.target, 0, 300, 2000, '+', 'K');
            document.querySelectorAll('.chart-anim-rect').forEach(rect => {
              rect.style.width = '100%';
            });
          }
          if (entry.target.id === 'anim-num-2') animateValue(entry.target, 0, 99, 2000, '', '%');
        } else {
          // Reset numbers and charts when they leave screen
          if (entry.target.id === 'anim-num-1') {
            if (entry.target.animationId) window.cancelAnimationFrame(entry.target.animationId);
            entry.target.innerHTML = '+0K';
            document.querySelectorAll('.chart-anim-rect').forEach(rect => {
              rect.style.transition = 'none';
              rect.style.width = '0px';
              // Force reflow
              void rect.offsetWidth;
              rect.style.transition = 'width 2s cubic-bezier(0.16, 1, 0.3, 1)';
            });
          }
          if (entry.target.id === 'anim-num-2') {
            if (entry.target.animationId) window.cancelAnimationFrame(entry.target.animationId);
            entry.target.innerHTML = '0%';
          }
        }
      });
    }, { threshold: 0.5 });
    
    if (num1) numObserver.observe(num1);
    if (num2) numObserver.observe(num2);

    const marqueeContainer = document.getElementById('marquee-container');
    if (marqueeContainer) {
      marqueeContainer.style.display = 'flex';
      marqueeContainer.style.animation = 'marquee 25s linear infinite';
      const children = Array.from(marqueeContainer.children);
      children.forEach(child => {
        marqueeContainer.appendChild(child.cloneNode(true));
      });
    }

    return () => {
      observer.disconnect();
      numObserver.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <style>{\`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      \`}</style>
      <div dangerouslySetInnerHTML={{ __html: \`${content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
    </>
  );
}
`;
  fs.writeFileSync('C:/Users/seven/Downloads/rev-frontend/app/page.tsx', componentCode);
  console.log('Successfully wrote page.tsx with chart animations added!');
} else {
  console.log('Could not find body content');
}
