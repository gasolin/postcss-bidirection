2.2 2017/2/15

* refactor
* add npm badge
* support rules with non-bidi declarations

2.1 2017/2/8

* treat ltr as default and only render affected styles into rtl rules

2.0.3 2016/12/10

* fix dir=rtl rules when there's normal rules and bi-direction rules coexist.

2.0.2 2016/12/9

* rewrite to fix `node.each` API missing in recent postcss version, make it work again.
* add configuration and samples for `postcss-debug`
* pump node support version to 6 because of using some es6 functions
* fix lint
* not do anything on unaffected rules

1.2 2015/11/29

* generate both LTR and RTL prefix for affected syntaxes.

1.1 2015/11/23

* support float and clear property

1.0 2015/11/19

* init relase version
