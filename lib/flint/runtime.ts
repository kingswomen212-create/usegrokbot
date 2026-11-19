export function program(body: string): string {
  return `(function () {
  var mem = Object.create(null);
  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch (err) {}
    if (Object.prototype.hasOwnProperty.call(mem, key)) return mem[key];
    return fallback;
  }
  function save(key, value) {
    mem[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) {}
  }
  function uid() {
    return Math.random().toString(36).slice(2, 9);
  }
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function on(node, type, fn) {
    if (node) node.addEventListener(type, fn);
  }
  ${body}
})();
`;
}
