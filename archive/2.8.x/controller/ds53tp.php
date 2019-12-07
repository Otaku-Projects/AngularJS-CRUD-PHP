<?php

function GetTableStructure(){
	$thirdPartyManager = new ThirdPartyManager();
    
    return $thirdPartyManager->selectPrimaryKeyList();
}

function CreateData($requestData){
	$thirdPartyManager = new ThirdPartyManager();
    
	$createRows = new stdClass();
	$createRows = $requestData->Data->Header;
	foreach ($createRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$thirdPartyManager->$columnName = $value;
		}
		$responseArray = $thirdPartyManager->insert();

	}
	return $responseArray;
}

function FindData($requestData){
	$thirdPartyManager = new ThirdPartyManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
    
	foreach ($updateRows as $keyIndex => $rowItem) {
        foreach ($rowItem as $columnName => $value) {
            $thirdPartyManager->$columnName = $value;
        }
        $responseArray = $thirdPartyManager->select();
        break;
    }
    
	return $responseArray;
}

function GetData($requestData){
	$thirdPartyManager = new ThirdPartyManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $thirdPartyManager->selectPage($offsetRecords);
    
	return $responseArray;

}

function UpdateData($requestData){
	$thirdPartyManager = new ThirdPartyManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
	foreach ($updateRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$thirdPartyManager->$columnName = $value;
		}
		$responseArray = $thirdPartyManager->update();

	}
	return $responseArray;
}

function DeleteData($requestData){
	$thirdPartyManager = new ThirdPartyManager();

	$deleteRows = new stdClass();
	$deleteRows = $requestData->Data->Header;
	foreach ($deleteRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$thirdPartyManager->$columnName = $value;
		}
		$responseArray = $thirdPartyManager->delete();

	}
	return $responseArray;
}

?>