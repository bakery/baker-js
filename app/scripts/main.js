/*
    Require setup + entry point for the application
    This hybrid setup allows us to use 1 single config file across
    both runtime and test environment  
*/

function testing(){
    return typeof window.__karma__ !== 'undefined'; 
}

var requireConfig =  {
    
    shim: {
        'underscore' : {exports: '_' },
        'backbone' : {exports: 'Backbone', deps: ['underscore']},
        'json' : {exports: 'JSON'},
        'handlebars' :  {exports: 'Handlebars'}
    },

    paths: {
        jquery: 'vendor/jquery.min',
        underscore: 'vendor/underscore',
        backbone: 'vendor/backbone',
        text : 'vendor/text',
        json : 'vendor/json2',
        handlebars : 'vendor/handlebars',
        templates: '../templates'
    }

};

if (!testing()) {

    requireConfig.baseUrl = "scripts/";
    
    require.config(requireConfig);

    require(['jquery','app'], function($,Application) {
        Application.run();
    });

} else {

    requireConfig.baseUrl = "/base/app/scripts";

    var tests = [];
    for (var file in window.__karma__.files) {
        if (/specs\/.*\.js$/.test(file)) {
            tests.push(file);
        }
    }

    // ask Require.js to load these files (all our tests)
    requireConfig.deps = tests;
    // start test run, once Require.js is done
    requireConfig.callback = window.__karma__.start;

    require.config(requireConfig);
}