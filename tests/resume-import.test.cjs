const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const dashboard = read('app.js');

test('every résumé PDF loader opts out of PDF.js evaluation, including the careers generator', () => {
    for (const [source, options] of [
        [dashboard, /\(\{\s*data: arrayBuffer,\s*isEvalSupported: false\s*\}\)/],
        [read('engineering-careers/app.js'), /\(\{\s*data: arrayBuffer,\s*isEvalSupported: false\s*\}\)/],
        [read('generate_engineering_hub.py'), /\(\{\{\s*data: arrayBuffer,\s*isEvalSupported: false\s*\}\}\)/]
    ]) {
        const calls = source.match(/pdfjsLib\.getDocument\s*\(.*/g);
        assert.equal(calls?.length, 1);
        assert.match(calls[0], options);
    }
});

test('résumé preview preserves literal text and creates only fixed highlight spans', () => {
    const source = dashboard.match(/^function renderResumePreview\(.+?^\}/ms)?.[0];
    assert.ok(source);
    assert.match(dashboard, /renderResumePreview\(document\.getElementById\("highlighted-resume-box"\), parsed\)/);
    assert.doesNotMatch(source, /innerHTML|insertAdjacentHTML/);
    const createElement = tag => ({ tag, className: '', textContent: '' });
    const createTextNode = textContent => ({ textContent });
    const render = vm.runInNewContext(source + '\nrenderResumePreview', { document: { createElement, createTextNode } });
    const box = {
        children: [],
        set textContent(value) { this.children = value ? [createTextNode(value)] : []; },
        get textContent() { return this.children.map(node => node.textContent).join(''); },
        append(...children) { this.children.push(...children); }
    };
    const raw_text = 'SolidWorks\n<sample>FEA & C++</sample>';
    render(box, { raw_text, skills: ['FEA', 'C++'], software_tools: ['SolidWorks'], certifications: [] });
    assert.equal(box.textContent, raw_text);
    assert.deepEqual(box.children.filter(node => node.tag).map(({ tag, className, textContent }) => [tag, className, textContent]), [
        ['span', 'highlight-software', 'SolidWorks'],
        ['span', 'highlight-skill', 'FEA'],
        ['span', 'highlight-skill', 'C++']
    ]);
    render(box, { raw_text: '<sample>plain text</sample>', skills: [], software_tools: [], certifications: [] });
    assert.deepEqual(box.children, [{ textContent: '<sample>plain text</sample>' }]);
});

test('career assessment skip link targets the native PDF chooser, not the drop area or hidden input', () => {
    const html = read('index.html');
    assert.match(html, /<a class="skip-link" href="#choose-resume-pdf">/);
    const zone = html.match(/<div class="drag-drop-zone" id="upload-dropzone">([\s\S]+?)<\/div>\s*<\/div>\s*<input\b[^>]*id="hero-file-input"[^>]*\bhidden>/);
    assert.ok(zone, 'the native file input is hidden and outside the click handling area');
    assert.match(zone[1], /<button type="button"[^>]*id="choose-resume-pdf"[^>]*>Choose a résumé PDF<\/button>/);
    assert.match(zone[1], /id="hero-upload-status"[^>]*role="status"/);
});
