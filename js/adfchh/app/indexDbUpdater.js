define('adfchh/app/indexDbUpdater', [
    'dexie',
    'adfchh/model/unfalldaten-legende',
    'adfchh/view/indexDbLoader',
    'adfchh/model/lat-lon-tile-calc',
], function (Dexie, model, view, tileCalc) {

    'use strict';

    var MIN_COUNT=594272;
    var START_JAHR = 2009;
    //var END_JAHR = 2009;
    var END_JAHR = 2017;

    const UNFALLDB= 'unfalldaten1';
    const UNFALL_TABLE = 'unfalldaten';
    const RAD_TABLE = 'raddaten';
    const DEL_UNFALLDB = [ 'unfalldaten'];

    function convertCSVtoArr(startId, lines) {
        var arr=[];
        for (var i = 1, len = lines.length; i < len; i++) {
            if (lines[i] !== "") {
                var obj = convertLineToObject(lines[i]);
                obj['id'] = startId++;
                arr.push(obj);
            }
        }
        return arr;
    }
    function filterRad(obj) {
        var radArr=[ 3,71,72,81,82,83,85 ];
        var rtn= ((radArr.indexOf(obj.AV2) !== -1) ||
                  (radArr.indexOf(obj.AV1) !== -1));
        return rtn;
    }
    function filterArr(arr, filterFunc) {
        var rtnArr=[];
        for (var i=0, len = arr.length; i< len ; i++) {
            if (filterFunc(arr[i])) {
                rtnArr.push(arr[i]);
            }
        }
        return rtnArr;
    }
    function loadUnfalldaten(arr, unfallDb, jahr, myView) {
        var def=$.Deferred();
        var countPerAdd=1000;
        function addToDb(startVal) {
            var endVal=startVal+countPerAdd;
            var partArr=arr.slice(startVal, endVal);
            console.log('start indexdb', jahr,' ',startVal, new Date());
            if (myView) {
                myView.setText('Fülle IndexDB Jahr '+jahr+ ' von '+END_JAHR+' ('+startVal+' von '+arr.length+' Unfälle)');
                myView.setYearProgress(jahr,(startVal/arr.length)*100,START_JAHR, END_JAHR);
            }
            unfallDb.bulkAdd(partArr).then(function () {
                console.log('stop indexdb', jahr, new Date(), endVal, ' ',arr.length);
                if (endVal >arr.length) {
                    def.resolve();
                } else {
                    addToDb(endVal);
                }
            });
        };
        addToDb(0);
        return def;
    }

    
    function parseGeschlecht( geschl) {
        if (geschl==="m") {
            return 0;
        }
        if (geschl==="w") {
            return 1;
        }
        return -1;
    }
    function parseString(val) {
        return val;
    }
    function parseRichtung( richtung) {
        if (richtung === "absteigend") {
            return 0;
        }
        if (richtung === "aufsteigend") {
            return 1;
        }
        return -1;
    }
    function parseIntArray(arr) {
        var rtn=[];

        if (arguments.length>1) {
            for (var i= 0, len= arguments.length; i< len; i++) {
                var c = parseInt(arguments[i]);
                if (!isNaN(c)) {
                    rtn.push(c);
                }
            }
        }  else {
            for (var i= 0, len= arr.length; i< len; i++) {
                var c = parseInt(arr[i]);
                if (!isNaN(c)) {
                    rtn.push(c);
                }
            }
        }
        return rtn;
    }

    function parseZeit(dateStr, timeStr) {
        var dateArr=dateStr.split("\/");
        var date=new Date();
        date.setMonth(parseInt(dateArr[0])-1, parseInt(dateArr[1]));
        date.setYear(parseInt(dateArr[2]));
        var zeitArr=timeStr.split(":");
        date.setHours(parseInt(zeitArr[0]),parseInt(zeitArr[1]),0);
        return date;
    }
    function parsePerson(f,g,a,z) {
        return {
            'Fahrzeug': parseInt(f),
            'Geschlecht': parseGeschlecht(g),
            'Alter': parseInt(a),
            'Zulassung': z
        };
    }
    
    function convertLineToObject (line ) {
        var field = line.trim().split("\t");
        var rtn={};
        var parseFunc={
            'int': parseInt,
            'float': parseFloat,
            'geschlecht': parseGeschlecht,
            'string': parseString,
            'richtung': parseRichtung,
            'date': parseZeit
        };

        Object.keys(model).forEach(function (key) {
            var mfield= model[key];
            if (!mfield.ignore) {
                var value = null;
                var func = parseInt;
                var dexieName;
                if (mfield.dexieName) {
                    dexieName = mfield.dexieName;
                } else {
                    dexieName = key;
                }
                if (mfield.converter) {
                    func=parseFunc[mfield.converter];
                }
                if (!mfield.fieldNr) {
                    console.error('fieldnr fehlt im model', key, mfield);
                }
                if (mfield.fieldNr.length>0) {
                    if (mfield.fieldNr.length ===1) {
                        value = func(field[mfield.fieldNr[0]]);
                    } else if (mfield.fieldNr.length ===2) {
                        value = func(
                            field[mfield.fieldNr[0]],
                            field[mfield.fieldNr[1]]
                        );
                    } else if (mfield.fieldNr.length ===3) {
                        value = func(
                            field[mfield.fieldNr[0]],
                            field[mfield.fieldNr[1]],
                            field[mfield.fieldNr[2]]
                        );
                    } else if (mfield.fieldNr.length ===4) {
                        value = func(
                            field[mfield.fieldNr[0]],
                            field[mfield.fieldNr[1]],
                            field[mfield.fieldNr[2]],
                            field[mfield.fieldNr[3]]
                        );
                    }
                    rtn[dexieName]=value;
                }
            }
        });
        rtn['tile']=
            tileCalc.lat2tile(rtn['lat'],tileCalc.stdzoom)+'x'+
            tileCalc.lon2tile(rtn['lon'],tileCalc.stdzoom);
        return rtn;
    }
    function fetchUnfalldatenAb(jahr, unfallTbl, radTbl, startId, callback) {
        console.log('load Unfalldaten in IndexDB');
        view.setYearProgress(jahr,0,START_JAHR, END_JAHR);
        view.setText('Downloade Jahr '+jahr+ ' von '+END_JAHR);
        var url='data/Geodaten'+jahr+'anonymisiert.txt';
        return $.ajax({
            'dataType': 'text',
            'url': url,
            'data': {},
            'success': function (fileContent) {
                var lines = fileContent.split("\n");
                view.setText('Konvertiere Jahr '+jahr+ ' von '+END_JAHR+' ('+lines.length+' Unfälle)');
                var arr = convertCSVtoArr(startId, lines);
                loadUnfalldaten(arr, unfallTbl, jahr, view).then( function () {
                    var radArr = filterArr(arr, filterRad);
                    loadUnfalldaten(radArr, radTbl, jahr, null). then( function () {
                        if (jahr<END_JAHR) {
                            jahr++;
                            fetchUnfalldatenAb(jahr, unfallTbl, radTbl, startId + arr.length, callback);
                        } else {
                            callback();
                        }
                    });
                });
            }
        });
                         
    }

    function indexDbUpdater(callback) {
        DEL_UNFALLDB.forEach(function (db) {
            Dexie.delete(db);
        });
        var db = new Dexie(UNFALLDB);
        var databaseStr='id,tile';
        Object.keys(model).forEach(function (key) {
            if (! model[key].ignore) {
                if (model[key].dexieName) {
                    databaseStr = databaseStr + ',' + model[key].dexieName;
                } else if (model[key].searchGroup) {
                    var sgName=model[key].searchGroup;
                    sgName=sgName.replace(' ','');
                    if (databaseStr.indexOf(','+sgName)===-1) {
                        databaseStr = databaseStr + ',' + sgName;
                    }
                } else {
                    databaseStr = databaseStr + ',' + key;
                }
            }
        });
        view.show();
        view.setText('Prüfe Datenbank..');

        var storArr={};
        storArr[UNFALL_TABLE]=databaseStr;
        storArr[RAD_TABLE]=databaseStr;
        
        db.version(1).stores(storArr);
        console.log(storArr);
        db.table(UNFALL_TABLE).count().then(function (count) {
            if (count >= MIN_COUNT) {
                console.log('data loaded count=',count);
                view.hide();
                callback(db.table(UNFALL_TABLE), db.table(RAD_TABLE));
            } else {
                view.setHint('Wenn Sie ihren Browser Cache NICHT löschen, bleiben die Daten später erhalten und müssen nicht erneut geladen werden.');
                fetchUnfalldatenAb(START_JAHR, db.table(UNFALL_TABLE), db.table(RAD_TABLE), 0, function () {
                    view.hide();
                    callback(db.table(UNFALL_TABLE), db.table(RAD_TABLE));
                });
                
            }
        });
    };

    return indexDbUpdater;
                                               
});
