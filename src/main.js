import $ from 'jquery';
import asPieProgress from './asPieProgress';
import info from './info';

const NAMESPACE = 'asPieProgress';
const OtherAsPieProgress = $.fn.asPieProgress;

const jQueryAsPieProgress = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new asPieProgress(this, options));
    }
  });
};

$.fn.asPieProgress = jQueryAsPieProgress;

$.asPieProgress = $.extend({
  setDefaults: asPieProgress.setDefaults,
  registerEasing: asPieProgress.registerEasing,
  getEasing: asPieProgress.getEasing,
  noConflict: function() {
    $.fn.asPieProgress = OtherAsPieProgress;
    return jQueryAsPieProgress;
  }
}, info);
