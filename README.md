# bitch

Fork for humans

## Installing

`npm install bitch`

## How to use

```javascript
var bitch = require('bitch')

var fn = bitch(function (x, y) { // init block
  var secret = 'prepare your bitch'
  var crypto = require('crypto')

  // this is actual bitch
  return function (a, b, c, callback) {
    callback(null, 'whatever')
  }
}, 150, 250) // pass init args

fn(1, 'foo', 3, function (err, result) {
  console.log(result) // 'whatever'
  fn.die() // kill the bitch
})

```

## Licence

MIT/X11
