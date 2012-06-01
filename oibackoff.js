var _ = require('underscore');

var defaults = {
    'maxRetries' : 5,
    // could be 'linear' or 'fibonacci' (for the lulz)
    // * exponential = 1, 2, 4, 8, 16, ...
    // * linear      = 1, 2, 3, 4, 5, ...
    // * fibonacci   = 1, 2, 3, 5, 8, ...
    'algorithm' : 'exponential',
    'start'     : 1, // you could make it any other integer or fraction (e.g. 0.25)
};

exports.backoff = function(opts) {

    // build up all the options
    opts = _.extend({}, defaults, opts);

    return function() {
        if ( arguments.length < 2 ) {
            throw 'Provide at least two args : backoff(fn, ..., callback)';
        }

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
                // call this again
                priorErrors.push(err);
                fn.apply(null, args);
                return;
            }
            callback(null, data, priorErrors);
        };

        // add our own callback to the args
        args.push(myCallback);

        // finally, call the provided function and see if it succeeds
        fn.apply(null, args);
    };
};
