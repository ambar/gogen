## Comparison

| name                                         | bundle size/gzip | build time |
| -------------------------------------------- | ---------------- | ---------- |
| [@vercel/ncc](https://github.com/vercel/ncc) | 188K/49K         | 4.5s       |
| webpack                                      | 162K/45K         | 4.3s       |
| rollup + terser                              | 174K/46K         | 5.5s       |
| esbuild                                      | 168K/49K         | 0.1s       |

esbuild:

- `--bundle` 时无法识别 `paths`: https://github.com/evanw/esbuild/issues/394
- alias plugin 无法处理子路径引用

`resolutions` 对 ncc/esbuild 都有效。

## webpack CLI options

https://webpack.js.org/api/cli/#stats-options

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
