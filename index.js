var postcss = require('postcss');
var eachDecl = require('postcss-each-decl');

module.exports = postcss.plugin('postcss-bidirection', function (opts) {
    opts = opts || {};

    function processBidi(decl, reverseFlag) {
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

    return function (css) {

        // Transform CSS AST here
        css.walk(function (node) {
            var resultList;
            var isBiDi = false;
            var rtlNode = node.clone();
            eachDecl(node, function (decl) {
                resultList = processBidi(decl);
                if (resultList[1]) {
                // console.log(decl.prop + ' : ' + decl.value);
                    isBiDi = true;
                    decl = resultList[0];
                }
            });

            if (isBiDi) { // is BiDi
                rtlNode.raws.before = '\n\nhtml[dir="rtl"] ';
                var rtlResult;
                eachDecl(rtlNode, function transformDecl(decl) {
                    rtlResult = processBidi(decl, true);
                    if (rtlResult[1]) {
                        decl = rtlResult[0];
                    }
                });
                css.insertAfter(node, rtlNode);
            }
            // console.log(''+css.toString());
        });
    };
});
