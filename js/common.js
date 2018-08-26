requirejs.config({
    baseUrl: 'js',
    paths: {
        'popper': '../node_modules/popper.js/dist/umd/popper',
        jquery: '../node_modules/jquery/dist/jquery',
        'js.cookie': '../node_modules/js-cookie/src/js.cookie',
        bootstrap: '../node_modules/bootstrap/dist/js/bootstrap.bundle',
        'bootstrap-typeahead': '../node_modules/bootstrap-typeahead/bootstrap-typeahead',
        async: '../node_modules/requirejs-plugins/src/async',
        leaflet: '../node_modules/leaflet/dist/leaflet',
        leafletmarker: '../node_modules/leaflet.markercluster/dist/leaflet.markercluster',
        leaflethash: '../node_modules/leaflet-hash/leaflet-hash',
        leafletgeocsv: 'leaflet.geocsv-src'
    },
    shim: {
        jquery: {
	    exports: '$',
        },
        jquerycookie: {
            deps: ['jquery'],
            exports: '$.cookie',
        },
        leafletmarker: {
            deps: ['leaflet'],
        },
        leaflet: {
	    exports: 'L',
        },
        leaflethash: {
            deps: ['leaflet'],
        },
        leafletgeocsv: {
            deps: ['leaflet'],
        },
        bootstrap: {
            deps: ['jquery'],
        },
        'bootstrap-typeahead': {
            deps: ['bootstrap'],
        }
    }
});
