const test = require('node:test');
const assert = require('node:assert');
const { extractClassAttributes, effectiveTokens, tokenize } = require('../src/lib/classes');

test('tokenize splits on whitespace and drops empty tokens', () => {
  assert.deepStrictEqual(tokenize('  flex  items-center\njustify-between '), [
    'flex',
    'items-center',
    'justify-between',
  ]);
});

test('tokenize strips ${...} template expressions', () => {
  assert.deepStrictEqual(tokenize('flex ${inter.className} items-center'), [
    'flex',
    'items-center',
  ]);
});

test('extracts a double-quoted className and reports line 1', () => {
  const attrs = extractClassAttributes('<div className="flex items-center">');
  assert.strictEqual(attrs.length, 1);
  assert.strictEqual(attrs[0].attr, 'className');
  assert.strictEqual(attrs[0].line, 1);
  assert.deepStrictEqual(attrs[0].tokens, ['flex', 'items-center']);
});

test('extracts a plain class attribute', () => {
  const attrs = extractClassAttributes('<a class="btn btn-primary">');
  assert.strictEqual(attrs.length, 1);
  assert.deepStrictEqual(attrs[0].tokens, ['btn', 'btn-primary']);
});

test('extracts a single-quoted braced className', () => {
  const attrs = extractClassAttributes("<div className={'a b'}>");
  assert.strictEqual(attrs.length, 1);
  assert.deepStrictEqual(attrs[0].tokens, ['a', 'b']);
});

test('extracts a template-literal className and ignores the expression', () => {
  const attrs = extractClassAttributes('className={`flex ${inter.className} items-center`}');
  assert.strictEqual(attrs.length, 1);
  assert.deepStrictEqual(attrs[0].tokens, ['flex', 'items-center']);
});

test('a fully-dynamic template className counts as zero tokens', () => {
  const attrs = extractClassAttributes('className={`${inter.className}`}');
  assert.strictEqual(attrs.length, 1);
  assert.deepStrictEqual(attrs[0].tokens, []);
});

test('computes correct line numbers for multiline input', () => {
  const source = '<div\n  className="a"\n  id="x"\n>';
  const attrs = extractClassAttributes(source);
  assert.strictEqual(attrs.length, 1);
  assert.strictEqual(attrs[0].line, 2);
});

test('captures multiple attributes on the same line', () => {
  const attrs = extractClassAttributes('<a class="a" className="b">');
  assert.strictEqual(attrs.length, 2);
});

test('does not match class-like words inside other attribute names', () => {
  const attrs = extractClassAttributes('<div data-class="x" aria-label="c1 c2">');
  assert.strictEqual(attrs.length, 0);
});

test('ignores complex JSX expressions rather than mis-counting them', () => {
  const attrs = extractClassAttributes('className={condition ? "a b" : "c d"}');
  assert.strictEqual(attrs.length, 0);
});

test('keeps variant and arbitrary-value tokens', () => {
  const attrs = extractClassAttributes('className="hover:bg-green-500 max-w-[600px] lg:p-4"');
  assert.deepStrictEqual(attrs[0].tokens, ['hover:bg-green-500', 'max-w-[600px]', 'lg:p-4']);
});

test('handles single quotes embedded inside a double-quoted value', () => {
  const attrs = extractClassAttributes('className="after:content-[\'\'] before:blur"');
  assert.deepStrictEqual(attrs[0].tokens, ["after:content-['']", 'before:blur']);
});

test('effectiveTokens drops ignored classes', () => {
  assert.deepStrictEqual(effectiveTokens(['flex', 'brand-btn', 'p-4'], ['brand-btn']), [
    'flex',
    'p-4',
  ]);
});

test('effectiveTokens with no exclusions returns tokens unchanged', () => {
  assert.deepStrictEqual(effectiveTokens(['a', 'b']), ['a', 'b']);
});
