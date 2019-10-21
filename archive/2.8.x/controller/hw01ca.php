<?php
// header('Content-Type: application/json');
// require_once '../model/FormSubmitManager.php';
// require_once '../model/DatabaseManager.php';
// require_once '../model/SecurityManager.php';
// require_once '../model/ProfileManager.php';
// require_once '../model/WebuserManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

function GetTableStructure(){
	$responseArray = array();
	$cardManager = new CardManager();
    return $cardManager->selectPrimaryKeyList();
}

function CreateData($requestData){
	$responseArray = array();
	return $responseArray;
}

function GetData($requestData){
	$cardManager = new CardManager();
	$cardContentManager = new CardContentManager();
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	//$responseArray = $senseiManager->select();
	$responseArray = $cardManager->selectPage($offsetRecords);

	//  print_r($responseArray['data']);

	// read cardContent table
	foreach ($responseArray['data'] as $key => $value)
	{
		$cardID = $value['cardID'];
		$cardContentManager->cardID = $cardID;

		$itemResponseArray = $cardContentManager->select();

		if( $itemResponseArray['affected_rows'] <=0)
			continue;

		$responseArray['data'][$key]['Items'] = array();
		$responseArray['data'][$key]['Items'] = $itemResponseArray['data'];

		// print_r($responseArray);
		// print_r($itemResponseArray);
	}

	return $responseArray;

}

function UpdateData($requestData){
	$responseArray = array();
	return $responseArray;
}

function DeleteData($requestData){
	$responseArray = array();
	return $responseArray;
}


?>