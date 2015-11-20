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

### logformat(any)

Parameters:

* `any` anything you wish to stringify... booleans, strings, numbers, objects, arrays, etc.

Returns:

* formatted string

## Example

```
var logformat = require('logformat');
var fs = require('fs');

console.log(logformat(fs.statSync('/dev/null')));

// -> 'dev=287613608 mode=8630 nlink=1 uid=0 gid=0 rdev=50331650 blksize=131072 ino=303 size=0 blocks=0'
```

## Testing

There is an automated test suite:

    npm test

## License

```
Copyright (C) 2015 SSi Micro, Ltd. and other contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
