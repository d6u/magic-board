export function random() {
  return Math.floor(Math.random() * 10000);
}

export function zeroFill(n) {
  let digits = n.toString(10).split('');
  while (digits.length < 4) {
    digits.unshift('0');
  }
  return digits.join('');
}
