// Matches a class/className attribute whose value is a quoted string ("…", '…'
// or a `…` template literal), optionally wrapped in JSX braces: {"…"} / {`…`}.
// Complex JSX expressions like `className={cond ? "a" : "b"}` are intentionally
// not captured. The negative lookbehind guards against names like `data-class`.
const ATTR_RE =
  /(?<![\w-:.])(class|className)\s*=\s*(?:(["'`])([\s\S]*?)\2|\{\s*(["'`])([\s\S]*?)\4\s*\})/g;

/**
 * Turn a raw attribute value into a list of class tokens.
 * `${...}` template expressions are dropped so runtime-generated classes
 * (e.g. `${inter.className}`) do not inflate the count.
 *
 * @param {string} raw
 * @returns {string[]}
 */
function tokenize(raw) {
  return raw
    .replace(/\$\{[^}]*\}/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

/**
 * Extract every class/className attribute from a source string.
 *
 * @param {string} source
 * @returns {Array<{ attr: string, line: number, tokens: string[] }>}
 */
function extractClassAttributes(source) {
  const attributes = [];
  let match;
  ATTR_RE.lastIndex = 0;

  while ((match = ATTR_RE.exec(source)) !== null) {
    const attr = match[1];
    // Group 3 captures a plain (unbraced) value, group 5 a braced JSX value.
    const raw = match[3] !== undefined ? match[3] : match[5];
    const line = (source.slice(0, match.index).match(/\n/g) || []).length + 1;

    attributes.push({ attr, line, tokens: tokenize(raw) });
  }

  return attributes;
}

/**
 * Remove classes the team does not want counted (custom/brand classes etc.).
 *
 * @param {string[]} tokens
 * @param {string[]} [ignoredClasses]
 * @returns {string[]}
 */
function effectiveTokens(tokens, ignoredClasses = []) {
  const ignored = new Set(ignoredClasses);
  return tokens.filter((token) => !ignored.has(token));
}

module.exports = { extractClassAttributes, effectiveTokens, tokenize };
