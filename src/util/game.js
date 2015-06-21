function random(n) {
  return Math.floor(Math.random() * n);
}

function zeroFill(n) {
  let digits = n.toString(10).split('');
  while (digits.length < 4) {
    digits.unshift('0');
  }
  return digits.join('');
}

export function randomGameId() {
  return zeroFill(random(10000));
}

export function roll() {
  let a;
  let b;

  do {
    a = random(20);
    b = random(20);
  } while (a === b);

  return [a, b];
}
