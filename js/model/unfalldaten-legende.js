define('model/unfalldaten-legende', [], function () {

    'use strict';

var charKeys =   {
    '0': 'keine',
    '1': 'Kreuzung',
    '2': 'Einmündung',
    '3': 'Grundstückeinfahrt',
    '4': 'Steigung',
    '5': 'Gefälle',
    '6': 'Kurve'
};
var besoKeys = {
    '0': 'keine',
    '2': 'Schienengleicher Wegübergang',
    '3': 'Fußgängerüberweg',
    '4': 'Fußgängerfurt',
    '5': 'Haltestelle',
    '6': 'Arbeitsstelle',
    '7': 'verkehrsberuhiger Bereich'
};
var ursKeys = {
    '01':'Alkoholeinfluß',
    '02':'Einfluß anderer berauschender (z.B. Drogen, Rauschgift) ',
    '03':'Übermüdung',
    '04':'Sonstige körperliche oder geistige Mängel',
    '10':'Benutzung der falschen Fahrbahn  (a.Richtungsfahrbahn) od. verbotsw. Benutzung and. Straßenteile',
    '11':'Verstoß gegen das Rechtsfahrgebot',
    '12':'mit überschreiten der Höchstgeschwindigkeit',
    '13':'in anderen Fällen',
    '14':'Ungenügender Sicherheitsabstand',
    '15':'Starkes Bremsen des Vorausfahrenden ohne zwingenden Grund',
    '16':'Unzulässiges Rechtsüberholen',
    '17':'Überholen trotz Gegenverkehrs',
    '18':'Überholen trotz unklarer Verkehrslage',
    '19':'Überholen trotz unzureichender Sichtverhältnisse',
    '20':'Überholen ohne Beachtung des nachfolgenden Verkehrs und/oder ohne rechtz. Ankündigung',
    '21':'Fehler beim Wiedereinordnen nach rechts',
    '22':'Sonstiger Fehler beim überholen (z.B. ungenügender Seitenabstand)',
    '23':'Fehler beim Überholtwerden',
    '24':'Nichtbeachten des Vorrangs entgegenkommender Fz beim Vorbeifahren an Hindernissen etc.',
    '25':'Nichtbeachten des nachfolgenden Verkehrs beim Vorbeifahren an Hindernissen etc.',
    '26':'Fehlerhaftes Wechseln des Fahrstreifens, Nichtbeachten des Reßverschlusßverfahrens',
    '27':'Nicht beachten der Regel ""rechts vor links""',
    '28':'Nichtbeachten der Vorfahrt regelnden Verkehrszeichen',
    '29':'Nichtbeachten der Vorfahrt des durchgehenden Verkehrs auf BAB und Kraftfahrstraßen',
    '30':'Nichtbeachten der Vorfahrt durch Fz, die aus Feld- und Waldwegen kommen',
    '31':'Nichtbeachten der Verkehrsregelung d. Pol-Bea oder LZA, ausgenommen Pos 39',
    '32':'Nichtbeachten des Vorrangs entgegenkommender Fz (Z 208) ',
    '33':'Nichtbeachten des Vorranges von Schienenfahrzeugen an Bahnübergängen',
    '35':'Fehler beim Abbiegen (§9), ausgenommen Pos. 33, 40',
    '36':'Fehler beim wenden od. Rückwärtsfahren',
    '37':'Fehler beim Einfahren in den fließenden Verkehr',
    '38':'an Fußgängerüberwegen',
    '39':'an Fußgängerfurten',
    '40':'beim Abbiegen',
    '41':'an Haltestellen',
    '42':'an anderen Stellen',
    '43':'unzulässiges Halten od. Parken',
    '44':'mangelnde Sicherung haltender od. liegengebliebener Fz, Unfallstellen, Kinder- u. Schulbusse',
    '45':'verkehrswidriges Verhalten beim Ein- / Aussteigen, Be- und Entladen',
    '46':'Nichtbeachten der Beleuchtungsvorschriften',
    '47':'Überladung, Überbesetzung',
    '48':'unzureichend gesicherte Ladung und Fahrzeugteile',
    '49':'Andere Fehler des Fz-Führers',
    '50':'Beleuchtung',
    '51':'Bereifung',
    '52':'Bremsen',
    '53':'Lenkung',
    '54':'Zugvorrorichtung',
    '55':'andere Mängel',
    '60':'Regleung des Fußgängerverkehrs durch LZA oder Pol-Bea',
    '61':'auf Fußgängerüberwegen ohne Regelung durch LZA oder Pol-Bea',
    '62':'in der Nähe von Kreuzungen, Einmündungen, LZA oder FGÜ bei dichtem Verkehr',
    '63':'durch pötzliches Hervortreten hinter Sichthindernissen',
    '64':'ohne auf den Fahrzeugverkehr zu achten',
    '65':'durch sonstiges falsches Verhalten',
    '66':'Nichtbenutzen des Gehweges',
    '67':'Nichtbenutzen der vorgeschriebenen Straßenseite',
    '68':'Spielen auf oder neben der fahrbahn',
    '69':'Andere Fehler der Fußgänger',
    '70':'Verunreinigung durch öl',
    '71':'Andere Verunreinigung durch Straßenbenutzer',
    '72':'Schnee, Eis',
    '73':'Regen',
    '74':'andere Einflüsse (u.a. Laub, angeschwemmter Lehm)',
    '75':'Spurrillen im Zusammenhang mit Regen, Schnee oder Eis',
    '76':'Anderer Zustand der Straße',
    '77':'Nicht ordnungsgemäßer Zustand der Verkehrszeichen od. -einrichtungen',
    '78':'mangelnde Beleuchtung der Straße',
    '79':'mangelhafte Sicherung von Bahnübergängen',
    '80':'Nebel',
    '81':'Starker Regen, Hagel, Schneegestöber usw.',
    '82':'blendende Sonne',
    '83':'Seitenwind',
    '84':'Unwetter oder sonstige Witterungseinflüsse',
    '85':'nicht / unzureichend gesicherte Arbeitsstelle auf der Fahrbahn',
    '86':'Wild auf der Fahrbahn',
    '87':'anders Tier auf der Fahrbahn',
    '88':'sonstiges Hinderniss auf der fahrbahn (ausgen. Pos 43, 44)',
    '89':'Sonstige Ursache mit kurzer Beschreibung',
};
var avKeys = {
    '1': 'Moped /Mockis',
    '2': 'Mofa 25',
    '3': 'E-Bikes',
    '4': 'leichtes Kfz (3/4-Rad) bis 50 ccm',
    '11': 'Motorrad über 125 ccm',
    '12': 'Leichtkraftrad / Roller bis 125 ccm',
    '13': 'leichtes Kfz (3/4-Rad) über 50 ccm',
    '15': 'Kraftroller über 125 ccm',
    '21': 'Pkw',
    '22': 'Wohnmobil',
    '31': 'Bus (8-22 Personen)',
    '32': 'Reisebus',
    '33': 'Linienbus',
    '34': 'Schulbus',
    '35': 'Oberleitungsbus',
    '40': 'Liefer-/Lkw bis 3,5t',
    '41': 'Liefer-/Lkw ohne Anhänger',
    '42': 'Liefer-/Lkw bis 3,5t mit Anhänger',
    '43': 'Liefer-/Lkw mit Tank',
    '44': 'Liefer-/Lkw über 3,5 t',
    '45': 'Liefer-/Lkw über 3,5 t mit Anhänger',
    '46': 'Liefer-/Lkw mit Anhänger',
    '48': 'Liefer-/Lkw mit Tank u. Anhänger',
    '51': 'Sattelzug ohne Tank',
    '52': 'Sattelzug mit Tank',
    '53': 'Traktor/Gespann',
    '54': 'Zugmaschine ohne Tank',
    '55': 'Zugmaschine mit Tank',
    '57': 'LKW mit Gefahrgut',
    '58': 'LKW mit Spezialgut (Beton u.ä.)',
    '59': 'sonstige Kraftfahrzeuge',
    '61': 'Straßenbahn, auch Fahrgäste',
    '62': 'Eisenbahn',
    '71': 'Fahrrad',
    '72': 'Pedelec',
    '81': 'Fußgänger',
    '82': 'Handwagen / Karre',
    '83': 'Tiere',
    '84': 'Fußgänger m. Sport o. Spielgerät',
    '91': 'bespanntes Fuhrwerk',
    '92': 'sonstiges Fahrzeug',
    '93': 'andere Personen',
};
var fahrzeugKeys = {
    'BUS' : 'Bus',
    'FG' : 'Fußgänger',
    'KRD': 'Motorrad',
    'LKW': 'LKW',
    'PKW': 'PKW',
    'RF' : 'Radfahrer', 
    'SOF': 'Sonderfahrzeug',
};
var popupOpt = {
    Kl: {
	title: 'Straßenklasse',
	keys: {
	    '1': 'Autobahn',
	    '2': 'Bundesstraße',
	    '3': 'Landstraße',
	    '4': 'Keisstraße',
	    '5': 'Gemeindestraße'
	}
    },
    NrBu: {
	title: 'Staßennummer',
	descr: 'Nr. bei BAB oder Bundesstraße'
    },
    LfNr: {
        title: 'Unfall Nr.',
    },
    Datum: {
        title: 'Datum',
    },
    Zeit: {
        title: 'Zeit',
    },
    Fahrtrichtung: {
        title: 'Fahrtrichtung',
    },

    Zif: {
	title: 'Ortsteilnummer'
    },
    Gemeinde: {
	ignore: true,
    },
    OL: {
	title: 'Ortslage',
	keys: {
	    '1':'innerorts',
	    '2':'außerorts',
	}
    },
    Gt: {
	title: 'Tote',
	descr: 'Anzahl bei dem Unfall getötete Personen',
    },
    Sv: {
	title: 'Schwerverletze',
	descr: 'Anzahl bei dem Unfall scherverletze Personen',
    },
    Lv: {
	title: 'Leichtverletze',
	descr: 'Anzahl bei dem Unfall leichtverletze Personen',
    },
    Bet: {
	title: 'Unfallbeteiligte',
	descr: 'Anzahl der Unfallbeteiligten',
    },
    Art: {
	title: 'Unfallart',
	keys: {
	    '0':'Unfall anderer Art',
	    '1':'Zusammenstoß mit anfahrendem/ anhaltendem/ ruhendem Fahrzeug',
	    '2':'Zusammenstoß mit vorausfahrendem/ wartendem Fahrzeug',
	    '3':'Zusammenstoß mit seitlich in gleicher Richtung fahrendem Fahrzeug',
	    '4':'Zusammenstoß mit entgegenkommendem Fahrzeug',
	    '5':'Zusammenstoß mit einbiegendem/ kreuzendem Fahrzeug',
	    '6':'Zusammenstoß zwischen Fahrzeug und Fußgänger',
	    '7':'Aufprall auf Fahrbahnhindernis',
	    '8':'Abkommen von Fahrbahn nach rechts',
	    '9':'Abkommen von Fahrbahn nach links',
	}
    },
    Char1: {
	title: 'Charakteristik 1',
	descr: 'Charakteristik Unfallstelle 1',
        searchGroup: 'Charakteristik',
	keys: charKeys
    },
    Char2: {
	title: 'Charakteristik 2',
	descr: 'Charakteristik Unfallstelle 2',
        searchGroup: 'Charakteristik',
	keys: charKeys
    },
	
    Char3: {
	title: 'Charakteristik 3',
	descr: 'Charakteristik Unfallstelle 3',
        searchGroup: 'Charakteristik',
	keys: charKeys
    },
    Beso1: {
	title: 'Besonderheiten 1',
        searchGroup: 'Besonderheiten',
	descr: 'Besonderheiten Unfallstelle 1',
	keys: besoKeys
    },
    Beso2: {
	title: 'Besonderheiten 2',
        searchGroup: 'Besonderheiten',
	descr: 'Besonderheiten Unfallstelle 2',
	keys: besoKeys
    },
    Beso3: {
	title: 'Besonderheiten 3',
        searchGroup: 'Besonderheiten',
	descr: 'Besonderheiten Unfallstelle 3',
	keys: besoKeys
    },
    LZ: {
	title: 'Ampel',
	descr: 'Lichtzeichenanlage',
	keys: {
	    '0': 'keine',
	    '8': 'im Betrieb',
	    '9': 'außer Betrieb',
	}
    },
    L: {
	title: 'Lichtverhältnisse',
	fixme: 'unterschied zu Licht',
    },
    SZ: {
	title: 'Straßenzustand',
	fixme: 'unterschied zu Str_Zus und was ist Schlüpfigkeit?',
	keys: {
	    '0': 'trocken',
	    '1': 'nass/feucht',
	    '2': 'winterglatt',
	    '5': 'Schlüpfigkeit',
	}
    },
    AH: {
	title: 'Aufprall auf Hindernis',
	descr: 'Aufprall auf Hindernis neben der Fahrbahn',
	keys: {
	    '0': 'Baum',
	    '1': 'Mast',
	    '2': 'Widerlager',
	    '3': 'Schutzplanke',
	    '4': 'sonstiges Hindernis',
	    '5': 'kein Aufprall'
	},
    },
    Kat: {
	title: 'Unfallkategorie',
	keys: {
	    '1': 'Unfall mit Getöteten',
	    '2':'Unfall mit Schwerverletzen',
	    '3':'Unfall mit Leichtverletzen',
	    '4':'Unfall mit schw. Sachschaden',	    
	    '5':'sonstiger Sachschadensunfall',
	    '6': 'Unfall unter Einfluss von berauschenden Mitel'
	}
    },
    Typ: {
	title: 'Unfalltyp',
	keys: {
	    '1': 'Fahrunfall',
	    '2': 'Abbiege-Unfall',
	    '3': 'Einbiegen/Kreuzen-Unfall',
	    '4': 'Überschreiten-Unfall',
	    '5': 'ruhenden Verkehr',
	    '6': 'Unfall im längsverkehr',
	    '7': 'sonstiger Unfall',
	}
    },
    Urs01: {
	title: 'Hauptunfallursache',
	descr: 'Hauptunfallursache des Hauptunfallverursachers',
	keys: ursKeys,
    },
    Urs02: {
	title: 'weitere Ursache 1',
        searchGroup: 'weitere Ursachen',
	descr: 'weitere Unfallursache des Hauptunfallverursachers',
	keys: ursKeys,
    },
    Urs03: {
	title: 'weitere Ursache 2',
        searchGroup: 'weitere Ursachen',
	descr: 'weitere Unfallursache des Hauptunfallverursachers',
	keys: ursKeys,
    },
    AV1: {
	title: 'Fahrzeug Hauptunfallverursacher',
	keys: avKeys,
    },
    AV2: {
	title: 'Fahrzeug nächster Unfallbeteiligter',
	keys: avKeys,
    },
    Jahr: {
	ignore: true,
    },
    Mt: {
	ignore: true,
    },
    Tag: {
	ignore: true,
    },
    Licht: {
	title: 'Lichtverhältnisse',
	keys: {
	    he: 'Tageslicht',
	    dae: 'Dämmerung',
	    wu: 'Dunkelheit',
	}
    },
    Str_Zus: {
	title: 'Straßenzustand',
	keys: {
	    tr: 'trocken',
	    na: 'nass',
	    wg: 'winterglatt',
	}
    },
    Bet_01: {
	title: 'Hauptunfallverursacher',
        keys: fahrzeugKeys,
    },
    Bet_02: {
	title: 'nächster Beteiligter',
        keys: fahrzeugKeys,
    },
    Unf_Typ: {
	descr: 'siehe Typ',
	ignore: true,
    },
    Kz_Bet1: {
	title: 'Kennzeichen Hauptunfallverursacher',
    },
    Kz_Bet2: {
	title: 'Kennzeichen nächster Beteiligter',
    },
    BAB_Km: {
	title: 'BAB km',
	ignore: true,
    },
    M: {
	title: 'BAB Meter',
	ignore: true,
    },
    OrdNr: {
	ignore: true,
    },
};

    return popupOpt;
});
