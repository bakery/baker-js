/*
    Require setup + entry point for the application
*/

require.config({
    baseUrl : "scripts/",
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

});

require(['jquery','app'], function($,Application) {
    if($("#mocha").length === 0){
        Application.run();
    }
});
