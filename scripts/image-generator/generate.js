import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKey = envContent.split('=')[1].trim();

const openai = new OpenAI({ apiKey });

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'curriculum');

// Style suffix for all prompts
const STYLE_SUFFIX = ', digital art style, vibrant colors, high detail, game art aesthetic, no text, no watermarks, no letters';

// All image prompts organized by season
const PROMPTS = {
  // ==================== SAISON 1: piscine-js-expert ====================
  'expert-banner': {
    type: 'banner',
    size: '1792x1024',
    prompt: `Wide panoramic view of a floating cyberpunk city suspended in a cosmic void, massive central clock tower with glowing blue gears, multiple time zones visible as layered translucent dimensions, streams of light data flowing between floating islands, neon blue and purple lighting, holographic displays showing abstract patterns, epic scale, cinematic composition${STYLE_SUFFIX}`
  },
  'expert-worldmap': {
    type: 'worldmap',
    size: '1792x1024',
    prompt: `Top-down isometric view of the Temporal Nexus city, floating islands connected by light bridges forming a network, central massive clock mechanism, different zones glowing in varying shades of blue and purple, temporal portals as swirling vortexes, data streams flowing like rivers, crystalline structures, game map style with clear pathways${STYLE_SUFFIX}`
  },
  'expert-mod-fundamentals': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a glowing blue crystal core with orbiting smaller crystals, represents fundamental building blocks, clean geometric design, neon blue glow effect, dark background, game icon style${STYLE_SUFFIX}`
  },
  'expert-mod-structures': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring interconnected geometric nodes forming a complex 3D structure, purple and cyan gradient, floating in void, represents data structures, architectural precision, game icon style${STYLE_SUFFIX}`
  },
  'expert-mod-async': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a swirling temporal vortex with multiple clock hands frozen at different angles, blue and violet energy spirals, represents asynchronous time manipulation, mystical cosmic feel, game icon style${STYLE_SUFFIX}`
  },
  'expert-mod-patterns': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring interlocking golden gears and cogs forming a perfect mechanism, blueprint-style lines in background, represents design patterns and architecture, steampunk meets cyberpunk, game icon style${STYLE_SUFFIX}`
  },

  // ==================== SAISON 2: piscine-js-ydkjs ====================
  'ydkjs-banner': {
    type: 'banner',
    size: '1792x1024',
    prompt: `Wide panoramic underwater vista showing multiple depth levels of an ancient submerged kingdom, bioluminescent creatures illuminating stone temples, glass domes containing air pockets at various depths, strong currents visualized as flowing energy streams, ancient runes glowing on pillars, mysterious deep trenches below, teal and deep blue color palette, ethereal underwater lighting${STYLE_SUFFIX}`
  },
  'ydkjs-worldmap': {
    type: 'worldmap',
    size: '1792x1024',
    prompt: `Cross-section view of the Abyssal Depths showing 8 distinct underwater zones at different depths, surface light filtering down, each zone with unique architecture and lighting, glass dome cities, glowing anchor chains connecting zones, bioluminescent pathways, ancient stone structures, game map style with clear level progression from surface to abyss, teal and blue palette${STYLE_SUFFIX}`
  },
  'ydkjs-mod-welcome': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a sunlit shallow water surface with gentle waves, welcoming coral reef below, first light penetrating water, represents beginning of the journey, warm teal tones, peaceful and inviting, game icon style${STYLE_SUFFIX}`
  },
  'ydkjs-mod-primitives': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring an underwater research laboratory with glowing specimen containers holding basic elemental orbs, scientific equipment, bubbles rising, teal and cyan lighting, mysterious research facility vibe, game icon style${STYLE_SUFFIX}`
  },
  'ydkjs-mod-scope': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a tall underwater tower with multiple levels visible through transparent walls, each level has different pressure and lighting representing scope levels, fish swimming at different heights, vertical structure showing hierarchy, deep blue and teal, game icon style${STYLE_SUFFIX}`
  },
  'ydkjs-mod-closures': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a mystical underwater cave with a glowing protective bubble inside containing treasures, the bubble represents closure encapsulation, bioluminescent crystals on cave walls, secrets preserved within, deep teal and purple, game icon style${STYLE_SUFFIX}`
  },
  'ydkjs-mod-this': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring an underwater martial arts dojo with shifting sand patterns on the floor representing changing context, a compass in the center pointing in multiple directions, currents flowing around, represents the dynamic nature of context, zen underwater temple, game icon style${STYLE_SUFFIX}`
  },
  'ydkjs-mod-prototype': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a massive anchor chain descending into darkness with glowing links, each link connected to ancient artifacts representing inherited properties, ancestral symbols on the chain, deep ocean depth, represents prototype inheritance chain, game icon style${STYLE_SUFFIX}`
  },
  'ydkjs-mod-async-river': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a powerful underwater current river flowing through a canyon, multiple streams merging and splitting representing async flows, bioluminescent particles in the current, dynamic movement feel, represents asynchronous data flow, deep teal with energy streaks, game icon style${STYLE_SUFFIX}`
  },
  'ydkjs-mod-esnext': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring an underwater mountain peak reaching toward the surface light, advanced technology merged with ancient stone, represents reaching new heights with modern features, beacon of light at the top, ascending bubbles, triumphant arrival feeling, game icon style${STYLE_SUFFIX}`
  },

  // ==================== SAISON 3: piscine-js-good-parts ====================
  'goodparts-banner': {
    type: 'banner',
    size: '1792x1024',
    prompt: `Wide panoramic view inside a massive volcanic mountain forge, multiple forge chambers carved into rock at different heights, rivers of molten gold flowing, master craftsmen silhouettes working at anvils, ancient leather-bound books and blueprints, giant mechanical hammers, sparks and embers floating, warm orange and gold lighting with deep shadows, epic fantasy forge atmosphere${STYLE_SUFFIX}`
  },
  'goodparts-worldmap': {
    type: 'worldmap',
    size: '1792x1024',
    prompt: `Cutaway view of the Ancestral Forge mountain showing 7 forge chambers at different levels connected by stone stairs and bridges, lava rivers as pathways, each chamber specialized for different crafting, smoke rising through vents, warm orange glow throughout, game map style with clear progression paths, warm color palette${STYLE_SUFFIX}`
  },
  'goodparts-mod-syntax': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring an ornate golden anvil with precise geometric patterns etched into it, representing syntax precision, small hammer resting on top, sparks frozen in time, clean craftsmanship, warm orange glow, game icon style${STYLE_SUFFIX}`
  },
  'goodparts-mod-objects': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a master craftsman display shelf with various forged artifacts like keys, gears, and orbs each glowing with inner light, represents object creation, organized collection, warm golden lighting, treasure vault feeling, game icon style${STYLE_SUFFIX}`
  },
  'goodparts-mod-functions': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring an array of master craftsman tools hanging on a forge wall including hammers, tongs, and chisels, each tool glowing with magical energy, represents functions as tools, workshop organization, warm orange and bronze tones, game icon style${STYLE_SUFFIX}`
  },
  'goodparts-mod-inheritance': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a family tree of forge masters depicted as connected portrait medallions, oldest at top with wisdom glow, knowledge flowing down through generations, ancestral lineage, represents prototype inheritance, warm sepia and gold tones, game icon style${STYLE_SUFFIX}`
  },
  'goodparts-mod-arrays': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring perfectly organized rows of identical forged ingots on shelves, precise alignment representing array order, numbered slots glowing, industrial organization, represents array manipulation, warm bronze and copper tones, game icon style${STYLE_SUFFIX}`
  },
  'goodparts-mod-regex': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring ancient stone tablets with glowing runic patterns, mystical symbols that match and transform, pattern recognition magic, represents regular expressions as pattern matching runes, warm orange glow on stone, mystical forge magic, game icon style${STYLE_SUFFIX}`
  },
  'goodparts-mod-style': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring an open master craftsman codex book with golden illuminated pages showing perfect diagrams, quill pen resting beside, represents coding style and best practices, scholarly craftsmanship, warm amber lighting on parchment, game icon style${STYLE_SUFFIX}`
  },

  // ==================== SAISON 4: piscine-js-browser ====================
  'browser-banner': {
    type: 'banner',
    size: '1792x1024',
    prompt: `Wide panoramic view of a magical modern metropolis at golden hour, buildings with window-facades showing portals to other colorful realms, messenger spirits carrying glowing scrolls flying between towers, central plaza with giant interactive canvas where painted elements are coming alive, floating UI elements as magical runes, living architecture that pulses with light, vibrant and welcoming atmosphere${STYLE_SUFFIX}`
  },
  'browser-worldmap': {
    type: 'worldmap',
    size: '1792x1024',
    prompt: `Bird eye view of the Interface Kingdom city, 7 distinct districts arranged in a circle around central plaza, DOM district with living buildings, Events district with flying messengers, Forms district with glowing input towers, Async district with bridges to floating islands, Storage district with underground vaults, Canvas district with art galleries, Projects district as grand central station, colorful and organized, game map style with clear district borders, vibrant multicolor palette${STYLE_SUFFIX}`
  },
  'browser-mod-dombasics': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a miniature living building with glowing windows that can be selected, a magical hand pointer hovering to select elements, represents DOM selection and manipulation basics, friendly architecture, bright white and blue tones, game icon style${STYLE_SUFFIX}`
  },
  'browser-mod-events': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a cute messenger spirit carrying a glowing scroll, sparkle trail behind, represents event handling and propagation, dynamic movement, multiple smaller spirits in background showing event bubbling, bright and energetic, game icon style${STYLE_SUFFIX}`
  },
  'browser-mod-forms': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a magical scroll with interactive form elements like checkboxes ticking and fields appearing, quill writing automatically, validation sparkles, represents form handling and validation, organized input interface, purple and gold tones, game icon style${STYLE_SUFFIX}`
  },
  'browser-mod-async': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a magical bridge connecting two floating islands, data packets as glowing orbs traveling across, represents fetch and async communication, connection and transfer, blue and teal energy bridge, game icon style${STYLE_SUFFIX}`
  },
  'browser-mod-storage': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring an enchanted vault door slightly open revealing organized glowing containers inside, magical preservation of data, represents browser storage APIs, secure and organized, gold and amber tones, game icon style${STYLE_SUFFIX}`
  },
  'browser-mod-canvas': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a magical easel with a canvas where painted elements are coming alive and stepping out of the frame, creative magic, represents Canvas API for drawing, artistic and dynamic, multicolor paint splashes, game icon style${STYLE_SUFFIX}`
  },
  'browser-mod-projects': {
    type: 'icon',
    size: '1024x1024',
    prompt: `Circular emblem featuring a grand trophy or achievement star surrounded by smaller project icons like a checklist, weather sun, clock, and color palette, represents capstone projects combining all skills, celebratory and accomplished feeling, golden glow, game icon style${STYLE_SUFFIX}`
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const iconsOnly = args.includes('--icons-only');
const bannersOnly = args.includes('--banners-only');
const specificId = args.find(a => !a.startsWith('--'));

// Filter prompts based on arguments
function getPromptsToGenerate() {
  let filtered = { ...PROMPTS };

  if (specificId) {
    if (PROMPTS[specificId]) {
      filtered = { [specificId]: PROMPTS[specificId] };
    } else {
      console.error(`❌ ID "${specificId}" not found`);
      process.exit(1);
    }
  } else if (iconsOnly) {
    filtered = Object.fromEntries(
      Object.entries(PROMPTS).filter(([_, v]) => v.type === 'icon')
    );
  } else if (bannersOnly) {
    filtered = Object.fromEntries(
      Object.entries(PROMPTS).filter(([_, v]) => v.type === 'banner' || v.type === 'worldmap')
    );
  }

  return filtered;
}

// Generate a single image
async function generateImage(id, config) {
  const { prompt, size } = config;

  console.log(`\n🎨 Generating: ${id}`);
  console.log(`   Size: ${size}`);
  console.log(`   Prompt: ${prompt.substring(0, 80)}...`);

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size,
      quality: 'standard',
      response_format: 'url'
    });

    const imageUrl = response.data[0].url;

    // Download image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine subfolder
    const subfolder = config.type === 'icon' ? 'icons' :
                      config.type === 'banner' ? 'banners' : 'worldmaps';
    const outputDir = path.join(OUTPUT_DIR, subfolder);

    // Ensure directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // Save image
    const filename = `${id}.png`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, buffer);

    console.log(`   ✅ Saved: ${filepath}`);

    return { id, success: true, path: filepath };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { id, success: false, error: error.message };
  }
}

// Main function
async function main() {
  console.log('🚀 CodeBog Image Generator - DALL-E 3\n');

  const prompts = getPromptsToGenerate();
  const total = Object.keys(prompts).length;

  console.log(`📋 Images to generate: ${total}`);
  console.log(`💰 Estimated cost: ~$${(total * 0.04).toFixed(2)} (standard quality)`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  let current = 0;

  for (const [id, config] of Object.entries(prompts)) {
    current++;
    console.log(`\n[${current}/${total}] Processing ${id}...`);

    const result = await generateImage(id, config);
    results.push(result);

    // Rate limiting - wait 2 seconds between requests
    if (current < total) {
      console.log('   ⏳ Waiting 2s (rate limit)...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${total}`);
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}`);
    failed.forEach(f => console.log(`   - ${f.id}: ${f.error}`));
  }

  console.log(`\n📁 Images saved in: ${OUTPUT_DIR}`);

  // Save results log
  const logPath = path.join(OUTPUT_DIR, 'generation-log.json');
  fs.writeFileSync(logPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }, null, 2));
  console.log(`📝 Log saved: ${logPath}`);
}

main().catch(console.error);
