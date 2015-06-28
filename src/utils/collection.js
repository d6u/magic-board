export function makeIterable(obj) {
  return {
    * [Symbol.iterator]() {
      for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
      }
    }
  };
}
