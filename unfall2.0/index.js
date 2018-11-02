var db = new Dexie("unfalldaten");
db.version(1).stores({
    // FIXME aus index=True ermitteln
    unfalldaten: 'id++,LfNr,Jahr,Zeit,lon,lat,Art,Typ,Strassenklasse,Tote,Leichtverletzte,Schwerverletzte,Kategorie,Unfallverursacher.Fahrzeug,ZweiterBeteiligter.Fahrzeug,Unfallverursacher.Alter'
});
//    ,Kl,NrBu,Zif,Gemeinde,OL,Gt,Sv,Lv,Bet,Art,Char1,Char2,Char3,Beso1,Beso2,Beso3,LZ,L,SZ,AHKat,Typ,Urs01,Urs02,Urs03,AV1,AV2,Licht,Str_Zus,Bet_01,Bet_02,Geschl_01,Geschl_02,Alter_01,Alter_02,Unf_Typ,Kz_Bet1,Kz_Bet2,BAB_Km,M,OrdNr,Fahrtrichtung'
var id = 0;
var start_jahr = 2009;
var end_jahr = 2017;


//

var model = [{
    'name': 'LfNr', 
    "converter": "int",
    "fieldnr": [0],
    'index': True,
},{
    "name": 'Jahr',
    "converter": "int",
    "fieldnr": [33],
    'index': True,
},
{
    "name": 'Zeit',
    "converter": "date",
    "fieldnr": [1,2],
},
{
    "name": 'lon', 
    "converter": "float",
    "fieldnr":[4],
},
{
    "name": 'lat', 
    "converter": "float",
    "fieldnr":[5],
},
{
    "name": 'Strassenklasse', 
    "converter": "int",
    "fieldnr":[6],
},
{
    "name": 'Strassennummer',
    "converter": "int",
    "fieldnr":[7],
},
{
    "name": 'Ortsteilnummer',
    "converter": "int",
    "fieldnr": [8],
},
{
    "name": 'Gemeinde',
    "converter": "string",
    "fieldnr":[9],
},
{
    "name": 'Ortslage', 
    "converter": "int",
    "fieldnr":[10],
},
{
    "name": 'Tote', 
    "converter": "int",
    "fieldnr":[11],
},
{
    "name": 'Schwerverletzte', 
    "converter": "int",
    "fieldnr":[12],
},
{
    "name": 'Leichtverletzte', 
    "converter": "int",
    "fieldnr":[13],
},
{
    "name": 'Unfallbeteiligte', 
    "converter": "int",
    "fieldnr":[14],
},
{
    "name": 'Art', 
    "converter": "int",
    "fieldnr":[15],
},
{
    "name": 'Charakteristik',
    "converter": "intArr",
    "fieldnr":[16,17,18],
},
{
    "name": 'Besonderheiten',
    "converter": "intArr",
    "fieldnr":[19,20,21],
},
{
    "name": 'Ampel', 
    "converter": "int",
    "fieldnr":[22],
},
{
    "name": 'Lichtverhaeltnise', 
    "converter": "int",
    "fieldnr":[23],
},
{
    "name": 'StrZustand', 
    "converter": "int",
    "fieldnr":[24],
},
{
    "name": 'AufprallAuf', 
    "converter": "int",
    "fieldnr":[25],
},
{
    "name": 'Kategorie', 
    "converter": "int",
    "fieldnr":[26],
},
{
    "name": 'Typ', 
    "converter": "int",
    "fieldnr":[27],
},
{
    "name": 'Ursachen',
    "converter": "intArr",
    "fieldnr":[28,29,30],
},
{
    "name": 'Unfallverursacher',
    "converter": "person",
    "fieldnr": [31,40,42,45],
},
{
    "name": 'ZweiterBeteiligter',
    "converter": "person",
    "fieldnr": [32,41,43,46],
},
{
    "name": 'Alter', 
    "converter": "int",
    "fieldnr":[43],
},
{
    "name": 'Zulassung',
    "converter": "string",
    "fieldnr":[46],
},
{
    "name": 'BAB_km', 
    "converter": "int",
    "fieldnr":[47],
},
{
    "name": 'BAB_m', 
    "converter": "int",
    "fieldnr":[48],
},
{
    "name": 'Ordnungsnummer', 
    "converter": "int",
    "fieldnr":[49],
},
{
    "name": 'Fahrtrichtung',
    "converter": 'richtung',
    "fieldnr":[50],
}]

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
    debugger;
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
function parseYear() {
    return 'FIXME';
}
function parseDate() {
    return 'FIXME';
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
    field = line.split("\t");
    var date=parseZeit(field[1],field[2]);
    var rtn={};
    var parseFunc={
        'int': parseInt,
        'float': parseFloat,
        'intArr': parseIntArray,
        'geschlecht': parseGeschlecht,
        'string': parseString,
        'richtung': parseRichtung,
        'year': parseYear,
        'date': parseZeit,
        'person': parsePerson,
    };
    model.forEach(function (mfield) {
        var value = null;
        var func=parseFunc[mfield.converter];
        if (mfield.fieldnr.length ===1) {
            value = func(field[mfield.fieldnr[0]]);
        } else if (mfield.fieldnr.length ===2) {
            value = func(
                field[mfield.fieldnr[0]],
                field[mfield.fieldnr[1]]
            );
        } else if (mfield.fieldnr.length ===3) {
            value = func(
                field[mfield.fieldnr[0]],
                field[mfield.fieldnr[1]],
                field[mfield.fieldnr[2]]
            );
        } else if (mfield.fieldnr.length ===4) {
            value = func(
                field[mfield.fieldnr[0]],
                field[mfield.fieldnr[1]],
                field[mfield.fieldnr[2]],
                field[mfield.fieldnr[3]]
            );
        }
        rtn[mfield.name]=value;

    });
    return rtn;
 }
function loadUnfalldaten( fileContent ) {
    var def=$.Deferred();
    var lines = fileContent.split("\n");
    var arr=[];
    console.log('start convert', new Date())
    for (var i = 1, len = lines.length; i < len; i++) {
        if (lines[i] !== "") {
            var obj=convertLineToObject(lines[i]);
            arr.push(obj);
            def.notify(obj.Jahr, i, lines.length)
        }
    }
    console.log('start indexdb', new Date())
    db.unfalldaten.bulkPut(arr).then(function () {
        console.log('stop indexdb', new Date())
        def.resolve();
    });
    return def;
}

function fetchUnfallDatenAb( jahr) {
    var url=`data/Geodaten${jahr}anonymisiert.txt`
    return $.ajax({
        'url': url,
        'data': {},
        'success': function (data) {
            loadUnfalldaten(data).then( function () {
                if (jahr<end_jahr) {
                    jahr++;
                    fetchUnfallDatenAb(jahr);
                }
            });
        },
        'dataType': 'text'
    });
}
fetchUnfallDatenAb(start_jahr);




