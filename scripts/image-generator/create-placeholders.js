import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'curriculum');

// Placeholder definitions with colors
const PLACEHOLDERS = {
  banners: [
    { id: 'expert-banner', name: 'JS Expert', gradient: ['#00D4FF', '#8B5CF6'] },
    { id: 'ydkjs-banner', name: 'JS YDKJS', gradient: ['#14B8A6', '#1E3A5F'] },
    { id: 'goodparts-banner', name: 'JS Good Parts', gradient: ['#F97316', '#EAB308'] },
    { id: 'browser-banner', name: 'JS Browser', gradient: ['#A78BFA', '#10B981'] }
  ],
  worldmaps: [
    { id: 'expert-worldmap', name: 'Nexus Temporel', gradient: ['#00D4FF', '#8B5CF6'] },
    { id: 'ydkjs-worldmap', name: 'Profondeurs Abyssales', gradient: ['#14B8A6', '#1E3A5F'] },
    { id: 'goodparts-worldmap', name: 'Forge Ancestrale', gradient: ['#F97316', '#EAB308'] },
    { id: 'browser-worldmap', name: 'Royaume Interfaces', gradient: ['#A78BFA', '#10B981'] }
  ],
  icons: [
    // Expert
    { id: 'expert-mod-fundamentals', name: 'Fundamentals', color: '#00D4FF' },
    { id: 'expert-mod-structures', name: 'Structures', color: '#8B5CF6' },
    { id: 'expert-mod-async', name: 'Async', color: '#06B6D4' },
    { id: 'expert-mod-patterns', name: 'Patterns', color: '#A855F7' },
    // YDKJS
    { id: 'ydkjs-mod-welcome', name: 'Welcome', color: '#5EEAD4' },
    { id: 'ydkjs-mod-primitives', name: 'Primitives', color: '#14B8A6' },
    { id: 'ydkjs-mod-scope', name: 'Scope', color: '#0D9488' },
    { id: 'ydkjs-mod-closures', name: 'Closures', color: '#0F766E' },
    { id: 'ydkjs-mod-this', name: 'This', color: '#115E59' },
    { id: 'ydkjs-mod-prototype', name: 'Prototype', color: '#134E4A' },
    { id: 'ydkjs-mod-async-river', name: 'Async River', color: '#7DD3FC' },
    { id: 'ydkjs-mod-esnext', name: 'ES.Next', color: '#38BDF8' },
    // Good Parts
    { id: 'goodparts-mod-syntax', name: 'Syntax', color: '#FB923C' },
    { id: 'goodparts-mod-objects', name: 'Objects', color: '#F97316' },
    { id: 'goodparts-mod-functions', name: 'Functions', color: '#EA580C' },
    { id: 'goodparts-mod-inheritance', name: 'Inheritance', color: '#C2410C' },
    { id: 'goodparts-mod-arrays', name: 'Arrays', color: '#FBBF24' },
    { id: 'goodparts-mod-regex', name: 'Regex', color: '#F59E0B' },
    { id: 'goodparts-mod-style', name: 'Style', color: '#D97706' },
    // Browser
    { id: 'browser-mod-dombasics', name: 'DOM Basics', color: '#C4B5FD' },
    { id: 'browser-mod-events', name: 'Events', color: '#A78BFA' },
    { id: 'browser-mod-forms', name: 'Forms', color: '#8B5CF6' },
    { id: 'browser-mod-async', name: 'Async', color: '#7C3AED' },
    { id: 'browser-mod-storage', name: 'Storage', color: '#6D28D9' },
    { id: 'browser-mod-canvas', name: 'Canvas', color: '#5B21B6' },
    { id: 'browser-mod-projects', name: 'Projects', color: '#FCD34D' }
  ]
};

// Generate SVG for banner (wide format)
function generateBannerSVG(name, gradient) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="400" viewBox="0 0 1920 400">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradient[1]};stop-opacity:1" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <text x="960" y="180" font-family="monospace" font-size="48" fill="white" text-anchor="middle" font-weight="bold">${name}</text>
  <text x="960" y="240" font-family="monospace" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle">[ PLACEHOLDER BANNER ]</text>
  <rect x="50" y="50" width="120" height="40" rx="5" fill="rgba(0,0,0,0.3)"/>
  <text x="110" y="77" font-family="monospace" font-size="14" fill="white" text-anchor="middle">1920×400</text>
</svg>`;
}

// Generate SVG for worldmap
function generateWorldmapSVG(name, gradient) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradient[1]};stop-opacity:1" />
    </linearGradient>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="2" fill="rgba(255,255,255,0.2)"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
  <!-- Fake map elements -->
  <circle cx="600" cy="400" r="80" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <circle cx="300" cy="300" r="50" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <circle cx="900" cy="300" r="50" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <circle cx="400" cy="550" r="40" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <circle cx="800" cy="550" r="40" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <line x1="350" y1="300" x2="520" y2="380" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="5,5"/>
  <line x1="850" y1="300" x2="680" y2="380" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="5,5"/>
  <line x1="440" y1="550" x2="520" y2="420" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="5,5"/>
  <line x1="760" y1="550" x2="680" y2="420" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="600" y="380" font-family="monospace" font-size="36" fill="white" text-anchor="middle" font-weight="bold">${name}</text>
  <text x="600" y="430" font-family="monospace" font-size="18" fill="rgba(255,255,255,0.7)" text-anchor="middle">[ WORLD MAP ]</text>
  <rect x="30" y="30" width="100" height="30" rx="5" fill="rgba(0,0,0,0.3)"/>
  <text x="80" y="52" font-family="monospace" font-size="12" fill="white" text-anchor="middle">1200×800</text>
</svg>`;
}

// Generate SVG for icon (pixel art style placeholder)
function generateIconSVG(name, color) {
  // Create a simple pixel art style placeholder
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="100%" height="100%" fill="#111"/>
  <!-- Pixel border effect -->
  <rect x="32" y="32" width="448" height="448" fill="none" stroke="${color}" stroke-width="8"/>
  <rect x="48" y="48" width="416" height="416" fill="none" stroke="${color}" stroke-width="4" opacity="0.5"/>
  <!-- Center icon area -->
  <rect x="128" y="128" width="256" height="256" fill="url(#iconGrad)" rx="16"/>
  <!-- Pixel decoration corners -->
  <rect x="32" y="32" width="32" height="32" fill="${color}"/>
  <rect x="448" y="32" width="32" height="32" fill="${color}"/>
  <rect x="32" y="448" width="32" height="32" fill="${color}"/>
  <rect x="448" y="448" width="32" height="32" fill="${color}"/>
  <!-- Text -->
  <text x="256" y="270" font-family="monospace" font-size="28" fill="white" text-anchor="middle" font-weight="bold">${name.substring(0, 10)}</text>
  <text x="256" y="310" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.5)" text-anchor="middle">[ICON]</text>
  <!-- Size label -->
  <rect x="200" y="420" width="112" height="24" rx="4" fill="rgba(0,0,0,0.5)"/>
  <text x="256" y="438" font-family="monospace" font-size="12" fill="rgba(255,255,255,0.7)" text-anchor="middle">512×512</text>
</svg>`;
}

// Main function
async function createPlaceholders() {
  console.log('🎨 Creating placeholder images...\n');

  let created = 0;

  // Create banners
  for (const banner of PLACEHOLDERS.banners) {
    const svg = generateBannerSVG(banner.name, banner.gradient);
    const filepath = path.join(OUTPUT_DIR, 'banners', `${banner.id}.svg`);
    fs.writeFileSync(filepath, svg);
    console.log(`✅ ${filepath}`);
    created++;
  }

  // Create worldmaps
  for (const map of PLACEHOLDERS.worldmaps) {
    const svg = generateWorldmapSVG(map.name, map.gradient);
    const filepath = path.join(OUTPUT_DIR, 'worldmaps', `${map.id}.svg`);
    fs.writeFileSync(filepath, svg);
    console.log(`✅ ${filepath}`);
    created++;
  }

  // Create icons
  for (const icon of PLACEHOLDERS.icons) {
    const svg = generateIconSVG(icon.name, icon.color);
    const filepath = path.join(OUTPUT_DIR, 'icons', `${icon.id}.svg`);
    fs.writeFileSync(filepath, svg);
    console.log(`✅ ${filepath}`);
    created++;
  }

  console.log(`\n📁 Created ${created} placeholder images in ${OUTPUT_DIR}`);
  console.log('\n💡 Replace these with real generated images when ready.');
}

createPlaceholders().catch(console.error);
