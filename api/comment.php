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
        $entityManager->persist($comment);
        $entityManager->flush();
        $out= array(
          'status' => 1,
	  'id' => $comment->getId()
        );
    };
    echo json_encode($out);
//    echo "Created Product with ID " . $comment->getId() . "\n";

});
$app->run();