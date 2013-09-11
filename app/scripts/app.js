define(["marionette","tools/marionette.override"],function(Marionette){

    var application = new Marionette.Application();

    application.on('initialize:after', function() {
        alert("baker is in the house");
    });

    return application;
});