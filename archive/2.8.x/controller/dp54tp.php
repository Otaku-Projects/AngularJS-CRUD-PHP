<?php

function GetTableStructure(){
	$thirdPartyManager = new ThirdPartyManager();
    
    return $thirdPartyManager->selectPrimaryKeyList();
}

function InquiryData($requestData){
	return FindData($requestData);
}

function FindData($requestData){
	$thirdPartyManager = new ThirdPartyManager();
	$thirdPartyLangManager = new ThirdPartyLangManager();
	$computerLanguageManager = new ComputerLanguageManager();
	$responseArray = Core::CreateResponseArray();
	$responseArrayThirdParty = Core::CreateResponseArray();
	$responseArrayThirdPartyLang = Core::CreateResponseArray();
	$responseArrayComputerLanguage = Core::CreateResponseArray();

	$updateRow = $requestData->InquiryRecord;
	$action = $requestData->InquiryCriteria->Action;
	
	foreach ($updateRow as $columnName => $value) {
		$thirdPartyManager->$columnName = $value;
	}
		
		$responseArrayThirdParty = $thirdPartyManager->select();
		
	if($action == "amend"){
	
		$thirdPartyLangManager->ThirdPartyID = $thirdPartyManager->ThirdPartyID;
		$responseArrayThirdPartyLang = $thirdPartyLangManager->select();
	}
	
	$responseArrayComputerLanguage = $computerLanguageManager->select();
	
    $responseArray["AllAssets"] = array();
    $responseArray["AllAssets"]["thirdParty"] = $responseArrayThirdParty;
    $responseArray["AllAssets"]["thirdPartyLang"] = $responseArrayThirdPartyLang;
    $responseArray["AllAssets"]["computerLanguage"] = $responseArrayComputerLanguage;

    $responseArray["data"] = $responseArray["AllAssets"];

    $responseArray["num_rows"] = count($responseArrayThirdParty["data"]);
    $responseArray["affected_rows"] = $responseArray["num_rows"];
    $responseArray["access_status"] = "OK";

	return $responseArray;
}

function ProcessData($requestData){
	$responseArray = Core::CreateResponseArray();
	$editmode = $requestData->ProcessCriteria->Editmode;
	if($editmode == "create"){
		$responseArray = CreateData($requestData);
	}else if($editmode == "amend"){
		$responseArray = UpdateData($requestData);
	}else if($editmode == "delete"){
		$responseArray = DeleteData($requestData);
	}
	
	return $responseArray;
}

function CreateData($requestData){
	$responseArray = Core::CreateResponseArray();
	$thirdPartyManager = new ThirdPartyManager();

	$createRow = new stdClass();
	$createRow = $requestData->ProcessRecord;
	foreach ($createRow as $columnName => $value) {
		$thirdPartyManager->$columnName = $value;
	}
	$responseArray = $thirdPartyManager->insert();
	$responseArray["processed_message"] = [];
	if($responseArray["access_status"]=="OK"){
		// insert third party lang record
		InsertThirdPartyLang($requestData, $responseArray["insert_id"]);
		array_push($responseArray["processed_message"], "Data created");
	}else{
		array_push($responseArray["processed_message"], "Data create failure");
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
	$responseArray = Core::CreateResponseArray();
	$thirdPartyManager = new ThirdPartyManager();

	$updateRow = new stdClass();
	$updateRow = $requestData->ProcessRecord;
	foreach ($updateRow as $columnName => $value) {
		$thirdPartyManager->$columnName = $value;
	}
	$responseArray = $thirdPartyManager->update();
	$responseArray["processed_message"] = [];
	
	if($responseArray["access_status"]=="OK"){
		// delete thirdPartyLang record
		DeleteThirdPartyLang($thirdPartyManager->ThirdPartyID);
		
		// insert third party lang record
		InsertThirdPartyLang($requestData, $thirdPartyManager->ThirdPartyID);
		
		array_push($responseArray["processed_message"], "Data updated");
	}else{
		array_push($responseArray["processed_message"], "update failure");
	}

	return $responseArray;
}

function InsertThirdPartyLang($requestData, $thirdPartyID){
	$responseArray = Core::CreateResponseArray();
	$thirdPartyLangManager = new ThirdPartyLangManager();
	
	$childRows = new stdClass();
	$childRows = $requestData->ProcessCriteria->ThirdPartyLang;
	$thirdPartyRow = $requestData->ProcessRecord;
	//$thirdPartyID = $thirdPartyRow->ThirdPartyID;
	
	foreach ($childRows as $keyIndex => $rowItem) {
		if(!$rowItem->isSelect)
			continue;
		
		foreach ($rowItem as $columnName => $value) {
			$thirdPartyLangManager->$columnName = $value;
		}
		$thirdPartyLangManager->ThirdPartyID = $thirdPartyID;
		$responseArray = $thirdPartyLangManager->insert();
		
		//print_r($responseArray);
	}
	
    $responseArray["num_rows"] = count($childRows);
    $responseArray["affected_rows"] = $responseArray["num_rows"];
	
	return $responseArray;
}

function DeleteThirdPartyLang($thirdPartyID){
	$responseArray = Core::CreateResponseArray();
	$thirdPartyLangManager = new ThirdPartyLangManager();
	
    $sql_str = "DELETE";
    $sql_str .= " FROM `thirdpartylang`";
    $sql_str .= " WHERE";
	$sql_str .= " ThirdPartyID = " . $thirdPartyID;
	
    $responseArray = $thirdPartyLangManager->runSQL($sql_str);
	
	return $responseArray;
}

function DeleteData($requestData){
	$responseArray = Core::CreateResponseArray();
	$responseArrayChild = Core::CreateResponseArray();
	$thirdPartyManager = new ThirdPartyManager();

	$deleteRow = new stdClass();
	$deleteRow = $requestData->ProcessRecord;
	
	$thirdPartyID = $deleteRow->ThirdPartyID;
	
    $sql_str = "DELETE";
    $sql_str .= " FROM `thirdparty`";
    $sql_str .= " WHERE";
	$sql_str .= " ThirdPartyID = " . $thirdPartyID;
	
    $responseArray = $thirdPartyManager->runSQL($sql_str);
	
	DeleteThirdPartyLang($thirdPartyID);
	
	$responseArray["processed_message"] = [];
	if($responseArray["access_status"]=="OK"){
		array_push($responseArray["processed_message"], "Data deleted");
	}else{
		array_push($responseArray["processed_message"], "Data delete failure");
	}
		
	return $responseArray;
}

?>