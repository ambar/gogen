# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/ambar/gogen/compare/v2.0.0...v2.1.0) (2021-10-11)


### Features

* allow change context value (name or path) on the fly ([dabec0f](https://github.com/ambar/gogen/commit/dabec0fec62e34ff790fa8976c25818681d1a2f8))
* ignore .git and .DS_Store ([dfb8e07](https://github.com/ambar/gogen/commit/dfb8e0799d42279a738484afbeb323ef0f2e1f8f))





# [2.0.0](https://github.com/ambar/gogen/compare/v1.1.1...v2.0.0) (2021-10-07)


### Features

* add `client` option for install ([964609b](https://github.com/ambar/gogen/commit/964609b79bc1c1e856f74781ebc8c21fa7e7c481))
* add types ([c564be9](https://github.com/ambar/gogen/commit/c564be98525bcae767d51e3e9d0822eea40e2562))
* remove utils to core api ([a6529ae](https://github.com/ambar/gogen/commit/a6529ae041a7d5d29df9a3344fb64bc92a80dc37))
* use fast-glob instead of vinyl-fs ([bb49881](https://github.com/ambar/gogen/commit/bb49881634cfbd0929a3bbd6cabdd53313ddc59c))


### BREAKING CHANGES

* target Node v10.3, removed vinyl-fs





## [1.1.1](https://github.com/ambar/gogen/compare/v1.1.0...v1.1.1) (2021-09-25)

**Note:** Version bump only for package gogen





# [1.1.0](https://github.com/ambar/gogen/compare/v1.0.1...v1.1.0) (2021-09-23)


### Features

* add `test` option to template, support infix ext ([4012b3b](https://github.com/ambar/gogen/commit/4012b3b3f91aadd860f5311218943d6091061be2))
* move helper API to core API ([7608ee6](https://github.com/ambar/gogen/commit/7608ee62182272cfe228fd7a8310a00530966136))





## [1.0.1](https://github.com/ambar/gogen/compare/v0.0.7...v1.0.1) (2021-09-20)


### Bug Fixes

* use path.format in rename function ([dfe9b1b](https://github.com/ambar/gogen/commit/dfe9b1bf792a83d723a478dcac000d99f37971eb))


### Features

* drop Node 8 support ([e33215c](https://github.com/ambar/gogen/commit/e33215c56e598204794d2dcf402058a941f78e2f))
* inject context to mock function ([a966cec](https://github.com/ambar/gogen/commit/a966cec07fd37fa384c8893010f4bbf7297a3ce7))
