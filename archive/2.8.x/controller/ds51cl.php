<?php

function GetTableStructure(){
	$computerLanguageManager = new ComputerLanguageManager();
    
    return $computerLanguageManager->selectPrimaryKeyList();
}

function CreateData($requestData){
	$computerLanguageManager = new ComputerLanguageManager();
    
	$createRows = new stdClass();
	$createRows = $requestData->Data->Header;
	foreach ($createRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$computerLanguageManager->$columnName = $value;
		}
		$responseArray = $computerLanguageManager->insert();

	}
	return $responseArray;
}

function FindData($requestData){
	$computerLanguageManager = new ComputerLanguageManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
    
	foreach ($updateRows as $keyIndex => $rowItem) {
        foreach ($rowItem as $columnName => $value) {
            $computerLanguageManager->$columnName = $value;
        }
        $responseArray = $computerLanguageManager->select();
        break;
    }
    
	return $responseArray;
}

function GetData($requestData){
	$computerLanguageManager = new ComputerLanguageManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $computerLanguageManager->selectPage($offsetRecords);
    
	return $responseArray;

}

function UpdateData($requestData){
	$computerLanguageManager = new ComputerLanguageManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
	foreach ($updateRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$computerLanguageManager->$columnName = $value;
		}
		$responseArray = $computerLanguageManager->update();

	}
	return $responseArray;
}

function DeleteData($requestData){
	$computerLanguageManager = new ComputerLanguageManager();

	$deleteRows = new stdClass();
	$deleteRows = $requestData->Data->Header;
	foreach ($deleteRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$computerLanguageManager->$columnName = $value;
		}
		$responseArray = $computerLanguageManager->delete();

	}
	return $responseArray;
}

?>