<?php
header('Content-Type: application/json');
require_once '../model/FormSubmitManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';
require_once '../model/ProfileManager.php';
require_once '../model/WebuserManager.php';
require_once '../model/ForgetAccountManager.php';

$profileManager = new ProfileManager();
$webuserManager = new WebuserManager();
$securityManager = new SecurityManager();

$forgetAccountManager = new ForgetAccountManager();

//$securityManager = new SecurityManager();
//$securityManager->Initialize();



if(isset($_POST["create"]))
foreach($_POST["create"] as $key => $value) {
	if($profileManager->IsNullOrEmptyString($value))
		continue;

	$profileManager->$key = $value;
	$forgetAccountManager->$key = $value;
}

// validate is profile exists - Start
$profileManager->topRightToken = true;

$profileManager->email = strtolower($profileManager->email);
$responseArray = $profileManager->select();

//echo $forgetAccountManager->requestDateTime;


if($responseArray['affected_rows']>0){
	$profileRecord = $responseArray['data'][0];
	//print_r($profileManager->_);
	$profileManager->_ = $profileRecord;

	//$forgetAccountManager->profileID = $profileRecord['profileID'];
	//$forgetAccountManager->userID = $profileRecord['userID'];
	$forgetAccountManager->notifyEmail = $profileManager->email;
	$forgetAccountManager->profileID = $profileManager->profileID;
	$forgetAccountManager->userID = $profileManager->userID;

	$responseArray = $forgetAccountManager->insert();
	/*
	$profileID = $responseArray['insert_id'];

	$webuserManager->loginID = $profileManager->email;

	$webuserManager->password = $securityManager->Hash($_POST["create"]['password']);
	$webuserManager->isDisabled = "N";
	$webuserManager->permissionID = 4;
	$webuserManager->status = "unactivated";

	$webuserManager->topRightToken = true;
	$responseArray = $webuserManager->insert();
	*/
}
// validate is profile exists - End

echo json_encode($responseArray, JSON_PRETTY_PRINT);
?>