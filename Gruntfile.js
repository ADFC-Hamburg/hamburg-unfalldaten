
module.exports = function(grunt) {
 
    grunt.initConfig({
	clean: ["fonts", 'css/generated.css', 'js/generated.js', 'bower_components'],
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
	    all: ['Gruntfile.js', 'js/app.js', 'config.js']
	},
	copy: {
	    main: {
		files: [
		    {expand: true, flatten: true, src: ['bower_components/*/fonts/*'], dest: 'fonts/', filter: 'isFile'},
		]
	    },
	},
        cssmin: {
            css: {
		options: {
		    sourceMap:true,
		},
                files: {
                    'css/generated.css':     [
			'bower_components/leaflet/dist/leaflet.css',
			'bower_components/bootstrap/dist/css/bootstrap.css',
			'bower_components/leaflet.markercluster/dist/MarkerCluster.css',
			'bower_components/leaflet.markercluster/dist/MarkerCluster.Default.css',
			'bower_components/font-awesome/css/font-awesome.css',
			'css/screen.css'
		    ]
                }
            }
        },
        uglify: {
            js: {
		options: {
		    sourceMap:true,
		},
                files: {
                    'js/generated.js': [
			'bower_components/jquery/dist/jquery.js',
			'bower_components/jquery.cookie/jquery.cookie.js',
			'bower_components/leaflet/dist/leaflet.js',
			'bower_components/bootstrap/dist/js/bootstrap.js',
			'bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
			'bower_components/leaflet-hash/leaflet-hash.js',
			'bower_components/bootstrap3-typeahead/bootstrap3-typeahead.js',
			'js/leaflet.geocsv.js',
			'js/app.js'
		    ]
                }
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.task.registerTask('default', ['bower','jshint','cssmin', 'uglify','copy']);
};