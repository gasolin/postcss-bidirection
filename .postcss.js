var bidi = require('./index');

module.exports = function (postcss) {
  return postcss([ bidi ]);
}

