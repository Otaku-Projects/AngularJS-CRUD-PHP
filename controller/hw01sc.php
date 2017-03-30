<?php

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

function GetTableStructure(){
	$responseArray = array();
	$spellClassManager = new SpellClass();
    return $spellClassManager->selectPrimaryKeyList();
}

function CreateData($requestData){
	$responseArray = array();
	return $responseArray;
}

function GetData($requestData){
	$spellClassManager = new SpellClass();
	$cardContentManager = new CardContentManager();
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	//$responseArray = $senseiManager->select();
	$responseArray = $spellClassManager->selectPage($offsetRecords);

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