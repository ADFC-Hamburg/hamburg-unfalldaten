define('app/map',['model/unfalldaten-legende',
		  'jquery',
		  'jquerycookie',
		  'model/version',
		  'leaflet',
		  'bootstrap',
		  'bootstraptypehead',
		  'leafletmarker',
		  'leafletgeocsv',
		  'leaflethash',
		  'async!https://maps.googleapis.com/maps/api/js?signed_in=true'],function (popupOpt,$,jqc,version,L,bootstrap) {


var dataUrl = 'data/RF_2014_Anonym.txt';                                                                                                                                           
var maxZoom = 18;
var fieldSeparator = '\t';
//var baseUrl = 'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
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


function clearErr() {
    $('#comments').find('.help-block').each(function (ele) {
	$(this).remove();
    });
    $('#comments').find('.form-control-feedback').each(function (ele) {
	$(this).remove();
    });
    $('#comments').find('.has-error').each(function (ele) {
	$(this).removeClass('has-error').removeClass('has-feedback');
    });
    $('#newcommentmsg').hide();
}


function addComment() {
    var data= {
	id:$("#comment-id").val(),
	usr:$("#comment-usr").val(),
	email:$("#comment-email").val(),
	save:$("#comment-save").is(":checked"),
	subject:$("#comment-subject").val(),
	comment:$("#comment-comment").val(),
    };

    if (data.save) {
	$.cookie('adfc_username', data.usr);
	$.cookie('adfc_useremail', data.email);
    } else {
	$.removeCookie('adfc_username');
	$.removeCookie('adfc_useremail');
    }

    $('#comment-send-btn').button("loading");
    clearErr();
    $('#newcomment').hide();
    $.post( "api/comment.php/new", JSON.stringify(data) ).done( function (d) {
	console.log('done',d);
	d=JSON.parse(d);
        $('#comment-send-btn').button("reset");
	if (d.status==1) {
	    $('#comment-send-btn').hide();
	    $('#newcommentmsg').removeClass().addClass('alert alert-success').text("Vielen Dank, der Kommentar wurde gespeichert. Wir melden uns bei Ihnen per E-Mail sobald dieser angezeigt wird.").show();
	} else if (d.status==2) {
	    $('#comment-send-btn').button("reset");
	    $('#newcomment').show();
	    $.map(d.val, function(value, index) {
		var obj=$('#fg-'+index);
		obj.addClass("has-error").addClass("has-feedback").append($('<span>').addClass('glyphicon glyphicon-remove form-control-feedback'));
		for (var i = 0; i < value.length; i++) {
		    obj.append($('<span>').addClass("help-block").text(value[i]));
		}
//		console.log(value,index);
	    });
/*	    for (var i = 0; i < d.val.keys().length; i++) {
		var key= d.val.keys()[i];
		console.log(key);
	    }*/
	}
    }).fail(function (jqXHR, textStatus, errorThrown ) {
	$('#newcomment').show();
	$('#comment-send-btn').button("reset");
	console.log('fail', jqXHR, textStatus, errorThrown);
	$('#newcommentmsg').removeClass().addClass('alert alert-danger').text("Leider gab es beim Speichern einen unvorhergesehen Fehler. Bitte informieren Sie den Admin unter: adfc2015@sven.anders.hamburg").show();
    });
}
		      $('#comment-send-btn').on('click', addComment);
function convertDate(date) {
    var pattern = /^(\d\d\d\d)-(\d\d)-(\d\d) .*$/;
    var matches = pattern.exec(date);
    if (!matches) {
        throw new Error("Invalid string: " + date);
    }
    var year = matches[1];
    var month = matches[2];  
    var day = matches[3];
    return day+"."+month+"."+year;
}
function loadComments( lfnr ) {
    $('#oldcomments').text('Lade Kommentare ...');
    $.ajax ({
	type:'GET',
	dataType:'text',
	url: 'api/comment.php/getAll/'+lfnr,
	error: function() {
	    $('#oldcomments').text('Kommentierung zur Zeit wegen eines Fehlers deaktiviert');
	},
	success: function(data) {
	    // FIXME 
	    var comments=JSON.parse(data);
	    var container= $('#oldcomments');
	    container.html('');
	    if (comments.length===0) {
		container.append($('<div>').addClass('alert alert-success').text('Wir haben leider noch keine Kommentare zur Unfallstelle erhalten. Schreibe den ersten Kommentar!'));
	    } else {
		for (var i = 0; i < comments.length; i++) {
		    var comment= comments[i];
		    container.append($('<h4>').text(comment.subject));
		    
		    container.append($('<div id="comment-from">').text('Von '+comment.creator+' am '+convertDate(comment.created.date)+'.'));
		    container.append($('<div id="comment-msg">').text(comment.description));
		    container.append($('<hr>'));
		}
	    }
	}
    });
}

function openComment( id ) {
    map.closePopup();
    clearErr();
    loadComments(id);
    $('#comment-send-btn').show();
    $('#newcomment').show();
    $('#newcommentmsg').text("");
    $('#comment-subject').val('');
    $('#comment-usr').val('');
    $('#comment-email').val('');
    $('#comment-comment').val('');
    if ($.cookie('adfc_username')) {
	$('#comment-usr').val($.cookie('adfc_username'));
	$('#comment-email').val($.cookie('adfc_useremail'));
	$("#comment-save").prop( "checked",true);
    }
    $("#comment-title").text("Kommentare zu Fahrradunfall Nr. "+id+" in 2014");
    $("#comment-id").val(id);
    $("#comments").modal();
}

var openMarker = 0;
var points = L.geoCsv (null, {
    firstLineTitles: true,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
	popup="<div>Loading...</div>";
        layer.bindPopup(popup, popupOpt);
	layer.on('click', function (e) {
	    var lfnr=e.target.feature.properties.lfnr;
	    var url=window.location.href.split("?")[0]+'?lfnr='+lfnr;
	    var shareTitle='Fahrradunfall+Nr.+'+lfnr+'+in+2014';
	    var popupj= $('<div>').addClass('popup-content').append($('<div id="street-view">'));
	   
//	    var popup = '<div class="popup-content"><div id="street-view"></div>';
	    var share='<div class="share">';
	    share+='<a href="'+url+' title="Link zu diesem Marker""><i class="fa fa-link"></i></a>';
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
		    console.log(data);
		    console.log(data.published);
		    td.text(data.published+' Kommentare').append($('<br>'));
		    if (data.waiting>0) {
			var count=data.published+data.waiting;
			td.text(count+' Kommentare (davon  '+data.waiting+' auf Moderation wartend)').append($('<br>'));
		    }
		    if ((data.published+data.waiting)===0) {
			td.append($('<a>').text('Schreibe den ersten Kommentar!').on('click',function () {openComment(lfnr)}));
		    } else {
			td.append($('<button type="button" class="btn btn-info btn-xs" data-target="#comments">')
				  .text('Kommentare')
				  .on('click',function () {openComment(lfnr)}));
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
//	    popupj.append($(popup));
	    e.target._popup.setContent(popupj[0]);

	    var panorama = new google.maps.StreetViewPanorama(
		document.getElementById('street-view'),
		{
		    position: e.target.getLatLng(),
		    zoom: 1
		}); 
/*	    var popup = e.target.getPopup();
	    popup.setContent('<div>hallo</div>');
            popup.update();*/
	});
	if ( feature.properties.lfnr == lfnr) {
	    // hier den Marker merken und dann spaeter oeffnen
	    openMarker = layer;
	    layer.openPopup(); 
	}
    },
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
	if (lowerFilterString.indexOf(':') !== -1) {
	    var lfkey=lowerFilterString.split(':')[0];
	    var lfvalue=lowerFilterString.split(':')[1];
            $.each(feature.properties, function(k, v) {
		var key=k.toLowerCase().strip();
		if (key === lfkey) {
		    var value= v.toLowerCase().strip();
		    if (value === lfvalue) {
			hit = true;
			hits += 1;
			return true;
		    }
		}
	    });
	    
	} else {
            $.each(feature.properties, function(k, v) {
		var value = v.toLowerCase();
		if (value.indexOf(lowerFilterString) !== -1) {
                    hit = true;
                    hits += 1;
                    return true;
		}
            });
	}
        return hit;
    }
});

var hits = 0;
var total = 0;
var filterString;
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
    filterString = document.getElementById('filter-string').value;

    if (filterString) {
        $("#clear").fadeIn();
    } else {
        $("#clear").fadeOut();
    }

    map.removeLayer(markers);
    points.clearLayers();

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataCsv);
    markers.addLayer(points);

    map.addLayer(markers);
/*    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }*/

    if (openMarker !== 0) {

	markers.zoomToShowLayer(openMarker, function () {
	    openMarker.fire('click');
//	    openMarker.openPopup();

	    openMarker=0;
	});
    }
// view-source:http://danzel.github.io/Leaflet.markercluster/example/marker-clustering-zoomtoshowlayer.html

    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};

var typeAheadSource = [];

function ArrayToSet(a) {
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

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
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
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});
            addCsvMarkers();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addCsvMarkers();
    });

});


});