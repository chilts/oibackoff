// --------------------------------------------------------------------------------------------------------------------
//
// algorithm.js - tests for the different algorithms for oibackoff
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

// modules
var _ = require('underscore');
var tap = require("tap");
var test = tap.test;
var oibackoff = require('../');

// creates a function which will fail n times before succeeding
function failNTimes(n) {
    var count = 0;
    return function(callback) {
        count++;
        if ( count <= n ) {
            callback('Error', null);
            return;
        }
        callback(null, 'Ok');
    };
}

// --------------------------------------------------------------------------------------------------------------------

test('Test our algorithms', function(t) {
    t.plan(18);

    t.equal(oibackoff.incremental(0), 1, 'Incremental(0)');
    t.equal(oibackoff.incremental(1), 2, 'Incremental(1)');
    t.equal(oibackoff.incremental(2), 3, 'Incremental(2)');
    t.equal(oibackoff.incremental(3), 4, 'Incremental(3)');
    t.equal(oibackoff.incremental(4), 5, 'Incremental(4)');
    t.equal(oibackoff.incremental(5), 6, 'Incremental(5)');

    t.equal(oibackoff.exponential(0), 1, 'Exponential(0)');
    t.equal(oibackoff.exponential(1), 2, 'Exponential(1)');
    t.equal(oibackoff.exponential(2), 4, 'Exponential(2)');
    t.equal(oibackoff.exponential(3), 8, 'Exponential(3)');
    t.equal(oibackoff.exponential(4), 16, 'Exponential(4)');
    t.equal(oibackoff.exponential(5), 32, 'Exponential(5)');

    t.equal(oibackoff.fibonacci(0), 0, 'Fibonacci(0)');
    t.equal(oibackoff.fibonacci(1), 1, 'Fibonacci(1)');
    t.equal(oibackoff.fibonacci(2), 1, 'Fibonacci(2)');
    t.equal(oibackoff.fibonacci(3), 2, 'Fibonacci(3)');
    t.equal(oibackoff.fibonacci(4), 3, 'Fibonacci(4)');
    t.equal(oibackoff.fibonacci(5), 5, 'Fibonacci(5)');

    t.end();
});

test("Check that 'incremental' backoff works", function (t) {
    t.plan(3);

    var backoff = oibackoff.backoff({
        algorithm : 'incremental',
    });

    backoff(failNTimes(3), function(err, data, priorErrors) {
        t.equal(err, null, 'function did not fail');
        t.equal(data, 'Ok', 'function returned a good result');
        t.equal(priorErrors.length, 3, 'function failed three times before succeeding');
        t.end();
    });
});

test("Check that 'incremental' backoff works", function (t) {
    t.plan(3);

    var backoff = oibackoff.backoff({
        algorithm : 'exponential',
    });

    backoff(failNTimes(3), function(err, data, priorErrors) {
        t.equal(err, null, 'function did not fail');
        t.equal(data, 'Ok', 'function returned a good result');
        t.equal(priorErrors.length, 3, 'function failed three times before succeeding');
        t.end();
    });
});

test("Check that 'incremental' backoff works", function (t) {
    t.plan(3);

    var backoff = oibackoff.backoff({
        algorithm : 'fibonacci',
    });

    backoff(failNTimes(3), function(err, data, priorErrors) {
        t.equal(err, null, 'function did not fail');
        t.equal(data, 'Ok', 'function returned a good result');
        t.equal(priorErrors.length, 3, 'function failed three times before succeeding');
        t.end();
    });
});

// --------------------------------------------------------------------------------------------------------------------
