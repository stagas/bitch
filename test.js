var bitch = require('./bitch')
var assert = require('assert')

var tests = 3

function done () {
  console.log('tests pass')
}

var one = bitch(function () {
  var total = 0
  return function (i, cb) {
    total += i
    cb(total)
  }
})

var total = 0
for (var i = 1000; i--;) {
  total += i
}

for (var i = 1000, cnt = 1000; i--;) {
  one(i, function (x) {
    if (!--cnt) {
      assert.equal(total, x)
      one.die()
      --tests || done()
    }
  })
}

var two = bitch(function () {
  return function (cb) {
    cb(new ReferenceError('Some error'))
  }
})

two(function (err) {
  assert.throws(function () { throw err }, ReferenceError)
  two.die(function () {
    --tests || done()
  })
})

var three = bitch(function () {
  return function (str, cb) {
    cb(null, str)
  }
})

three('yo', function (err, str) {
  assert.equal(null, err)
  assert.equal('yo', str)
  three.die()
  --tests || done()
})
