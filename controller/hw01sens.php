<?php
header('Content-Type: application/json');
require_once '../model/FormSubmitManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';
require_once '../model/SenseiProfileManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$senseiProfileManager = new SenseiProfileManager();
$securityManager = new SecurityManager();

//$securityManager = new SecurityManager();
//$securityManager->Initialize();

$senseiProfileManager->topRightToken = true;

$pageNum = 1;
$recordPerPage = 10;
$tempPageNum = 0;

$requestType = FormSubmit::POST("requestType");
if(DatabaseManager::IsNullOrEmptyString($requestType))
{
	$requestType = FormSubmit::POST("requestType");
}

if($requestType === "select"){
	$tempPageNum = FormSubmit::POST("select")["pageNum"];
	$tempRecordPerPage = FormSubmit::POST("select")["recordPerPage"];
	if(DatabaseManager::IsNullOrEmptyString($tempPageNum)){
		$pageNum = 1;
	}else{
		$pageNum = intval($tempPageNum);
	}
	
	//$senseiProfileManager->selectStep = $recordPerPage;
	$responseArray = $senseiProfileManager->selectPage($pageNum);
}
else if($requestType === "count"){
	$responseArray = $senseiProfileManager->count();
}

echo json_encode($responseArray, JSON_PRETTY_PRINT);
?>