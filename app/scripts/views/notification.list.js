define(['marionette','views/notification', 'models/notification', 'text!./notification.list.html'], function(Marionette, NotificationView, NotificationModel, template){

        'use strict';
        
        return Marionette.Layout.extend({
            
            template : template,

            regions : {
            	'notificationContainer' : '.notifications'
            },          

            onRender : function(){

            	var myNotif = new NotificationView({model : new NotificationModel()});
            	this.notificationContainer.show(myNotif);  
            }

        });
    }
);