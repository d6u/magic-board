function hash() {
  return location.hash.slice(1);
}

const PRAMA = /:(\w+)/g;

/**
 *
 * /
 * /*
 * /items/:id/detail
 * /items/:id/*
 *
 * @param  {string} pattern
 * @return {Function}
 */
function parsePattern(pattern) {
  let raw = '';
  let pramaRegex = new RegExp(PRAMA);
  let i = 0;
  let labels = [];
  let m;

  while ((m = pramaRegex.exec(pattern))) {
    raw += pattern.slice(i, m.index);
    raw += '(\\w+)';
    labels.push(m[1]);
    i += m.index + m[0].length;
  }

  raw += pattern.slice(i);

  raw = raw.replace('*', '([\\w/]+)');

  raw += '$';

  let regex = new RegExp(raw);

  return function (url) {
    let r = regex.exec(url);
    if (r) {
      let params = {};
      let i;

      for (i = 0; i < labels.length; i++) {
        params[labels[i]] = r[i + 1];
      }

      // Save `*` portion
      if (r[i + 1]) {
        params.rest = r[i + 1];
      }

      return params;
    }
    return false;
  };
}

export default class RouteRegistry {

  constructor() {
    this.routes = new Map();

    window.addEventListener('hashchange', () => {
      for (let [, obj] of this.routes) {
        let r = obj.matcher(hash());
        if (r) {
          obj.callbacks.forEach(cb => cb(r));
        }
      }
    }, false);
  }

  /**
   * @param  {string}   pattern
   * @param  {Function} cb
   * @return {string}
   */
  register(pattern, cb) {
    let key = pattern.toString();
    let r = this.routes.get(key);
    let matcher = parsePattern(pattern);

    if (!r) {
      r = { matcher, callbacks: [] };
      this.routes.set(key, r);
    }

    r.callbacks.push(cb);

    // Trigger if already in route
    let m = matcher(hash());
    if (m) {
      cb(m);
    }

    return key;
  }

  deregister(key, cb) {
    let route = this.routes.get(key);
    route.callbacks = route.callbacks.filter(e => e !== cb );
  }

}

export const sharedRegistry = new RouteRegistry();
