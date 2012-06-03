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
        algorithm  : 'incremental',
        maxTries   : 10, // so we don't hit the limit
        delayRatio : 0.25,
    });

    backoff(failNTimes(3), function(err, data, priorErrors) {
        t.equal(err, null, 'Incremental: function did not fail');
        t.equal(data, 'Ok', 'Incremental: function returned a good result');
        t.equal(priorErrors.length, 3, 'Incremental: function failed thrice times before succeeding');
        t.end();
    });
});

test("Check that 'exponential' backoff works", function (t) {
    t.plan(3);

    var backoff = oibackoff.backoff({
        algorithm  : 'exponential',
        maxTries   : 10, // so we don't hit the limit
        delayRatio : 0.25,
    });

    backoff(failNTimes(3), function(err, data, priorErrors) {
        t.equal(err, null, 'Exponential: function did not fail');
        t.equal(data, 'Ok', 'Exponential: function returned a good result');
        t.equal(priorErrors.length, 3, 'Exponential: function failed three times before succeeding');
        t.end();
    });
});

test("Check that 'fibonacci' backoff works", function (t) {
    t.plan(3);

    var backoff = oibackoff.backoff({
        algorithm  : 'fibonacci',
        maxTries   : 10, // so we don't hit the limit
        delayRatio : 0.25,
    });

    backoff(failNTimes(3), function(err, data, priorErrors) {
        t.equal(err, null, 'Fibonacci: function did not fail');
        t.equal(data, 'Ok', 'Fibonacci: function returned a good result');
        t.equal(priorErrors.length, 3, 'Fibonacci: function failed three times before succeeding');
        t.end();
    });
});

test("No Max Tries", function (t) {
    t.plan(3);

    // go up in tenths of a second
    var backoff = oibackoff.backoff({
        algorithm  : 'incremental',
        delayRatio : 0.1,
        maxTries   : 0,
    });

    backoff(failNTimes(8), function(err, data, priorErrors) {
        t.equal(err, null, 'NoMaxTries: function did not fail');
        t.equal(data, 'Ok', 'NoMaxTries: function returned a good result');
        t.equal(priorErrors.length, 8, 'NoMaxTries: function failed eight times before succeeding');
        t.end();
    });
});

test("With a Max Tries (never succeeds)", function (t) {
    t.plan(3);

    // go up in tenths of a second
    var backoff = oibackoff.backoff({
        algorithm  : 'incremental',
        delayRatio : 0.1,
        maxTries   : 3,
    });

    var alwaysFail = function(callback) {
        callback('Error', null);
    };
    backoff(alwaysFail, function(err, data, priorErrors) {
        t.equal(err, 'Error', "MaxTries=3: Function's last fail was 'Error'");
        t.equal(data, null, 'MaxTries=3: function failed overall');
        t.equal(priorErrors.length, 2, 'MaxTries=3: function failed twice prior to this one');
        t.end();
    });
});

// --------------------------------------------------------------------------------------------------------------------
