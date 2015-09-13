<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">

    <title>Kommentar-Freigabe</title>

    <link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">


  </head>

  <body role="document">

    <div class="container theme-showcase" role="main">
	<div id="success">
	  <div>
            <h1>Kommentar-Freigabe</h1>
            <p id="msg" class="alert alert-warning">Die Daten werden gespeichert.</p>
            <button id="close" type="button" class="btn btn-success" onClick="window.close()">Seite schlie&szlig;en</button>
	</div>
      </div>

</div>
    <script src="bower_components/jquery/dist/jquery.min.js" ></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script> 
      var $btn=$("#close")
      $btn.button('loading');
      var param=location.search.replace(/.id=(\d*)&pw=(\w*)&lfnr=\d*&action=(\w*)/,'$1/$2/$3');
      console.log(param);
      
      var dataUrl='api/comment.php/publish/'+param;
      $.ajax ({
        type:'GET',
        dataType:'text',
        url: dataUrl,
        error: function(e) {
            $("#msg").removeClass('alert-warning').addClass('alert-danger').text('API-Fehler: '+e.statusText);
        },
        success: function(csv) {
            $btn.button('reset');
            $("#msg").removeClass('alert-warning').addClass('alert-success').text('Vielen Dank, Ihre Entscheidung wurde gespeichert.');
        }
    });
  </script>
</body>
</html>
