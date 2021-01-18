# postcss-theme-fallback [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url] [![github (ci)][github-ci]][github-ci]

A postcss plugin to adding fallback values for css-variables.

## ✈️ Install

```sh
npm i -DE postcss-theme-fallback
```

## ☄️ Usage

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-theme-fallback')({
      theme: {
        '--var-a': '10px',
        '--var-b': '20px',
      },
    }),
  ],
}
```

### Options

| Name                             | Description                 | Default |
|----------------------------------|-----------------------------|---------|
| `theme` *Record<string, string>* | Object with theme variables | {}      |
| `silent?` *boolean*              | Disable warnings output     | false   |

## 🌈 Example

```css
/* input.css */
.component {
  width: var(--var-a);
}

/* output.css */
.component {
  width: var(--var-a, 10px);
}
```

## License

Project is [MIT licensed](https://github.com/yarastqt/postcss-theme-fallback/blob/master/LICENSE.md).

[npm-img]: https://img.shields.io/npm/v/postcss-theme-fallback.svg
[npm-url]: https://www.npmjs.com/package/postcss-theme-fallback
[github-ci]: https://github.com/yarastqt/postcss-theme-fallback/workflows/ci/badge.svg?branch=master
[PostCSS]: https://github.com/postcss/postcss
