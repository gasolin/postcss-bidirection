2.7.2 2020/06/15

* Update ava & postcss, thanks @Gregoor
* (fix windows test) Replace CRLF with LF when loading fixtures, thanks @Gregoor
* simplify test definition

2.7 2018/08/24

* support renamed inset-inline-(start/end) properties

2.6 2017/11/23

* support custom output via pass the `buildSelector` option, thanks @rolfen

2.5 2017/11/13

* keep the default styles and generate both LTR/RTL styles
* support media-query, thanks @rolfen
* Support more border syntaxes, thanks Justin Daining

2.4 2017/2/17

* fix a bug when isDirty is flagged on while no changes is needed , thanks @nirhart

2.3 2017/2/15

* refactor
* add npm badge
* support rules with non-bidi declarations
* support multiple selectors in a rule

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
