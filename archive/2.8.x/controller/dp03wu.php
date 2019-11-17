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

function ProcessData($requestData){
    $responseArray = Core::CreateResponseArray();
	$webuserManager = new WebuserManager();
    
    $msgList = [];
    
	$userRows = $requestData->ProcessCriteria;
    foreach ($userRows as $index => $userRow){
        foreach ($userRow as $columnName => $value) {
            $webuserManager->$columnName = $value;
        }
        
        $password = generateRandomString(6);
        $hasdPwd = sha1($password);
    
        $sql_str = "Update `webuser`";
        $sql_str .= " SET ";
        $sql_str .= " Password = '".$hasdPwd."'";
        $sql_str .= " WHERE";
        
        $sql_str .= " UserID = " . $webuserManager->UserID;
        
        $responseArray = $webuserManager->runSQL($sql_str);
        if($responseArray["affected_rows"] > 0){
            $msg = "User ID:".$webuserManager->UserID." generated new password as ".$password;
        }else{
            $msg = "User ID:".$webuserManager->UserID." failed to generate new password.";
        }
        
        array_push($msgList, $msg);
    }
    
    $responseArray["processed_message"] = $msgList;
    
	return $responseArray;
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

?>