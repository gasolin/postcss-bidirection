var postcss = require('postcss');

function log(...args) {
    (args || []).forEach(arg => {
        console.log(JSON.stringify(arg, null, 2));
    });
}

function cloneItem(item) {
    let rtlRule = item.clone();
    rtlRule.raws.before = item.raws.before;
    rtlRule.raws.after = item.raws.after;
    rtlRule.raws.between = item.raws.between;

    return rtlRule;
}


function processProps(decl, reverseFlag) {
    let isDirty = false;
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
        isDirty = true;
        break;
    case 'padding-inline-start':
        decl.prop = 'padding-' + start;
        isDirty = true;
        break;
    case 'padding-inline-end':
        decl.prop = 'padding-' + end;
        isDirty = true;
        break;
    case 'border-inline-start':
        decl.prop = 'border-' + start;
        isDirty = true;
        break;
    case 'border-inline-end':
        decl.prop = 'border-' + end;
        isDirty = true;
        break;
    case 'margin-inline-start':
        decl.prop = 'margin-' + start;
        isDirty = true;
        break;
    case 'margin-inline-end':
        decl.prop = 'margin-' + end;
        isDirty = true;
        break;
    case 'offset-inline-start':
        decl.prop = start;
        isDirty = true;
        break;
    case 'offset-inline-end':
        decl.prop = end;
        isDirty = true;
        break;
    default:
        break;
    }
        // if (isDirty) console.log(decl.prop + ' : ' + decl.value);
    const newDecl = decl;
    return { newDecl, isDirty };
}

function updateRule(item) {
    return item.rtlNodes.map(decl => {
        const { newDecl, isDirty } = processProps(decl, true);
        if (isDirty) {
            return newDecl;
        }
    });
}

function updateItem(item) {
    for ( let i in item.rtlRule ) {
        if ( !item.rtlRule.hasOwnProperty(i) ) {
            continue;
        }

        if ( item.rtlRule[i] instanceof Array ) {
            item.rtlRule[i] = updateRule(item);
        }
    }

    return item;
}


module.exports = postcss.plugin('postcss-bidirection', function (opts) {
    opts = opts || {};

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
                    rtlRule:  cloneItem(item),
                    rtlNodes: [],
                    isBiDi:   false
                };
                currentIdx = idx;
                idx += 1;
            } else if (item.type === 'decl') {
                tree[currentIdx].nodes.push(item);
                tree[currentIdx].rtlNodes.push(cloneItem(item));
            }
        });

        // Transform CSS AST here
        // Unefficient but works

        // LTR
        tree.forEach(item => {
            item.nodes.forEach(decl => {
                const { newDecl, isDirty } = processProps(decl);
                if (isDirty) {
                    decl = newDecl;
                    item.isBiDi = true;
                }
            });
        });

        // RTL
        tree.forEach((item) => {
            if (item.isBiDi) {
                // modified from postcss internal clone method
                updateItem(item);

                root.insertAfter(item.rule, item.rtlRule);
                // overwrite rtlRule.raws.before since its been lazy evaluated
                item.rtlRule.raws.before = '\n\nhtml[dir="rtl"] ';
                // console.log('<', item.rule.raws.before,
                //     '>', item.rtlRule.raws.before);
            }
        });
    };
});
