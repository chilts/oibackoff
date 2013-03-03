// --------------------------------------------------------------------------------------------------------------------
//
// basic.js - basic tests for oibackoff
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

test("Basic successful callback", function (t) {
    // do a basic fs.stat of this __filename

    t.plan(3);

    backoff(fs.stat, __filename, function(err, stats, priorErrors) {
        t.equal(err, null, 'Error should be null');
        t.ok(stats.size, 'stats.size should be populated (with a number)');
        t.equal(priorErrors.length, 0, 'There should be no prior errors');
        t.end();
    });

});

var count = 0;
function statWithOneFail(filename, callback) {
    if ( count === 0 ) {
        count++;
        callback('Error', null);
        return;
    }
    else {
        count = 0;
    }
    // now call the real one
    fs.stat(filename, callback);
}

test("Basic successful callback", function (t) {
    // call a modified fs.stat which returns a fail on the first go
    t.plan(3);

    backoff(statWithOneFail, __filename, function(err, stats, priorErrors) {
        t.equal(err, null, 'Error should be null');
        t.ok(stats.size, 'stats.size should be populated (with a number)');
        t.equal(priorErrors.length, 1, 'There should be one prior errors');
        t.end();
    });

});

test("Basic intermediate callback", function (t) {
    t.plan(5);

    // call a modified fs.stat which returns a fail on the first go
    var intermediate = function (err, tries, delay) {
        t.equal(err, 'Error', 'err should be \'Error\'');
        t.equal(tries, 1, 'tries count should be 1');
        t.ok(delay, "delay should be populated (with a number)");
        return false;
    };

    backoff(statWithOneFail, __filename, intermediate, function(err, stats, priorErrors) {
        t.equal(err, 'Error', 'err should be \'Error\'');
        t.equal(priorErrors.length, 0, 'There should be no prior errors');
        t.end();
    });

});

// --------------------------------------------------------------------------------------------------------------------
