## Comparison

| name                                            | bundle size | build time                 |
| ----------------------------------------------- | ----------- | -------------------------- |
| [@zeit/ncc](https://github.com/zeit/ncc) (v0.7) | 219K        | 2.53s                      |
| webpack                                         | 192K        | 3287ms, 515ms (with cache) |
| rollup                                          |             |

ncc versions:

- `@zeit/ncc@0.5`: 203K, 4.88s
- `@zeit/ncc@0.7`: 219K, 2.53s
- `@zeit/ncc@0.8`: 219K, 1.75s (webpack#next)

readable-stream:

- bundle `readable-stream`: 192K
- eliminate `readable-stream`: 165K

## webpack CLI options

https://webpack.js.org/api/cli/#stats-options

```
--hide-modules
--verbose
```

## Tricks

**How to ignore dynamic require?**

related:

- https://github.com/webpack/webpack/issues/198
- https://webpack.js.org/guides/dependency-management/#require-with-expression
- https://webpack.js.org/plugins/context-replacement-plugin/
- https://webpack.js.org/plugins/ignore-plugin/
- https://webpack.js.org/configuration/externals/

hacks:

- eval: `eval('require')(module)`
- webpack 4 hack: https://github.com/zeit/ncc/blob/c289b28ff8/src/index.js#L145-L173
- wepback 5 hack: https://github.com/zeit/ncc/blob/c2fb87e0c0/src/index.js#L147-L182
