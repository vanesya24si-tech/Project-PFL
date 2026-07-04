const fs = require('fs');
const path = require('path');

const dirsToScan = ['src/pages', 'src/components', 'src/layouts'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Mapping of font size classes to bump them up
  content = content.replace(/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/g, (match, p1) => {
    switch(p1) {
      case 'xs': return 'text-sm';
      case 'sm': return 'text-base';
      case 'base': return 'text-lg';
      case 'lg': return 'text-xl';
      case 'xl': return 'text-2xl';
      case '2xl': return 'text-3xl';
      case '3xl': return 'text-4xl';
      case '4xl': return 'text-5xl';
      case '5xl': return 'text-6xl';
      case '6xl': return 'text-7xl';
      default: return match;
    }
  });

  content = content.replace(/\btext-\[(\d+)px\]\b/g, (match, p1) => {
    const size = parseInt(p1, 10);
    if (size <= 9) return 'text-xs';
    if (size === 10) return 'text-sm';
    if (size === 11) return 'text-sm';
    if (size === 12) return 'text-base';
    if (size === 13 || size === 14) return 'text-lg';
    return `text-[${size + 2}px]`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

dirsToScan.forEach(scanDir);
console.log('Typography bumped successfully.');
