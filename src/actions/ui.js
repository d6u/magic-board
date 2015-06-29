import store from '../store/store';
import {Map} from 'immutable';

export function openMenu(state) {
  store.uiChange(Map({
    showMenu: true
  }));
}

export function closeMenu(state) {
  store.uiChange(Map({
    showMenu: false
  }));
}
