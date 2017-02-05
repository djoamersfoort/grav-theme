/* eslint-disable strict */
/**
 * Creates CSS and JS files from Sass and uncompressed Javascript.
 *
 * @author Roelof Roos <github@roelof.io>
 * @license LGPL-3.0
 */

module.exports = function(grunt) {
    // Fix promises
    require('es6-promise').polyfill();

    // Make sure some directories exist
    grunt.file.mkdir('./css-compiled');
    grunt.file.mkdir('./js-compiled');
    grunt.file.mkdir('./cache');

    var banner = [
        'DJO Amersfoort - Grav Theme',
        'Developed with ❤ by Roelof in Amersfoort',
        '(and sometimes Zwolle...)',
        '',
        '@author Roelof Roos <github@roelof.io>',
        '@license LGPL-3.0',
        '@link https://github.com/djoamersfoort/grav-theme'
    ];

    banner.forEach(function(val, key) {
        banner[key] = ' * ' + val;
    });

    // Add jshint and eslint ignore lines
    banner.unshift('/**!');
    banner.unshift('/* eslint-disable */');
    banner.push(' */');

    var bannerText = banner.join('\n') + '\n';

    //
    // File configuration, contains all files that will be compiled.
    //
    var files = {
        vendor: {
            'js-compiled/vendor.min.js': [
                'node_modules/jquery/dist/jquery.js',
                'node_modules/tether/dist/js/tether.js',
                'node_modules/bootstrap/dist/js/bootstrap.js'
            ]
        },
        uglify: {
            'js-compiled/theme.min.js': [
                'js/*.js'
            ]
        },
        eslint: [
            'Gruntfile.js',
            'js/*.js',
            '!js/theme.min.js',
            '!js/theme-vendor.min.js'
        ],
        eslintconfig: '.eslintrc.json',
        sass: {
            'cache/theme.css': [
                'scss/theme.scss'
            ]
        },
        sasslint: [
            'scss/*.scss',
            'scss/**/*.scss'
        ],
        postcss: {
            'css-compiled/theme.css': [
                'cache/theme.css'
            ]
        },
        cssmin: {
            'css-compiled/theme.min.css': 'css-compiled/theme.css'
        },
        watch: {
            js: [
                'js/*.js',
                '!js/*.min.js'
            ],
            sass: [
                'scss/*.scss',
                'scss/*/*.scss'
            ]
        }
    };

    var plugins = [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({
            browsers: ['last 2 versions']
        })
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Start of JS minifier
        uglify: {
            options: {
                banner: bannerText,
                quoteStyle: 1,
                mangle: true,
                compress: {
                    warnings: false
                },
                ASCIIOnly: false,
                preserveComments: 'some'
            },
            vendor: {
                files: files.vendor
            },
            prod: {
                files: files.uglify,
                options: {
                    preserveComments: false
                }
            },
            dev: {
                files: files.uglify
            }
        },

        // ESLint linting and validation
        eslint: {
            files: files.eslint,
            options: {
                configFile: '.eslintrc.json'
            }
        },

        // Sass linting
        sasslint: {
            files: files.sasslint,
            options: {
                configFile: '.sass-lint.yml'
            }
        },

        // Sass compiler
        sass: {
            options: {
                indentWidth: 4,
                banner: bannerText,
                outputStyle: 'nested'
            },
            prod: {
                files: files.sass,
                options: {
                    roundingPrecision: 4,
                    keepSpecialComments: 0,
                    processImportFrom: ['local']
                }
            },

            dev: {
                files: files.sass,
                options: {
                    roundingPrecision: -1,
                    sourceComments: true
                }
            }
        },

        // Postprocess CSS
        postcss: {
            dev: {
                files: files.postcss,
                options: {
                    map: {
                        inline: false,
                        annotation: 'cache/maps'
                    },
                    processors: plugins
                }
            },

            prod: {
                files: files.postcss,
                options: {
                    map: false,
                    processors: plugins
                }
            }
        },

        // CSS min
        cssmin: {
            options: {
                keepSpecialComments: '1',
                processImport: true,
                mediaMerging: true,
                compatibility: '*',
                processImportFrom: ['local']
            },
            prod: {
                files: files.cssmin
            },
            dev: {
                files: files.cssmin,
                options: {
                    keepSpecialComments: '*',
                    keepBreaks: true,
                    advanced: false
                }
            }
        },

        // Watch config
        watch: {
            sass: {
                files: files.watch.sass,
                tasks: ['test-css', 'dev-css'],
                options: {
                    interrupt: true
                }
            },

            js: {
                files: files.watch.js,
                tasks: ['test-js', 'dev-js'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    // Load all used tasks
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-lint');

    //
    // Start registering tasks
    //

    // Verifies javascript is valid and standards are honored
    grunt.registerTask(
        'test-js',
        'Tests javascript code for validity',
        ['eslint']
    );

    // Verfies Sass files are valid
    grunt.registerTask(
        'test-css',
        'verifies if the Sass files meet the required standards',
        ['sasslint']
    );

    // Runs all the aforementioned tests in one go. This command is also run
    // before running `dev` or `prod`.
    grunt.registerTask(
        'test',
        'Runs all tests',
        [
            'test-js',
            'test-css'
        ]
    );

    grunt.registerTask(
        'dev-js',
        'Compiles only the Javascript assets (development)',
        [
            'uglify:dev'
        ]
    );

    grunt.registerTask(
        'dev-css',
        'Compiles only the Sass assets (development)',
        [
            'sass:dev',
            'postcss:dev',
            'cssmin:dev'
        ]
    );

    grunt.registerTask(
        'dev',
        'Compiles assets for development',
        [
            'test',
            'dev-css',
            'dev-js'
        ]
    );

    grunt.registerTask(
        'prod',
        'Compiles assets for production',
        [
            // Run tests
            'test',

            // CSS
            'sass:prod',
            'postcss:prod',
            'cssmin:prod',

            // Javascript
            'uglify:prod',

            // Vendor
            'uglify:vendor'
        ]
    );

    // Default is never really called... Right?
    grunt.registerTask('default', 'dev');
};
