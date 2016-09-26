import $ from 'jquery';
import asPieProgress from './asPieProgress';
import info from './info';

const NAME = 'asPieProgress';
const OtherAsPieProgress = $.fn.asPieProgress;

$.fn.asPieProgress = function jQueryAsPieProgress(options, ...args) {
  if (typeof options === 'string') {
    let method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      let instance = this.first().data(NAME);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        let instance = $.data(this, NAME);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAME)) {
      $(this).data(NAME, new asPieProgress(this, options));
    }
  });
};

$.asPieProgress = $.extend({
  setDefaults: asPieProgress.setDefaults,
  registerEasing: asPieProgress.registerEasing,
  getEasing: asPieProgress.getEasing,
  noConflict: function() {
    $.fn.asPieProgress = OtherAsPieProgress;
    return this;
  }
}, info);
