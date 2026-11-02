(function () {
  const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  const WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  const EVENTS = { onclick: 'click', onchange: 'input' };

  function lookup(path, scopes) {
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    const parts = path.split('.');
    for (const scope of scopes) {
      if (scope && Object.prototype.hasOwnProperty.call(scope, parts[0])) {
        let v = scope;
        for (const p of parts) {
          if (v == null) return undefined;
          v = v[p];
        }
        return v;
      }
    }
    return undefined;
  }

  function fill(text, scopes) {
    return text.replace(HOLE, (_, p) => {
      const v = lookup(p, scopes);
      return v == null ? '' : String(v);
    });
  }

  function build(node, scopes, out) {
    if (node.nodeType === 3) {
      out.appendChild(document.createTextNode(fill(node.nodeValue, scopes)));
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (tag === 'sc-if') {
      const m = (node.getAttribute('value') || '').match(WHOLE);
      if (m && lookup(m[1], scopes)) node.childNodes.forEach((c) => build(c, scopes, out));
      return;
    }
    if (tag === 'sc-for') {
      const m = (node.getAttribute('list') || '').match(WHOLE);
      const list = m ? lookup(m[1], scopes) || [] : [];
      const as = node.getAttribute('as') || 'item';
      list.forEach((item, i) => {
        const local = { [as]: item, $index: i };
        node.childNodes.forEach((c) => build(c, [local].concat(scopes), out));
      });
      return;
    }
    const el = node.namespaceURI === 'http://www.w3.org/2000/svg'
      ? document.createElementNS(node.namespaceURI, node.tagName)
      : document.createElement(node.tagName);
    for (const attr of node.attributes) {
      const name = attr.name;
      if (name.startsWith('hint-')) continue;
      if (EVENTS[name]) {
        const m = attr.value.match(WHOLE);
        const fn = m && lookup(m[1], scopes);
        if (typeof fn === 'function') {
          el.__h = el.__h || {};
          el.__h[EVENTS[name]] = fn;
        }
        continue;
      }
      if (name === 'value' && (tag === 'input' || tag === 'textarea')) {
        const v = fill(attr.value, scopes);
        el.__val = v;
        el.value = v;
        continue;
      }
      el.setAttribute(name, fill(attr.value, scopes));
    }
    const src = tag === 'template' ? node.content : node;
    src.childNodes.forEach((c) => build(c, scopes, el));
    out.appendChild(el);
  }

  function morph(a, b) {
    if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) {
      a.replaceWith(b);
      return;
    }
    if (a.nodeType === 3) {
      if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue;
      return;
    }
    if (a.nodeType !== 1) return;
    for (const { name } of Array.from(a.attributes)) {
      if (name === 'open' && a.tagName === 'DETAILS') continue;
      if (!b.hasAttribute(name)) a.removeAttribute(name);
    }
    for (const { name, value } of Array.from(b.attributes)) {
      if (a.getAttribute(name) !== value) a.setAttribute(name, value);
    }
    a.__h = b.__h;
    if ('__val' in b && document.activeElement !== a && a.value !== b.__val) a.value = b.__val;
    const ac = Array.from(a.childNodes);
    const bc = Array.from(b.childNodes);
    bc.forEach((n, i) => (i < ac.length ? morph(ac[i], n) : a.appendChild(n)));
    for (let i = bc.length; i < ac.length; i++) ac[i].remove();
  }

  function dispatch(e) {
    let el = e.target;
    while (el && el !== document) {
      if (el.__h && el.__h[e.type]) {
        el.__h[e.type](e);
        return;
      }
      el = el.parentNode;
    }
  }

  class DCLogic {
    constructor(props) {
      this.props = props || {};
      this.state = {};
    }
    setState(patch) {
      const p = typeof patch === 'function' ? patch(this.state) : patch;
      this.state = Object.assign({}, this.state, p);
      this.__render();
    }
    forceUpdate() {
      this.__render();
    }
  }

  function mount(Component, templateId, rootId, props) {
    const tpl = document.getElementById(templateId);
    const root = document.getElementById(rootId);
    const comp = new Component(props || {});
    let queued = false;
    const render = () => {
      queued = false;
      const vals = comp.renderVals();
      const next = document.createElement(root.tagName);
      tpl.content.childNodes.forEach((c) => build(c, [vals], next));
      if (!root.firstChild) {
        while (next.firstChild) root.appendChild(next.firstChild);
      } else {
        for (const { name, value } of Array.from(root.attributes)) next.setAttribute(name, value);
        morph(root, next);
      }
    };
    comp.__render = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(render);
      }
    };
    document.addEventListener('click', dispatch);
    document.addEventListener('input', dispatch);
    render();
  }

  window.DCLogic = DCLogic;
  window.dcMount = mount;
})();
