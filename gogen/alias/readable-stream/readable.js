// Copy from https://unpkg.com/readable-stream@2.3.6/readable.js
// Removed conditional require to ensure eliminate readable-stream
const Stream = require('stream')
module.exports = Stream
exports = module.exports = Stream.Readable
exports.Readable = Stream.Readable
exports.Writable = Stream.Writable
exports.Duplex = Stream.Duplex
exports.Transform = Stream.Transform
exports.PassThrough = Stream.PassThrough
exports.Stream = Stream
