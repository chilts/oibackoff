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

oibackoff - backoff functionality for any : fn(err, data);

# Features #

* exponential backoff
* linear backoff
* max number of retries
* max time to wait per try

# Examples #

```
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
    console.log('Filesize : ' + stats.size);
});
```

# Options #

ToDo :)

# Author #

Written by: [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

# License #

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
