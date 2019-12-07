<?php

function GetTableStructure(){
	$repositoryManager = new RepositoryManager();
    
    return $repositoryManager->selectPrimaryKeyList();
}

function CreateData($requestData){
	$repositoryManager = new RepositoryManager();
    
	$createRows = new stdClass();
	$createRows = $requestData->Data->Header;
	foreach ($createRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$repositoryManager->$columnName = $value;
		}
		$responseArray = $repositoryManager->insert();

	}
	return $responseArray;
}

function FindData($requestData){
	$repositoryManager = new RepositoryManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
    
	foreach ($updateRows as $keyIndex => $rowItem) {
        foreach ($rowItem as $columnName => $value) {
            $repositoryManager->$columnName = $value;
        }
        $responseArray = $repositoryManager->select();
        break;
    }
    
	return $responseArray;
}

function GetData($requestData){
	$repositoryManager = new RepositoryManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $repositoryManager->selectPage($offsetRecords);
    
	return $responseArray;

}

function UpdateData($requestData){
	$repositoryManager = new RepositoryManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
	foreach ($updateRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$repositoryManager->$columnName = $value;
		}
		$responseArray = $repositoryManager->update();

	}
	return $responseArray;
}

function DeleteData($requestData){
	$repositoryManager = new RepositoryManager();

	$deleteRows = new stdClass();
	$deleteRows = $requestData->Data->Header;
	foreach ($deleteRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$repositoryManager->$columnName = $value;
		}
		$responseArray = $repositoryManager->delete();

	}
	return $responseArray;
}

?>