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
                        'node_modules/glyphicons-halflings/css/glyphicons-halflings.css',
                        'node_modules/glyphicons-only-bootstrap/css/bootstrap.css',
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
    grunt.registerTask('unzip-fdss-zip', 'Unzip one Zip file from fragdenstaat.de', function(zipFile) {
        var gruntTaskName= this.name;
        var done = this.async();
        grunt.log.writeln(gruntTaskName + ', '+
                          zipFile);
        var dataDir = process.cwd()+ '/data';
        var extract = require('extract-zip');
        extract(zipFile,{ dir: dataDir}, function (err) {
            if (err) {
                grunt.log.writeln(gruntTaskName + ', '+err);
                done(false);
            } else {
                done();
            }
        });
    });
    grunt.registerTask('download-fdss-zip', 'Download one Zip file from fragdenstaat.de', function(purl,zipFile) {
        var baseurl='https://media.frag-den-staat.de/files/foi/';
        var url=baseurl+ purl;
        var gruntTaskName= this.name;
        grunt.log.writeln(gruntTaskName + ', '+
                                  url+ ' - ' +
                                  zipFile);

        var done = this.async();
        var fs = require('fs');
        var https = require('https');
        var file = fs.createWriteStream(zipFile);
        var request = https.get(url, function(response) {
            console.log("\nstatus code: ", response.statusCode);
            response.pipe(file);
            file.on('finish', function() {
                file.close(function () {
                    grunt.log.writeln(gruntTaskName + 'done');
                    grunt.task.run('unzip-fdss-zip:'+zipFile);
                    done();
                });
            });
        });
        request.on('error', function(err) { // Handle errors
            fs.unlinkSync(zipFile);
            // Delete the file async. (But we don't check the result)
            grunt.log.writeln(gruntTaskName +
                              'failed to download:'+
                              zipFile+
                              ', '+
                              err.message);
            done(false);
        });
    });
    grunt.registerTask('prep-data', 'Download Data from fragdenstaat.de', function() {
        var gruntTaskName= this.name;
        function download(url) {
            var fs = require('fs');
            var path = require('path');
            var zipFile = 'data/' + path.basename(url);

            if (fs.existsSync(zipFile)) {
                grunt.log.writeln(gruntTaskName +
                                  ', file exists, no download: ' +
                                  zipFile);
            } else {
                grunt.task.run('download-fdss-zip:'+url+':'+zipFile);
            }
        }

        var urls=[
            '106840/Geodaten2009_2011anonymisiert.zip',
            '106841/Geodaten2012_2014anonymisiert.zip',
            '106842/Geodaten2015_2017anonymisiert.zip'
        ];
        urls.forEach(download);
    });
    grunt.task.registerTask('default', [ 'git-describe', 'eslint', 'jshint', 'requirejs', 'cssmin', 'copy']);
};
