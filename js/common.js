requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        'js.cookie': '../bower_components/js-cookie/src/js.cookie',
//        leaflet: 'js/lib/leaflet-generated',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        bootstraptypehead: '../bower_components/bootstrap3-typeahead/bootstrap3-typeahead',
        async: '../bower_components/requirejs-plugins/src/async',
        leaflet: '../bower_components/leaflet/dist/leaflet',
        leafletmarker: '../bower_components/leaflet.markercluster/dist/leaflet.markercluster',
        leaflethash: '../bower_components/leaflet-hash/leaflet-hash',
        leafletgeocsv: 'leaflet.geocsv-src'
    },
    shim: {
        jquerycookie: {
            deps: ['jquery'],
            exports: '$.cookie',
        },
        leafletmarker: {
            deps: ['leaflet'],
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
        bootsrtaptypehead: {
            deps: ['bootstrap'],
        }
    }
});