<?php

function GetTableStructure(){
	$thirdPartyManager = new ThirdPartyManager();
    
    return $thirdPartyManager->selectPrimaryKeyList();
}

function GetData($requestData){
	$thirdPartyManager = new ThirdPartyManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $thirdPartyManager->selectPage($offsetRecords);
    
	return $responseArray;

}

?>