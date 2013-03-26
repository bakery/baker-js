var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};


module.exports = function(grunt) {

    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),
        
        settings : {
            appDirectory : "app",
            testDirectory : "test"
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['<%= settings.appDirectory %>/src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },

            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        jshint: {
            files: {
                src: [
                    'Gruntfile.js',
                    '<%= settings.appDirectory %>/scripts/*.js',
                    '<%= settings.appDirectory %>/scripts/models/**/*.js',
                    '<%= settings.appDirectory %>/scripts/views/**/*.js'
                ]
            },
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    name: 'vendor/almond',
                    include: ['main'],
                    baseUrl: "scripts",
                    mainConfigFile: "<%= settings.appDirectory %>/scripts/main.js",
                    out: "dist/scripts/app.compiled.js"
                }
            }
        },

        compass: {    
            dist: {   
                options: {
                    sassDir: '<%= settings.appDirectory %>/styles',
                    cssDir: 'dist/styles',
                    environment: 'production',
                    force:true
                }
            },
            dev: {                 
                options: {
                    sassDir: '<%= settings.appDirectory %>/styles',
                    cssDir: '<%= settings.appDirectory %>/styles',
                    force:true
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 9001,
                    base:'<%= settings.appDirectory %>/',
                    middleware: function(connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)];
                    }
                }
            },

            test: {
                options: {
                    port: 9001,
                    base:'test/',
                    middleware: function(connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)];
                    }
                }
            }            
        },
        
        regarde: {
            server : {
                files: ['<%= settings.appDirectory %>/styles/*.scss', '<%= settings.appDirectory %>/scripts/**/*.js'],
                tasks: ['jshint','compass','livereload']
            },

            test : {
                files: ['<%= settings.appDirectory %>/scripts/**/*.js', '<%= settings.testDirectory %>/spec/**/*.js', '<%= settings.testDirectory %>/index.html'],
                tasks: ['jshint','livereload']  
            }
        }  
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-livereload');

    grunt.registerTask('default', ['jshint','compass','livereload-start', 'connect:server', 'regarde:server']);
    grunt.registerTask('test', ['jshint','livereload-start','connect:test','regarde:test']);
};