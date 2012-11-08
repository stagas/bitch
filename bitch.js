var fork = require('child_process').fork
var slice = [].slice

// Reference to error types by name
var errors = {
  'EvalError': EvalError
, 'RangeError': RangeError
, 'ReferenceError': ReferenceError
, 'SyntaxError': SyntaxError
, 'TypeError': TypeError
, 'URIError': URIError
}

module.exports = function (fn) {
  var args = slice.call(arguments, 1)
  var child = fork(__dirname + '/worker.js')
  var callbacks = {}
  child.on('message', function (m) {
    if (m.id && m.id in callbacks) {
      if ('object' === typeof m.args[0]
        && null !== m.args[0]
        && '__isError__' in m.args[0]) {
        var err = (errors[m.args[0].name] || Error)(m.args[0].message)
        err.stack = m.args[0].stack
        m.args[0] = err
      }
      callbacks[m.id].apply(this, m.args)
      delete callbacks[m.id]
    }
  })
  child.send({ fn: fn.toString(), args: args })
  var proxy = function () {
    var id = (Math.random() * 100000000 | 0).toString(36)
    var args = slice.call(arguments)
    var cb = args.pop()
    callbacks[id] = cb
    child.send({
      id: id
    , args: args
    })
  }
  proxy.die = proxy.destroy = proxy.kill = function (cb) {
    child.once('exit', cb || function () {})
    child.kill()
  }
  return proxy
}
