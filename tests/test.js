import postcss from 'postcss';
import test    from 'ava';
import plugin  from '../';
import fs from 'fs';


function read(name) {
    function _read(ele) {
        return fs.readFileSync(`./fixtures/${ele}.css`, {
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
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        })
        .catch(function (error) {
            t.fail();
            console.error(error);
        });
}


test('text-align end', t => {
    var input = `.foo {
  text-align: end;
}
    `;
    var output = `.foo {
  text-align: right;
}

html[dir="rtl"] .foo {
  text-align: left;
}
    `;
    return run(t, input, output, { });
});

test('float start', t => {
    var input = `.foo {
  float: start;
}
    `;
    var output = `.foo {
  float: left;
}

html[dir="rtl"] .foo {
  float: right;
}
    `;
    return run(t, input, output, { });
});

test('float end', t => {
    var input = `.foo {
  float: end;
}
    `;
    var output = `.foo {
  float: right;
}

html[dir="rtl"] .foo {
  float: left;
}
    `;
    return run(t, input, output, { });
});

test('clear start', t => {
    var input = `.foo {
  clear: start;
}
    `;
    var output = `.foo {
  clear: left;
}

html[dir="rtl"] .foo {
  clear: right;
}
    `;
    return run(t, input, output, { });
});

test('clear end', t => {
    var input = `.foo {
  clear: end;
}
    `;
    var output = `.foo {
  clear: right;
}

html[dir="rtl"] .foo {
  clear: left;
}
    `;
    return run(t, input, output, { });
});

test('padding-inline-start', t => {
    var input = `.foo {
  padding-inline-start: 1px;
}
    `;
    var output = `.foo {
  padding-left: 1px;
}

html[dir="rtl"] .foo {
  padding-right: 1px;
}
    `;
    return run(t, input, output, { });
});

test('padding-inline-end', t => {
    var input = `.foo {
  padding-inline-end: 1px;
}
    `;
    var output = `.foo {
  padding-right: 1px;
}

html[dir="rtl"] .foo {
  padding-left: 1px;
}
    `;
    return run(t, input, output, { });
});

test('border-inline-start', t => {
    var input = `.foo {
  border-inline-start: 1px;
}
    `;
    var output = `.foo {
  border-left: 1px;
}

html[dir="rtl"] .foo {
  border-right: 1px;
}
    `;
    return run(t, input, output, { });
});

test('border-inline-end', t => {
    var input = `.foo {
  border-inline-end: 1px;
}
    `;
    var output = `.foo {
  border-right: 1px;
}

html[dir="rtl"] .foo {
  border-left: 1px;
}
    `;
    return run(t, input, output, { });
});

test('margin-inline-start', t => {
    var input = `.foo {
  margin-inline-start: 1px;
}
    `;
    var output = `.foo {
  margin-left: 1px;
}

html[dir="rtl"] .foo {
  margin-right: 1px;
}
    `;
    return run(t, input, output, { });
});

test('margin-inline-end', t => {
    var input = `.foo {
  margin-inline-end: 1px;
}
    `;
    var output = `.foo {
  margin-right: 1px;
}

html[dir="rtl"] .foo {
  margin-left: 1px;
}
    `;
    return run(t, input, output, { });
});

test('offset-inline-start', t => {
    var input = `.foo {
  offset-inline-start: 1px;
}
    `;
    var output = `.foo {
  left: 1px;
}

html[dir="rtl"] .foo {
  right: 1px;
}
    `;
    return run(t, input, output, { });
});

test('offset-inline-end', t => {
    var input = `.foo {
  offset-inline-end: 1px;
}
    `;
    var output = `.foo {
  right: 1px;
}

html[dir="rtl"] .foo {
  left: 1px;
}
    `;
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

test('should only render affected styles into rtl rules', t => {
    const { input, output } = read('t1');
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

test('text-align start', t => {
    const { input, output } = read('text-align');
    return run(t, input, output, { });
});

test('should render rtl before each multi-selector rule', t => {
    const { input, output } = read('multi-selectors');
    return run(t, input, output, { });
});
