<?php
header('Content-Type: application/json');
require_once '../model/FormSubmitManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$username = FormSubmit::POST("username");
$password = FormSubmit::POST("password");

//$username = FormSubmit::GET("username");
//$password = FormSubmit::GET("password");

$securityManager = new SecurityManager();
//$securityManager->Initialize();

if($securityManager->isUserLoggedInBool()){
	echo json_encode($securityManager->isUserLoggedIn());
}else{
	echo json_encode($securityManager->doLogin($username, $password));
}


?>