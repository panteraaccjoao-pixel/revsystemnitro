const fs = require('fs');
const path = require('path');

const files = [
  'C:/Users/seven/Downloads/rev-frontend/app/login/page.tsx',
  'C:/Users/seven/Downloads/rev-frontend/app/cadastro/page.tsx',
  'C:/Users/seven/Downloads/rev-frontend/app/register/page.tsx'
];

const liquidGlassButton = `
      {/* Liquid Glass Back Button */}
      <button 
        onClick={() => window.location.href = '/'}
        className="fixed top-6 left-6 md:top-8 md:left-8 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80 group-hover:text-white transition-colors">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
`;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Make sure we only add it once
    if (!content.includes('Liquid Glass Back Button')) {
      // Find the inner <iframe> and prepend the button
      content = content.replace(
        /(<div className="w-full h-screen overflow-hidden bg-background">)/,
        `$1\n${liquidGlassButton}`
      );
      fs.writeFileSync(file, content);
      console.log('Updated', file);
    } else {
      console.log('Already updated', file);
    }
  }
});

console.log('Done installing Liquid Glass back buttons.');
