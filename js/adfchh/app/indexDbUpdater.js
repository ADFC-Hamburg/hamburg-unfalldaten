define('adfchh/app/indexDbUpdater', [
    'dexie',
    'adfchh/model/unfalldaten-legende',
    'adfchh/view/indexDbLoader'
], function (Dexie, model, view) {

    'use strict';

    var MIN_COUNT=100;
    var START_JAHR = 2009;
    //var END_JAHR = 2009;
    var END_JAHR = 2017;
    function loadUnfalldaten(fileContent, unfallDb, jahr) {
        var def=$.Deferred();
        var lines = fileContent.split("\n");
        var arr=[];
        view.setText('Konvertiere Jahr '+jahr+ ' von '+END_JAHR+' ('+lines.length+' Unfälle)');
        for (var i = 1, len = lines.length; i < len; i++) {
            if (lines[i] !== "") {
                var obj=convertLineToObject(lines[i]);
                arr.push(obj);
                def.notify(obj.Jahr, i, lines.length)
            }
        }

        var countPerAdd=1000;
        function addToDb(startVal) {
            var endVal=startVal+countPerAdd;
            var partArr=arr.slice(startVal, endVal);
            console.log('start indexdb', jahr,' ',startVal, new Date());
            view.setText('Fülle IndexDB Jahr '+jahr+ ' von '+END_JAHR+' ('+startVal+' von '+lines.length+' Unfälle)');
            view.setYearProgress(jahr,(startVal/lines.length)*100,START_JAHR, END_JAHR);
            unfallDb.bulkAdd(partArr).then(function () {
                console.log('stop indexdb', jahr, new Date(), endVal, ' ',arr.length)
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
        var field = line.split("\t");
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
                } else if (mfield.fieldnr.length ===4) {
                    value = func(
                        field[mfield.fieldNr[0]],
                        field[mfield.fieldNr[1]],
                        field[mfield.fieldNr[2]],
                        field[mfield.fieldNr[3]]
                    );
                }
                rtn[dexieName]=value;
            }
        });
        return rtn;
    }
    function fetchUnfalldatenAb(jahr, unfallDb, callback) {
        console.log('load Unfalldaten in IndexDB');
        view.setYearProgress(jahr,0,START_JAHR, END_JAHR);
        view.setText('Downloade Jahr '+jahr+ ' von '+END_JAHR);
        var url='data/Geodaten'+jahr+'anonymisiert.txt';
        return $.ajax({
            'dataType': 'text',
            'url': url,
            'data': {},
            'success': function (data) {
                loadUnfalldaten(data, unfallDb, jahr).then( function () {
                    if (jahr<END_JAHR) {
                        jahr++;
                        fetchUnfalldatenAb(jahr, unfallDb, callback);
                    } else {
                        callback();
                    }
                    
                });
            }
        });
                         
    }

    function indexDbUpdater(callback) {
        var db = new Dexie("unfalldaten");
        var databaseStr='id++';
        Object.keys(model).forEach(function (key) {
            if (! model[key].ignore) {
                if (model[key].dexieName) {
                    databaseStr = databaseStr + ',' + model[key].dexieName;
                } else {
                    databaseStr = databaseStr + ',' + key;
                }
            }
        });
        view.show();
        db.version(1).stores({
            unfalldaten: databaseStr
        });

        db.unfalldaten.count().then(function (count) {
            if (count >= MIN_COUNT) {
                console.log('data loaded count=',count);
                view.hide();
                callback();
            } else {
                fetchUnfalldatenAb(START_JAHR, db.unfalldaten, function () {
                    view.hide();
                    callback();
                });
                                   
            }
        });
    };


    return indexDbUpdater;
    
});
