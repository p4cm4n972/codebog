// Note: Functions are expected to be defined by user code
// (hslToRgb, rgbToHsl, rgbToHex, hexToRgb, drawColorPalette, drawHueSlider, getColorAt, isValidHex, formatColor, getComplementary, isLightColor)

// Test utilities
let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✓ ${message}`);
        passed++;
    } else {
        console.error(`✗ ${message}`);
        failed++;
    }
}

console.log('Testing Ex35 - Color Picker...\n');

assert(r === 255, 'should convert red');
assert(g === 0, 'should convert red');
assert(b === 0, 'should convert red');
assert(r === 0, 'should convert green');
assert(g === 255, 'should convert green');
assert(b === 0, 'should convert green');
assert(r === 0, 'should convert blue');
assert(g === 0, 'should convert blue');
assert(b === 255, 'should convert blue');
assert(r === 255, 'should convert white');
assert(g === 255, 'should convert white');
assert(b === 255, 'should convert white');
assert(r === 0, 'should convert black');
assert(g === 0, 'should convert black');
assert(b === 0, 'should convert black');
assert(h === 0, 'should convert red');
assert(s === 100, 'should convert red');
assert(l === 50, 'should convert red');
assert(h === 120, 'should convert green');
assert(s === 100, 'should convert green');
assert(l === 50, 'should convert green');
assert(rgbToHex(255, 0, 0) === '#ff0000', 'should convert to hex');
assert(rgbToHex(0, 255, 0) === '#00ff00', 'should convert to hex');
assert(rgbToHex(0, 0, 255) === '#0000ff', 'should convert to hex');
assert(rgbToHex(255, 255, 255) === '#ffffff', 'should convert to hex');
assert(rgbToHex(0, 0, 0) === '#000000', 'should pad with zeros');
assert(rgbToHex(15, 15, 15) === '#0f0f0f', 'should pad with zeros');
assert(JSON.stringify(hexToRgb('#ff0000')) === JSON.stringify([255, 0, 0]), 'should convert from hex');
assert(JSON.stringify(hexToRgb('#00ff00')) === JSON.stringify([0, 255, 0]), 'should convert from hex');
assert(JSON.stringify(hexToRgb('#0000ff')) === JSON.stringify([0, 0, 255]), 'should convert from hex');
assert(JSON.stringify(hexToRgb('ff0000')) === JSON.stringify([255, 0, 0]), 'should handle without #');
assert(hexToRgb('invalid') === null, 'should return null for invalid hex');
assert(hexToRgb('#gg0000') === null, 'should return null for invalid hex');
assert(color.r === 255, 'should return color at position');
assert(color.g === 0, 'should return color at position');
assert(color.b === 0, 'should return color at position');
assert(isValidHex('#ff0000') === true, 'should validate correct hex codes');
assert(isValidHex('#FFF') === true, 'should validate correct hex codes');
assert(isValidHex('ff0000') === true, 'should validate correct hex codes');
assert(isValidHex('invalid') === false, 'should reject invalid hex codes');
assert(isValidHex('#gg0000') === false, 'should reject invalid hex codes');
assert(isValidHex('#ff00') === false, 'should reject invalid hex codes');
assert(h === 180, 'should return complementary color');
assert(h === 90, 'should wrap around 360');
assert(isLightColor(255, 255, 255) === true, 'should detect light colors');
assert(isLightColor(255, 255, 0) === true, 'should detect light colors');
assert(isLightColor(0, 0, 0) === false, 'should detect dark colors');
assert(isLightColor(0, 0, 128) === false, 'should detect dark colors');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
