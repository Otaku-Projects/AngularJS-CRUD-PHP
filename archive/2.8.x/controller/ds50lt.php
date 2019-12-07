<?php

function GetTableStructure(){
	$licenseManager = new LicenseManager();
    
    return $licenseManager->selectPrimaryKeyList();
}

function CreateData($requestData){
	$licenseManager = new LicenseManager();
    
	$createRows = new stdClass();
	$createRows = $requestData->Data->Header;
	foreach ($createRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$licenseManager->$columnName = $value;
		}
		$responseArray = $licenseManager->insert();

	}
	return $responseArray;
}

function FindData($requestData){
	$licenseManager = new LicenseManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
    
	foreach ($updateRows as $keyIndex => $rowItem) {
        foreach ($rowItem as $columnName => $value) {
            $licenseManager->$columnName = $value;
        }
        $responseArray = $licenseManager->select();
        break;
    }
    
	return $responseArray;
}

function GetData($requestData){
	$licenseManager = new LicenseManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $licenseManager->selectPage($offsetRecords);
    
	return $responseArray;

}

function UpdateData($requestData){
	$licenseManager = new LicenseManager();

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
	foreach ($updateRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$licenseManager->$columnName = $value;
		}
		$responseArray = $licenseManager->update();

	}
	return $responseArray;
}

function DeleteData($requestData){
	$licenseManager = new LicenseManager();

	$deleteRows = new stdClass();
	$deleteRows = $requestData->Data->Header;
	foreach ($deleteRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$licenseManager->$columnName = $value;
		}
		$responseArray = $licenseManager->delete();

	}
	return $responseArray;
}

?>