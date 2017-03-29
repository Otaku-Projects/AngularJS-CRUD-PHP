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

/*
$address = "";
if(isset($_POST["create"]))
foreach($_POST["create"] as $key => $value) {
	if($key == "address"){
		$profileManager->key = join("\n\r",$value);

	}else if($key == "password"){
		$profileManager->key = $value[0];
	}else{
		$profileManager->$key = $value;
	}
}
*/

$profileManager->topRightToken = true;
$webuserManager->topRightToken = true;

$pageNum = 1;
$recordPerPage = 10;
$tempPageNum = 0;

$requestType = FormSubmit::GET("requestType");
if(DatabaseManager::IsNullOrEmptyString($requestType))
{
	$requestType = FormSubmit::POST("requestType");
}

if($requestType === "select"){
	$tempPageNum = FormSubmit::GET("pageNum");
	$tempRecordPerPage = FormSubmit::GET("recordPerPage");
	if(!$webuserManager->IsNullOrEmptyString($tempPageNum)){
		if($tempPageNum>0)
			$pageNum = $tempPageNum;
		else
			$pageNum = 1;
	}
	//$webuserManager->selectStep = $recordPerPage;
	$responseArray = $webuserManager->selectPage($pageNum);
}
else if($requestType === "count"){
	$responseArray = $webuserManager->count();
}




/*
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
*/

echo json_encode($responseArray, JSON_PRETTY_PRINT);
?>