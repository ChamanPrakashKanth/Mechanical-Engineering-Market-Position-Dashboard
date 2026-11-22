const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const test = require('node:test');
const { runInNewContext } = require('node:vm');
const { join } = require('node:path');

const rootFile = (file) => readFileSync(join(__dirname, '..', file), 'utf8');
const source = rootFile('app.js');

function decorativeFrameCount({ id, present = true, reduced = false, display = 'block', context = true }) {
  // Extract the startup functions without loading the dashboard and its browser globals.
  const motion = source.slice(source.indexOf('function canAnimateDecorativeCanvas'), source.indexOf('function showPane'));
  const ambient = source.slice(source.indexOf('function initParticleBackground'), source.indexOf('function initBeamCalculator'));
  let frames = 0;
  const canvas = { getContext: () => context ? new Proxy({}, { get: () => () => {} }) : null };
  runInNewContext(motion + ambient + '\n' + id + '();', {
    activeTheme: 'dark',
    document: { getElementById: () => present ? canvas : null },
    window: {
      innerWidth: 390, innerHeight: 740, addEventListener() {},
      matchMedia(query) {
        assert.equal(query, '(prefers-reduced-motion: reduce)');
        return { matches: reduced };
      },
      getComputedStyle: () => ({ display }),
    },
    requestAnimationFrame: () => { frames += 1; },
  });
  return frames;
}

test('decorative startup queues no frame when hidden, unavailable, or reduced-motion is requested', () => {
  for (const id of ['initParticles', 'initParticleBackground']) {
    for (const options of [{ display: 'none' }, { reduced: true }, { present: false }, { context: false }]) {
      assert.equal(decorativeFrameCount({ id, ...options }), 0);
    }
    assert.equal(decorativeFrameCount({ id }), 1);
  }
});

test('the root benchmark and its navigation describe what is actually available', () => {
  const homepage = rootFile('index.html');
  assert.match(homepage, /10K<\/span>\s*<span class="stat-label">Generated profiles · 100K ranking scale/);
  assert.match(homepage, /Showing 1-12 of 10,000 records/);
  for (const path of ['gate-practice-coach/', 'fieldnotes/tools/pressure-drop.html', 'fieldnotes/guides/engineering-calculation-checklist.html']) {
    assert.ok(homepage.includes(`href="${path}"`), path);
  }
});
