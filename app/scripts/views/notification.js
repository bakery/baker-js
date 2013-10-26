define(['marionette','text!./notification.html'], function(Marionette, template){

        'use strict';
        
        return Marionette.ItemView.extend({
            
            template : template,
            tagName : 'li',
            

            initialize : function(){

            }

        });
    }
);