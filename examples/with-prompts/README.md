## why `prompts`?

```
┌───────────┬─────────────┬───────┐
│ name      │ children    │ size  │
├───────────┼─────────────┼───────┤
│ inquirer  │ 35          │ 6.84M │
├───────────┼─────────────┼───────┤
│ prompt    │ 34          │ 1.28M │
├───────────┼─────────────┼───────┤
│ prompts   │ 2           │ 0.12M │
├───────────┼─────────────┼───────┤
│ 3 modules │ 62 children │ 8.01M │
└───────────┴─────────────┴───────┘
```

| Library                                            | Package Phobia                                                                                                       | Bundle Size                                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [inquirer](https://www.npmjs.com/package/inquirer) | [![install size](https://badgen.net/packagephobia/install/inquirer)](https://packagephobia.now.sh/result?p=inquirer) | [![minzipped size](https://badgen.net/bundlephobia/min/inquirer)](https://bundlephobia.com/result?p=inquirer) |
| [prompt](https://www.npmjs.com/package/prompt)     | [![install size](https://badgen.net/packagephobia/install/prompt)](https://packagephobia.now.sh/result?p=prompt)     | [![minzipped size](https://badgen.net/bundlephobia/min/prompt)](https://bundlephobia.com/result?p=prompt)     |
| [prompts](https://www.npmjs.com/package/prompts)   | [![install size](https://badgen.net/packagephobia/install/prompts)](https://packagephobia.now.sh/result?p=prompts)   | [![minzipped size](https://badgen.net/bundlephobia/min/prompts)](https://bundlephobia.com/result?p=prompts)   |

## Development

```
rm -rf dist && node ../../gogen . dist
```
