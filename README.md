# PostCSS Bidirection [![Build Status][ci-img]][ci]

[PostCSS] plugin that polyfill Mozilla's Bi-directional CSS proposal to suppot direction-sensitive rules, a.k.a Left-To-Right (LTR) and Right-To-Left (RTL), in single syntax.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/gasolin/postcss-bidirection.svg
[ci]:      https://travis-ci.org/gasolin/postcss-bidirection

## Install

```
npm install --save-dev postcss-bidirection
```

## Examples

PostCSS Bidirection support syntax based on https://wiki.mozilla.org/Gaia/CSS_Guidelines

```css
.foo {
  text-align: start;
}
```

```css
.foo {
  text-align: left;
}

html[dir="rtl"] .foo {
  text-align: right;
}
```

|     left/right     |     begin/end        |
|--------------------|----------------------|
|   text alignment                          |
| text-align: left   | text-align: start    |
| text-align: right  | text-align: end      |
|         padding, margin, border           |
| padding-left       | padding-inline-start |
| padding-right      | padding-inline-end   |
| border-left        | border-inline-start  |
| border-right       | border-inline-end    |
| margin-left        | margin-inline-start  |
| margin-right       | margin-inline-end    |
|            absolute positioning           |
| left               | offset-inline-start  |
| right              | offset-inline-end    |

## Usage

```js
postcss([ require('postcss-bidi') ])
```

See [PostCSS] docs for examples for your environment.
