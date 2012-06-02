```
          _______ _________ _       ______   _______  _______  _        _______  _______  _______ 
         (  ___  )\__   __/( )     (  ___ \ (  ___  )(  ____ \| \    /\(  ___  )(  ____ \(  ____ \
         | (   ) |   ) (   | |     | (   ) )| (   ) || (    \/|  \  / /| (   ) || (    \/| (    \/
         | |   | |   | |   | |     | (__/ / | (___) || |      |  (_/ / | |   | || (__    | (__    
         | |   | |   | |   | |     |  __ (  |  ___  || |      |   _ (  | |   | ||  __)   |  __)   
         | |   | |   | |   (_)     | (  \ \ | (   ) || |      |  ( \ \ | |   | || (      | (      
         | (___) |___) (___ _      | )___) )| )   ( || (____/\|  /  \ \| (___) || )      | )      
         (_______)\_______/(_)     |/ \___/ |/     \|(_______/|_/    \/(_______)|/       |/       
                                                                                                  
```

oibackoff - backoff functionality for any : fn(function(err, data) { ... });

## Features ##

* exponential backoff
* incremental backoff
* fibonacci backoff ;)
* max number of retries

## Examples ##

```
var backoff = require('oibackoff');

// original code
fs.stat(__filename, function(err, stats) {
    if (err) {
        console.log('An error an occurred: ' + err);
        return;
    }
    console.log('Filesize : ' + stats.size);
}

// exponential backoff
backoff(fs.stat, __filename, function(err, stats, priorErrors) {
    if (err) {
        console.log('An error an occurred: ' + err);
        return;
    }
    console.log('There were ' + priorErrors.length ' errors prior to this success');
    console.log('Filesize : ' + stats.size);
});
```

## Options ##

### maxRetries ###

Default: 5

Will retry a maximum number of times. If you don't want a maxiumum, set this to 0.

### delayRatio ###

Default : 1

This is the ratio for each delay between retries (in seconds).

If you choose the exponential algorithm, then 1s delayRatio will result in delays of 1, 2, 4, 8 etc

### algorithm ###

Default : 'exponential'

Valid Values : exponential, incremental, fibonacci ;)

## Example Backoff Stategies ##

```
var oibackoff = require('oibackoff');

// 0.4, 0.8, 1.6, 3.2, 6.4, ...
var backoff = oibackoff.backoff({
    algorithm  : 'exponential',
    delayRatio : 0.4,
});

// 1, 2, 3, 4, 5, ...
var backoff = oibackoff.backoff({
    algorithm  : 'incremental',
    delayRatio : 1,
});

// 0.5, 1.0, 1.5, 2.5, 4, ...
var backoff = oibackoff.backoff({
    algorithm  : 'fibonacci',
    delayRatio : 0.5,
});
```

## Author ##

Written by: [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

## License ##

The MIT License : http://opensource.org/licenses/MIT

Copyright (c) 2011-2012 AppsAttic Ltd. http://appsattic.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
