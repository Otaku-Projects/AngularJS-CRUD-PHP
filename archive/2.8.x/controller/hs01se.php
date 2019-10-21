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
    return $senseiManager->selectPrimaryKeyList();
}

function CreateData($requestData){
	$senseiManager = new SenseiManager();
	$createRows = new stdClass();
	$createRows = $requestData->Data->Header;
	foreach ($createRows as $keyIndex => $rowItem) {
		// $senseiManager->Initialize();
		foreach ($rowItem as $columnName => $value) {
			$senseiManager->$columnName = $value;
		}
		$responseArray = $senseiManager->insert();

	}
	return $responseArray;
}

function GetData($requestData){
	$senseiManager = new SenseiManager();
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	//$responseArray = $senseiManager->select();
	$responseArray = $senseiManager->selectPage($offsetRecords);

	// foreach ($createRows as $keyIndex => $rowItem) {
	// 	// $senseiManager->Initialize();
	// 	foreach ($rowItem as $columnName => $value) {
	// 		$senseiManager->$columnName = $value;
	// 	}

	// }
	return $responseArray;

}

function UpdateData($requestData){
	$senseiManager = new SenseiManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
	foreach ($updateRows as $keyIndex => $rowItem) {
		$senseiManager->Initialize();
		foreach ($rowItem as $columnName => $value) {
			$senseiManager->$columnName = $value;
		}
		$responseArray = $senseiManager->update();

	}
	return $responseArray;
}

function DeleteData($requestData){
	$senseiManager = new SenseiManager();

	$deleteRows = new stdClass();
	$deleteRows = $requestData->Data->Header;
	foreach ($deleteRows as $keyIndex => $rowItem) {
		$senseiManager->Initialize();
		foreach ($rowItem as $columnName => $value) {
			$senseiManager->$columnName = $value;
		}
		$responseArray = $senseiManager->delete();

	}
	return $responseArray;
}


?>