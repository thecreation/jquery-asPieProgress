/*
 * jquery-asPieProgress
 * https://github.com/amazingSurge/jquery-asPieProgress
 *
 * Copyright (c) 2014 amazingSurge
 * Licensed under the GPL license.
 */
(function($, document, window, undefined) {
    "use strict";

    var svgElement = function(tag, attrs) {
        var elem = document.createElementNS("http://www.w3.org/2000/svg", tag);

        $.each(attrs, function(name, value) {
            elem.setAttribute(name, value);
        });

        return elem;
    }
    var svgSupported = "createElementNS" in document && svgElement("svg", {}).createSVGRect;

    function isPercentage(n) {
        return typeof n === 'string' && n.indexOf('%') != -1;
    }

    var pluginName = 'asPieProgress';

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());
        this.namespace = this.options.namespace;

        this.classes = {
            label: this.namespace + '__label',
            meter: this.namespace + '__meter'
        };
        this.$element.addClass(this.namespace);

        this.min = parseInt(this.$element.attr('aria-valuemin'), 10) || this.options.min;
        this.max = parseInt(this.$element.attr('aria-valuemax'), 10) || this.options.max;
        this.first = parseInt(this.$element.attr('aria-valuenow'), 10) || this.min;

        this.now = this.first;
        this.goal = this.options.goal;
        this._interval = null;

        this.initialized = false;
        this._trigger('init');
        this.init();
    };

    Plugin.defaults = {
        namespace: 'asPieProgress',
        min: 0,
        max: 100,
        goal: 100,
        step: 1,
        speed: 50, // refresh speed
        delay: 300,
        barColor: '#ef1e25',
        trackColor: '#f2f2f2',
        strokeWidth: '4',
        label: function(n) {
            var percentage = this.getPercentage(n);
            return percentage + '%';
        }
    };

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            this.$meter = this.$element.find('.' + this.classes.meter);
            this.$label = this.$element.find('.' + this.classes.label);
            this.width = this.$meter.width();
            this.height = this.$meter.height();
            this.prepare();
            this.reset();
            this.initialized = true;
            this._trigger('ready');
        },
        prepare: function() {
            this.svg = new svgElement("svg", {
                "width": this.width,
                "height": this.height
            });

            this.$meter.append(this.svg);
            this.build();
        },
        build: function(){
            this.buildTrack();
            this.buildBar();
        },
        buildTrack: function(){
            var width = this.width,
                height = this.height,
                cx = width / 2,
                cy = height / 2;

            var strokeWidth = this.options.strokeWidth;

            var ellipse = svgElement("ellipse", {
                rx: cx - strokeWidth/2,
                ry: cy - strokeWidth/2,
                cx: cx,
                cy: cy,
                stroke: this.options.trackColor,
                fill: 'none',
                'stroke-width': strokeWidth
            });
            
            this.svg.appendChild(ellipse);
        },
        buildBar: function() {
            var width = this.width,
                height = this.height,
                cx = width / 2,
                cy = height / 2,
                start_angle = 0;

            var strokeWidth = this.options.strokeWidth;

            var r = Math.min(cx, cy) - strokeWidth/2;
            var percentage = this.getPercentage(this.goal);
            var end_angle = start_angle + percentage * Math.PI * 2/100;

            var x1 = cx + r * Math.sin(start_angle),
                y1 = cy - r * Math.cos(start_angle),
                x2 = cx + r * Math.sin(end_angle),
                y2 = cy - r * Math.cos(end_angle);

            // This is a flag for angles larger than than a half circle
            // It is required by the SVG arc drawing component
            var big = 0;
            if (end_angle - start_angle > Math.PI) big = 1;

            // This string holds the path details
            var d = "M" + x1 + "," + y1 +     // Start at (x1,y1)
                " A" + r + "," + r +       // Draw an arc of radius r
                " 0 " + big + " 1 " +      // Arc details...
                x2 + "," + y2;

            var path = svgElement("path", {
                d: d,
                fill: 'none',
                'stroke-width': strokeWidth,
                stroke: this.options.barColor
            });
            this.svg.appendChild(path);
        },
        _trigger: function(eventType) {
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined,
                data;
            if (method_arguments) {
                data = method_arguments;
                data.push(this);
            } else {
                data = this;
            }
            // event
            this.$element.trigger(pluginName + '::' + eventType, data);
            this.$element.trigger(eventType + '.' + pluginName, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        getPercentage: function(n) {
            return Math.round(100 * (n - this.min) / (this.max - this.min));
        },
        go: function(goal) {
            var self = this;
            this._clear();

            if (isPercentage(goal)) {
                goal = parseInt(goal.replace('%', ''), 10);
                goal = Math.round((goal / 100) * (this.max - this.min));
            }

            if (typeof goal === 'undefined') {
                goal = this.goal;
            }

            if (goal > this.max) {
                goal = this.max;
            } else if (goal < this.min) {
                goal = this.min;
            }


            setTimeout(function() {
                self._interval = setInterval(function() {
                    var distance = goal - self.now,
                        next;
                    if (distance > 0) {
                        if (distance < self.options.step) {
                            next = goal;
                        } else {
                            next = self.now + self.options.step;
                        }
                    } else if (distance < 0) {
                        if (-distance < self.options.step) {
                            next = goal;
                        } else {
                            next = self.now - self.options.step;
                        }
                    } else {
                        next = goal;
                    }

                    self._update(next);

                    if (self.now === goal) {
                        clearInterval(self._interval);
                        self._interval = null;

                        if (self.now === self.goal) {
                            self._trigger('done');
                        }
                    }
                }, self.options.speed);
            }, self.options.delay);
        },
        _update: function(n) {
            this.now = n;

            var percenage = this.getPercentage(this.now);
            // this.$meter.css('width', percenage + '%');
            this.$element.attr('aria-valuenow', this.now);
            // if (typeof this.options.label === 'function') {
            //     this.$label.html(this.options.label.call(this, [this.now]));
            // }

            this._trigger('update', n);
        },
        get: function() {
            return this.now;
        },
        start: function() {
            this._clear();
            this._trigger('start');
            this.go(this.goal);
        },
        _clear: function() {
            if (this._interval) {
                clearInterval(this._interval);
                this._interval = null;
            }
        },
        reset: function() {
            this._clear();
            this._update(this.first);
            this._trigger('reset');
        },
        stop: function() {
            this._clear();
            this._trigger('stop');
        },
        done: function() {
            this._clear();
            this._update(this.goal);
            this._trigger('done');
        },
        destory: function() {
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)$/.test(method))) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, document, window);
