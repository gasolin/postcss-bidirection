import postcss from 'postcss';
import test    from 'ava';
import plugin  from '../';
import fs from 'fs';


function read(name) {
    function _read(ele) {
        return fs.readFileSync(`./tests/fixtures/${ele}.css`, {
            encoding: 'utf8'
        });
    }
    const input = _read(`${name}-input`);
    const output = _read(`${name}-output`);

    return { input, output };
}


function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            t.deepEqual(result.css, output);
            t.is(result.warnings().length, 0);
        })
        .catch(function (error) {
            t.fail();
            console.error(error);
        });
}


test('text-align', t => {
    const { input, output } = read('text-align');
    return run(t, input, output, { });
});

test('float', t => {
    const { input, output } = read('float');
    return run(t, input, output, { });
});

test('clear', t => {
    const { input, output } = read('clear');
    return run(t, input, output, { });
});

test('padding-inline-(start/end)', t => {
    const { input, output } = read('padding');
    return run(t, input, output, { });
});

test('border-inline-(start/end)', t => {
    const { input, output } = read('border');
    return run(t, input, output, { });
});

test('border-inline-(start/end)-color', t => {
    const { input, output } = read('border-color');
    return run(t, input, output, { });
});

test('border-inline-(start/end)-style', t => {
    const { input, output } = read('border-style');
    return run(t, input, output, { });
});

test('border-inline-(start/end)-width', t => {
    const { input, output } = read('border-width');
    return run(t, input, output, { });
});

test('border-top-inline-(start/end)-radius', t => {
    const { input, output } = read('border-top');
    return run(t, input, output, { });
});

test('border-bottom-inline-(start/end)-radius', t => {
    const { input, output } = read('border-bottom');
    return run(t, input, output, { });
});

test('margin-inline-(start/end)', t => {
    const { input, output } = read('margin');
    return run(t, input, output, { });
});

test('offset-inline-(start/end)', t => {
    const { input, output } = read('offset-inline');
    return run(t, input, output, { });
});

test('do not do anything on unaffected rules', t => {
    var input = `.foo {
  margin-top: 1px
}
    `;
    var output = `.foo {
  margin-top: 1px
}
    `;
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
