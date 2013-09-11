define(["underscore", "backbone","marionette","handlebars"],function(_,Backbone,Marionette,Handlebars){
    Backbone.Marionette.Renderer.render = function(template,data){
        return _.isFunction(template) ? template(data) : Handlebars.compile(template)(data);
    };
});