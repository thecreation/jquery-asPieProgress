import $ from 'jquery';
import SvgElement from './svgElement';
import { isPercentage, getTime, svgSupported } from './helpers';
import easingBezier from './easingBezier';
import EASING from './easing';
import DEFAULTS from './defaults';

const NAMESPACE = 'asPieProgress';

class asPieProgress {
  constructor(element, options) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend(true, {}, DEFAULTS, options, this.$element.data());
    this.namespace = this.options.namespace;

    this.classes = this.options.classes;
    this.easing = EASING[this.options.easing] || EASING.ease;
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

  _trigger(eventType, ...params) {
    const data = [this].concat(params);

    // event
    this.$element.trigger(`${NAMESPACE}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    const onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, params);
    }
  }

  // Return the percentage based on the current step
  getPercentage(n) {
    return 100 * (n - this.min) / (this.max - this.min);
  }

  go(goal) {
    const that = this;
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

    const start = that.now;
    const startTime = getTime();
    const endTime = startTime + Math.abs(start - goal) * 100 * that.options.speed / (that.max - that.min);

    const animation = time => {
      let next;

      if (time > endTime) {
        next = goal;
      } else {
        const distance = (time - startTime) / that.options.speed;
        next = Math.round(that.easing.fn(distance / 100) * (that.max - that.min));

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

      that._update(next);
      if (next === goal) {
        window.cancelAnimationFrame(that._frameId);
        that._frameId = null;

        if (that.now === that.goal) {
          that._trigger('finish');
        }
      } else {
        that._frameId = window.requestAnimationFrame(animation);
      }
    };

    that._frameId = window.requestAnimationFrame(animation);
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

  destroy() {
    this.$element.data(NAMESPACE, null);
    this._trigger('destroy');
  }

  static registerEasing(name, ...args) {
    EASING[name] = easingBezier(...args);
  }

  static getEasing(name) {
    return EASING[name];
  }

  static setDefaults(options) {
    $.extend(true, DEFAULTS, $.isPlainObject(options) && options);
  }
}

export default asPieProgress;
