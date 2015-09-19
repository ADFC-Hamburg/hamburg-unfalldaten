<!DOCTYPE html>
<html lang="de">
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
            <p id="msg" class="alert alert-warning">Bitte warten, Seite wird geladen. Wenn diese Meldung l&auml;nger hier steht, ist es ein Javascript Fehler.</p>
            <button id="close" type="button" class="btn btn-success" onClick="window.close()">Seite schlie&szlig;en</button>
	</div>
      </div>
    </div>
    <script src="bower_components/requirejs/require.js"></script>
    <script> 
        requirejs(['./js/common'], function (common) {
              requirejs(['app/comment_freigabe']);
            });
    </script>
</body>
</html>
