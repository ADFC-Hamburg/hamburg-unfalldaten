
module.exports = function(grunt) {
 
    grunt.initConfig({
        cssmin: {
            css: {
                files: {
                    'css/generated.css':     [
			'bower_components/leaflet/dist/leaflet.css',
			'bower_components/bootstrap/dist/css/bootstrap.min.css',
			'bower_components/leaflet.markercluster/dist/MarkerCluster.css',
			'bower_components/leaflet.markercluster/dist/MarkerCluster.Default.css',
			'bower_components/font-awesome/css/font-awesome.min.css',
			'css/screen.css'
		    ]
                }
            }
        },
        uglify: {
            js: {
                files: {
                    'js/generated.js': [
			'bower_components/jquery/dist/jquery.min.js',
			'bower_components/jquery.cookie/jquery.cookie.js',
			'bower_components/leaflet/dist/leaflet.js',
			'bower_components/bootstrap/dist/js/bootstrap.min.js',
			'bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
			'bower_components/leaflet-hash/leaflet-hash.js',
			'bower_components/bootstrap3-typeahead/bootstrap3-typeahead.js',
			'js/leaflet.geocsv.js',
			'config.js',
			'js/app.js'
		    ]
                }
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
 
    grunt.task.registerTask('default', ['cssmin', 'uglify']);
}