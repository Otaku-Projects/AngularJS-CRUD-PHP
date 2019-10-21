<?php

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

function GetTableStructure(){
	$responseArray = array();
	$cardTypeManager = new CardTypeManager();
    return $cardTypeManager->selectPrimaryKeyList();
}

function CreateData($requestData){
	$responseArray = array();
	return $responseArray;
}

function GetData($requestData){
	$cardTypeManager = new CardTypeManager();
	$cardContentManager = new CardContentManager();
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	//$responseArray = $senseiManager->select();
	$responseArray = $cardTypeManager->selectPage($offsetRecords);

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