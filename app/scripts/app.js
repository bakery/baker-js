define(['marionette','views/notification.list','tools/marionette.override'],function(Marionette, NotificationList){

    'use strict';

    var application = new Marionette.Application();

    application.addRegions({
        notificationContainer: '#notifications',
    });

    application.on('initialize:after', function() {
        
        application.notificationContainer.show(new NotificationList()); 

    });

    return application;
});