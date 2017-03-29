<?php
header('Content-Type: application/json');
require_once '../model/FormSubmitManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';
require_once '../model/ProductManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$productManager = new ProductManager();
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

$productManager->topRightToken = true;

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
	
	//$productManager->selectStep = $recordPerPage;
	$responseArray = $productManager->selectPage($pageNum);
}
else if($requestType === "count"){
	$responseArray = $productManager->count();
}

echo json_encode($responseArray, JSON_PRETTY_PRINT);
?>