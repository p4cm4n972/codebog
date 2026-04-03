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

// Output directory - ALGOBOG specific
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'algobog');

// Style suffixes - RETRO GAMING / PIXEL ART style
// Matching CodeBog's overall aesthetic (swamp cyberpunk theme but pixel art style)
const PIXEL_ICON_SUFFIX = ', pixel art style, 32-bit retro game icon, clean pixels, crisp edges, limited color palette, game icon, vibrant neon colors, black background, no text, no watermarks';

const PIXEL_BANNER_SUFFIX = ', pixel art style, 16-bit retro game aesthetic, clean pixels, crisp edges, neon lighting, dark cyberpunk city atmosphere, game banner art, limited color palette, no text, no watermarks, no letters';

const PIXEL_MAP_SUFFIX = ', pixel art style, 16-bit isometric game map, clean pixels, crisp edges, bird eye view, neon city lights, dark atmosphere, game world map, limited palette, no text, no watermarks';

// All ALGOBOG image prompts
const PROMPTS = {
  // ==================== WORLDMAP - Vue globale de la ville ====================
  'algobog-worldmap': {
    type: 'worldmap',
    aspect: '16:9',
    prompt: `Isometric pixel art view of a sprawling cyberpunk city at night, 6 distinct glowing districts connected by neon metro lines forming a network, green downtown district with data towers, orange industrial factories with pipes, cyan transit hub with rail networks, purple tech park with holographic buildings, pink research domes with lab equipment, amber skyline tower reaching into clouds, pixel city lights reflecting on dark streets${PIXEL_MAP_SUFFIX}`
  },

  // ==================== DISTRICT 1: DOWNTOWN (Vert - Fondamentaux) ====================
  'algobog-downtown-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide pixel art view of downtown cyberpunk district at night, massive buildings with green neon signs and data displays, street level with pixel characters and data streams, central plaza with glowing green fountain, grid pattern streets representing arrays, welcoming city entrance gate, emerald green neon lighting${PIXEL_BANNER_SUFFIX}`
  },
  'algobog-downtown-icon': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Downtown building icon with green neon glow, grid windows pattern, welcome entrance arch, foundation pillar symbol, emerald green on black${PIXEL_ICON_SUFFIX}`
  },
  // Buildings - Downtown
  'algobog-building-arrays': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Data tower building with numbered grid cells in rows, array structure, index numbers glowing, organized blocks, green neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-strings': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Building wrapped in scrolling text characters, letters cascading down facade, string manipulation symbol, green and cyan neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-hashmaps': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Building with key-value pairs connected by arrows, hash slots visible, lookup table structure, green neon with golden keys${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-twopointers': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Two arrow cursors pointing at each other from opposite sides, converging motion, algorithm symbol, green neon arrows${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-binarysearch': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Building being split in half repeatedly, target highlighted in center, divide and conquer, precision crosshair, green neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-slidingwindow': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Transparent window frame sliding across data row, motion blur effect, scanning pattern, green neon glow${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-sorting': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Bars of different heights being rearranged, swap arrows, ascending order visualization, sorting icon, green neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-stack': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Vertical tower of stacked plates, top plate glowing brightest, LIFO structure, stack symbol, green neon${PIXEL_ICON_SUFFIX}`
  },

  // ==================== DISTRICT 2: INDUSTRIAL (Orange - Structures) ====================
  'algobog-industrial-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide pixel art view of industrial cyberpunk zone at night, massive factories with orange glowing pipes and conveyor belts, chain-linked structures, mechanical arms handling data, smoke stacks emitting particles, complex machinery, warm orange amber neon lighting${PIXEL_BANNER_SUFFIX}`
  },
  'algobog-industrial-icon': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Industrial factory with connected pipes forming chain, gears turning, smoke stack, data structure complexity symbol, orange neon${PIXEL_ICON_SUFFIX}`
  },
  // Buildings - Industrial
  'algobog-building-linkedlists': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Buildings connected by glowing chain links, nodes in sequence, linked list structure, orange neon chains${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-queues': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Conveyor belt with elements entering and exiting, FIFO order, queue symbol, industrial machinery, orange neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-trees': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Hierarchical tree structure, nodes branching downward from root, tree data structure, orange gold neon branches${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-bst': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Balanced binary tree, smaller left larger right, ordered BST structure, numbers visible, orange neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-heaps': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Triangular pyramid heap, largest at top glowing bright, priority queue symbol, orange neon pyramid${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-tries': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Prefix tree with letters at each branch, words forming paths, trie structure, orange neon letter nodes${PIXEL_ICON_SUFFIX}`
  },

  // ==================== DISTRICT 3: TRANSIT HUB (Cyan - Graphes) ====================
  'algobog-transit-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide pixel art view of futuristic transit hub at night, massive central station with multiple levels of glowing cyan metro lines, pixel trains traveling between platforms, network of connected paths, graph structure in architecture, cyan teal neon atmosphere${PIXEL_BANNER_SUFFIX}`
  },
  'algobog-transit-icon': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Metro station hub with lines radiating outward, connected nodes, graph network symbol, cyan neon${PIXEL_ICON_SUFFIX}`
  },
  // Buildings - Transit
  'algobog-building-bfs': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Concentric rings expanding outward from center, wave ripple pattern, breadth first search, cyan neon waves${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-dfs': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Deep vertical path going down then branching, maze exploration, depth first search, cyan neon trail${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-topsort': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Directed arrows flowing one direction, nodes in dependency order, topological sort, cyan neon arrows${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-unionfind': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Separate node groups merging together, set union visualization, disjoint sets, cyan neon clusters${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-shortestpath': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Multiple paths between two points, optimal route highlighted golden, shortest path, cyan with gold highlight${PIXEL_ICON_SUFFIX}`
  },

  // ==================== DISTRICT 4: TECH PARK (Violet - Algo Avancés) ====================
  'algobog-techpark-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide pixel art view of high-tech business park at night, sleek towers with holographic displays, decision trees projected, recursive patterns in architecture, advanced tech aesthetic, purple violet neon lighting${PIXEL_BANNER_SUFFIX}`
  },
  'algobog-techpark-icon': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Modern tech building with holographic displays, recursive patterns, advanced algorithms symbol, purple neon${PIXEL_ICON_SUFFIX}`
  },
  // Buildings - Tech Park
  'algobog-building-backtracking': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Maze with X marks on dead ends, exploration with retreat arrows, backtracking algorithm, purple neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-dp': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Grid table with values computed from previous cells, memoization pattern, dynamic programming, purple neon grid${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-segtrees': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Binary tree with interval brackets on nodes, range query structure, segment tree, purple neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-fenwick': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Special tree with cumulative values, bit index pattern, binary indexed tree, purple neon with numbers${PIXEL_ICON_SUFFIX}`
  },

  // ==================== DISTRICT 5: RESEARCH CAMPUS (Rose - Spécialisation) ====================
  'algobog-research-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide pixel art view of research campus at night, scientific domes and laboratories, equations and formulas floating, mathematical symbols, experimental chambers, pink rose neon lighting${PIXEL_BANNER_SUFFIX}`
  },
  'algobog-research-icon': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Scientific dome with floating math equations, research symbols, specialized algorithms, pink neon${PIXEL_ICON_SUFFIX}`
  },
  // Buildings - Research
  'algobog-building-greedy': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Hand grabbing largest coin from pile, locally optimal choice, greedy algorithm, pink neon with gold coins${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-bits': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Binary digits 0 and 1 with AND OR XOR gates, bit manipulation, digital binary pattern, pink neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-math': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Math symbols pi sigma infinity intertwined, number theory, mathematical algorithms, pink neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-systemdesign': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Interconnected microservices boxes with arrows, system architecture blueprint, scalability, pink neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-concurrency': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Multiple parallel threads running, synchronization locks, concurrent processing, pink neon${PIXEL_ICON_SUFFIX}`
  },

  // ==================== DISTRICT 6: SKYLINE TOWER (Ambre - Expert) ====================
  'algobog-skyline-banner': {
    type: 'banner',
    aspect: '16:9',
    prompt: `Wide pixel art view of tallest tower in city reaching into clouds, golden amber neon crown at top, elite achievement symbols, view over entire city below, prestige and mastery atmosphere, amber gold neon lighting${PIXEL_BANNER_SUFFIX}`
  },
  'algobog-skyline-icon': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Towering skyscraper reaching into golden clouds, crown at top, mastery achievement symbol, amber neon${PIXEL_ICON_SUFFIX}`
  },
  // Buildings - Skyline
  'algobog-building-advanceddp': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Complex multi-dimensional DP grid, bitmask patterns, advanced dynamic programming, amber neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-hardgraphs': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Complex graph with cycles and flow networks, strongly connected, advanced graph algorithms, amber neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-stringalgo': {
    type: 'icon',
    aspect: '1:1',
    prompt: `String patterns with KMP arrows, suffix array visualization, advanced string algorithms, amber neon${PIXEL_ICON_SUFFIX}`
  },
  'algobog-building-contest': {
    type: 'icon',
    aspect: '1:1',
    prompt: `Trophy cup with algorithm symbols, competitive programming championship, contest victory, golden amber neon${PIXEL_ICON_SUFFIX}`
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const iconsOnly = args.includes('--icons-only');
const bannersOnly = args.includes('--banners-only');
const districtFilter = args.find(a => a.startsWith('--district='))?.split('=')[1];
const specificId = args.find(a => !a.startsWith('--'));

// Filter prompts based on arguments
function getPromptsToGenerate() {
  let filtered = { ...PROMPTS };

  if (specificId) {
    if (PROMPTS[specificId]) {
      filtered = { [specificId]: PROMPTS[specificId] };
    } else {
      console.error(`❌ ID "${specificId}" not found`);
      console.log('\nAvailable IDs:');
      Object.keys(PROMPTS).forEach(id => console.log(`  - ${id}`));
      process.exit(1);
    }
  } else if (districtFilter) {
    // Filter by district name
    filtered = Object.fromEntries(
      Object.entries(PROMPTS).filter(([id]) => id.includes(districtFilter))
    );
    if (Object.keys(filtered).length === 0) {
      console.error(`❌ No images found for district "${districtFilter}"`);
      console.log('\nAvailable districts: downtown, industrial, transit, techpark, research, skyline');
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
  console.log(`   Type: ${type} | Style: PIXEL ART RETRO GAMING`);
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
  console.log('🏙️  ALGOBOG Image Generator - Replicate Flux');
  console.log('🎮 Style: PIXEL ART RETRO GAMING (cohérent avec CodeBog)\n');

  const prompts = getPromptsToGenerate();
  const total = Object.keys(prompts).length;
  const icons = Object.values(prompts).filter(p => p.type === 'icon').length;
  const banners = Object.values(prompts).filter(p => p.type === 'banner').length;
  const worldmaps = Object.values(prompts).filter(p => p.type === 'worldmap').length;

  console.log(`📋 Images à générer: ${total}`);
  console.log(`   🏢 Icons: ${icons}`);
  console.log(`   🖼️  Banners: ${banners}`);
  console.log(`   🗺️  Worldmaps: ${worldmaps}`);
  console.log(`💰 Coût estimé: ~$${(total * 0.003).toFixed(3)} (Flux Schnell ~$0.003/image)`);
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
  console.log('📊 RÉSUMÉ\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Réussi: ${successful.length}/${total}`);
  if (failed.length > 0) {
    console.log(`❌ Échec: ${failed.length}`);
    failed.forEach(f => console.log(`   - ${f.id}: ${f.error}`));
  }

  console.log(`\n📁 Images sauvegardées dans: ${OUTPUT_DIR}`);
  console.log(`   📂 icons/     - Icônes pixel art`);
  console.log(`   📂 banners/   - Bannières pixel art`);
  console.log(`   📂 worldmaps/ - Carte du monde pixel art`);

  // Save results log
  const logPath = path.join(OUTPUT_DIR, 'generation-log.json');
  fs.writeFileSync(logPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    model: 'flux-schnell',
    style: 'Pixel Art Retro Gaming',
    totalGenerated: total,
    successful: successful.length,
    failed: failed.length,
    results
  }, null, 2));
  console.log(`📝 Log sauvegardé: ${logPath}`);
}

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🏙️  ALGOBOG Image Generator - Replicate Flux

Usage:
  node generate-algobog.js [options] [image-id]

Options:
  --icons-only          Generate only icon images
  --banners-only        Generate only banner and worldmap images
  --district=<name>     Generate images for a specific district
                        (downtown, industrial, transit, techpark, research, skyline)
  --help, -h            Show this help message

Examples:
  node generate-algobog.js                           # Generate all images
  node generate-algobog.js --icons-only              # Generate only icons
  node generate-algobog.js --district=downtown       # Generate downtown district images
  node generate-algobog.js algobog-worldmap          # Generate specific image

Total images: ${Object.keys(PROMPTS).length}
  - 1 worldmap
  - 6 district banners
  - 6 district icons
  - 34 building icons
`);
  process.exit(0);
}

main().catch(console.error);
