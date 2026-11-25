const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const read = (file) => readFileSync(join(__dirname, '..', file), 'utf8');
const rootUrl = 'https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard/';
const pages = ['books', 'applied-mechanics-design', 'engineering-mathematics', 'manufacturing-industrial-engineering', 'thermal-fluid-sciences'];
const book = (slug) => read(`engineering-careers/gate-mechanical-${slug}.html`);

test('GATE ME marks are tied to the official pattern, not an assumed topic weight', () => {
  const home = read('index.html');
  assert.doesNotMatch(home, /represent 70% of exam weights/);
  const card = home.match(/<h4>GATE ME and Public-Sector Recruitment<\/h4>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(card);
  assert.ok(card.includes('https://gate2027.iitm.ac.in/question_paper_pattern'));
  assert.match(card, /General Aptitude is worth 15 marks, Engineering Mathematics 13, and the remaining Mechanical Engineering topics 72 in total/);
  assert.match(card, /official exam pattern does not assign fixed marks/);
});

test('the right GATE worked examples link to online calculators without changing offline download controls', () => {
  const expected = [
    ['thermal-fluid-sciences', 'bernoulli-continuity', 'pipe-velocity'],
    ['thermal-fluid-sciences', 'thermal-resistance', 'conduction'],
    ['applied-mechanics-design', 'axial-stress-strain', 'axial-stress'],
  ];
  for (const [slug, chapter, tool] of expected) {
    const page = book(slug);
    const section = page.split(`id="${chapter}">`)[1]?.split('</article>')[0];
    assert.ok(section, chapter);
    assert.ok(section.includes(`href="${rootUrl}fieldnotes/tools/${tool}.html"`), tool);
    assert.match(page, /Download offline HTML/);
  }
  assert.match(book('thermal-fluid-sciences'), /continuity only; this calculator does not predict a pressure change/);
  assert.match(book('books'), /href="\.\.\/gate-practice-coach\/">Open the GATE Practice Coach/);
});

test('generated GATE book pages provide a first keyboard shortcut and a reduced-motion override', () => {
  for (const slug of pages) {
    const page = book(slug);
    assert.match(page, /<body><a class="skip-link no-print" href="#main-content">Skip to main content/);
    assert.match(page, /<main id="main-content" tabindex="-1">/);
    assert.match(page, /@media\(prefers-reduced-motion:reduce\)\{html\{scroll-behavior:auto\}\}/);
  }
});

test('the GATE 2027 coach callout uses the official XE0 label and explains the archived code', () => {
  const callout = book('books').match(/<h2>GATE 2027 Practice Coach<\/h2>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(callout);
  assert.match(callout, /Practise XE0 Engineering Mathematics/);
  assert.match(callout, /compulsory 15-mark section of GATE XE/);
  assert.match(callout, /called XE-A in the 2026 paper/);
  assert.ok(callout.includes('https://gate2027.iitm.ac.in/exam_papers_and_syllabus'));
});
