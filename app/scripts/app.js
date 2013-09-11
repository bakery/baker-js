define(['marionette','tools/marionette.override'],function(Marionette){

    'use strict';

    var application = new Marionette.Application();

    application.on('initialize:after', function() {
        alert('baker is in the house');
    });

    return application;
});