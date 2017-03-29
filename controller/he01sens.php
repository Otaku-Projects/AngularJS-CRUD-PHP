<?php
header('Content-Type: application/json');
require_once '../model/FormSubmitManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';
require_once '../model/SenseiProfileManager.php';
require_once '../model/WebuserManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$senseiProfileManager = new SenseiProfileManager();
$webuserManager = new WebuserManager();
$securityManager = new SecurityManager();

//$securityManager = new SecurityManager();
//$securityManager->Initialize();

$address = "";
if(isset($_POST["create"]))
foreach($_POST["create"] as $key => $value) {
	/*
	if($key == "address"){
		$senseiProfileManager->key = join("\n\r",$value);

	}else if($key == "password"){
		$senseiProfileManager->key = $value[0];
	}else{
		$senseiProfileManager->$key = $value;
	}
	*/

	$senseiProfileManager->$key = $value;
}

$senseiProfileManager->topRightToken = true;

$responseArray = $senseiProfileManager->insert();

/*
if($responseArray['affected_rows']>0){
	$profileID = $responseArray['insert_id'];

	$webuserManager->loginID = $senseiProfileManager->email;

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
	$senseiProfileManager->profileID = $profileID;
	$senseiProfileManager->userID = $userID;

	//echo json_encode($senseiProfileManager->_, JSON_PRETTY_PRINT);
	$senseiProfileManager->update(true);
}
*/

echo json_encode($responseArray, JSON_PRETTY_PRINT);
?>