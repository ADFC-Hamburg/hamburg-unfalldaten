
module.exports = function(grunt) {
 
    grunt.initConfig({
        clean: ['fonts', 'css/generated.css', 'js/generated.js', 'dist'],
        bower: {
            install: {
                options: {
                    copy: false,
                    verbose: true,
                },
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            },
        },
        jshint: {
            all: ['Gruntfile.js', 'js/**.js', 'js/*/**.js', 'config.js', '!js/leaflet.geocsv-src.js', '!js/leaflet.geocsv.js' ]
        },
        eslint: {
            target: ['Gruntfile.js', 'js/**.js', 'js/*/**.js', 'config.js', '!js/leaflet.geocsv-src.js', '!js/leaflet.geocsv.js', '!js/adfchh/model/version.js' ]
        },
        copy: {
            fonts: {
                files: [
                    {expand: true, flatten: true, src: ['node_modules/*/fonts/*'], dest: 'fonts/', filter: 'isFile'},
                ]
            },
            images: {
                files: [
                    {expand: true, flatten: true, src: ['./node_modules/leaflet/dist/images/*'], dest: 'images/', filter: 'isFile'},
                ]
            },
            dist: {
                files: [
                    {expand: true, flatten: false, src: ['index.html',
                        'comment_freigabe.php',
                        'api/**',
                        'css/generated.css*',
                        'node_modules/requirejs/require.js',
                        'fonts/*',
                        'data/*',
                        'node_modules/leaflet/dist/images/*'
                    ], dest: 'dist/', filter: 'isFile'},
                ]
            },

        },
        cssmin: {
            css: {
                options: {
                    sourceMap: true,
                },
                files: {
                    'css/generated.css': [
                        'node_modules/leaflet/dist/leaflet.css',
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'node_modules/leaflet.markercluster/dist/MarkerCluster.css',
                        'node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
                        'node_modules/font-awesome/css/font-awesome.css',
                        'css/screen.css'
                    ]
                }
            }
        },
        requirejs: {
            common: {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/common.js',
                    out: 'dist/js/common.js',
                    include: ['jquery', 'bootstrap'],
                }
            },
            map: {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/common.js',
                    out: 'dist/adfchh/app/map.js',
                    name: 'adfchh/app/map',
                    exclude: ['jquery', 'bootstrap'],
                }
            }
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'js/**.js', 'js/*/**.js', 'config.js', '!js/leaflet.geocsv-src.js', '!js/leaflet.geocsv.js' ],
                tasks: ['eslint', 'jshint', 'copy', 'requirejs'],
            }
        },
        'git-describe': {
            options: {
                prop: 'meta.revision'
            },
            me: {}
        },
    });


    grunt.event.once('git-describe', function (rev) {
        grunt.log.writeln('Git Revision: ' + rev);
        var out = 'define(\'adfchh/model/version\', function () { return '+
            JSON.stringify({
                revision: rev[0],
                date: grunt.template.today()
            })+';});';
        grunt.file.write('js/adfchh/model/version.js', out.replace(/\"/g, '\'').replace(/,/g, ', '));
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-git-describe');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.task.registerTask('default', [ 'git-describe', 'eslint', 'jshint', 'requirejs', 'cssmin', 'copy']);
};
