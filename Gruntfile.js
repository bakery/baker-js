var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var modRewrite = require('connect-modrewrite');

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};


module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        settings : {
            appDirectory : "app",
            testDirectory : "test",
            distDirectory : "dist"
        },

        clean: {
            dist: ["<%= settings.distDirectory %>"]
        },

        copy: {
            prebuild: {
                files: [
                    {expand: true, cwd: '<%= settings.appDirectory %>', src: ['index.html'], dest: '<%= settings.distDirectory %>'}
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'} // flattens results to a single level
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
                    name: 'vendor/almond/almond',
                    include: ['main'],
                    baseUrl: "<%= settings.appDirectory %>/scripts",
                    mainConfigFile: "<%= settings.appDirectory %>/scripts/main.js"
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
                            modRewrite([
                                '^/test /index.html'
                            ]),
                            lrSnippet,folderMount(connect, options.base)
                        ];
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

        watch: {
            stuff: {
                files: [
                    '<%= settings.appDirectory %>/scripts/**/*.js',
                    '!<%= settings.appDirectory %>/scripts/vendor/**/*.js',
                    '<%= settings.testDirectory %>/specs/**/*.js',
                    '<%= settings.appDirectory %>/styles/*.scss',
                    '<%= settings.appDirectory %>/**/*.html',
                    '<%= settings.testDirectory %>/**/*.html'
                ],
                options: {
                    spawn: false,
                    livereload: true
                }
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


    grunt.event.on('watch', function(action, filepath) {
        if(filepath.match(/\.js$/)){
            grunt.task.run('jshint');
        } else if(filepath.match(/\.scss$/)){
            grunt.task.run('compass');
        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-usemin-baked');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('init', ['shell:bower']);
    grunt.registerTask('default', ['jshint','compass', 'connect:server', 'watch:stuff']);
    grunt.registerTask('test', ['jshint','karma','watch:stuff']);

    grunt.registerTask('build',['clean:dist','copy:prebuild','useminPrepare','requirejs','compass:dist','rev','usemin']);

};