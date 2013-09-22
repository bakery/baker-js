define(['jquery', 'underscore', 'backbone', 'app'], function($, _, Backbone, Application) {
    

    describe("accessing vendor libraries", function(){

        it("can load jquery", function(){
            expect($).toBeDefined();
        });

        it("can load underscore", function(){
            expect(_).toBeDefined();
        });

        it("can load Backbone", function(){
            expect(Backbone).toBeDefined();
        });

    });

    describe("accessing application modules", function(){

        it("can load application module", function(){
            expect(Application).toBeDefined();
        });

    });
});