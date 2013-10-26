define(['underscore','backbone','settings'],function(_,Backbone,settings){

    'use strict';

    return Backbone.Model.extend({

        defaults : {
            duration : '00:00',
        },

        initialize : function(){
            this.set('timestamp', this.getTime());
        },

        getTime : function(){
            var currentdate = new Date();
            var datetime = "Last Sync: " + currentdate.getDay() + "/"+currentdate.getMonth() 
            + "/" + currentdate.getFullYear() + " @ " 
            + currentdate.getHours() + ":" 
            + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            return currentdate;
        }

    });
});