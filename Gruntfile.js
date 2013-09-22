var path = require('path');
var modRewrite = require('connect-modrewrite');

var folderMount = function folderMount(connect, point) {
    'use strict';
    return connect.static(path.resolve(point));
};


module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        settings : {
            appDirectory : 'app',
            testDirectory : 'test',
            distDirectory : 'dist'
        },

        clean: {
            dist: ['<%= settings.distDirectory %>']
        },

        copy: {
            prebuild: {
                files: [
                    {expand: true, cwd: '<%= settings.appDirectory %>', src: ['index.html'], dest: '<%= settings.distDirectory %>'}
                ]
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['<%= settings.appDirectory %>/src/**/*.js'],
                dest: '<%= settings.distDirectory %>/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },

            dist: {
                files: {
                    '<%= settings.distDirectory %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        jshint: {
            files: {
                src: [
                    'Gruntfile.js',
                    '<%= settings.appDirectory %>/scripts/**/*.js',
                    '!<%= settings.appDirectory %>/scripts/vendor/**/*.js'
                ]
            },
            options: {
                force: true,
                jshintrc: '.jshintrc'
            }
        },

        requirejs: {
            compile: {
                options: {
                    name: 'vendor/almond/almond',
                    include: ['main'],
                    baseUrl: '<%= settings.appDirectory %>/scripts',
                    mainConfigFile: '<%= settings.appDirectory %>/scripts/main.js'
                }
            }
        },

        rev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src: [
                        'dist/**/*.js',
                        'dist/**/*.css'
                    ]
                }]
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: '<%= settings.appDirectory %>/styles',
                    cssDir: '<%= settings.distDirectory %>/styles',
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
                        return [
                            require('connect-livereload')(),
                            folderMount(connect, options.base)
                        ];
                    }
                }
            }
        },

        watch: {

            options: {
                livereload: true
            },
            
            js : {
                files : [
                    '<%= settings.appDirectory %>/scripts/**/*.js',
                    '!<%= settings.appDirectory %>/scripts/vendor/**/*.js',
                    '<%= settings.testDirectory %>/specs/**/*.js'
                ],
                tasks : 'jshint'
            },

            sass : {
                files : [
                    '<%= settings.appDirectory %>/styles/*.scss'
                ],
                tasks : 'compass:dev'
            },

            html : {
                files : [
                    '<%= settings.appDirectory %>/**/*.html',
                    '!<%= settings.appDirectory %>/scripts/vendor/**/*.html',
                    '<%= settings.testDirectory %>/**/*.html'
                ]
            }
        },


        'useminPrepare': {
            html: '<%= settings.distDirectory %>/index.html'
        },

        usemin: {
            html: ['<%= settings.distDirectory %>/*.html'],
            css: ['<%= settings.appDirectory %>/styles/*.css'],
            options: {
                dirs: ['<%= settings.distDirectory %>']
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        shell: {
            bower: {
                command: 'bower install',
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-usemin-baked');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('init', ['shell:bower']);
    grunt.registerTask('default', ['jshint','compass', 'connect:server', 'watch']);
    grunt.registerTask('test', ['jshint','karma','watch']);

    grunt.registerTask('build',['clean:dist','copy:prebuild','useminPrepare','requirejs','compass:dist','rev','usemin']);

};