'use strict'

var tape = require('tape')

var pull = require('pull-stream')

var Throttle = require('../')

tape('simple', function (t) {
  var cb, timeout, output = [], ended = false

  function fakeTimeout (fn) {
    var called = false
    timeout = function () {
      if(called) throw new Error('timeout already called')
      called = true
      fn()
    }
  }

  pull(
    function (_, _cb) {
      var called = false
      cb = function (err, data) {
        if(called) throw new Error('cb already called')
        called = true
        _cb(err, data)
      }
    },
    Throttle(10, fakeTimeout),
    pull.drain(function (data) {
      output.push(data)
    }, function (end) {
      ended = end || true
    })
  )

  t.ok(cb)
  t.ok(timeout)

  timeout() // simulate a slow read

  cb(null, 1)

  t.deepEqual(output, [1])

  cb(null, 2) // fast reads
  cb(null, 3)
  cb(null, 4)

  //still waiting for timeout
  t.deepEqual(output, [1])

  timeout()//simulate a slow read

  t.deepEqual(output, [1, 4])

  //2nd timeout, very slow read
  timeout()

  cb(null, 5)

  t.deepEqual(output, [1, 4, 5])

  cb(true)

  timeout()

  t.deepEqual(output, [1, 4, 5])
  t.ok(ended)

  t.end()
})

tape('end before timeout', function (t) {
  var cb, timeout, output = [], ended = false

  function fakeTimeout (fn) {
    var called = false
    timeout = function () {
      if(called) throw new Error('timeout already called')
      called = true
      fn()
    }
  }

  pull(
    function (_, _cb) {
      var called = false
      cb = function (err, data) {
        if(called) throw new Error('cb already called')
        called = true
        _cb(err, data)
      }
    },
    Throttle(10, fakeTimeout),
    pull.drain(function (data) {
      output.push(data)
    }, function (end) {
      ended = end || true
    })
  )
  //no need to wait for a timeout on end
  cb(true)
  t.ok(ended)

  t.end()
})

tape('end before timeout', function (t) {
  var cb, timeout, output = [], ended = false

  function fakeTimeout (fn) {
    var called = false
    timeout = function () {
      if(called) throw new Error('timeout already called')
      called = true
      fn()
    }
  }

  pull(
    function (_, _cb) {
      var called = false
      cb = function (err, data) {
        if(called) throw new Error('cb already called')
        called = true
        _cb(err, data)
      }
    },
    Throttle(10, fakeTimeout),
    pull.drain(function (data) {
      output.push(data)
    }, function (end) {
      ended = end || true
    })
  )
  //no need to wait for a timeout on end
  cb(true)
  t.ok(ended)
  timeout()

  t.end()
})


tape('end after timeout', function (t) {
  var cb, timeout, output = [], ended = false

  function fakeTimeout (fn) {
    var called = false
    timeout = function () {
      if(called) throw new Error('timeout already called')
      called = true
      fn()
    }
  }

  pull(
    function (_, _cb) {
      var called = false
      cb = function (err, data) {
        if(called) throw new Error('cb already called')
        called = true
        _cb(err, data)
      }
    },
    Throttle(10, fakeTimeout),
    pull.drain(function (data) {
      output.push(data)
    }, function (end) {
      ended = end || true
    })
  )
  //no need to wait for a timeout on end
  timeout()
  cb(true)
  t.ok(ended)

  t.end()
})



tape('abort', function (t) {

 var cb, timeout, output = [], ended = false

  function fakeTimeout (fn) {
    var called = false
    timeout = function () {
      if(called) throw new Error('timeout already called')
      called = true
      fn()
    }
  }

  var read = pull(
    function (abort, _cb) {
      if(abort) {
        if(cb) {
          cb(abort)
        }
        return _cb(abort)
      }
      var called = false
      cb = function (err, data) {
        if(called) throw new Error('cb already called')
        called = true
        _cb(err, data)
      }
    },
    Throttle(10, fakeTimeout)
  )

  read(null, function (err) {
    console.log('cb!',err)
    t.ok(err)
  })

  read(true, function (end) {
    t.ok(end)
  })

  t.end()
})




