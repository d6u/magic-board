const PRAMA = /:(\w+)/g;

function hash() {
  return location.hash.slice(1);
}

/**
 * Supported patterns:
 *
 * /
 * /*
 * /items/:id/detail
 * /items/:id/*
 *
 * @param  {string}   pattern
 * @return {Function} Turn url into route param object, `*` part will be assign
 *                    as `rest` property. Return `false` if no match.
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

function extractHash(url) {
  let i = url.indexOf('#');
  if (i > -1) {
    return url.slice(i + 1);
  }
  return '';
}

function formatRoot() {
  if (!location.hash) {
    location.hash = '/';
  }
}

class RouteRegistry {

  constructor() {
    this.routes = new Map();

    formatRoot();

    window.addEventListener('hashchange', ({ oldURL, newURL }) => {
      let oldHash = extractHash(oldURL);
      let newHash = extractHash(newURL);

      for (let [, obj] of this.routes) {
        let oldParams = obj.matcher(oldHash);
        let newParams = obj.matcher(newHash);

        if (oldParams) {
          obj.callbacks.forEach(cb => cb({ isEnter: false, ...oldParams }));
        }

        if (newParams) {
          obj.callbacks.forEach(cb => cb({ isEnter: true, ...newParams }));
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
    let matcher = parsePattern(pattern);
    let r = this.routes.get(key);

    if (!r) {
      r = { matcher, callbacks: [] };
      this.routes.set(key, r);
    }

    r.callbacks.push(cb);

    // Trigger if already in route
    let m = matcher(hash());
    if (m) {
      cb({ isEnter: true, ...m });
    }

    return key;
  }

  deregister(key, cb) {
    let route = this.routes.get(key);
    route.callbacks = route.callbacks.filter(e => e !== cb );
  }

}

export default new RouteRegistry();
