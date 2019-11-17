<?php

function GetTableStructure(){
	$webuserManager = new WebuserManager();
    
    return $webuserManager->selectPrimaryKeyList();
}

function InquiryData($requestData){
	return FindData($requestData);
}

function FindData($requestData){
    $responseArray = Core::CreateResponseArray();
	$webuserManager = new WebuserManager();
	
	$userID = $requestData->InquiryCriteria->UserID;
	$loginID = $requestData->InquiryCriteria->LoginID;
	
	$searchRows = $requestData->InquiryRecord;
	foreach ($searchRows as $columnName => $value) {
		$webuserManager->$columnName = $value;
	}
    
    $sql_str = "SELECT UserID, LoginID, Status, IsDisabled, ActivateDate, CreateDate, CreateUser";
    $sql_str .= " FROM `webuser`";
    $sql_str .= " WHERE";
	
	$sql_str .= " IsDisabled = " . $webuserManager->IsDisabled;
	if($userID)
		$sql_str .= " AND UserID LIKE '%$userID%' ";
	if($loginID)
		$sql_str .= " AND LoginID LIKE '%$loginID%' ";
	
	$sql_str .= " ORDER BY UserID ASC ";
    $responseArray = $webuserManager->runSQL($sql_str);
			
	return $responseArray;
}

function GetData($requestData){
    $responseArray = Core::CreateResponseArray();
	$webuserManager = new WebuserManager();
    
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	$responseArray = $webuserManager->selectPage($offsetRecords);
    
	return $responseArray;

}

?>