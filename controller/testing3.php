<?php
$email = "'yourFBac@email.com'";
echo "php version:".phpversion();
echo"<br>";
require_once '../model/WebuserManager.php';

$webuserManager = new WebuserManager();
$testManager = new WebuserManager();
$webuserManager->loginID = $email;

//echo $webuserManager->loginID;

//$testManager->loginID = $webuserManager->loginID;

/*
echo strpos($email, "'");
echo "<br>";
echo strrpos($email, "'");
echo "<br>";
echo strlen($email);
*/
?>