const easingBezier = (mX1, mY1, mX2, mY2) => {
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
    let aGuessT = aX;
    for (let i = 0; i < 4; ++i) {
      const currentSlope = GetSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return aGuessT;
      }
      const currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return {
      css: 'linear',
      fn(aX) {
        return aX;
      }
    };
  }
  return {
    css: `cubic-bezier(${mX1},${mY1},${mX2},${mY2})`,
    fn(aX) {
      return CalcBezier(GetTForX(aX), mY1, mY2);
    }
  };
};

export default easingBezier;