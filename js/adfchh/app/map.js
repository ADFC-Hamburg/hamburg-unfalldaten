define('adfchh/app/map', [
    'adfchh/model/map',
    'adfchh/model/unfalldaten-legende',
    'adfchh/view/unfalldaten-popup',
    'jquery',
    'adfchh/model/version',
    'adfchh/view/comment',
    'bootstrap',
    'adfchh/model/searchbox',
    'adfchh/app/indexDbUpdater',
    'adfchh/view/statusbar',
    // not in function
    'bootstrap-typeahead',
], function (model, legende, ufPopup, $, version, comment, bootstrap, searchbox, indexDbUpdater, statusbar) {

       'use strict';
       if(typeof(String.prototype.strip) === 'undefined') {
           String.prototype.strip = function() {
               return String(this).replace(/^\s+|\s+$/g, '');
           };
       }

       var fieldSeparator = '\t',
           map=model.createMap(),
           query = window.location.search.substring(1), 
           queryPairs = query.split('&'), 
           queryJSON = {},
           hits = 0,
           total = 0,
           lowerFilterString,
           filterKey,
           filterOp,
           lowerFilterVal,
           markers = model.newMarker(),
           unfallDb = null,
           lfnr;

                     
       $.each(queryPairs, function() { queryJSON[this.split('=')[0]] = this.split('=')[1]; });

       function openComment(lfnr) {
           map.closePopup();
           comment.open(lfnr);
       }

    var openMarker = 0;
    function createPointLayer() {
       var points = new L.FeatureGroup(null, {
           onEachFeature: function (feature, layer) {
            
               if ( feature.properties.lfnr == lfnr) {
     // hier den Marker merken und dann spaeter oeffnen
                   openMarker = layer;
                   layer.openPopup(); 
               }
           },
           pointToLayer: function(feature /*, latlng*/) {
//               debugger;
               var t=legende.Typ.icons[feature.properties.typ];
               var c=legende.Kat.color[feature.properties.kat];
//               console.log(c);
               return new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), {
                   icon: L.divIcon({
                       className: 'mmap-marker green '+c,
//                       iconSize:L.point(20, 30),
                       iconAnchor: [14, 30],
                       iconSize: [26, 26],
                       html: '<div class="icon fa '+t+'" /><div class="arrow" />'
                   })
               });
           },
           filter: function(feature) {
               debugger;
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
        return points;
    }
    var points = createPointLayer();
       if (typeof queryJSON.lfnr !== 'undefined') {
           lfnr=queryJSON.lfnr;
           console.log('lfnr', queryJSON.lfnr);
       }

    var markersCallCount=0;
    
    var addCsvMarkers = function() {
        markersCallCount++;
        var callCount=markersCallCount;
        console.log('New addCsvMarks call, no:', callCount);


        hits = 0;
        total = 0;
        var steps=20000;
        //               var max  =82000;
        var max  = 50000;

        var pointsNew = createPointLayer();
        //        594272
        function fillMarkersFromDb(start, callback) {
            
            var end=start+steps;
            if (end>max) {
                end=max;
            }
            var b=map.getBounds();
            console.log('unfallDb.toArray ',start);
            console.log(b.getNorth(), b.getSouth());
            function handleArrayResult(items) {
                if (callCount<markersCallCount) {
                    console.log('cancel old FillMarkers', callCount);
                    return;
                }
                
                items.forEach(function (item) {
                    if (callCount<markersCallCount) {
                        console.log('cancel old FillMarkers', callCount);
                        return;
                    }
                    
                    var t=legende.Typ.icons[item.Typ];
                    var c=legende.Kat.color[item.Kat];
                    var m=new L.Marker([item.lat, item.lon ], {
                        icon: L.divIcon({
                            className: 'mmap-marker green '+c,
                            //                       iconSize:L.point(20, 30),
                            iconAnchor: [14, 30],
                            iconSize: [26, 26],
                            html: '<div class="icon fa '+t+'" /><div class="arrow" />'
                        })
                    });
                    m.id=item.id;
                    m.LfNr=item.LfNr;
                    m.Jahr=item.Jahr
                    var popup='<div>Loading...</div>';
                    m.bindPopup(popup, model.popupOpts);
                    m.on('click', function (e) {
                        ufPopup.click(e, openComment, unfallDb );
                    });
                    m.addTo(pointsNew);
                    if ((item.id % 10000) === 0) {
                        console.log(item);
                    }
                });
                if (callCount<markersCallCount) {
                    console.log('cancel old FillMarkers', callCount);
                    return;
                }
                
                console.log(items.length);
                hits= items.length;
                callback();
            };

            var sFilter=searchbox.getSearchCondition();
            function lonCheck(item) {
                return (item.lon>=b.getWest()) && (item.lon<=b.getEast());
            };
            function latCheck(item) {
                return (item.lat>=b.getSouth()) && (item.lon<=b.getNorth());;
            };
            function latLonCheck(item) {
                return latCheck(item) && lonCheck(item);
            };

            if (sFilter[0]==='*') {
                unfallDb
                    .where('lat').between(b.getSouth(), b.getNorth())
                    .and(lonCheck)
                    .limit(max).toArray(handleArrayResult);
            } else {
                if (sFilter[1] === 'eq') {
                    unfallDb.where(sFilter[0]).equals(sFilter[2])
                        .and(latLonCheck)
                        .limit(max).toArray(handleArrayResult);     
                } else {
                    unfallDb.where(sFilter[0]).notEqual(sFilter[2])
                        .and(latLonCheck)
                        .limit(max).toArray(handleArrayResult);     
                }
            }

        };
            
        console.log('unfallDb.toArray start');
        statusbar.show();
        statusbar.setText('Lade Daten ...');
        statusbar.startProgress();
        fillMarkersFromDb(0, function (){
            console.log('unfallDb.each stop');
            if (callCount<markersCallCount) {
                console.log('cancel old FillMarkersFromDb', callCount);
                return;
            }
            //map.removeLayer(markers);
            markers.addLayer(pointsNew);
            markers.removeLayer(points);
            
            points.clearLayers();
            points= pointsNew;
            statusbar.stopProgress();
            if (hits<max) {
                statusbar.hide();
            } else {
                statusbar.zuVieleDaten();
                statusbar.hideProgress();
            }
            //markers = model.newMarker();
            //markers.addLayer(points);
            //map.addLayer(markers);
            
            if (openMarker !== 0) {
                markers.zoomToShowLayer(openMarker, function () {
                    openMarker.fire('click');
                    openMarker=0;
                });
            }
            if (total > 0) {
                $('#search-results').html('Zeige ' + hits + ' von ' + total + '.');
            }
        });
        return false;
    };


       function arrayToSet(a) {
           var temp = {};
           for (var i = 0; i < a.length; i++)
               temp[a[i]] = true;
           var r = [];
           for (var k in temp)
               r.push(k);
           return r;
       }


       map.addLayer(markers);


    $(document).ready( function() {

        indexDbUpdater( function (newUnfallDb) {
            if (unfallDb == null) {
                unfallDb=newUnfallDb;
                map.on('moveend', addCsvMarkers);
            }
            //var csv="";
               //populateTypeAhead(csv, fieldSeparator);
               //typeAheadSource = arrayToSet(typeAheadSource);
            //$('#filter-string').typeahead({source: typeAheadSource});
            searchbox.setSearchFunc(addCsvMarkers);
            addCsvMarkers();
            
        });

       

    });


});
