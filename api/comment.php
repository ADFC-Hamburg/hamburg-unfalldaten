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

/**
Validate an email address.
Provide email address (raw input)
Returns true if the email address has the email 
address format and the domain exists.
See http://www.linuxjournal.com/article/9585?page=0,3
*/
function validEmail($email)
{
   $isValid = "";
   $atIndex = strrpos($email, "@");
    if (is_bool($atIndex) && !$atIndex)
   {
      $isValid = "@ Zeichen nicht gefunden".$atIndex;
   }
   else
   {
      $domain = substr($email, $atIndex+1);
      $local = substr($email, 0, $atIndex);
      $localLen = strlen($local);
      $domainLen = strlen($domain);
      if ($localLen < 1 || $localLen > 64)
      {
         // local part length exceeded
         $isValid = 'Lokaler-Teil zu lang';
      }
      else if ($domainLen < 1 || $domainLen > 255)
      {
         // domain part length exceeded
         $isValid = 'Domain-Teil zu lang';
      }
      else if ($local[0] == '.' || $local[$localLen-1] == '.')
      {
         // local part starts or ends with '.'
         $isValid = 'Der Lokaler-Teil darf nicht mit einem Punkt enden.';
      }
      else if (preg_match('/\\.\\./', $local))
      {
         // local part has two consecutive dots
         $isValid = 'Zwei Punkte im Lokalen Teil nicht erlaubt';
      }
      else if (!preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain))
      {
         // character not valid in domain part
         $isValid = 'Illegales Zeichen im Domainnamen';
      }
      else if (preg_match('/\\.\\./', $domain))
      {
         // domain part has two consecutive dots
         $isValid = 'Domainname hat zwei aufeinanderfolgende Punkte';
      }
      else if
(!preg_match('/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/',
                 str_replace("\\\\","",$local)))
      {
         // character not valid in local part unless 
         // local part is quoted
         if (!preg_match('/^"(\\\\"|[^"])+"$/',
             str_replace("\\\\","",$local)))
         {
            $isValid = 'Lokaler Anteil hat illegale Zeichen';
         }
      }
      if (($isValid == '') && !(checkdnsrr($domain,"MX") || checkdnsrr($domain,"A")))
      {
         // domain not found in DNS
         $isValid = "Domain: $domain nicht im DNS gefunden";
      }
   }
   return $isValid;
}


function validate_field($value, $cfg) {
    $err=array();
    foreach ($cfg as $validator) {
        switch ($validator) {
    	       case "required":
	            if ($value == '') {
		      array_push($err,"Bitte geben Sie einen Wert ein!");
                    }
		    break;
               case "int":
	            if (!is_numeric($value)) {
		      array_push($err,"Bitte geben Sie eine Zahl ein");
		    }
		    break;
               case "email":
	            $val=validEmail($value);
	            if ($val != '') {
		      array_push($err,$val);
		    }
		    break;
	}
    }
    return $err;
}

function validate_array($arr, $cfg) {
   $rtn=array();
   foreach ($cfg as $key => $value) {
      $rtnv=validate_field($arr[$key],$value);
      if (count($rtnv)>0) {
         $rtn[$key]=$rtnv;
      }
   }
  return $rtn;
}

$app = new \Slim\Slim();
$app->post('/new', function () {
    global   $entityManager;
    global   $validation_cfg;
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $val= validate_array(get_object_vars($data),$validation_cfg);
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