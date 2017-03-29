<?php
// header('Content-Type: application/json');
// require_once '../model/FormSubmitManager.php';
// require_once '../model/DatabaseManager.php';
// require_once '../model/SecurityManager.php';
// require_once '../model/ProfileManager.php';
// require_once '../model/WebuserManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$responseArray = array();

function GetTableStructure(){
	$senseiManager = new SenseiManager();
	$responseArray = array();
	$responseArray["DataColumns"] = $senseiManager->dataSchemaCSharp;
	$responseArray["KeyColumns"] = $senseiManager->getPrimaryKeyName()["data"]["Field"];
	return $responseArray;
}

function GetData($requestData){
	$senseiManager = new SenseiManager();
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;

	$responseArray = $senseiManager->selectPage(1, $offsetRecords);

	// foreach ($createRows as $keyIndex => $rowItem) {
	// 	// $senseiManager->Initialize();
	// 	foreach ($rowItem as $columnName => $value) {
	// 		$senseiManager->$columnName = $value;
	// 	}

	// }
	return $responseArray;

}

?>