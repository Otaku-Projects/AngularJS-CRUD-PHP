<?php

function GetTableStructure(){
	$repositoryManager = new RepositoryManager();
    
    return $repositoryManager->selectPrimaryKeyList();
}

function GetData($requestData){
	$repositoryManager = new RepositoryManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $repositoryManager->selectPage($offsetRecords);
    
	return $responseArray;

}

?>