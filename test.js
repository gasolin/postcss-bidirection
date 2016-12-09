import postcss from 'postcss';
import test    from 'ava';
import plugin  from './';


function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        }).catch(function (error) {
            console.error(error);
        });
}

/* text alignment */
test('text-align start', t => {
    var input = `.foo {
  text-align: start;
}
    `;
    var output = `html[dir="ltr"] .foo {
  text-align: left;
}

html[dir="rtl"] .foo {
  text-align: right;
}
    `;
    return run(t, input, output, { });
});

test('text-align end', t => {
    var input = `.foo {
  text-align: end;
}
    `;
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
  clear: right;
}

html[dir="rtl"] .foo {
  clear: left;
}
    `;
    return run(t, input, output, { });
});

/* padding, margin, border */
test('padding-inline-start', t => {
    var input = `.foo {
  padding-inline-start: 1px;
}
    `;
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
  margin-right: 1px;
}

html[dir="rtl"] .foo {
  margin-left: 1px;
}
    `;
    return run(t, input, output, { });
});

/* padding-block-start */

/* absolute positioning */
test('offset-inline-start', t => {
    var input = `.foo {
  offset-inline-start: 1px;
}
    `;
    var output = `html[dir="ltr"] .foo {
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
    var output = `html[dir="ltr"] .foo {
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

test('normal rules with bidi rules should display correctly', t => {
    var input = `.sources-header {
  height: 30px;
  border-bottom: 1px solid var(--theme-splitter-color);
  padding-top: 0px;
  padding-bottom: 0px;
  line-height: 30px;
}

.sources-header {
  padding-inline-start: 10px;
}
    `;
    var output = `.sources-header {
  height: 30px;
  border-bottom: 1px solid var(--theme-splitter-color);
  padding-top: 0px;
  padding-bottom: 0px;
  line-height: 30px;
}

html[dir="ltr"] .sources-header {
  padding-left: 10px;
}

html[dir="rtl"] .sources-header {
  padding-right: 10px;
}
    `;
    return run(t, input, output, { });
});
