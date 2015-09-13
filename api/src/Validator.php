<?php

class Validator {
/**
Validate an email address.
Provide email address (raw input)
Returns true if the email address has the email 
address format and the domain exists.
See http://www.linuxjournal.com/article/9585?page=0,3
*/
private function validEmail($email)
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


public function validate_field($value, $cfg) {
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
	            $val=self::validEmail($value);
	            if ($val != '') {
		      array_push($err,$val);
		    }
		    break;
	       default: 
	            if (preg_match('/^len>(\d*)/',$validator, $found)) {
		      $len=$found[1];
		      if (!(strlen($value)>$len)) {
		            array_push($err,'Geben Sie hier bitte mindestens '.($len+1).' Zeichen ein!');
		      }
		    } else {
		      array_push($err,'Validator nicht gefunden: '.$validator);
		    }
		    
	}
    }
    return $err;
}

public function validate_array($arr, $cfg) {
   $rtn=array();
   foreach ($cfg as $key => $value) {
      $rtnv=self::validate_field($arr[$key],$value);
      if (count($rtnv)>0) {
         $rtn[$key]=$rtnv;
      }
   }
  return $rtn;
}
};
