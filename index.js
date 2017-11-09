var postcss = require('postcss');

const DEBUG = false;
const SUPPORT_PROPS = ['float', 'clear', 'text-align', 'padding-inline-start', 'padding-inline-end',
    'border-inline-start', 'border-inline-end', 'border-inline-start-color', 'border-inline-end-color',
    'border-inline-start-style', 'border-inline-end-style',
    'border-inline-start-width', 'border-inline-end-width',
    'border-inline-start-top', 'border-inline-end-top',
    'border-top-inline-start-radius', 'border-top-inline-end-radius',
    'border-bottom-inline-start-radius', 'border-bottom-inline-end-radius',
    'margin-inline-start', 'margin-inline-end',
    'offset-inline-start', 'offset-inline-end'
];

function log(...args) {
    (args || []).forEach(arg => {
        if (DEBUG) console.log(JSON.stringify(arg, null, 2));
    });
}

function cloneItem(item) {
    let newRule = item.clone();
    newRule.raws.before = item.raws.before;
    newRule.raws.after = item.raws.after;
    newRule.raws.between = item.raws.between;
    return newRule;
}

// process LTR by default, process RTL when reverseFlag is set
function processProps(decl, reverseFlag) {
    let isDirty = true;
    let start = !reverseFlag ? 'left' : 'right';
    let end = !reverseFlag ? 'right' : 'left';
    switch (decl.prop.toLowerCase()) {
    case 'float':
    case 'clear':
    case 'text-align':
        if(['start', 'end'].indexOf(decl.value.toLowerCase()) !== -1) {
            if (decl.value.toLowerCase() === 'start') {
                decl.value = start;
            } else {
                decl.value = end;
            }
        }
        break;
    case 'padding-inline-start':
        decl.prop = 'padding-' + start;
        break;
    case 'padding-inline-end':
        decl.prop = 'padding-' + end;
        break;
    case 'border-inline-start':
        decl.prop = 'border-' + start;
        break;
    case 'border-inline-end':
        decl.prop = 'border-' + end;
        break;
    case 'border-inline-start-color':
        decl.prop = 'border-' + start + '-color';
        break;
    case 'border-inline-end-color':
        decl.prop = 'border-' + end + '-color';
        break;
    case 'border-inline-start-width':
        decl.prop = 'border-' + start + '-width';
        break;
    case 'border-inline-end-width':
        decl.prop = 'border-' + end + '-width';
        break;
    case 'border-inline-start-style':
        decl.prop = 'border-' + start + '-style';
        break;
    case 'border-inline-end-style':
        decl.prop = 'border-' + end + '-style';
        break;
    case 'border-top-inline-start-radius':
        decl.prop = 'border-top-' + start + '-radius';
        break;
    case 'border-top-inline-end-radius':
        decl.prop = 'border-top-' + end + '-radius';
        break;
    case 'border-bottom-inline-start-radius':
        decl.prop = 'border-bottom-' + start + '-radius';
        break;
    case 'border-bottom-inline-end-radius':
        decl.prop = 'border-bottom-' + end + '-radius';
        break;
    case 'margin-inline-start':
        decl.prop = 'margin-' + start;
        break;
    case 'margin-inline-end':
        decl.prop = 'margin-' + end;
        break;
    case 'offset-inline-start':
        decl.prop = start;
        break;
    case 'offset-inline-end':
        decl.prop = end;
        break;
    default:
        isDirty = false;
        break;
    }

    if (isDirty) log(decl.prop + ' : ' + decl.value);

    const newDecl = decl;
    return { newDecl, isDirty };
}

function isSupportedProps(decl) {
    if (SUPPORT_PROPS.indexOf(decl.prop.toLowerCase()) > -1) {
        return true;
    }
}

function updateRtlRule(item) {
    return item.rtlNodes.filter(decl => {
        const { newDecl, isDirty } = processProps(decl, true);
        if (isDirty) {
            return newDecl;
        }
    });
}

function updateLtrRule(item) {
    return item.ltrNodes.filter(decl => {
        const { newDecl, isDirty } = processProps(decl);
        if (isDirty) {
            return newDecl;
        }
    });
}

function updateRtlItem(item, reverseFlag) {
    let rule = reverseFlag ? item.ltrRule : item.rtlRule;
    for ( let i in rule ) {
        if ( !rule.hasOwnProperty(i) ) {
            continue;
        }

        if ( rule[i] instanceof Array ) {
            rule[i] = reverseFlag ? updateLtrRule(item) : updateRtlRule(item);
        }
    }

    return item;
}

function updateLtrItem(item) {
    return updateRtlItem(item, true);
}

function postcssBiDirection(opts) {
    opts = opts || {};
    const PATTERN = /\s*[,\n]+\s*/;

    // Work with options here

    return function (root) {
        let tree = [];
        let idx = 0;
        let currentIdx;

        // Rebuild tree for reuse
        root.walk(function (item) {
            if (item.type === 'rule') {
                tree[idx] = {
                    rule:     item,
                    nodes:    [],
                    ltrRule:  cloneItem(item),
                    ltrNodes: [],
                    rtlRule:  cloneItem(item),
                    rtlNodes: [],
                    isBiDi:   false
                };
                currentIdx = idx;
                idx += 1;
            } else if (item.type === 'decl') {
                tree[currentIdx].nodes.push(item);
                tree[currentIdx].ltrNodes.push(cloneItem(item));
                tree[currentIdx].rtlNodes.push(cloneItem(item));
            }
        });

        // Transform CSS AST here
        // Unefficient but works

        // default
        tree.forEach(item => {
            item.nodes = item.nodes.filter(decl => {
              if (isSupportedProps(decl)) {
                  item.isBiDi = true;
              }
              return decl;
            });
        });

        tree.forEach((item) => {
            if (item.isBiDi) {
                // LTR
                // modified from postcss internal clone method
                updateLtrItem(item, true);

                root.insertAfter(item.rule, item.ltrRule);

                // overwrite rtlRule.raws.before since its been lazy evaluated
                item.ltrRule.raws.before = '\n\nhtml[dir="ltr"] ';

                // multiple selectors in a rule
                let selectors = item.ltrRule.selector.split(PATTERN);
                if (selectors.length) {
                    item.ltrRule.selector =
                      selectors.join(',\nhtml[dir="ltr"] ');
                }

                // RTL
                updateRtlItem(item);

                root.insertAfter(item.ltrRule, item.rtlRule);

                // overwrite rtlRule.raws.before since its been lazy evaluated
                item.rtlRule.raws.before = '\n\nhtml[dir="rtl"] ';

                // multiple selectors in a rule
                let rtlSelectors = item.rtlRule.selector.split(PATTERN);
                if (rtlSelectors.length) {
                    item.rtlRule.selector =
                      rtlSelectors.join(',\nhtml[dir="rtl"] ');
                }

                log('<', item.rule.raws.before,
                    '>', item.rtlRule.raws.before);
            }
        });
    };
}

module.exports = postcss.plugin('postcss-bidirection', postcssBiDirection);
