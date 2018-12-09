# GoGen

Use [vinyl-fs](https://github.com/gulpjs/vinyl-fs) based stream API to create generator/initializer packages.

## Features

- [Gulp](https://github.com/gulpjs/gulp)-compatible stream API
- Lightweight, single file bundled (64K gzip size), no need to install globally, just run `npx`
- Automatically rename `gitignore` to `.gitignore`, due to [npm/issues/1862](https://github.com/npm/npm/issues/1862)
- Automatically set `name` field in `package.json`
- Render `*.foo.t` to `*.foo` with lodash template
- Add command line prompts with [prompts](https://github.com/terkelg/prompts#-usage)
- Add command line arguments with [minimist](https://github.com/substack/minimist)

## Usage

### Run existing generator

Run from npm/GitHub/git/folder, same as [npm install](https://docs.npmjs.com/cli/install#synopsis):

```bash
# install generator to directory
npx gogen <generator> <directory>
npx gogen [<@scope>/]<name> <directory> # npm
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

## Comparison with alternatives

| Library                                 | Package Phobia                                                                                             |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [gogen](https://github.com/ambar/gogen) | [![install size](https://packagephobia.now.sh/badge?p=gogen)](https://packagephobia.now.sh/result?p=gogen) |
| [sao](https://saojs.org/)               | [![install size](https://packagephobia.now.sh/badge?p=sao)](https://packagephobia.now.sh/result?p=sao)     |
| [yeoman](https://yeoman.io)             | [![install size](https://packagephobia.now.sh/badge?p=yo)](https://packagephobia.now.sh/result?p=yo)       |
