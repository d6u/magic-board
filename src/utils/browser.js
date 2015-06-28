import UAParser from 'ua-parser-js';

let uaString = navigator.userAgent || navigator.vendor || window.opera;

export let isMobile = new UAParser(uaString).getDevice().type === 'mobile';
