import store from '../store/store';

export function routeChange(name, isEnter) {
  store.routeChange(name, isEnter);
}
