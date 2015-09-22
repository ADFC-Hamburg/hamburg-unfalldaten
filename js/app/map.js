define('app/map',['model/unfalldaten-legende',
		  'jquery',
		  'model/version',
		  'view/comment',
		  'leaflet',
		  'bootstrap',
                  'model/searchbox',
		  'bootstraptypehead',
		  'leafletmarker',
		  'leafletgeocsv',
		  'leaflethash',
		  'async!https://maps.googleapis.com/maps/api/js?signed_in=true'],function (popupOpt,$,version,comment, L,bootstrap, searchbox) {

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
	    var lfnr=e.target.feature.properties.lfnr;
	    var url=window.location.href.split("?")[0]+'?lfnr='+lfnr;
	    var shareTitle='Fahrradunfall+Nr.+'+lfnr+'+in+2014';
	    var popupj= $('<div>').addClass('popup-content').append($('<div id="street-view">'));
	   
//	    var popup = '<div class="popup-content"><div id="street-view"></div>';
	    var share='<div class="share">';
	    share+='<a href="'+url+'" title="Link zu diesem Marker"><i class="fa fa-link"></i></a>';
	    url=encodeURIComponent(url);
	    share+='<a href="http://www.facebook.com/sharer.php?u='+url+'&t='+ shareTitle+'" target="_blank" title="Bei Facebook teilen"><i class="fa fa-facebook"></i></a>';
	    share+='<a href="http://twitter.com/home?status='+shareTitle+' - '+url+'"  target="_blank" title="Unfallstelle twittern"><i class="fa fa-twitter"></i></a>';
	    share+='<a href="mailto:?subject='+shareTitle+'&body='+url+'" title="Per E-Mail weiterleiten"><i class="fa fa-envelope"></i></a>';
	    share+='</div>';
	    table=$('<table class="table table-striped table-bordered table-condensed">');
	    var td=$('<td>').text('Suche nach Kommentaren...');

	    $.ajax ({
		type:'GET',
		dataType:'text',
		url: 'api/comment.php/count/'+lfnr,
		error: function() {
		    td.text('Kommentierung zur Zeit deaktiviert');
		},
		success: function(data) {
		    data=JSON.parse(data);
		    td.text(data.published+' Kommentare').append($('<br>'));
		    if (data.waiting>0) {
			if (data.published===0) {
			    td.text(data.waiting+' Kommentare auf Moderation wartend').append($('<br>'));
			} else {
			    var count=data.published+data.waiting;
			    td.text(count+' Kommentare (davon  '+data.waiting+' auf Moderation wartend)').append($('<br>'));
			}
		    }
		    if ((data.published+data.waiting)===0) {
			td.append($('<a>').text('Schreibe den ersten Kommentar!').on('click',function () {openComment(lfnr);}));
		    } else {
			td.append($('<button type="button" class="btn btn-info btn-xs" data-target="#comments">')
				  .text('Kommentare')
				  .on('click',function () {openComment(lfnr);}));
		    }
		}
	    });

	    table.append($('<tr>').append($('<th>').html('Kommentare'+share)).append(td));

            for (var clave in e.target.feature.properties) {
		var title = points.getPropertyTitle(clave).strip();
		var attr = feature.properties[clave];
		var ignore = false;
		var tooltip = '';
		if (popupOpt[title] !== undefined) {
                    if (popupOpt[title].keys !== undefined ) {
			if (popupOpt[title].keys[attr] !== undefined) {
                            attr=attr+': '+popupOpt[title].keys[attr];
			}
                    }
		    if (popupOpt[title].ignore !== undefined) {
			ignore = popupOpt[title].ignore;
		    }
		    if (popupOpt[title].descr !== undefined) {
			tooltip = popupOpt[title].descr;
		    }
                    // do this as last operation                                                                                                                                   
                   if (popupOpt[title].title !== undefined) {
			title=popupOpt[title].title;
                    }
		}
		if (attr.indexOf('http') === 0) {
                    attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
		}
		if ((attr) && (! ignore)) {
                    table.append($('<tr>').html('<th title="'+tooltip+'">'+title+'</th><td>'+attr+'</td>'));
		}
            }
	    popupj.append(table);
	    e.target._popup.setContent(popupj[0]);

	    var panorama = new google.maps.StreetViewPanorama(
		document.getElementById('street-view'),
		{
		    position: e.target.getLatLng(),
		    zoom: 1
		}); 
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
        }  else if (popupOpt[key].keys === undefined) {
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