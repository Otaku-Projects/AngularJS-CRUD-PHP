<?php
// header('Content-Type: application/json');
// require_once '../model/FormSubmitManager.php';
// require_once '../model/DatabaseManager.php';
// require_once '../model/SecurityManager.php';
// require_once '../model/ProfileManager.php';
// require_once '../model/WebuserManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

function GetTableStructure(){
	$responseArray = array();
	$cardManager = new CardManager();
	$responseArray["DataColumns"] = $cardManager->dataSchemaCSharp;
	$responseArray["KeyColumns"] = $cardManager->getPrimaryKeyName()["data"]["Field"];
	return $responseArray;
}

function CreateData($requestData){
	$responseArray = array();
	$cardManager = new CardManager();
	$cardContentManager = new CardContentManager();

	$createRows = new stdClass();
	$createRows = $requestData->Data->Header;

	foreach ($createRows as $keyIndex => $rowItem) {
		foreach ($rowItem as $columnName => $value) {
			$cardManager->$columnName = $value;
		}

		$responseArray = $cardManager->insert();

		// insert success
		if($responseArray['affected_rows']){
			// $cardID = $responseArray['insert_id'];
			$cardID = $cardManager->cardID;

			$cardContentManager->Initialize();
			$cardContentManager->cardID = $cardID;
			$cardContentManager->language = "JPN";
			if(property_exists($rowItem, "nameJpn"))
			$cardContentManager->name = $rowItem->nameJpn;
			if(property_exists($rowItem, "contentJpn"))
			$cardContentManager->description = $rowItem->contentJpn;
			$responseArray2 = $cardContentManager->insert();
			//print_r($responseArray2);

			$cardContentManager->Initialize();
			$cardContentManager->cardID = $cardID;
			$cardContentManager->language = "ENG";
			if(property_exists($rowItem, "nameEng"))
			$cardContentManager->name = $rowItem->nameEng;
			if(property_exists($rowItem, "contentEng"))
			$cardContentManager->description = $rowItem->contentEng;
			$responseArray2 = $cardContentManager->insert();
			//print_r($responseArray2);

			$cardContentManager->Initialize();
			$cardContentManager->cardID = $cardID;
			$cardContentManager->language = "CHI";
			if(property_exists($rowItem, "nameChi"))
			$cardContentManager->name = $rowItem->nameChi;
			if(property_exists($rowItem, "contentChi"))
			$cardContentManager->description = $rowItem->contentChi;
			$responseArray2 = $cardContentManager->insert();
			//print_r($responseArray2);
		}
	}
	return $responseArray;
}

function GetData($requestData){
	$cardManager = new CardManager();
	$cardContentManager = new CardContentManager();
	$offsetRecords = 0;
	$offsetRecords = $requestData->Offset;
	$pageNum = $requestData->PageNum;

	//$responseArray = $senseiManager->select();
	$responseArray = $cardManager->selectPage($offsetRecords);

	//  print_r($responseArray['data']);

	// read cardContent table
	foreach ($responseArray['data'] as $key => $value)
	{
		$cardID = $value['cardID'];
		$cardContentManager->cardID = $cardID;

		$itemResponseArray = $cardContentManager->select();

		if( $itemResponseArray['affected_rows'] <=0)
			continue;

		$responseArray['data'][$key]['Items'] = array();
		$responseArray['data'][$key]['Items'] = $itemResponseArray['data'];

		// print_r($responseArray);
		// print_r($itemResponseArray);
	}

	return $responseArray;

}

function UpdateData($requestData){
	$cardManager = new CardManager();

	// print_r($requestData);

	$updateRows = new stdClass();
	$updateRows = $requestData->Data->Header;
	foreach ($updateRows as $keyIndex => $rowItem) {
		$cardManager->Initialize();
		foreach ($rowItem as $columnName => $value) {
			$cardManager->$columnName = $value;
		}
		$responseArray = $cardManager->update();

	}
	return $responseArray;
}

function DeleteData($requestData){
	$cardManager = new CardManager();

	// print_r($requestData);

	$deleteRows = new stdClass();
	$deleteRows = $requestData->Data->Header;
	foreach ($deleteRows as $keyIndex => $rowItem) {
		$cardManager->Initialize();
		foreach ($rowItem as $columnName => $value) {
			$cardManager->$columnName = $value;
		}
		$responseArray = $cardManager->delete();

	}
	return $responseArray;
}


?>