<?php

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$responseArray = array();

function GetTableStructure(){
	$staffManager = new StaffManager();
    
    return $staffManager->selectPrimaryKeyList();
}

function GetData($requestData){
	$staffManager = new StaffManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $staffManager->selectPage($offsetRecords);
    
	return $responseArray;

}

?>