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
           allDb = null,
           radDb = null,
           max  = 50000,
           carBtn = $('#car-btn'),
           bikeBtn = $('#bike-btn'),
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
               var t=legende.Typ.icons[feature.properties.typ];
               var c=legende.Kat.color[feature.properties.kat];
               return new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), {
                   icon: L.divIcon({
                       className: 'mmap-marker green '+c,
                       iconAnchor: [14, 30],
                       iconSize: [26, 26],
                       html: '<div class="icon fa '+t+'" /><div class="arrow" />'
                   })
               });
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

    function lonCheck(item, bounds) {
        return (item.lon>=bounds.getWest()) && (item.lon<=bounds.getEast());
    };
    function latCheck(item, bounds) {
        return (item.lat>=bounds.getSouth()) && (item.lon<=bounds.getNorth());;
    };
    function latLonCheck(item, bounds) {
        return latCheck(item, bounds) && lonCheck(item, bounds);
    };
    
    function filterOne(item, sFilter) {
        if (sFilter.id === '*') {
            return true;
        }
        var val=item[sFilter.id];
        if (!Array.isArray(sFilter.val)) {
            sFilter.val=[sFilter.val];
        }
        var rtn=(sFilter.val.indexOf(val) != -1);
        if (sFilter.cmp === 'ne' ) {
            rtn=!rtn;
        }
        return rtn;
    };
    function filterArrFunc(item, arrIn) {
        var arr=arrIn.slice(0);
        var sFilter=arr.shift();
        if (arr.length>0) {
            if (sFilter.comp === 'and') {
                return filterOne(item,sFilter) && filterArrFunc(item, arr);
            } else {
                // comp === 'or'
                return filterOne(item,sFilter) || filterArrFunc(item, arr);
            }
        } else {
            return filterOne(item,sFilter);
        }
    }

    function addCsvMarkers(bounds)  {
        markersCallCount++;
        var callCount=markersCallCount;
        console.log('New addCsvMarks call, no:', callCount);
        hits = 0;
        total = 0;
        var steps=20000;
        //               var max  =82000;


        var pointsNew = createPointLayer();
        //        594272
        function fillMarkersFromDb(bounds, callback) {
            console.log(bounds.getNorth(), bounds.getSouth());
            function handleArrayResult(items) {
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
                            iconAnchor: [14, 30],
                            iconSize: [26, 26],
                            html: '<div class="icon fa '+t+'" /><div class="arrow" />'
                        })
                    });
                    m.id=item.id;
                    m.LfNr=item.LfNr;
                    m.Jahr=item.Jahr;
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

            var sFilterArr=searchbox.getSearchCondition();
            function filterFunc(item) {
                return (latLonCheck(item,bounds) && filterArrFunc(item, sFilterArr));
            }
            
            unfallDb
                .where('lat').between(bounds.getSouth(), bounds.getNorth())
                .and(filterFunc)
                .limit(max).toArray(handleArrayResult);
        };
            
        console.log('unfallDb.toArray start');
        statusbar.show();
        statusbar.setText('Lade Daten ...');
        statusbar.startProgress();
        fillMarkersFromDb(bounds, function (){
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
        });
        return false;
    };

    map.addLayer(markers);

    var oldBounds=null;
    var BOUNDS_PAD=0.3;
    function searchFunc() {
        oldBounds= map.getBounds().pad(BOUNDS_PAD);
        addCsvMarkers(oldBounds);
    };
    function moveFunc() {
        var newBounds=null;
        if (oldBounds === null ) {
            newBounds= map.getBounds().pad(BOUNDS_PAD);
        } else {
            newBounds= map.getBounds();
            if ((oldBounds.contains(newBounds)) && (hits < max)) {
                return;
            } else {
                newBounds= newBounds.pad(BOUNDS_PAD);
            }
        }
        oldBounds= newBounds;
        addCsvMarkers(oldBounds);
    };
    var oldModus='bike';
    function setDbModus(modus) {
        if (modus === oldModus) {
            return;
        }
        oldModus= modus;
        var activeBtn,passiveBtn;
        if (modus == 'car') {
            activeBtn= carBtn;
            passiveBtn = bikeBtn;
            unfallDb = allDb;
        } else {
            passiveBtn= carBtn;
            activeBtn = bikeBtn;
            unfallDb = radDb;
        }
        activeBtn.addClass('btn-dark');
        activeBtn.removeClass('btn-outline-dark');
        passiveBtn.removeClass('btn-dark');
        passiveBtn.addClass('btn-outline-dark');
        searchFunc();
    }
    $(document).ready( function() {

        indexDbUpdater( function (newUnfallDb, newRadDb) {
            if (unfallDb == null) {
                unfallDb=newRadDb;
                allDb= newUnfallDb;
                radDb= newRadDb;
                map.on('moveend', moveFunc);
            }
            searchbox.setSearchFunc(searchFunc);
            searchFunc();
            bikeBtn.click(function (e) {
                e.preventDefault();
                setDbModus('bike');
            });
            carBtn.click(function (e) {
                e.preventDefault();
                setDbModus('car');
            });

        });

       

    });


});
