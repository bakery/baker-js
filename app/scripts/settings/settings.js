define(['jquery','base.settings'], function($,BaseSettings){

    'use strict';
    
    return $.extend(BaseSettings, {
        exampleString : 'this is overriden in settings/dev.js'
    });
});