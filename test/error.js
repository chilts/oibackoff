// --------------------------------------------------------------------------------------------------------------------
//
// error.js - tests for errors for oibackoff
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

// core
var fs = require('fs');

// modules
var _ = require('underscore');
var tap = require("tap");
var test = tap.test;
var backoff = require('../').backoff();

// --------------------------------------------------------------------------------------------------------------------

test("Check the number of args (should be at least two)", function (t) {
    t.plan(3);

    try {
        backoff(function() {});
    }
    catch (e) {
        t.ok(e, 'backoff() threw an error as expected (only 1 arg)');
    }

    try {
        backoff();
    }
    catch (e) {
        t.ok(e, 'backoff() threw an error as expected (no args)');
    }

    backoff(function(callback) { callback(null, 1); }, function(err, data) {
        t.equal(data, 1, 'backoff was fine (as suspected)');
    });

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
