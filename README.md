##Tasty web Apps with the Baker
===

### What's in the Box?

- jshint to make sure your code is neat
- SASS compilation
- require.js optimized builds (using almond for a smaller footprint)
- karma for testing
- bower for package management
- livereload goodnes so you can leave your referesh button alone

###Bootstrap your project

Baker needs [Grunt.js 0.4+](http://gruntjs.com/) and [Bower](http://bower.io/)

```
npm install -g grunt-cli bower 
```

Note: you might need to sudo this command

To install development dependencies for the Baker, do the following

```
npm install 
```

Note: you might need to sudo this command

Baker uses [Bower](http://bower.io/) to keep third party libraries organized within the project. All the vendor dependencies are listed in bower.json. To get all the required libraries for the project, use the init task

```
grunt init
```  

Note: you might need to sudo this command

This will download and install all the js goodness to app/scripts/vendor

Baker uses livereload to automatically update your site on code/style/content updates. To enable Livereload in your browser, grab [these extensions](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-)

###Run the app (http://localhost:9001)
```
grunt 
```

###Test
Baker uses [karma](http://karma-runner.github.io/) for testing. Once you launch Baker's test runner, it will be running in the background monitoring updates to project files and reevaluating the tests so you can get immediate feedback and see if the code you are writing is behaving the way you want it to. 

```
grunt test
```

###Build
Once your awesome app is fully tested and good to go, Baker helps you get it ready for deployment. Build does a few handy things:

* compiles all your scripts into 1 single file so your entire app is served in one batch
* compiles your SASS and minifies the resulting CSS file
* revs scripts and css to confuse your cache  

```
grunt build
```

===

Happy baking!
