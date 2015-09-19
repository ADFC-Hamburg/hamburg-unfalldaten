define('app/comment_freigabe',[
                  'jquery',
                  'bootstrap',
                 ],function ($,bootstrap) {

		     "use strict";
		     var $btn=$("#close");
$btn.button('loading');
var param=location.search.replace(/.id=(\d*)&pw=(\w*)&lfnr=\d*&action=(\w*)/,'$1/$2/$3');
console.log(param);
      
var dataUrl='api/comment.php/publish/'+param;
$.ajax ({
    type:'GET',
    dataType:'text',
    url: dataUrl,
    error: function(e) {
        console.log(e);
        $("#msg").removeClass('alert-warning').addClass('alert-danger').text('API-Fehler: '+e.status+' '+e.responseText);
        $btn.button('reset');
    },
    success: function(csv) {
        $btn.button('reset');
        $("#msg").removeClass('alert-warning').addClass('alert-success').text('Vielen Dank, Ihre Entscheidung wurde gespeichert.');
    }
});
		 });