var postcss = require('postcss');

module.exports = postcss.plugin('postcss-bidirection', function (opts) {
    opts = opts || {};

    function processProps(decl, reverseFlag) {
        var isDirty = false;
        var start = !reverseFlag ? 'left' : 'right';
        var end = !reverseFlag ? 'right' : 'left';
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
        return [decl, isDirty];
    }

    // Work with options here

    return function (root) {
        let tree = [];
        let idx = 0;
        let currentIdx;
        let rtlRule;
        let rtlItem;

        // Rebuild tree for reuse
        root.walk(function (item) {
            if (item.type === 'rule') {
                rtlRule = item.clone();
                tree[idx] = {
                    rule:     item,
                    nodes:    [],
                    rtlRule:  rtlRule,
                    rtlNodes: []
                };
                currentIdx = idx;
                idx += 1;
            } else if (item.type === 'decl') {
                tree[currentIdx].nodes.push(item);
                rtlItem = item.clone();
                rtlItem.raws.before = item.raws.before;
                rtlItem.raws.after = item.raws.after;
                rtlItem.raws.between = item.raws.between;
                tree[currentIdx].rtlNodes.push(rtlItem);
            }
        });

        // Transform CSS AST here
        // Unefficient but works

        let resultList;
        tree.forEach(item => {
            item.nodes.forEach(decl => {
                resultList = processProps(decl);
                if (resultList[1]) {
                    decl = resultList[0];
                }
            });
        });

        tree.forEach((item) => {
            item.rule.raws.before += 'html[dir="ltr"] ';
            item.rtlRule.raws.before = '\n\nhtml[dir="rtl"] ';
            for ( let i in item.rtlRule ) {
                if ( !item.rtlRule.hasOwnProperty(i) ) continue;
                let value = item.rtlRule[i];
                if ( value instanceof Array ) {
                    item.rtlRule[i] = item.rtlNodes.map(decl => {
                        resultList = processProps(decl, true);
                        if (resultList[1]) {
                            return resultList[0];
                        } else {
                            return decl;
                        }
                    });
                }
            }
            root.insertAfter(item.rule, item.rtlRule);
        });
    };
});
