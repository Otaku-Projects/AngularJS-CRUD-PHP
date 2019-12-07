<?php

function GetTableStructure(){
	$licenseManager = new LicenseManager();
    
    return $licenseManager->selectPrimaryKeyList();
}

function GetData($requestData){
	$licenseManager = new LicenseManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $licenseManager->selectPage($offsetRecords);
    
	return $responseArray;

}

?>