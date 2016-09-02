/*
 * jquery-asPieProgress
 * https://github.com/amazingSurge/jquery-asPieProgress
 *
 * Copyright (c) 2015 amazingSurge
 * Licensed under the GPL license.
 */
import $ from 'jquery';
import getTime from './getTime';
import SvgElement from './svgElement';
import isPercentage from './isPercentage';
import easingBezier from './easingBezier';
import defaults from './defaults';

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
if (/iP(ad|hone|od).*OS (6|7)/.test(window.navigator.userAgent) // iOS6 is buggy
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

const svgSupported = 'createElementNS' in document && new SvgElement('svg', {}).createSVGRect;

const pluginName = 'asPieProgress';

defaults.namespace = pluginName;

class asPieProgress {
  constructor(element, options) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend({}, defaults, options, this.$element.data());
    this.namespace = this.options.namespace;

    this.classes = this.options.classes;
    this.easing = asPieProgress.easing[this.options.easing] || asPieProgress.easing.ease;
    this.$element.addClass(this.classes.element);

    this.min = this.$element.attr('aria-valuemin');
    this.max = this.$element.attr('aria-valuemax');
    this.min = this.min ? parseInt(this.min, 10) : this.options.min;
    this.max = this.max ? parseInt(this.max, 10) : this.options.max;
    this.first = this.$element.attr('aria-valuenow');
    this.first = this.first ? parseInt(this.first, 10) : (this.options.first ? this.options.first : this.min);
    this.now = this.first;
    this.goal = this.options.goal;

    this._frameId = null;

    this.initialized = false;

    this._trigger('init');
    this.init();
  }

  init() {
    this.$number = this.$element.find(`.${this.classes.number}`);
    this.$content = this.$element.find(`.${this.classes.content}`);

    this.size = this.options.size;
    this.width = this.size;
    this.height = this.size;

    this.prepare();

    this.initialized = true;
    this._trigger('ready');
  }
  prepare() {
    if (!svgSupported) {
      return;
    }

    this.svg = new SvgElement('svg', {
      version: '1.1',
      preserveAspectRatio: 'xMinYMin meet',
      viewBox: `0 0 ${this.width} ${this.height}`
    });

    this.buildTrack();
    this.buildBar();

    $(`<div class="${this.classes.svg}"></div>`).append(this.svg).appendTo(this.$element);
  }
  buildTrack() {
    const height = this.size,
      width = this.size;

    const cx = width / 2,
      cy = height / 2;

    const barsize = this.options.barsize;

    const ellipse = new SvgElement('ellipse', {
      rx: cx - barsize / 2,
      ry: cy - barsize / 2,
      cx,
      cy,
      stroke: this.options.trackcolor,
      fill: this.options.fillcolor,
      'stroke-width': barsize
    });

    this.svg.appendChild(ellipse);
  }
  buildBar() {
    if (!svgSupported) {
      return;
    }

    const path = new SvgElement('path', {
      fill: 'none',
      'stroke-width': this.options.barsize,
      stroke: this.options.barcolor
    });
    this.bar = path;
    this.svg.appendChild(path);

    this._drawBar(this.first);
    this._updateBar();
  }
  _drawBar(n) {
    if (!svgSupported) {
      return;
    }

    this.barGoal = n;
    const height = this.size,
      width = this.size;

    const cx = width / 2,
      cy = height / 2,
      startAngle = 0;

    const barsize = this.options.barsize;

    const r = Math.min(cx, cy) - barsize / 2;
    this.r = r;
    let percentage = this.getPercentage(n);

    if (percentage === 100) {
      percentage -= 0.0001;
    }
    const endAngle = startAngle + percentage * Math.PI * 2 / 100;

    const x1 = cx + r * Math.sin(startAngle),
      x2 = cx + r * Math.sin(endAngle),
      y1 = cy - r * Math.cos(startAngle),
      y2 = cy - r * Math.cos(endAngle);

    // This is a flag for angles larger than than a half circle
    // It is required by the SVG arc drawing component
    let big = 0;
    if (endAngle - startAngle > Math.PI) {
      big = 1;
    }

    // This string holds the path details
    const d = `M${x1},${y1} A${r},${r} 0 ${big} 1 ${x2},${y2}`;

    this.bar.setAttribute('d', d);
  }
  _updateBar() {
    if (!svgSupported) {
      return;
    }
    const percenage = this.getPercentage(this.now);

    const length = this.bar.getTotalLength();
    const offset = length * (1 - percenage / this.getPercentage(this.barGoal));

    this.bar.style.strokeDasharray = `${length} ${length}`;
    this.bar.style.strokeDashoffset = offset;
  }
  _trigger(eventType, ...args) {
      const data = [this].concat(args);

      // event
      this.$element.trigger(`${pluginName}::${eventType}`, data);

      // callback
      eventType = eventType.replace(/\b\w+\b/g, word => word.substring(0, 1).toUpperCase() + word.substring(1));
      const onFunction = `on${eventType}`;
      if (typeof this.options[onFunction] === 'function') {
        this.options[onFunction](args);
      }
    }
    // Return the percentage based on the current step
  getPercentage(n) {
    return 100 * (n - this.min) / (this.max - this.min);
  }
  go(goal) {
    const self = this;
    this._clear();

    if (isPercentage(goal)) {
      goal = parseInt(goal.replace('%', ''), 10);
      goal = Math.round(this.min + (goal / 100) * (this.max - this.min));
    }
    if (typeof goal === 'undefined') {
      goal = this.goal;
    }

    if (goal > this.max) {
      goal = this.max;
    } else if (goal < this.min) {
      goal = this.min;
    }

    if (this.barGoal < goal) {
      this._drawBar(goal);
    }

    const start = self.now;
    const startTime = getTime();
    const endTime = startTime + Math.abs(start - goal) * 100 * self.options.speed / (self.max - self.min);

    const animation = time => {
      let next;

      if (time > endTime) {
        next = goal;
      } else {
        const distance = (time - startTime) / self.options.speed;
        next = Math.round(self.easing.fn(distance / 100) * (self.max - self.min));

        if (goal > start) {
          next = start + next;
          if (next > goal) {
            next = goal;
          }
        } else {
          next = start - next;
          if (next < goal) {
            next = goal;
          }
        }
      }

      self._update(next);
      if (next === goal) {
        window.cancelAnimationFrame(self._frameId);
        self._frameId = null;

        if (self.now === self.goal) {
          self._trigger('finish');
        }
      } else {
        self._frameId = window.requestAnimationFrame(animation);
      }
    };

    self._frameId = window.requestAnimationFrame(animation);
  }
  _update(n) {
    this.now = n;

    this._updateBar();

    this.$element.attr('aria-valuenow', this.now);
    if (this.$number.length > 0 && typeof this.options.numberCallback === 'function') {
      this.$number.html(this.options.numberCallback.call(this, [this.now]));
    }
    if (this.$content.length > 0 && typeof this.options.contentCallback === 'function') {
      this.$content.html(this.options.contentCallback.call(this, [this.now]));
    }

    this._trigger('update', n);
  }
  _clear() {
    if (this._frameId) {
      window.cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
  }
  get() {
    return this.now;
  }
  start() {
    this._clear();
    this._trigger('start');
    this.go(this.goal);
  }
  reset() {
    this._clear();
    this._drawBar(this.first);
    this._update(this.first);
    this._trigger('reset');
  }
  stop() {
    this._clear();
    this._trigger('stop');
  }
  finish() {
    this._clear();
    this._update(this.goal);
    this._trigger('finish');
  }
  destory() {
    this.$element.data(pluginName, null);
    this._trigger('destory');
  }

  static _jQueryInterface(options, ...args) {
    if (typeof options === 'string') {
      const method = options;

      if (/^\_/.test(method)) {
        return false;
      } else if ((/^(get)$/.test(method))) {
        const api = this.first().data(pluginName);
        if (api && typeof api[method] === 'function') {
          return api[method](...args);
        }
      } else {
        return this.each(function() {
          const api = $.data(this, pluginName);
          if (api && typeof api[method] === 'function') {
            api[method](...args);
          }
        });
      }
    }
    return this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new asPieProgress(this, options));
      }
    });
  }
}

$.extend(asPieProgress.easing = {}, {
  ease: easingBezier(0.25, 0.1, 0.25, 1.0),
  linear: easingBezier(0.00, 0.0, 1.00, 1.0),
  'ease-in': easingBezier(0.42, 0.0, 1.00, 1.0),
  'ease-out': easingBezier(0.00, 0.0, 0.58, 1.0),
  'ease-in-out': easingBezier(0.42, 0.0, 0.58, 1.0)
});

$.fn[pluginName] = asPieProgress._jQueryInterface;
$.fn[pluginName].constructor = asPieProgress;
$.fn[pluginName].noConflict = () => {
  'use strict';
  $.fn[pluginName] = window.JQUERY_NO_CONFLICT;
  return asPieProgress._jQueryInterface;
};

export default asPieProgress;
