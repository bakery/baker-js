/* jshint camelcase: false */

/*
    Require setup + entry point for the application
    This hybrid setup allows us to use 1 single config file across
    both runtime and test environment  
*/

function testing(){
    'use strict';
    return typeof window.__karma__ !== 'undefined';
}

require.config({
    baseUrl : 'scripts/',
 
    shim: {
        'underscore' : {exports: '_' },
        'backbone' : {exports: 'Backbone', deps: ['underscore']},
        'marionette' : {exports: 'Marionette', deps: ['backbone']},
        'json' : {exports: 'JSON'},
        'handlebars' :  {exports: 'Handlebars'}
    },

    paths: {
        jquery: 'vendor/jquery/jquery',
        underscore: 'vendor/underscore/underscore',
        backbone: 'vendor/backbone/backbone',
        marionette : 'vendor/backbone.marionette/lib/backbone.marionette',
        text : 'vendor/requirejs-text/text',
        json : 'vendor/json2/json2',
        handlebars : 'vendor/handlebars/handlebars',
        templates: '../templates',
        'base.settings' : 'settings/base',
        settings : 'settings/settings'
    }
});

if (!testing()){
    require(['jquery','app','settings'], function($,Application,settings) {
        'use strict';

        $(function(){
            console.log('settings', settings.exampleString);
            Application.start();
        });
    });
} else {

    var tests = [];
    for (var file in window.__karma__.files) {
        if (/specs\/.*\.js$/.test(file)) {
            tests.push(file);
        }
    }

    require.config({
        // Karma serves files under /base, which is the basePath from your config file
        baseUrl : '/base/app/scripts',
        
        // dynamically load all test files
        deps: tests,

        // we have to kick of jasmine, as it is asynchronous
        callback: window.__karma__.start
    });
}