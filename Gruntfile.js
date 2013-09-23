/* jshint camelcase: false */

var path = require('path');

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
            distDirectory : 'dist',
            tempDirectory : 'temp',
            devSettingsModule : 'settings/settings.js',
            stagingSettingsModule : 'settings/stage.js',
            productionSettingsModule : 'settings/prod.js',
            deploymentPassphrase : 'Hello world'
        },

        clean: {
            dist: ['<%= settings.distDirectory %>'],
            temp: ['<%= settings.tempDirectory %>']
        },

        copy: {
            /*
                on prebuild:
                    - copy index.html to the dist directory
                    - copy images, fonts to the dist directory 
                    - copy all the scripts to the temp directory, skip settings files
            */
            prebuild: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.appDirectory %>',
                        src: ['index.html'],
                        dest: '<%= settings.distDirectory %>'
                    },

                    {
                        expand: true,
                        cwd: '<%= settings.appDirectory %>/images',
                        src: ['**/**'],
                        dest: '<%= settings.distDirectory %>/images'
                    },

                    {
                        expand: true,
                        cwd: '<%= settings.appDirectory %>/fonts',
                        src: ['**/**'],
                        dest: '<%= settings.distDirectory %>/fonts'
                    },
                    
                    {
                        expand: true,
                        cwd: '<%= settings.appDirectory %>/scripts',
                        src: [
                            '**',
                            '!<%= settings.stagingSettingsModule %>',
                            '!<%= settings.productionSettingsModule %>',
                            '!<%= settings.devSettingsModule %>'
                        ],
                        dest: '<%= settings.tempDirectory %>/scripts'
                    }
                ]
            },

            /*
                copy production settings file to the temp directory and rename it to 'settings.js'
            */

            prodPrebuild: {
                files: [
                    {
                        src: '<%= settings.appDirectory %>/scripts/<%= settings.productionSettingsModule %>',
                        dest: '<%= settings.tempDirectory %>/scripts/settings/settings.js'
                    }
                ]
            },

            /*
                copy staging settings file to the temp directory and rename it to 'settings.js'
            */

            stagePrebuild: {
                files: [
                    {
                        src: '<%= settings.appDirectory %>/scripts/<%= settings.stagingSettingsModule %>',
                        dest: '<%= settings.tempDirectory %>/scripts/settings/settings.js'
                    }
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
                    baseUrl: '<%= settings.tempDirectory %>/scripts',
                    mainConfigFile: '<%= settings.tempDirectory %>/scripts/main.js'
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
                    base:'<%= settings.appDirectory %>',
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
                    'Gruntfile.js',
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
        },

        prompt: {
            // double check before deploying things to production
            deploy: {
                options: {
                    questions: [
                        {
                            config: 'deploymentPassphrase',
                            type: 'input',
                            message: 'You are about to deploy your app to production, broski. If you are sure, type "<%= settings.deploymentPassphrase %>"'
                        }
                    ]
                }
            }
        },

        aws: grunt.file.readJSON('aws.json'),

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
                region: '<%= aws.AWSRegion %>',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },

            // stage to http://openmike.s3-website-us-east-1.amazonaws.com/
            staging: {
                options: {
                    bucket: '<%= aws.stagingBucket %>',
                    differential: true // Only uploads the files that have changed
                },
                files: [
                    // never cache index.html
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['index.html'],
                        params : { 'CacheControl' : 'no-cache'}
                    },
                    // cache everything else agressively 
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**','!index.html'],
                        params: {
                            //ContentEncoding: 'gzip',
                            'CacheControl':'public, max-age=31152701',
                            'Expires':new Date(2023,5,20)
                        }
                    }
                ]
            },

            // production deploy to http://openmic.io.s3-website-us-east-1.amazonaws.com/
            production: {
                options: {
                    bucket: '<%= aws.productionBucket %>',
                    differential: true // Only uploads the files that have changed
                },
                files: [
                    // never cache index.html
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['index.html'],
                        params : { 'CacheControl' : 'no-cache'}
                    },
                    // cache everything else agressively 
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**','!index.html'],
                        params: {
                            //ContentEncoding: 'gzip',
                            'CacheControl':'public, max-age=31152701',
                            'Expires':new Date(2023,5,20)
                        }
                    }
                ]
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
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-prompt');


    // called after deployment prompt to check if the passphrase is right
    grunt.registerTask('checkdeploy', 'Check passphrase', function(){
        var passphrase = grunt.config('deploymentPassphrase');
        var targetPhrase = grunt.config('settings').deploymentPassphrase;

        if(passphrase !== targetPhrase){
            grunt.fatal('Aborted because you said so');
        }
    });

    grunt.registerTask('init', ['shell:bower']);
    grunt.registerTask('test', ['jshint','karma']);

    grunt.registerTask('default', [
        'jshint',
        'karma',
        'compass',
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('production-build',[
        'karma',
        'clean:temp',
        'clean:dist',
        'copy:prebuild',
        'copy:prodPrebuild',
        'useminPrepare',
        'requirejs',
        'compass:dist',
        'rev',
        'usemin',
        'clean:temp'
    ]);

    grunt.registerTask('staging-build',[
        'karma',
        'clean:temp',
        'clean:dist',
        'copy:prebuild',
        'copy:stagePrebuild',
        'useminPrepare',
        'requirejs',
        'compass:dist',
        'rev',
        'usemin',
        'clean:temp'
    ]);

    grunt.registerTask('stage',[
        'staging-build', 'aws_s3:staging'
    ]);

    grunt.registerTask('deploy',[
        'prompt:deploy', 'checkdeploy', 'production-build', 'aws_s3:production'
    ]);
};