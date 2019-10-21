<?php
header('Content-Type: application/json');
require_once '../model/FormSubmitManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';
require_once '../model/ProfileManager.php';
require_once '../model/WebuserManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$profileManager = new ProfileManager();
$webuserManager = new WebuserManager();
$securityManager = new SecurityManager();

//$securityManager = new SecurityManager();
//$securityManager->Initialize();

if(isset($_POST["create"]))
foreach($_POST["create"] as $key => $value) {
	if(isset($_POST["createDate"])){
		if(!array_key_exists($key, $_POST["createDate"]))
			$profileManager->$key = $value;
	}else{
			$profileManager->$key = $value;
	}
}

if(isset($_POST["createDate"]))
	foreach($_POST["createDate"] as $key => $value) {
		$profileManager->$key = $value;
	}

$profileManager->topRightToken = true;
/*
$profileManager->email = strtolower($profileManager->email);
$profileManager->facebookEmail = $profileManager->email;
*/

$responseArray = $profileManager->insert();

if($responseArray['affected_rows']>0){
	$profileID = $responseArray['insert_id'];

	$webuserManager->loginID = $profileManager->email;

	$webuserManager->password = $securityManager->Hash($_POST["create"]['password']);
	$webuserManager->isDisabled = "N";
	$webuserManager->permissionID = 4;
	$webuserManager->status = "unactivated";

	$webuserManager->topRightToken = true;
	$responseArray = $webuserManager->insert();
}

if($responseArray['insert_id']>0){
	//echo "1";
	$userID = $responseArray['insert_id'];
	$profileManager->profileID = $profileID;
	$profileManager->userID = $userID;

	//echo json_encode($profileManager->_, JSON_PRETTY_PRINT);
	$profileManager->update(true);
}

echo json_encode($responseArray, JSON_PRETTY_PRINT);
?>