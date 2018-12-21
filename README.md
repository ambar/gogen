# GoGen

Use [vinyl-fs](https://github.com/gulpjs/vinyl-fs) based stream API to create generator/initializer packages.

[![build status](https://badgen.net/travis/ambar/gogen)](https://travis-ci.org/ambar/gogen)
[![npm version](https://badgen.net/npm/v/gogen)](https://www.npmjs.com/package/gogen)
[![install size](https://badgen.net/packagephobia/install/gogen)](https://packagephobia.now.sh/result?p=gogen)
[![minzipped size](https://badgen.net/bundlephobia/minzip/gogen)](https://bundlephobia.com/result?p=gogen)

## Features

- [Gulp](https://github.com/gulpjs/gulp)-compatible stream API
- Lightweight, single file bundled (<50K gzip size), no need to install globally, just run `npx`
- Automatically rename `gitignore` to `.gitignore`, due to [npm/issues/1862](https://github.com/npm/npm/issues/1862)
- Automatically set `name` field in `package.json`
- Render `*.foo.t` to `*.foo` with lodash template
- Add command line prompts with [prompts](https://github.com/terkelg/prompts#-usage)
- Add command line arguments with [minimist](https://github.com/substack/minimist)
- Provide fast, in-memory testing API

## Usage

### Run existing generator

Run from any npm package (registry/GitHub/git/folder...), same as [npm install](https://docs.npmjs.com/cli/install#synopsis) or [yarn add](https://yarnpkg.com/lang/en/docs/cli/add/):

```bash
# install generator to directory
npx gogen <generator> <directory>
# eg.
npx gogen [<@scope>/]<name> <directory> # npm registry
npx gogen <user>/<repo> <directory>  # GitHub
npx gogen <host>:<name>/<repo> <directory>  # git
npx gogen <folder> <directory> # folder
```

### Create generator

The default directory structure, used in [examples](./examples):

```bash
.
├── .gogenrc.js # optional, defaults to `lib/.gogenrc.default.js`
├── package.json
└── template
    ├── index.js
    └── package.json
```

Edit the `.gogenrc.js` file:

```js
module.exports = async ({src, dest, pipeline}, {install, gitInit}) => {
  await pipeline(src('template/**'), dest())
  await install()
  await gitInit()
}
```

Run the generator:

```bash
npx gogen <your-generator> <your-project>
```

### Create initializer

Add a bin file, eg. [examples/create-gogen/cli.js](./examples/create-gogen/cli.js).

```js
const {run} = require('gogen')
run(
  [__dirname, ...process.argv.slice(2)],
  'Usage: npm init gogen <my-generator>'
)
```

Run the initializer:

```bash
npm init <your-initializer> <your-project>
# or: yarn create <your-initializer> <your-project>
```

### Examples

- [examples/basic](./examples/basic)
- [examples/with-ejs](./examples/with-ejs)
- [examples/with-prompts](./examples/with-prompts)
- [examples/create-gogen](./examples/create-gogen)

### Configuration file

`.gogenrc.js`:

- `run(go: Object, context: Object) => void`
  - `go` vinyl-fs based stream APIs
    - `src(glob: string | string[]) => Stream` read files
    - `dest(path?: string) => Stream` write files
    - `pipeline(...streams: Stream[]) => Promise` pipe a series of streams
    - `template(data: Object, {ext: RegExp, render: Function}) => Stream` render `*.t` files with [lodash template](https://lodash.com/docs/4.17.11#template)
    - `packages(content: Object | Function) => Stream` change `package.json`
    - `modify(match: RegExp | Function, transform: file => file) => Stream` change files
      - `modify.text(match: RegExp | Function, transform: (file, text: string) => text) => Stream` change text files
      - `modify.json(match: RegExp | Function, transform: (file, json: Object) => json) => Stream` change json files
      - `modify.rename(match: RegExp | Function, transform: (file, paths: Object) => paths) => Stream` rename files
  - `context` generator context
    - `path: string` new project's path
    - `name: string` new project's name
    - `argv: Object` command line arguments
    - `install(deps: string[], {dev: boolean, silent: boolean}) => Promise` install dependencies
    - `gitInit(message: string) => Promise` init git repository
    - `prompts(Array | Object) => Promise` see [prompts](https://github.com/terkelg/prompts#-usage)

## Testing

Use the `mock` API:

- `mock(generator: string, directory: string, options: Object)`:
  - `generator` path to generator
  - `directory` path to output
  - `options`
    - `answers: Object` inject prompt values

```js
const {mock} = require('gogen')

it('generate correctly', async () => {
  const {files, readFile} = await mock('.', 'dist', {
    answers: {description: 'superb'},
  })
  expect(files).toMatchSnapshot()
  expect(readFile('package.json')).toMatch(/superb/)
})
```

## Comparison with alternatives

| Library                                 | Package Phobia                                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [gogen](https://github.com/ambar/gogen) | [![install size](https://badgen.net/packagephobia/install/gogen)](https://packagephobia.now.sh/result?p=gogen) |
| [sao](https://saojs.org/)               | [![install size](https://badgen.net/packagephobia/install/sao)](https://packagephobia.now.sh/result?p=sao)     |
| [yeoman](https://yeoman.io)             | [![install size](https://badgen.net/packagephobia/install/yo)](https://packagephobia.now.sh/result?p=yo)       |
