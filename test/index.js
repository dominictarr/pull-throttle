
var tape = require('tape')
var pull = require('pull-stream')
var Throttle = require('../')

function Time () {
  var ts = 0
  return function (abort, cb) {
    if(abort) return cb(abort)
    var _ts = Date.now()
    if(_ts != ts)
      cb(null, ts = _ts)
    else
      setTimeout(function () {
        cb(null, ts = Date.now())
      }, 1)
  }
}

//read N items, but only output at most 10 times a second.
tape('simple', function (t) {
  var start = Date.now()
  var a = [], ended = false
  pull(
    Time(),
    Throttle(100),
    pull.take(10),
    pull.drain(function (ts) {
      a.push(ts - start)
      console.log(ts - start)
    }, function () {
      if(ended) throw new Error('already ended')
      ended = true
      t.equal(a.length, 10)
      console.log(Date.now() - start)
      t.ok(Date.now() - start >= 1000)
      t.end()
    })
  )
})

tape('for a slow stream, output every record', function (t) {

  var start = Date.now()
  var a = []
  pull(
    Time(),
    pull.asyncMap(function (d, cb) {
      setTimeout(function () {
        cb(null, d)
      }, 100)
    }),
    Throttle(20),
    pull.take(10),
    pull.drain(function (ts) {
      a.push(ts - start)
      console.log(ts - start)
    }, function () {
      t.equal(a.length, 10)
      console.log(Date.now() - start)
      t.ok(Date.now() - start >= 1000)
      t.end()
    })
  )
})


