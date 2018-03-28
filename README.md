# logformat

Stringify objects into searchable strings.

## Motivation

JSON is a great format for exchanging data, but it isn't so great for
logging. Say I want to log the follow user request object:

```
{
    date: '2015-11-19',
    client: {
        agent: 'firefox',
        ip: '10.1.32.1'
    },
    server: {
        ip: '192.168.2.222'
    }
}
```

If I use the traditional `JSON.stringify()`, I get something like this:

    {"date":"2015-11-19","client":{"agent":"firefox","ip":"10.1.32.1"},"server":{"ip":"192.168.2.222"}}

That isn't very readable and hard to [grep](https://www.gnu.org/software/grep/).
This library solves those problems by nicely formatting objects as `key=value` pairs:

    date=2015-11-19 client.agent=firefox client.ip=10.1.32.1 server.ip=192.168.2.222

## Installation

    npm install --save logformat

## API

### logformat(any [, opts])

Parameters:

* `any` anything you wish to stringify... booleans, strings, numbers, objects, arrays, etc.
* `opts` options for controlling the behaviour of the function. Object. Optional.
  - `maxDepth` maximum depth that should be formatted. positive integer. Optional.

Returns:

* formatted string

NOTE: if `any` is an object with a circular reference, this function returns `'[Circular]'`;

## Example

```
var logformat = require('logformat');
var fs = require('fs');

console.log(logformat(fs.statSync('/dev/null')));

// -> 'dev=6 mode=8630 nlink=1 uid=0 gid=0 rdev=259 blksize=4096 ino=1029 size=0 blocks=0 atime=2017-07-12T00:21:34-04:00 mtime=2017-07-12T00:21:34-04:00 ctime=2017-07-12T00:21:34-04:00 birthtime=2017-07-12T00:21:34-04:00'
```

## Testing

There is an automated test suite:

    npm test

## License

See [LICENSE.md](https://github.com/ssimicro/logformat/blob/master/LICENCE.md)
