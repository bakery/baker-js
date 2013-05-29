/*
    Require setup + entry point for the application
    This hybrid setup allows us to use 1 single config file across
    both runtime and test environment  
*/

function testing(){
    return typeof window.__karma__ !== 'undefined'; 
}


require.config({
    baseUrl : "scripts/",
 
    shim: {
        'underscore' : {exports: '_' },
        'backbone' : {exports: 'Backbone', deps: ['underscore']},
        'json' : {exports: 'JSON'},
        'handlebars' :  {exports: 'Handlebars'}
    },

    paths: {
        jquery: 'vendor/jquery/jquery',
        underscore: 'vendor/underscore/underscore',
        backbone: 'vendor/backbone/backbone',
        text : 'vendor/requirejs-text/text',
        json : 'vendor/json2/json2',
        handlebars : 'vendor/handlebars/handlebars',
        templates: '../templates'
    }
});

if (!testing()){
    require(['app'], function(Application) {
        Application.run();
    });
} else {
    var tests = [];
    for (var file in window.__karma__.files) {
        if (/specs\/.*\.js$/.test(file)) {
            tests.push(file);
        }
    }

    require.config({
        baseUrl : "/base/app/scripts",
        // ask Require.js to load these files (all our tests)
        deps : tests,
        // start test run, once Require.js is done
        callback : window.__karma__.start
    });
}