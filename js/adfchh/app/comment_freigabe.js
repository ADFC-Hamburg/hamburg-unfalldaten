define('adfchh/app/comment_freigabe', [
    'jquery',
    'bootstrap',
], function ($) {

    'use strict';
    var $btn = $('#close');
    $btn.button('loading');
    var param=location.search.replace(/.id=(\d*)&pw=(\w*)&lfnr=\d*&action=(\w*)/, '$1/$2/$3');
    console.log(param);
      
    var dataUrl='api/comment.php/publish/'+param;
    $.ajax ({
        type: 'GET',
        dataType: 'text',
        url: dataUrl,
        error: function() {
            $('#msg').removeClass('alert-warning').addClass('alert-danger').text('API-Fehler: '+e.status+' '+e.responseText);
            $btn.button('reset');
        },
        success: function() {
            $btn.button('reset');
            $('#msg').removeClass('alert-warning').addClass('alert-success').text('Vielen Dank, Ihre Entscheidung wurde gespeichert.');
        }
    });
});