define('model/unfalldaten-legende',[],function () {

var charKeys =   {
    '0': 'keine',
    '1': 'Kreuzung',
    '2': 'Einm&uuml;ndung',
    '3': 'Grundst&uuml;ckeinfahrt',
    '4': 'Steigung',
    '5': 'Gef&auml;lle',
    '6': 'Kurve'
};
var besoKeys = {
    '0': 'keine',
    '2': 'Schienengleicher Weg&uuml;bergang',
    '3': 'Fu&szlig;g&auml;nger&uuml;berweg',
    '4': 'Fu&szlig;g&auml;ngerfurt',
    '5': 'Haltestelle',
    '6': 'Arbeitsstelle',
    '7': 'verkehrsberuhiger Bereich'
};
var ursKeys = {
    '01':'Alkoholeinflu&szlig;',
    '02':'Einflu&szlig; anderer berauschender (z.B. Drogen, Rauschgift) ',
    '03':'Überm&uuml;dung',
    '04':'Sonstige k&ouml;rperliche oder geistige M&auml;ngel',
    '10':'Benutzung der falschen Fahrbahn  (a.Richtungsfahrbahn) od. verbotsw. Benutzung and. Stra&szlig;enteile',
    '11':'Versto&szlig; gegen das Rechtsfahrgebot',
    '12':'mit &Uuml;berschreiten der H&ouml;chstgeschwindigkeit',
    '13':'in anderen F&auml;llen',
    '14':'Ungen&uuml;gender Sicherheitsabstand',
    '15':'Starkes Bremsen des Vorausfahrenden ohne zwingenden Grund',
    '16':'Unzul&auml;ssiges Rechts&uuml;berholen',
    '17':'&Uuml;berholen trotz Gegenverkehrs',
    '18':'&Uuml;berholen trotz unklarer Verkehrslage',
    '19':'&Uuml;berholen trotz unzureichender Sichtverh&auml;ltnisse',
    '20':'&Uuml;berholen ohne Beachtung des nachfolgenden Verkehrs und/oder ohne rechtz. Ank&uuml;ndigung',
    '21':'Fehler beim Wiedereinordnen nach rechts',
    '22':'Sonstiger Fehler beim &Uuml;berholen (z.B. ungen&uuml;gender Seitenabstand)',
    '23':'Fehler beim &Uuml;berholtwerden',
    '24':'Nichtbeachten des Vorrangs entgegenkommender Fz beim Vorbeifahren an Hindernissen etc.',
    '25':'Nichtbeachten des nachfolgenden Verkehrs beim Vorbeifahren an Hindernissen etc.',
    '26':'Fehlerhaftes Wechseln des Fahrstreifens, Nichtbeachten des Re&szlig;verschlus&szlig;verfahrens',
    '27':'Nicht beachten der Regel ""rechts vor links""',
    '28':'Nichtbeachten der Vorfahrt regelnden Verkehrszeichen',
    '29':'Nichtbeachten der Vorfahrt des durchgehenden Verkehrs auf BAB und Kraftfahrstra&szlig;en',
    '30':'Nichtbeachten der Vorfahrt durch Fz, die aus Feld- und Waldwegen kommen',
    '31':'Nichtbeachten der Verkehrsregelung d. Pol-Bea oder LZA, ausgenommen Pos 39',
    '32':'Nichtbeachten des Vorrangs entgegenkommender Fz (Z 208) ',
    '33':'Nichtbeachten des Vorranges von Schienenfahrzeugen an Bahn&uuml;berg&auml;ngen',
    '35':'Fehler beim Abbiegen (§9), ausgenommen Pos. 33, 40',
    '36':'Fehler beim wenden od. R&uuml;ckw&auml;rtsfahren',
    '37':'Fehler beim Einfahren in den flie&szlig;enden Verkehr',
    '38':'an Fu&szlig;g&auml;nger&uuml;berwegen',
    '39':'an Fu&szlig;g&auml;ngerfurten',
    '40':'beim Abbiegen',
    '41':'an Haltestellen',
    '42':'an anderen Stellen',
    '43':'unzul&auml;ssiges Halten od. Parken',
    '44':'mangelnde Sicherung haltender od. liegengebliebener Fz, Unfallstellen, Kinder- u. Schulbusse',
    '45':'verkehrswidriges Verhalten beim Ein- / Aussteigen, Be- und Entladen',
    '46':'Nichtbeachten der Beleuchtungsvorschriften',
    '47':'&Uuml;berladung, &Uuml;berbesetzung',
    '48':'unzureichend gesicherte Ladung und Fahrzeugteile',
    '49':'Andere Fehler des Fz-F&uuml;hrers',
    '50':'Beleuchtung',
    '51':'Bereifung',
    '52':'Bremsen',
    '53':'Lenkung',
    '54':'Zugvorrorichtung',
    '55':'andere M&auml;ngel',
    '60':'Regleung des Fu&szlig;g&auml;ngerverkehrs durch LZA oder Pol-Bea',
    '61':'auf Fu&szlig;g&auml;nger&uuml;berwegen ohne Regelung durch LZA oder Pol-Bea',
    '62':'in der N&auml;he von Kreuzungen, Einm&uuml;ndungen, LZA oder FG&UUML; bei dichtem Verkehr',
    '63':'durch p&ouml;tzliches Hervortreten hinter Sichthindernissen',
    '64':'ohne auf den Fahrzeugverkehr zu achten',
    '65':'durch sonstiges falsches Verhalten',
    '66':'Nichtbenutzen des Gehweges',
    '67':'Nichtbenutzen der vorgeschriebenen Stra&szlig;enseite',
    '68':'Spielen auf oder neben der fahrbahn',
    '69':'Andere Fehler der Fu&szlig;g&auml;nger',
    '70':'Verunreinigung durch &Ouml;l',
    '71':'Andere Verunreinigung durch Stra&szlig;enbenutzer',
    '72':'Schnee, Eis',
    '73':'Regen',
    '74':'andere Einfl&uuml;sse (u.a. Laub, angeschwemmter Lehm)',
    '75':'Spurrillen im Zusammenhang mit Regen, Schnee oder Eis',
    '76':'Anderer Zustand der Stra&szlig;e',
    '77':'Nicht ordnungsgem&auml;&szlig;er Zustand der Verkehrszeichen od. -einrichtungen',
    '78':'mangelnde Beleuchtung der Stra&szlig;e',
    '79':'mangelhafte Sicherung von Bahn&uuml;berg&auml;ngen',
    '80':'Nebel',
    '81':'Starker Regen, Hagel, Schneegest&ouml;ber usw.',
    '82':'blendende Sonne',
    '83':'Seitenwind',
    '84':'Unwetter oder sonstige Witterungseinfl&uuml;sse',
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
    '11': 'Motorrad &uuml;ber 125 ccm',
    '12': 'Leichtkraftrad / Roller bis 125 ccm',
    '13': 'leichtes Kfz (3/4-Rad) &uuml;ber 50 ccm',
    '15': 'Kraftroller &uuml;ber 125 ccm',
    '21': 'Pkw',
    '22': 'Wohnmobil',
    '31': 'Bus (8-22 Personen)',
    '32': 'Reisebus',
    '33': 'Linienbus',
    '34': 'Schulbus',
    '35': 'Oberleitungsbus',
    '40': 'Liefer-/Lkw bis 3,5t',
    '41': 'Liefer-/Lkw ohne Anh&auml;nger',
    '42': 'Liefer-/Lkw bis 3,5t mit Anh&auml;nger',
    '43': 'Liefer-/Lkw mit Tank',
    '44': 'Liefer-/Lkw &uuml;ber 3,5 t',
    '45': 'Liefer-/Lkw &uuml;ber 3,5 t mit Anh&auml;nger',
    '46': 'Liefer-/Lkw mit Anh&auml;nger',
    '48': 'Liefer-/Lkw mit Tank u. Anh&auml;nger',
    '51': 'Sattelzug ohne Tank',
    '52': 'Sattelzug mit Tank',
    '53': 'Traktor/Gespann',
    '54': 'Zugmaschine ohne Tank',
    '55': 'Zugmaschine mit Tank',
    '57': 'LKW mit Gefahrgut',
    '58': 'LKW mit Spezialgut (Beton u.&auml;.)',
    '59': 'sonstige Kraftfahrzeuge',
    '61': 'Stra&szlig;enbahn, auch Fahrg&auml;ste',
    '62': 'Eisenbahn',
    '71': 'Fahrrad',
    '72': 'Pedelec',
    '81': 'Fu&szlig;g&auml;nger',
    '82': 'Handwagen / Karre',
    '83': 'Tiere',
    '84': 'Fu&szlig;g&auml;nger m. Sport o. Spielger&auml;t',
    '91': 'bespanntes Fuhrwerk',
    '92': 'sonstiges Fahrzeug',
    '93': 'andere Personen',
};
var popupOpt = {
    Kl: {
	title: 'Stra&szlig;enklasse',
	keys: {
	    '1': 'Autobahn',
	    '2': 'Bundesstra&szlig;e',
	    '3': 'Landstra&szlig;e',
	    '4': 'Keisstra&szlig;e',
	    '5': 'Gemeindestra&szlig;e'
	}
    },
    NrBu: {
	title: 'Sta&szlig;ennummer',
	descr: 'Nr. bei BAB oder Bundesstra&szlig;e'
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
	    '2':'au&szlig;erorts',
	}
    },
    Gt: {
	title: 'Tote',
	descr: 'Anzahl bei dem Unfall get&ouml;tete Personen',
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
	    '1':'Zusammensto&szlig; mit anfahrendem/ anhaltendem/ ruhendem Fahrzeug',
	    '2':'Zusammensto&szlig; mit vorausfahrendem/ wartendem Fahrzeug',
	    '3':'Zusammensto&szlig; mit seitlich in gleicher Richtung fahrendem Fahrzeug',
	    '4':'Zusammensto&szlig; mit entgegenkommendem Fahrzeug',
	    '5':'Zusammensto&szlig; mit einbiegendem/ kreuzendem Fahrzeug',
	    '6':'Zusammensto&szlig; zwischen Fahrzeug und Fu&szlig;g&auml;nger',
	    '7':'Aufprall auf Fahrbahnhindernis',
	    '8':'Abkommen von Fahrbahn nach rechts',
	    '9':'Abkommen von Fahrbahn nach links',
	}
    },
    Char1: {
	title: 'Charakteristik 1',
	descr: 'Charakteristik Unfallstelle 1',
	keys: charKeys
    },
    Char2: {
	title: 'Charakteristik 2',
	descr: 'Charakteristik Unfallstelle 2',
	keys: charKeys
    },
	
    Char3: {
	title: 'Charakteristik 3',
	descr: 'Charakteristik Unfallstelle 3',
	keys: charKeys
    },
    Beso1: {
	title: 'Besonderheiten 1',
	descr: 'Besonderheiten Unfallstelle 1',
	keys: besoKeys
    },
    Beso2: {
	title: 'Besonderheiten 2',
	descr: 'Besonderheiten Unfallstelle 2',
	keys: besoKeys
    },
    Beso3: {
	title: 'Besonderheiten 3',
	descr: 'Besonderheiten Unfallstelle 3',
	keys: besoKeys
    },
    LZ: {
	title: 'Ampel',
	descr: 'Lichtzeichenanlage',
	keys: {
	    '0': 'keine',
	    '8': 'im Betrieb',
	    '9': 'au&zlig;er Betrieb',
	}
    },
    L: {
	title: 'Lichtverh&auml;ltnisse',
	fixme: 'unterschied zu Licht',
    },
    SZ: {
	title: 'Stra&szlig;enzustand',
	fixme: 'unterschied zu Str_Zus und was ist Schl&uuml;pfigkeit?',
	keys: {
	    '0': 'trocken',
	    '1': 'nass/feucht',
	    '2': 'winterglatt',
	    '5': 'Schl&uuml;pfigkeit',
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
	    '1': 'Unfall mit Get&ouml;teten',
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
	    '4': '&Uuml;berschreiten-Unfall',
	    '5': 'ruhenden Verkehr',
	    '6': 'Unfall im l&auml;ngsverkehr',
	    '7': 'sonstiger Unfall',
	}
    },
    Urs01: {
	title: 'Hauptunfallursache',
	descr: 'Hauptunfallursache des Hauptunfallverursachers',
	keys: ursKeys,
    },
    Urs02: {
	title: 'weitere Ursache',
	descr: 'weitere Unfallursache des Hauptunfallverursachers',
	keys: ursKeys,
    },
    Urs03: {
	title: 'weitere Ursache',
	descr: 'weitere Unfallursache des Hauptunfallverursachers',
	keys: ursKeys,
    },
    AV1: {
	title: 'Fahrzeug Hauptunfallverursacher',
	keys: avKeys,
    },
    AV2: {
	title: 'Fahrzeug n&auml;chster Unfallbeteiligter',
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
	title: 'Lichtverh&auml;ltnisse',
	keys: {
	    he: 'Tageslicht',
	    dae: 'D&auml;mmerung',
	    wu: 'Dunkelheit',
	}
    },
    Str_Zus: {
	title: 'Stra&szlig;enzustand',
	keys: {
	    tr: 'trocken',
	    na: 'nass',
	    wg: 'winterglatt',
	}
    },
    Bet_01: {
	title: 'Hauptunfallverursacher',
    },
    Bet_02: {
	title: 'n&auml;chster Beteiligter',
    },
    Unf_Typ: {
	descr: 'siehe Typ',
	ignore: true,
    },
    Kz_Bet1: {
	title: 'Kennzeichen Hauptunfallverursacher',
    },
    Kz_Bet2: {
	title: 'Kennzeichen n&auml;chster Beteiligter',
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
