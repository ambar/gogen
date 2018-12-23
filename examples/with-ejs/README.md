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
| [ejs](https://ejs.co/)                                           | [![install size](https://badgen.net/packagephobia/install/ejs)](https://packagephobia.now.sh/result?p=ejs)                         | [![minzipped size](https://badgen.net/bundlephobia/min/ejs)](https://bundlephobia.com/result?p=ejs)                         |
| [lodash.template](https://www.npmjs.com/package/lodash.template) | [![install size](https://badgen.net/packagephobia/install/lodash.template)](https://packagephobia.now.sh/result?p=lodash.template) | [![minzipped size](https://badgen.net/bundlephobia/min/lodash.template)](https://bundlephobia.com/result?p=lodash.template) |
| [mustache](https://www.npmjs.com/package/mustache)               | [![install size](https://badgen.net/packagephobia/install/mustache)](https://packagephobia.now.sh/result?p=mustache)               | [![minzipped size](https://badgen.net/bundlephobia/min/mustache)](https://bundlephobia.com/result?p=mustache)               |

## Development

```
rm -rf dist && node ../../gogen . dist
```
