'use strict'

//when a read comes in, set timer

//timeout finishes, then read

//read finishes several times, then timeout

module.exports = function (delay, _setTimeout) {
  _setTimeout = _setTimeout || setTimeout
  var ended = false, value, cb, timeout = false
  return function (read) {
    return function (abort, cb) {
      if(abort) return read(ended = abort, cb)
      if(ended) return cb(ended)
      var timeout = false

      _setTimeout(function () {
        timeout = true
        if(value && !ended) {
          var _value = value
          value = null
          var _cb = cb
          cb = null
          _cb(null, _value)
        }
      }, delay)

      read(null, function next (end, data) {
        if(!cb) {
          value = data
          ended = ended || end
          return
        }
        if(end)
          cb(ended = end)
        else if(timeout) {
          cb(null, data)
        }
        else {
          value = data
          read(null, next) //loop until timeout is over
        }
      })
    }
  }
}



















