import {makeIterable} from './collection';

const PRAMA_REGEX = /:(\w+)/g;

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
  let pramaRegex = new RegExp(PRAMA_REGEX);
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

  raw = raw.replace('*', '([\\w/]*)');

  raw += '$';

  let regex = new RegExp(raw);

  return function (url) {
    if (url == null) return false;

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
  if (url == null) return null;

  let i = url.indexOf('#');
  if (i > -1) {
    return url.slice(i + 1);
  }
  return '';
}



export default class RouteRegistry {

  constructor(routeMap) {
    this.routes = new Set();

    for (let [pattern, callback] of makeIterable(routeMap)) {
      let matcher = parsePattern(pattern);
      this.routes.add({matcher, callback});
    }

    const hashchangeHandler = ({oldURL, newURL}) => {
      let oldHash = extractHash(oldURL);
      let newHash = extractHash(newURL);

      let oldParams;
      let oldRouteCallback;

      let newParams;
      let newRouteCallback;

      for (let {matcher, callback} of this.routes) {
        if (!oldParams) {
          oldParams = matcher(oldHash);
          oldRouteCallback = callback;
        }

        if (!newParams) {
          newParams = matcher(newHash);
          newRouteCallback = callback;
        }

        if (oldParams && newParams) break;
      }

      if (oldParams) {
        oldRouteCallback({isEnter: false, ...oldParams});
      }

      if (newParams) {
        newRouteCallback({isEnter: true, ...newParams});
      }
    };

    hashchangeHandler({newURL: location.href});

    window.addEventListener('hashchange', hashchangeHandler, false);
  }

}
