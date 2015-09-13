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
$app->get('/test', function () {
phpinfo();
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
	$to      = 'adfc-freigabe@sven.anders.hamburg';
	$subject = '[ADFC-Map] Neuer Kommentar Nr. '.$comment->getId().' Unfallstelle '. $data->id;
	$message = "Bitte den Kommentar freigeben: \r\n".
		 "Von: ".$data->usr." ".$data->email. "\r\n" .
		 "Betreff: ".$data->subject. "\r\n" .
		 $data->comment. "\r\n" .
		 'Bitte besuchen Sie die Webseite: '. "\r\n" .
	            $url ."\r\n" .
		    'um eine Entscheidung zu treffen'. "\r\n";

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