<?php
// comment.php
require_once "bootstrap.php";


$validation_cfg = array(
		'subject' => array('required','len>5'),
		'comment' => array('required','len>20'),
		'id' => array('required', 'int'),
		'usr'=> array('required','len>0'),
		'email'=> array('required','email'),
);

$app = new \Slim\Slim();
$app->get('/count/:lfnr', function ($lfnr) {
    global   $entityManager;
    $val=Validator::validate_field($lfnr, ['int']);
    if (sizeof($val)>0) {
	   $app->halt(400, $val[0]);
    }

    $repository = $entityManager->getRepository('Comment');
     $comments = $repository->findBy(array('lfnr' => $lfnr, 'publishpassword' => null));
     $commentsAll = $repository->findBy(array('lfnr' => $lfnr ));

    $out= array(
          'published' => count($comments),
          'waiting' => count($commentsAll)-count($comments)
        );
    
    echo json_encode($out);

});
$app->get('/getAll/:lfnr', function ($lfnr) {
    global   $entityManager;
    $val=Validator::validate_field($lfnr, ['int']);
    if (sizeof($val)>0) {
	   $app->halt(400, $val[0]);
    }
    $repository = $entityManager->getRepository('Comment');
    $comments = $repository->findBy(array('lfnr' => $lfnr, 'publishpassword' => null));
    $out= array();
    foreach ($comments as $comment) {
       $ele= array(
         'id' => $comment->getId(),
	 'subject' => $comment->getSubject(),
	 'description' => $comment->getDescription(),
	 'creator' => $comment->getCreator(),
	 'created' => $comment->getCreated(),
       );
       $out[]= $ele;
    };
    echo json_encode($out);
//     print_r($comments);
});
$app->get('/publish/:id/:pw/:action', function ($id, $pw, $action) {
    global   $entityManager;
    global   $app;
    $val=Validator::validate_field($id, ['int']);
    if (sizeof($val)>0) {
	   $app->halt(400, $val[0]);
    }
    if (($pw === '') || ($pw === null)) {
	   $app->halt(400, 'Passwort fehlt');
    }
    $comment = $entityManager->find('Comment', $id);
    if ($comment === null) {
	   $app->halt(410, 'Kommentar nicht gefunden');
    }
    if ($action == 'true') {
       if ($comment->checkPublishPw('')) {
          $app->halt(409, 'Schon freigegeben');
       }
       if ($comment->publish($pw)) {
           $entityManager->persist($comment);
           $entityManager->flush();
	   $app->halt(200, 'Published');
       } else {
          $app->halt(401, 'Falsches Passwort');
       }
    } else {
       if ($comment->checkPublishPw($pw)) {
           $entityManager->remove($comment);
           $entityManager->flush();
	   $app->halt(200, 'Geloescht');
       } else {
          $app->halt(401, 'Falsches Passwort');
       }
    }

});
$app->post('/new', function () {
    global   $entityManager;
    global   $validation_cfg;
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $val= Validator::validate_array(get_object_vars($data),$validation_cfg);
    if (sizeof($val)>0) {
        $out = array( 
          'status' => 2,
           'val' => $val
        );
    } else {
        $comment = new Comment();
        $comment->setSubject($data->subject);
	$comment->setDescription($data->comment);
        $comment->setCreated(new \DateTime("now"));
        $comment->setCreator($data->usr);
        $comment->setCreatorEmail($data->email);
        $comment->setStatus(1);
        $comment->setLfnr($data->id);
	$pw=$comment->setPublishPassword();
        $entityManager->persist($comment);
        $entityManager->flush();
	$url = 'https://'.$_SERVER["HTTP_HOST"].$request->getRootUri();
	$url=preg_replace('/api\/.*/', '', $url);
	$url.='comment_freigabe.php?id='.$comment->getId().'&pw='.$pw.'&lfnr='.$data->id;
	$jaurl=$url."&action=true";
	$neinurl=$url."&action=false";
	$to      = 'adfc-freigabe@sven.anders.hamburg';
	$subject = '[ADFC-Map] Neuer Kommentar Nr. '.$comment->getId().' Unfallstelle '. $data->id;
	$message = "Bitte den Kommentar freigeben: \r\n".
		 "Von: ".$data->usr." ".$data->email. "\r\n" .
		 "Betreff: ".$data->subject. "\r\n" .
		 $data->comment. "\r\n\r\n" .
		 'Um den Kommentar freizugeben Besuchen Sie bitte die Webseite: '. "\r\n" .
	            $jaurl ."\r\n\r\n" .
		 'Um den Kommentar zu entfernen Besuchen Sie bitte die Webseite: '. "\r\n" .
	            $neinurl ."\r\n\r\n" ;


	$headers = 'From: webmaster@sven.anders.hamburg' . "\r\n" .
	'Reply-To: adfc2015@sven.anders.hamburg' . "\r\n" .
	'X-Mailer: PHP/' . phpversion();

	mail($to, $subject, $message, $headers);

        $out= array(
          'status' => 1,
	  'id' => $comment->getId()
        );
    };
    echo json_encode($out);
//    echo "Created Product with ID " . $comment->getId() . "\n";

});
$app->run();