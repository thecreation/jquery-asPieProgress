/**
* jQuery asPieProgress
* A jQuery plugin that animate the progress bar
* Compiled: Thu Sep 01 2016 16:29:53 GMT+0800 (CST)
* @version v0.3.4
* @link https://github.com/amazingSurge/jquery-asPieProgress
* @copyright LGPL-3.0
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'jQuery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jQuery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.jqueryAsPieProgress = mod.exports;
  }
})(this,

  function(exports, _jQuery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _jQuery2 = _interopRequireDefault(_jQuery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?

      function(obj) {
        return typeof obj;
      }
      :

      function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

    var getTime = function getTime() {
      'use strict';

      if (typeof window.performance !== 'undefined' && window.performance.now) {

        return window.performance.now();
      }

      return Date.now();
    };

    var SvgElement = function SvgElement(tag, attrs) {
      'use strict';

      var elem = document.createElementNS('http://www.w3.org/2000/svg', tag);

      _jQuery2.default.each(attrs,

        function(name, value) {
          elem.setAttribute(name, value);
        }
      );

      return elem;
    };

    var isPercentage = function isPercentage(n) {
      'use strict';

      return typeof n === 'string' && n.indexOf('%') !== -1;
    };

    var easingBezier = function easingBezier(mX1, mY1, mX2, mY2) {
      'use strict';

      function A(aA1, aA2) {
        return 1.0 - 3.0 * aA2 + 3.0 * aA1;
      }

      function B(aA1, aA2) {
        return 3.0 * aA2 - 6.0 * aA1;
      }

      function C(aA1) {
        return 3.0 * aA1;
      }

      // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.

      function CalcBezier(aT, aA1, aA2) {
        return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
      }

      // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.

      function GetSlope(aT, aA1, aA2) {
        return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
      }

      function GetTForX(aX) {
        // Newton raphson iteration
        var aGuessT = aX;

        for (var i = 0; i < 4; ++i) {
          var currentSlope = GetSlope(aGuessT, mX1, mX2);

          if (currentSlope === 0.0) {

            return aGuessT;
          }
          var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
          aGuessT -= currentX / currentSlope;
        }

        return aGuessT;
      }

      if (mX1 === mY1 && mX2 === mY2) {

        return {
          css: 'linear',
          fn: function fn(aX) {
            return aX;
          }
        };
      }

      return {
        css: 'cubic-bezier(' + mX1 + ',' + mY1 + ',' + mX2 + ',' + mY2 + ')',
        fn: function fn(aX) {
          return CalcBezier(GetTForX(aX), mY1, mY2);
        }
      };
    };

    var defaults = {
      namespace: '',
      classes: {
        svg: 'pie_progress__svg',
        element: 'pie_progress',
        number: 'pie_progress__number',
        content: 'pie_progress__content'
      },
      min: 0,
      max: 100,
      goal: 100,
      size: 160,
      speed: 15, // speed of 1/100
      barcolor: '#ef1e25',
      barsize: '4',
      trackcolor: '#f2f2f2',
      fillcolor: 'none',
      easing: 'ease',
      numberCallback: function numberCallback(n) {
        'use strict';

        var percentage = Math.round(this.getPercentage(n));

        return percentage + '%';
      },

      contentCallback: null
    };

    if (!Date.now) {
      Date.now = function() {
        'use strict';

        return new Date().getTime();
      }
      ;
    }

    var vendors = ['webkit', 'moz'];

    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    }

    if (/iP(ad|hone|od).*OS (6|7)/.test(window.navigator.userAgent) // iOS6 is buggy
      || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
      (function() {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
          'use strict';

          var now = getTime();
          var nextTime = Math.max(lastTime + 16, now);

          return setTimeout(

            function() {
              callback(lastTime = nextTime);
            }
            , nextTime - now);
        }
        ;
        window.cancelAnimationFrame = clearTimeout;
      })();
    }

    var svgSupported = 'createElementNS' in document && new SvgElement('svg', {}).createSVGRect;

    var pluginName = 'asPieProgress';

    defaults.namespace = pluginName;

    var asPieProgress = function() {
      function asPieProgress(element, options) {
        _classCallCheck(this, asPieProgress);

        this.element = element;
        this.$element = (0, _jQuery2.default)(element);

        this.options = _jQuery2.default.extend({}, defaults, options, this.$element.data());
        this.namespace = this.options.namespace;

        this.classes = this.options.classes;
        this.easing = asPieProgress.easing[this.options.easing] || asPieProgress.easing.ease;
        this.$element.addClass(this.classes.element);

        this.min = this.$element.attr('aria-valuemin');
        this.max = this.$element.attr('aria-valuemax');
        this.min = this.min ? parseInt(this.min, 10) : this.options.min;
        this.max = this.max ? parseInt(this.max, 10) : this.options.max;
        this.first = this.$element.attr('aria-valuenow');
        this.first = this.first ? parseInt(this.first, 10) : this.options.first ? this.options.first : this.min;
        this.now = this.first;
        this.goal = this.options.goal;

        this._frameId = null;

        this.initialized = false;

        this._trigger('init');
        this.init();
      }

      _createClass(asPieProgress, [{
        key: 'init',
        value: function init() {
          this.$number = this.$element.find('.' + this.classes.number);
          this.$content = this.$element.find('.' + this.classes.content);

          this.size = this.options.size;
          this.width = this.size;
          this.height = this.size;

          this.prepare();

          this.initialized = true;
          this._trigger('ready');
        }
      }, {
        key: 'prepare',
        value: function prepare() {
          if (!svgSupported) {

            return;
          }

          this.svg = new SvgElement('svg', {
            version: '1.1',
            preserveAspectRatio: 'xMinYMin meet',
            viewBox: '0 0 ' + this.width + ' ' + this.height
          });

          this.buildTrack();
          this.buildBar();

          (0, _jQuery2.default)('<div class="' + this.classes.svg + '"></div>').append(this.svg).appendTo(this.$element);
        }
      }, {
        key: 'buildTrack',
        value: function buildTrack() {
          var height = this.size,
            width = this.size;

          var cx = width / 2,
            cy = height / 2;

          var barsize = this.options.barsize;

          var ellipse = new SvgElement('ellipse', {
            rx: cx - barsize / 2,
            ry: cy - barsize / 2,
            cx: cx,
            cy: cy,
            stroke: this.options.trackcolor,
            fill: this.options.fillcolor,
            'stroke-width': barsize
          });

          this.svg.appendChild(ellipse);
        }
      }, {
        key: 'buildBar',
        value: function buildBar() {
          if (!svgSupported) {

            return;
          }

          var path = new SvgElement('path', {
            fill: 'none',
            'stroke-width': this.options.barsize,
            stroke: this.options.barcolor
          });
          this.bar = path;
          this.svg.appendChild(path);

          this._drawBar(this.first);
          this._updateBar();
        }
      }, {
        key: '_drawBar',
        value: function _drawBar(n) {
          if (!svgSupported) {

            return;
          }

          this.barGoal = n;
          var height = this.size,
            width = this.size;

          var cx = width / 2,
            cy = height / 2,
            startAngle = 0;

          var barsize = this.options.barsize;

          var r = Math.min(cx, cy) - barsize / 2;
          this.r = r;
          var percentage = this.getPercentage(n);

          if (percentage === 100) {
            percentage -= 0.0001;
          }
          var endAngle = startAngle + percentage * Math.PI * 2 / 100;

          var x1 = cx + r * Math.sin(startAngle),
            x2 = cx + r * Math.sin(endAngle),
            y1 = cy - r * Math.cos(startAngle),
            y2 = cy - r * Math.cos(endAngle);

          // This is a flag for angles larger than than a half circle
          // It is required by the SVG arc drawing component
          var big = 0;

          if (endAngle - startAngle > Math.PI) {
            big = 1;
          }

          // This string holds the path details
          var d = 'M' + x1 + ',' + y1 + ' A' + r + ',' + r + ' 0 ' + big + ' 1 ' + x2 + ',' + y2;

          this.bar.setAttribute('d', d);
        }
      }, {
        key: '_updateBar',
        value: function _updateBar() {
          if (!svgSupported) {

            return;
          }
          var percenage = this.getPercentage(this.now);

          var length = this.bar.getTotalLength();
          var offset = length * (1 - percenage / this.getPercentage(this.barGoal));

          this.bar.style.strokeDasharray = length + ' ' + length;
          this.bar.style.strokeDashoffset = offset;
        }
      }, {
        key: '_trigger',
        value: function _trigger(eventType) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var data = [this].concat(args);

          // event
          this.$element.trigger(pluginName + '::' + eventType, data);

          // callback
          eventType = eventType.replace(/\b\w+\b/g,

            function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            }
          );
          var onFunction = 'on' + eventType;

          if (typeof this.options[onFunction] === 'function') {
            this.options[onFunction](args);
          }
        }
      }, {
        key: 'getPercentage',
        value: function getPercentage(n) {
          return 100 * (n - this.min) / (this.max - this.min);
        }
      }, {
        key: 'go',
        value: function go(goal) {
          var self = this;
          this._clear();

          if (isPercentage(goal)) {
            goal = parseInt(goal.replace('%', ''), 10);
            goal = Math.round(this.min + goal / 100 * (this.max - this.min));
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

          var start = self.now;
          var startTime = getTime();
          var endTime = startTime + Math.abs(start - goal) * 100 * self.options.speed / (self.max - self.min);

          var animation = function animation(time) {
            var next = void 0;

            if (time > endTime) {
              next = goal;
            } else {
              var distance = (time - startTime) / self.options.speed;
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
      }, {
        key: '_update',
        value: function _update(n) {
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
      }, {
        key: '_clear',
        value: function _clear() {
          if (this._frameId) {
            window.cancelAnimationFrame(this._frameId);
            this._frameId = null;
          }
        }
      }, {
        key: 'get',
        value: function get() {
          return this.now;
        }
      }, {
        key: 'start',
        value: function start() {
          this._clear();
          this._trigger('start');
          this.go(this.goal);
        }
      }, {
        key: 'reset',
        value: function reset() {
          this._clear();
          this._drawBar(this.first);
          this._update(this.first);
          this._trigger('reset');
        }
      }, {
        key: 'stop',
        value: function stop() {
          this._clear();
          this._trigger('stop');
        }
      }, {
        key: 'finish',
        value: function finish() {
          this._clear();
          this._update(this.goal);
          this._trigger('finish');
        }
      }, {
        key: 'destory',
        value: function destory() {
          this.$element.data(pluginName, null);
          this._trigger('destory');
        }
      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(options) {
          var _this = this;

          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          if (typeof options === 'string') {
            var _ret2 = function() {
              var method = options;

              if (/^\_/.test(method)) {

                return {
                  v: false
                };
              } else if (/^(get)$/.test(method)) {
                var api = _this.first().data(pluginName);

                if (api && typeof api[method] === 'function') {

                  return {
                    v: api[method].apply(api, args)
                  };
                }
              } else {

                return {
                  v: _this.each(

                    function() {
                      var api = _jQuery2.default.data(this, pluginName);

                      if (api && typeof api[method] === 'function') {
                        api[method].apply(api, args);
                      }
                    }
                  )
                };
              }
            }();

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object")

              return _ret2.v;
          }

          return this.each(

            function() {
              if (!_jQuery2.default.data(this, pluginName)) {
                _jQuery2.default.data(this, pluginName, new asPieProgress(this, options));
              }
            }
          );
        }
      }]);

      return asPieProgress;
    }();

    _jQuery2.default.extend(asPieProgress.easing = {}, {
      ease: easingBezier(0.25, 0.1, 0.25, 1.0),
      linear: easingBezier(0.00, 0.0, 1.00, 1.0),
      'ease-in': easingBezier(0.42, 0.0, 1.00, 1.0),
      'ease-out': easingBezier(0.00, 0.0, 0.58, 1.0),
      'ease-in-out': easingBezier(0.42, 0.0, 0.58, 1.0)
    });

    _jQuery2.default.fn[pluginName] = asPieProgress._jQueryInterface;
    _jQuery2.default.fn[pluginName].constructor = asPieProgress;
    _jQuery2.default.fn[pluginName].noConflict = function() {
      'use strict';

      _jQuery2.default.fn[pluginName] = window.JQUERY_NO_CONFLICT;

      return asPieProgress._jQueryInterface;
    }
    ;

    exports.default = asPieProgress;
  }
);