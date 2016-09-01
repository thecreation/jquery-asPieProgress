import $ from 'jQuery';

const SvgElement = (tag, attrs) => {
  'use strict';
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);

  $.each(attrs, (name, value) => {
    elem.setAttribute(name, value);
  });

  return elem;
};

export default SvgElement;