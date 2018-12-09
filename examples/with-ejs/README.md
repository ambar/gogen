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

| Library                                                          | Package Phobia                                                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [ejs](https://ejs.co/)                                           | [![install size](https://packagephobia.now.sh/badge?p=ejs)](https://packagephobia.now.sh/result?p=ejs)                         |
| [lodash.template](https://www.npmjs.com/package/lodash.template) | [![install size](https://packagephobia.now.sh/badge?p=lodash.template)](https://packagephobia.now.sh/result?p=lodash.template) |

## Development

```
rm -rf dist && node ../../gogen . dist
```
