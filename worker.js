var slice = [].slice
var serializeError = function (err) {
  return {
    __isError__: true
  , name: err.name
  , message: err.message
  , stack: err.stack
  }
}

process.once('message', function (m) {
  var fn = eval('(' + m.fn + ')').apply(this, m.args)
  process.on('message', function (m) {
    var id = m.id
    m.args.push(function () {
      var args = slice.call(arguments)
      if (args[0] instanceof Error) {
        args[0] = serializeError(args[0])
      }
      process.send({ id: id, args: args })
    })
    try { fn.apply(this, m.args) }
    catch (e) {
      process.send({ id: id, args: [ serializeError(e) ] })
    }
  })
})
