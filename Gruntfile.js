
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
	watch: {
	    scripts: {
		files: ['js/app.js','css/screen.css'],
		tasks: ['jshint','copy'],
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
	grunt.log.writeln("Git Revision: " + rev);
	grunt.file.write('js/model/version.js', 'define(\'model/version\', function () { return '+JSON.stringify({
	    revision: rev[0],
	    date: grunt.template.today()
	})+';});');
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-git-describe');

    grunt.task.registerTask('default', ['bower','git-describe','jshint','cssmin','copy']);
};