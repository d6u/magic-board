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

class RouteRegistry {

  constructor() {
    this.noMatchKey = Symbol('No match key');
    this.routes = new Map();
    this.routes.set(this.noMatchKey, {
      callbacks: new Set()
    });

    window.addEventListener('hashchange', ({ oldURL, newURL }) => {
      let oldHash = extractHash(oldURL);
      let newHash = extractHash(newURL);
      let oldMatched = false;
      let newMatched = false;

      for (let [key, obj] of this.routes) {
        if (key === this.noMatchKey) continue;

        let oldParams = obj.matcher(oldHash);
        let newParams = obj.matcher(newHash);

        if (oldParams) {
          oldMatched = true;
          obj.callbacks.forEach(cb => cb({ isEnter: false, ...oldParams }));
        }

        if (newParams) {
          newMatched = true;
          obj.callbacks.forEach(cb => cb({ isEnter: true, ...newParams }));
        }
      }

      if (!oldMatched) {
        this.routes.get(this.noMatchKey).callbacks.forEach(cb => cb({isEnter: false}));
      }

      if (!newMatched) {
        this.routes.get(this.noMatchKey).callbacks.forEach(cb => cb({isEnter: true}));
      }
    }, false);
  }

  /**
   * @param  {string}   [pattern]
   * @param  {Function} cb
   * @return {string}
   */
  register(pattern, cb) {
    if (cb) {
      return this._registerRoute(pattern, cb);
    } else {
      this._registerNoMatch(pattern);
    }
  }

  _registerRoute(pattern, cb) {
    let matcher = parsePattern(pattern);
    let key = pattern.toString();
    let r = this.routes.get(key);

    if (!r) {
      r = { matcher, callbacks: new Set() };
      this.routes.set(key, r);
    }

    r.callbacks.add(cb);

    // Trigger if already in route
    let m = matcher(hash());
    if (m) {
      cb({ isEnter: true, ...m });
    }

    return key;
  }

  _registerNoMatch(cb) {
    let h = hash();
    let matched = false;

    for (let [key, r] of this.routes) {
      if (key === this.noMatchKey) continue;
      if (r.matcher(h)) {
        matched = true;
        break;
      }
    }

    if (!matched) {
      cb({isEnter: true});
    }

    this.routes.get(this.noMatchKey).callbacks.add(cb);
  }

  /**
   * Deregister a route handler
   * @param  {string}   [key] Key returned by register
   * @param  {Function} cb
   * @return {void}
   */
  deregister(key, cb) {
    if (cb) {
      this._deregister(key, cb);
    } else {
      this._deregisterNoMatch(key);
    }
  }

  _deregister(key, cb) {
    this.routes.get(key).callbacks.delete(cb);
  }

  _deregisterNoMatch(cb) {
    this.routes.get(this.noMatchKey).callbacks.delete(cb);
  }

}

export default new RouteRegistry();
