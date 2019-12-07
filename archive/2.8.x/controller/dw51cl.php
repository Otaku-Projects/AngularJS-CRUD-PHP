<?php

function GetTableStructure(){
	$computerLanguageManager = new ComputerLanguageManager();
    
    return $computerLanguageManager->selectPrimaryKeyList();
}

function GetData($requestData){
	$computerLanguageManager = new ComputerLanguageManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $computerLanguageManager->selectPage($offsetRecords);
    
	return $responseArray;

}

?>