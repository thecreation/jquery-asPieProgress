import SvgElement from './svgElement';

if (!Date.now) {
  Date.now = () => {
    'use strict';
    return new Date().getTime();
  }
}

const vendors = ['webkit', 'moz'];
for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
  const vp = vendors[i];
  window.requestAnimationFrame = window[`${vp}RequestAnimationFrame`];
  window.cancelAnimationFrame = (window[`${vp}CancelAnimationFrame`] || window[`${vp}CancelRequestAnimationFrame`]);
}

if (/iP(ad|hone|od).*OS (6|7|8)/.test(window.navigator.userAgent) // iOS6 is buggy
  ||
  !window.requestAnimationFrame || !window.cancelAnimationFrame) {
  let lastTime = 0;
  window.requestAnimationFrame = callback => {
    'use strict';
    const now = getTime();
    const nextTime = Math.max(lastTime + 16, now);
    return setTimeout(() => {
        callback(lastTime = nextTime);
      },
      nextTime - now);
  };
  window.cancelAnimationFrame = clearTimeout;
}

const getTime = () => {
  if (typeof window.performance !== 'undefined' && window.performance.now) {
    return window.performance.now();
  }
  return Date.now();
};

const isPercentage = (n) => {
  'use strict';

  return typeof n === 'string' && n.indexOf('%') !== -1;
};

const svgSupported = 'createElementNS' in document && new SvgElement('svg', {}).createSVGRect;

export { isPercentage, getTime, svgSupported };
