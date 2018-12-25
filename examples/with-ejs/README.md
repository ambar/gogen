## why `ejs` or `lodash`?

```
➜  cost-of-modules --no-install
┌─────────────────┬──────────────┬────────┐
│ name            │ children     │ size   │
├─────────────────┼──────────────┼────────┤
│ nunjucks        │ 318          │ 14.89M │
├─────────────────┼──────────────┼────────┤
│ handlebars      │ 9            │ 6.58M  │
├─────────────────┼──────────────┼────────┤
│ dust            │ 0            │ 0.48M  │
├─────────────────┼──────────────┼────────┤
│ ejs             │ 0            │ 0.11M  │
├─────────────────┼──────────────┼────────┤
│ mustache        │ 0            │ 0.07M  │
├─────────────────┼──────────────┼────────┤
│ lodash.template │ 3            │ 0.05M  │
├─────────────────┼──────────────┼────────┤
│ 6 modules       │ 169 children │ 15.07M │
└─────────────────┴──────────────┴────────┘
```

| Library                                                          | Package Phobia                                                                                                                     | Bundle Size                                                                                                                 |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [mustache](https://www.npmjs.com/package/mustache)               | [![install size](https://badgen.net/packagephobia/install/mustache)](https://packagephobia.now.sh/result?p=mustache)               | [![minzipped size](https://badgen.net/bundlephobia/min/mustache)](https://bundlephobia.com/result?p=mustache)               |
| [lodash.template](https://www.npmjs.com/package/lodash.template) | [![install size](https://badgen.net/packagephobia/install/lodash.template)](https://packagephobia.now.sh/result?p=lodash.template) | [![minzipped size](https://badgen.net/bundlephobia/min/lodash.template)](https://bundlephobia.com/result?p=lodash.template) |
| [ejs](https://ejs.co/)                                           | [![install size](https://badgen.net/packagephobia/install/ejs)](https://packagephobia.now.sh/result?p=ejs)                         | [![minzipped size](https://badgen.net/bundlephobia/min/ejs)](https://bundlephobia.com/result?p=ejs)                         |
| [dustjs](https://github.com/linkedin/dustjs)                     | [![install size](https://badgen.net/packagephobia/install/dustjs-linkedin)](https://packagephobia.now.sh/result?p=dustjs-linkedin) | [![minzipped size](https://badgen.net/bundlephobia/min/dustjs-linkedin)](https://bundlephobia.com/result?p=dustjs-linkedin) |
| [handlebars](https://github.com/wycats/handlebars.js)            | [![install size](https://badgen.net/packagephobia/install/handlebars)](https://packagephobia.now.sh/result?p=handlebars)           | [![minzipped size](https://badgen.net/bundlephobia/min/handlebars)](https://bundlephobia.com/result?p=handlebars)           |
| [nunjucks](https://github.com/mozilla/nunjucks)                  | [![install size](https://badgen.net/packagephobia/install/nunjucks)](https://packagephobia.now.sh/result?p=nunjucks)               | [![minzipped size](https://badgen.net/bundlephobia/min/nunjucks)](https://bundlephobia.com/result?p=nunjucks)               |

## Development

```
rm -rf dist && node ../../gogen . dist
```
