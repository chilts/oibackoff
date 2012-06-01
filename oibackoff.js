var _ = require('underscore');

var defaults = {
    'maxRetries' : 3,
    'maxDelay'   : 10,
    'algorithm'  : 'exponential',
    'startDelay' : 1, // you could make it any other integer or fraction (e.g. 0.25)
};

exports.backoff = function(opts) {

    // build up all the options
    opts = _.extend({}, defaults, opts);

    return function() {
        if ( arguments.length < 2 ) {
            throw 'Provide at least two args : backoff(fn, ..., callback)';
        }

        // set up a few things we need to keep a check of
        var retries = 0;
        var delay = 0;

        // the function to call is the first arg, the last is the callback
        var args = Array.prototype.slice.call(arguments);
        var fn = args.shift();
        var callback = args.pop();

        // console.log(fn);
        // console.log(args);
        // console.log(callback);

        var priorErrors = [];

        // create the function we want to call when fn() calls back
        var myCallback = function(err, data) {
            if ( err ) {
                // remember this error
                priorErrors.push(err);

                console.log('' + (new Date()).toISOString() + ' : got an error');

                // call this again but only if we
                var doAgain = false;
                if ( opts.maxRetries === 0 ) {
                    console.log('maxretries is zero, trying again');
                    doAgain = true;
                }
                else {
                    if ( retries < opts.maxRetries ) {
                        console.log('retries is less than maxRetries');
                        doAgain = true;
                    }
                    else {
                        // we've retried enough, call callback as a failure
                        console.log('retries is more than maxRetries, failing');
                        callback(err, null, priorErrors);
                        return;
                    }
                }

                if ( doAgain ) {
                    retries++;

                    // increment the delay (or set it to the start value)
                    if ( delay === 0 ) {
                        delay = opts.startDelay;
                    }
                    else {
                        // should be changed to use the algorithm
                        delay = delay * 2;
                    }

                    setTimeout(function() {
                        fn.apply(null, args);
                    }, delay * 1000);
                }
                return;
            }
            callback(null, data, priorErrors);
        };

        // add our own callback to the args and call the incoming function
        args.push(myCallback);
        fn.apply(null, args);
    };
};
