define('app/map',['model/unfalldaten-legende',
                  'view/unfalldaten-popup',
		  'jquery',
		  'model/version',
		  'view/comment',
		  'leaflet',
		  'bootstrap',
                  'model/searchbox',
		  'bootstraptypehead',
		  'leafletmarker',
		  'leafletgeocsv',
		  'leaflethash'],function (legende, ufPopup, $,version,comment, L,bootstrap, searchbox) {

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

var dataUrl = 'data/RF_2014_Anonym.txt';                                                                                                                                           
var maxZoom = 18;
var fieldSeparator = '\t';

var baseUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var baseAttribution= 'Karte &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>. ( <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a>)'+"\n"+
			  version.revision+' '+version.date;
var subdomains = 'abc';
var clusterOptions = {showCoverageOnHover: false, maxClusterRadius: 50};
var labelColumn = "Name";

L.Icon.Default.imagePath = 'bower_components/leaflet/dist/images/';

var basemap = new L.TileLayer(baseUrl, {maxZoom: maxZoom, attribution: baseAttribution, subdomains: subdomains});

var center = new L.LatLng(53.5541,10.0193);

var map = new L.Map('map', {center: center, zoom: 10, maxZoom: maxZoom, layers: [basemap]});
var hash = new L.Hash(map);
var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true,
    maxWidth: 310,
};
var query = window.location.search.substring(1), queryPairs = query.split('&'), queryJSON = {};
$.each(queryPairs, function() { queryJSON[this.split('=')[0]] = this.split('=')[1]; });

function openComment(lfnr) {
    map.closePopup();
    comment.open(lfnr);
}

var openMarker = 0;
var points = L.geoCsv (null, {
    firstLineTitles: true,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
	popup="<div>Loading...</div>";
        layer.bindPopup(popup, popupOpts);
	layer.on('click', function (e) {
            ufPopup.click(e, openComment);
        });
	if ( feature.properties.lfnr == lfnr) {
	    // hier den Marker merken und dann spaeter oeffnen
	    openMarker = layer;
	    layer.openPopup(); 
	}
    },
    filter: function(feature, layer) {
        total += 1;
        if (filterKey === '') {
            if (!lowerFilterString) {
                hits += 1;
                return true;
            }
            $.each(feature.properties, function(k, v) {
		var value = v.toLowerCase();
		if (value.indexOf(lowerFilterString) !== -1) {
                    hits += 1;
                    return true;
		}
            });
        } else {
            var fKeys;
            if (Array.isArray(filterKey)) {
                fKeys=filterKey;
            } else {
                fKeys=[filterKey];
            }
            var found=false;
            for (var i = 0; i <fKeys.length; i++) {
                var key=fKeys[i];
                var value=feature.properties[key].toLowerCase().strip();
                if (value === lowerFilterVal) {
                    found=true;
                    break;
                }
            }
            if (filterOp === 'ne') {
                found=!found;
            }
            if (found) {
	        hits += 1;
		return true;
            }
        }
        return false;
    }
});

var hits = 0;
var total = 0;
var lowerFilterString;
var filterKey;
var filterOp;
var lowerFilterVal;
var markers = new L.MarkerClusterGroup();
var dataCsv;
var lfnr;
if (typeof queryJSON.lfnr !== 'undefined') {
    lfnr=queryJSON.lfnr;
    console.log('lfnr',queryJSON.lfnr);
}



var addCsvMarkers = function() {
    hits = 0;
    total = 0;
    $('#search-id option:selected').each(function(){
        var key=this.id;
        var filterString = document.getElementById('filter-string').value;
        if (key === '*') {
            lowerFilterString = filterString.toLowerCase().strip();
            filterKey='';
            filterOp='eq';
            if (filterString) {
                $("#clear").fadeIn();
            } else {
                $("#clear").fadeOut();
            }
        } else if (searchbox.searchGroups[key] !== undefined) {
            filterKey = [];
            for (var i = 0; i < searchbox.searchGroups[key].length; i++) {
                filterKey.push(searchbox.searchGroups[key][i].toLowerCase());
            }
            filterOp=$('#search-op option:selected').prop('id');
            $('#search-value option:selected').each(function(){
                var val=this.id;
                lowerFilterVal= val.toLowerCase().strip();
                $("#clear").fadeIn();
            });
        }  else if (legende[key].keys === undefined) {
            filterKey=key.toLowerCase();
            filterOp=$('#search-op option:selected').prop('id');
            lowerFilterVal= filterString.toLowerCase().strip();
            if (filterString) {
                $("#clear").fadeIn();
            } else {
                $("#clear").fadeOut();
            }
        } else {
            filterKey=key.toLowerCase();
            filterOp=$('#search-op option:selected').prop('id');
            $('#search-value option:selected').each(function(){
                var val=this.id;
                lowerFilterVal= val.toLowerCase().strip();
                $("#clear").fadeIn();
            });
        }
        map.removeLayer(markers);
        points.clearLayers();
        markers = new L.MarkerClusterGroup(clusterOptions);
        points.addData(dataCsv);
        markers.addLayer(points);
        
        map.addLayer(markers);
        
        if (openMarker !== 0) {
            
	    markers.zoomToShowLayer(openMarker, function () {
	        openMarker.fire('click');
	        openMarker=0;
	    });
        }
        if (total > 0) {
            $('#search-results').html("Zeige " + hits + " von " + total + '.');
        }
    });
    return false;
};

$('.form-search').submit(addCsvMarkers);


var typeAheadSource = [];

function arrayToSet(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

function populateTypeAhead(csv, delimiter) {
    var lines = csv.split("\n");
    for (var i = lines.length - 1; i >= 1; i--) {
        var items = lines[i].split(delimiter);
        for (var j = items.length - 1; j >= 0; j--) {
            var item = items[j].strip();
            item = item.replace(/"/g,'');
            if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
                typeAheadSource.push(item);
                var words = item.split(/\W+/);
                for (var k = words.length - 1; k >= 0; k--) {
                    typeAheadSource.push(words[k]);
                }
            }
        }
    }
}


map.addLayer(markers);


$(document).ready( function() {
    $.ajax ({
        type:'GET',
        dataType:'text',
        url: dataUrl,
        contentType: "text/csv; charset=utf-8",
        error: function() {
            alert('Error retrieving csv file');
        },
        success: function(csv) {
            dataCsv = csv;
            populateTypeAhead(csv, fieldSeparator);
            typeAheadSource = arrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});
            addCsvMarkers();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#search-id option[id='*']").prop('selected', true);
        $("#filter-string").val("").focus();
        $('#search-op').fadeOut();
        $('#search-value').fadeOut();
        $("#filter-string").fadeIn();
        addCsvMarkers();
    });

});


});