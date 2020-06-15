import postcss from 'postcss';
import test from 'ava';
import plugin from '../';
import fs from 'fs';

function read(name) {
  function readTestFile(ele) {
    return fs.readFileSync(`./tests/fixtures/${ele}.css`, {
      encoding: 'utf8'
    }).replace(/\r\n/g, '\n');
  }
  const input = readTestFile(`${name}-input`);
  const output = readTestFile(`${name}-output`);

  return { input, output };
}

function run(t, input, output, opts = { }) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
    .then(result => {
      t.deepEqual(result.css, output);
      t.is(result.warnings().length, 0);
    })
    .catch(function (error) {
      t.fail();
      console.error(error);
    });
}

// file name: title
const TEST_TARGETS = {
  'text-align': 'text-align',
  float: 'float',
  clear: 'clear',
  padding: 'padding-inline-(start/end)',
  border: 'border-inline-(start/end)',
  'border-color': 'border-inline-(start/end)-color',
  'border-style': 'border-inline-(start/end)-style',
  'border-width': 'border-inline-(start/end)-width',
  'border-top': 'border-top-inline-(start/end)-radius',
  'border-bottom': 'border-bottom-inline-(start/end)-radius',
  margin: 'margin-inline-(start/end)',
  'offset-inline': 'offset-inline-(start/end)',
  'inset-inline': 'inset-inline-(start/end)'
};

Object.keys(TEST_TARGETS).forEach((item) => {
  test(TEST_TARGETS[item], t => {
    const { input, output } = read(item);
    return run(t, input, output, { });
  });
});

test('do not do anything on unaffected rules', t => {
  var input = `.foo {
    margin-top: 1px
  }`;
  var output = `.foo {
    margin-top: 1px
  }`;
  return run(t, input, output, { });
});

test('codemirror', t => {
  const { input, output } = read('codemirror');
  return run(t, input, output, { });
});

test('normal rules with bidi rules should display correctly', t => {
  const { input, output } = read('normal');
  return run(t, input, output, { });
});

test('should only render affected styles into rtl rules', t => {
  const { input, output } = read('normal2');
  return run(t, input, output, { });
});

test('should render rtl before each multi-selector rule', t => {
  const { input, output } = read('multi-selectors');
  return run(t, input, output, { });
});

test('nested rules', t => {
  const { input, output } = read('nested');
  return run(t, input, output, { });
});

test('custom selector', t => {
  const { input, output } = read('custom-selector');
  return run(t, input, output, {
    buildSelector: function (selector, direction) {
      if (direction === 'ltr') {
        return '.bar.direction-ltr ' + selector;
      }
      return '[dir="' + direction + '"] ' + selector;
    }
  });
});
