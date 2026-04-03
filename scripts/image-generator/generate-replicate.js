import Replicate from 'replicate';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiToken = envContent.split('\n').find(l => l.startsWith('REPLICATE_API_TOKEN'))?.split('=')[1]?.trim();

if (!apiToken) {
  console.error('❌ REPLICATE_API_TOKEN not found in .env');
  process.exit(1);
}

const replicate = new Replicate({ auth: apiToken });

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'curriculum');

// Style suffixes
const PIXEL_ART_SUFFIX = ', pixel art style, 64x64 pixel icon upscaled, retro game aesthetic, limited color palette, clean pixels, crisp edges, no antialiasing, game icon, vibrant colors, black background';
const DIGITAL_ART_SUFFIX = ', digital art style, vibrant colors, high detail, game art aesthetic, no text, no watermarks, no letters, no words, epic composition';

// NEW: Pixel art style matching CodeBog homepage (swamp cyberpunk theme)
const BANNER_PIXEL_ART_SUFFIX = ', pixel art style, 16-bit retro game aesthetic, clean pixels, crisp edges, neon colors purple cyan and green, cyberpunk swamp atmosphere, dark moody with glowing elements, game banner art, limited color palette, no text, no watermarks, no letters';
const WORLDMAP_PIXEL_ART_SUFFIX = ', pixel art style, 16-bit isometric game map, clean pixels, crisp edges, neon accents, cyberpunk swamp theme, dark atmosphere with glowing paths, game world map, limited palette, no text, no watermarks';

// All image prompts organized by season
const PROMPTS = {
  // ==================== SAISON 1: piscine-js-expert ====================
  'expert-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide panoramic swamp landscape at night with glowing neon clock tower in the center, floating platforms connected by purple light bridges over murky water, giant mechanical gears rotating in the sky with blue holographic projections, fireflies and data particles floating, cypress trees silhouettes, temporal portals as swirling cyan vortexes, cyberpunk bog atmosphere${BANNER_PIXEL_ART_SUFFIX}`
  },
  'expert-worldmap': {
    type: 'worldmap',
    aspect: '3:2',
    prompt: `Top-down isometric pixel art map of a cyberpunk swamp, floating islands on dark water connected by glowing bridges, central clockwork mechanism, lily pads and cypress stumps as platforms, neon purple and cyan lighting, temporal zones marked by different colored glows, foggy atmosphere with data streams${WORLDMAP_PIXEL_ART_SUFFIX}`
  },
  'expert-mod-fundamentals': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Glowing blue crystal core with orbiting smaller crystals, fundamental building blocks, geometric design, neon blue glow effect${PIXEL_ART_SUFFIX}`
  },
  'expert-mod-structures': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Interconnected geometric nodes forming a 3D cube structure, purple and cyan gradient, data structures symbol, architectural grid${PIXEL_ART_SUFFIX}`
  },
  'expert-mod-async': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Swirling temporal vortex with clock hands frozen at different angles, blue and violet energy spiral, time manipulation symbol${PIXEL_ART_SUFFIX}`
  },
  'expert-mod-patterns': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Interlocking golden gears and cogs forming a mechanism, steampunk style, design patterns symbol${PIXEL_ART_SUFFIX}`
  },

  // ==================== SAISON 2: piscine-js-ydkjs ====================
  'ydkjs-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide panoramic deep swamp underwater scene, murky dark water with bioluminescent plants and creatures, submerged ancient ruins with glowing teal runes, bubbles and particles rising, multiple depth layers visible, glass domes containing secrets in the deep, anchor chains descending into darkness, mysterious cyberpunk underwater bog atmosphere${BANNER_PIXEL_ART_SUFFIX}`
  },
  'ydkjs-worldmap': {
    type: 'worldmap',
    aspect: '3:2',
    prompt: `Top-down isometric cross-section of underwater swamp layers, 8 depth zones from surface to abyss, bioluminescent pathways connecting glass dome structures, glowing anchor chains as vertical connectors, murky water with particles, teal and deep blue neon accents, ancient stone ruins${WORLDMAP_PIXEL_ART_SUFFIX}`
  },
  'ydkjs-mod-welcome': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Sunlit water surface with gentle waves, coral reef below, light rays penetrating water, welcome symbol, teal tones${PIXEL_ART_SUFFIX}`
  },
  'ydkjs-mod-primitives': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Underwater laboratory flask with glowing elemental orbs inside, bubbles rising, scientific research symbol, teal and cyan${PIXEL_ART_SUFFIX}`
  },
  'ydkjs-mod-scope': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Tall underwater tower with multiple glowing levels, vertical hierarchy structure, scope layers symbol, deep blue and teal${PIXEL_ART_SUFFIX}`
  },
  'ydkjs-mod-closures': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Mystical underwater cave with protective glowing bubble containing treasure, encapsulation symbol, teal and purple${PIXEL_ART_SUFFIX}`
  },
  'ydkjs-mod-this': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Compass pointing in multiple directions simultaneously, shifting context symbol, underwater dojo, zen circle${PIXEL_ART_SUFFIX}`
  },
  'ydkjs-mod-prototype': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Massive anchor chain descending into darkness with glowing links, inheritance chain symbol, deep ocean${PIXEL_ART_SUFFIX}`
  },
  'ydkjs-mod-async-river': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Powerful underwater current river with bioluminescent particles, streams merging and splitting, async flow symbol${PIXEL_ART_SUFFIX}`
  },
  'ydkjs-mod-esnext': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Underwater mountain peak reaching toward surface light, beacon at top, ascending bubbles, achievement symbol${PIXEL_ART_SUFFIX}`
  },

  // ==================== SAISON 3: piscine-js-good-parts ====================
  'goodparts-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide panoramic swamp forge built into twisted ancient trees, glowing orange lava rivers flowing through bog channels, cypress roots forming natural anvils, craftsmen silhouettes at work, sparks and fireflies mixing, steam rising from murky water meeting molten metal, neon orange and gold accents on dark swamp background, mystical forge bog atmosphere${BANNER_PIXEL_ART_SUFFIX}`
  },
  'goodparts-worldmap': {
    type: 'worldmap',
    aspect: '3:2',
    prompt: `Top-down isometric pixel art map of forge chambers built into swamp trees, 7 crafting zones connected by root bridges and lava streams, anvils on lily pad platforms, glowing orange pathways through dark bog water, smoke vents, warm neon orange accents${WORLDMAP_PIXEL_ART_SUFFIX}`
  },
  'goodparts-mod-syntax': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Ornate golden anvil with geometric patterns, small hammer on top, sparks, syntax precision symbol, warm orange glow${PIXEL_ART_SUFFIX}`
  },
  'goodparts-mod-objects': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Display shelf with forged artifacts like keys and gears glowing, object collection symbol, golden lighting${PIXEL_ART_SUFFIX}`
  },
  'goodparts-mod-functions': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Array of craftsman tools on wall, hammers and chisels glowing with magic, functions as tools symbol, orange bronze${PIXEL_ART_SUFFIX}`
  },
  'goodparts-mod-inheritance': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Family tree with connected medallions, oldest at top glowing, inheritance lineage symbol, sepia and gold${PIXEL_ART_SUFFIX}`
  },
  'goodparts-mod-arrays': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Organized rows of identical forged ingots on shelves, precise alignment, array order symbol, bronze copper${PIXEL_ART_SUFFIX}`
  },
  'goodparts-mod-regex': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Ancient stone tablet with glowing runic patterns, pattern matching magic symbol, orange glow on stone${PIXEL_ART_SUFFIX}`
  },
  'goodparts-mod-style': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Open codex book with golden illuminated pages, quill pen beside, best practices symbol, amber lighting${PIXEL_ART_SUFFIX}`
  },

  // ==================== SAISON 4: piscine-js-browser ====================
  'browser-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide panoramic cyberpunk swamp city at twilight, buildings made of giant screens and windows showing colorful portals, messenger fireflies carrying glowing data packets between structures, central plaza with interactive holographic canvas on water surface, floating UI runes and magical symbols, architecture built on stilts over murky water, vibrant neon multicolor accents on dark bog atmosphere${BANNER_PIXEL_ART_SUFFIX}`
  },
  'browser-worldmap': {
    type: 'worldmap',
    aspect: '3:2',
    prompt: `Top-down isometric pixel art map of swamp interface city, 7 districts on platforms connected by bridges over water, central plaza hub, DOM district with living tree-buildings, Events district with flying messengers, Forms district with input towers, colorful neon district markers, dark water with reflections${WORLDMAP_PIXEL_ART_SUFFIX}`
  },
  'browser-mod-dombasics': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Miniature building with glowing selectable windows, magical cursor pointer, DOM selection symbol, white and blue${PIXEL_ART_SUFFIX}`
  },
  'browser-mod-events': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Cute messenger spirit carrying glowing scroll, sparkle trail, event handling symbol, bright energetic${PIXEL_ART_SUFFIX}`
  },
  'browser-mod-forms': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Magical scroll with checkbox and input field, quill writing, form validation symbol, purple and gold${PIXEL_ART_SUFFIX}`
  },
  'browser-mod-async': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Magical bridge connecting two floating islands, glowing orbs traveling across, fetch symbol, blue teal${PIXEL_ART_SUFFIX}`
  },
  'browser-mod-storage': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Enchanted vault door slightly open with glowing containers inside, storage symbol, gold amber${PIXEL_ART_SUFFIX}`
  },
  'browser-mod-canvas': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Magical easel with canvas, painted elements coming alive, creative art symbol, multicolor splashes${PIXEL_ART_SUFFIX}`
  },
  'browser-mod-projects': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Grand trophy star surrounded by small icons checklist sun clock palette, achievement symbol, golden glow${PIXEL_ART_SUFFIX}`
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
      console.log('Available IDs:', Object.keys(PROMPTS).join(', '));
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

// Generate a single image using Flux
async function generateImage(id, config) {
  const { prompt, aspect, type } = config;

  console.log(`\n🎨 Generating: ${id}`);
  console.log(`   Type: ${type} (${type === 'icon' ? 'PIXEL ART' : 'DIGITAL ART'})`);
  console.log(`   Aspect: ${aspect}`);
  console.log(`   Prompt: ${prompt.substring(0, 80)}...`);

  try {
    // Using Flux Schnell (fast) model - good quality and fast
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          aspect_ratio: aspect,
          output_format: "png",
          output_quality: 100,
          num_outputs: 1
        }
      }
    );

    if (!output || output.length === 0) {
      throw new Error('No output received from Replicate');
    }

    const imageUrl = output[0];
    console.log(`   📥 Downloading...`);

    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download: ${imageResponse.status}`);
    }
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
  console.log('🚀 CodeBog Image Generator - Replicate Flux\n');
  console.log('🎮 Style: Icônes en PIXEL ART | Bannières/Maps en DIGITAL ART\n');

  const prompts = getPromptsToGenerate();
  const total = Object.keys(prompts).length;
  const icons = Object.values(prompts).filter(p => p.type === 'icon').length;
  const others = total - icons;

  console.log(`📋 Images to generate: ${total} (${icons} pixel art icons, ${others} digital art)`);
  console.log(`💰 Cost: ~$${(total * 0.003).toFixed(3)} (Flux Schnell ~$0.003/image)`);
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

    // Respect rate limit: 6 requests/minute with <$5 credit = 10 seconds between requests
    if (current < total) {
      console.log('   ⏳ Waiting 10s for rate limit...');
      await new Promise(resolve => setTimeout(resolve, 10000));
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
  console.log(`   📂 icons/     - Pixel art icons`);
  console.log(`   📂 banners/   - Digital art banners`);
  console.log(`   📂 worldmaps/ - Digital art world maps`);

  // Save results log
  const logPath = path.join(OUTPUT_DIR, 'generation-log.json');
  fs.writeFileSync(logPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    model: 'flux-schnell',
    style: 'mixed (pixel art icons + digital art banners)',
    results
  }, null, 2));
  console.log(`📝 Log saved: ${logPath}`);
}

main().catch(console.error);
