// Note: Functions are expected to be defined by user code
// (formatTime, parseTime, createStopwatch, createTimer, formatLaps)

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

console.log('Testing Ex34 - Timer & Stopwatch...\n');

assert(formatTime(0) === '00:00.00', 'should format milliseconds to MM:SS.CC');
assert(formatTime(1000) === '00:01.00', 'should format milliseconds to MM:SS.CC');
assert(formatTime(60000) === '01:00.00', 'should format milliseconds to MM:SS.CC');
assert(formatTime(61230) === '01:01.23', 'should format milliseconds to MM:SS.CC');
assert(formatTime(3600000) === '60:00.00', 'should handle minutes over 59');
assert(parseTime('00:00') === 0, 'should parse MM:SS to milliseconds');
assert(parseTime('00:01') === 1000, 'should parse MM:SS to milliseconds');
assert(parseTime('01:00') === 60000, 'should parse MM:SS to milliseconds');
assert(parseTime('05:30') === 330000, 'should parse MM:SS to milliseconds');
assert(sw.getElapsed() === 0, 'should start at 0');
assert(JSON.stringify(sw.getElapsed()) === JSON.stringify(elapsed1), 'should pause and resume');
assert(sw.getElapsed() > elapsed1, 'should pause and resume');
assert(sw.getElapsed() === 0, 'should reset');
assert(laps.length === 2, 'should record laps');
assert(sw.isRunning() === false, 'should report running state');
assert(sw.isRunning() === true, 'should report running state');
assert(sw.isRunning() === false, 'should report running state');
assert(formatted.length === 3, 'should format laps with times');
assert(formatted[0].includes('00:01'), 'should format laps with times');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
