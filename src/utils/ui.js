import debounce from 'lodash/function/debounce';

let adjustREM = debounce(function () {
  document.documentElement.style.fontSize = `${window.innerHeight / 100}px`;
}, 200);

export function initAdjustingREM() {
  adjustREM();
  window.addEventListener('resize', adjustREM, false);
}
