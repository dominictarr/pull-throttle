# pull-throttle

throttle a pull-stream. If things are coming in faster
than a given timeout, only keep the latest, reducing
the rate of the stream.

## example

``` js
pull(
  source,
  Throttle(100), //not more than 100 ms per item!
  sink
)
```

## License

MIT
