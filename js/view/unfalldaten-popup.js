define('view/unfalldaten-popup', [
    'model/unfalldaten-legende',
    'jquery',
    'async!https://maps.googleapis.com/maps/api/js?signed_in=true'
], function (legende) {

    'use strict';


    var keysLowerToUpper={};
    function calcKeysToLower() {
        var keys=Object.keys(legende);
        for (var i = 0; i <keys.length; i++) {
            var upper=keys[i];
            var lower=upper.toLowerCase();
            keysLowerToUpper[lower]=upper;
        }
    }
    calcKeysToLower();

    function click(e, openComment) {
        var lfnr=e.target.feature.properties.lfnr;
        var url=window.location.href.split('?')[0]+'?lfnr='+lfnr,
            shareTitle='Fahrradunfall+Nr.+'+lfnr+'+in+2014',
            popupj= $('<div>').addClass('popup-content').append($('<div id="street-view">'));
    
//     var popup = '<div class="popup-content"><div id="street-view"></div>';
        var share='<div class="share">';
        share+='<a href="'+url+'" title="Link zu diesem Marker"><i class="fa fa-link"></i></a>';
        url=encodeURIComponent(url);
        share+='<a href="http://www.facebook.com/sharer.php?u='+url+'&t='+ shareTitle+'" target="_blank" title="Bei Facebook teilen"><i class="fa fa-facebook"></i></a>';
        share+='<a href="http://twitter.com/home?status='+shareTitle+' - '+url+'"  target="_blank" title="Unfallstelle twittern"><i class="fa fa-twitter"></i></a>';
        share+='<a href="mailto:?subject='+shareTitle+'&body='+url+'" title="Per E-Mail weiterleiten"><i class="fa fa-envelope"></i></a>';
        share+='</div>';
        var table=$('<table class="table table-striped table-bordered table-condensed">');
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
                    td.append($('<a>').text('Schreibe den ersten Kommentar!').on('click', function () {openComment(lfnr);}));
                } else {
                    td.append($('<button type="button" class="btn btn-info btn-xs" data-target="#comments">')
      .text('Kommentare')
      .on('click', function () {openComment(lfnr);}));
                }
            }
        });

        table.append($('<tr>').append($('<th>').html('Kommentare'+share)).append(td));

        for (var clave in e.target.feature.properties) {
            var title = keysLowerToUpper[clave];
            if (title === undefined) {
                console.log('undef:', clave, '.');
            }
            var attr = e.target.feature.properties[clave];
            var ignore = false;
            var tooltip = '';
            if (legende[title] !== undefined) {
                if (legende[title].keys !== undefined ) {
                    if (legende[title].keys[attr] !== undefined) {
                        attr=attr+': '+legende[title].keys[attr];
                    }
                }
                if (legende[title].ignore !== undefined) {
                    ignore = legende[title].ignore;
                }
                if (legende[title].descr !== undefined) {
                    tooltip = legende[title].descr;
                }
                    // do this as last operation                                                                                                                                   
                if (legende[title].title !== undefined) {
                    title=legende[title].title;
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

        new google.maps.StreetViewPanorama(
                  document.getElementById('street-view'),
            {
                position: e.target.getLatLng(),
                zoom: 1
            }); 

    }

    return {
        'click':click,
    };
});