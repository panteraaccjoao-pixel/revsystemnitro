const fs = require('fs');
const html = fs.readFileSync('C:/Users/seven/Downloads/pagina inical/assets_home/dl/index.html', 'utf8');

// Match everything inside <body>
let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

if (bodyMatch) {
  let content = bodyMatch[1];
  
  // Fix the logo issue inside the content!
  content = content.replace(/<img[^>]*icon_668d8eb875c95764\.png[^>]*>/g, '<video autoplay loop muted playsinline src="/rev_system.mp4" class="w-9 h-9 rounded-lg object-cover"></video>');
  
  // Remove Next.js script tags so they don't break the new app
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Create the Next.js component
  const componentCode = `
export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  );
}
`;
  fs.writeFileSync('C:/Users/seven/Downloads/rev-frontend/app/page.tsx', componentCode);
  console.log('Successfully wrote page.tsx with full body content via dangerouslySetInnerHTML');
} else {
  console.log('Could not find body content');
}
