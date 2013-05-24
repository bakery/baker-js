##Tasty web Apps with the Baker
===

###Bootstrap your project

```
npm install
```

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

###Dependencies
[Grunt.js 0.4+](http://gruntjs.com/)

===

Happy baking!
