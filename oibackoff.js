// --------------------------------------------------------------------------------------------------------------------
//
// oibackoff.js - backoff functionality for any : fn(function(err, data) { ... });
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');

var defaults = {
    'maxTries'   : 3,
    'algorithm'  : 'exponential',
    'delayRatio' : 1, // you could make it any other integer or fraction (e.g. 0.25)
};

// returns 1, 2, 3, 4, 5, 6, 7, ...
function incremental(n) {
    return n + 1;
}

// memoizes 0, 1, 2, 4, 8, 16, 32, ...
var exp = [];
function exponential(n) {
    if ( exp[n] ) {
        return exp[n];
    }
    if ( n === 0 ) {
        exp[0] = 1;
        return exp[0];
    }
    if ( n === 1 ) {
        exp[1] = 2;
        return exp[1];
    }
    exp[n] = exponential(n-1) * 2;
    return exp[n];
}

// memoizes 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
var fib = [];
function fibonacci(n) {
    if ( fib[n] ) {
        return fib[n];
    }
    if ( n <= 1 ) {
        fib[n] = n;
        return fib[n];
    }
    fib[n] = fibonacci(n-2) + fibonacci(n-1);
    return fib[n];
}

var algorithm = {
    fibonacci   : fibonacci,
    exponential : exponential,
    incremental : incremental,
};

var backoff = function(opts) {

    // build up all the options
    opts = _.extend({}, defaults, opts);

    return function() {
        if ( arguments.length < 2 ) {
            throw 'Provide at least two args : backoff(fn, ..., callback)';
        }

        // set up a few things we need to keep a check of
        var tries = 0;

        // the function to call is the first arg, the last is the callback
        var args = Array.prototype.slice.call(arguments);
        var fn = args.shift();
        var callback = args.pop();

        var priorErrors = [];

        // create the function we want to call when fn() calls back
        var myCallback = function(err, data) {
            if ( err ) {
                // call this again but only if we
                var doAgain = false;
                if ( opts.maxTries === 0 ) {
                    doAgain = true;
                }
                else {
                    if ( tries < opts.maxTries ) {
                        doAgain = true;
                    }
                    else {
                        // we've retried enough, call callback as a failure
                        callback(err, null, priorErrors);
                        return;
                    }
                }

                // remember this error
                priorErrors.push(err);

                if ( doAgain ) {
                    // figure out the actual delay using the algorithm, the retry count and the delayRatio
                    var delay = algorithm[opts.algorithm](tries) * opts.delayRatio;

                    // ... and check it isn't over maxDelay
                    if ( opts.maxDelay && delay > opts.maxDelay ) {
                        delay = opts.maxDelay;
                    }

                    setTimeout(function() {
                        // increment how many tries we have done
                        tries++;

                        // now call it again
                        fn.apply(null, args);
                    }, delay * 1000);
                }
                return;
            }
            callback(null, data, priorErrors);
        };

        // add our own callback to the args and call the incoming function
        args.push(myCallback);
        tries++;
        fn.apply(null, args);
    };
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.exponential = exponential;
exports.incremental = incremental;
exports.fibonacci   = fibonacci;
exports.backoff     = backoff;

// --------------------------------------------------------------------------------------------------------------------
