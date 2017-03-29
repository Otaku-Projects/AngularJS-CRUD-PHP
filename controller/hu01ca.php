<?php
// require_once '../model/DatabaseManager.php';
// require_once '../model/SimpleTableManager.php';
// require_once '../model/ExcelManager.php';

// export single table

// ExportData();

function ExportData($httpRequest){
	$responseArray = array();

	$excelManager = new ExcelManager();
	$excelManager->Initialize();

	$requestData = new stdClass();
	$requestData = $httpRequest; //->Data->Header;

	// export multiple table
	// $tableList = array();
	// array_push($tableList, "profile");
	// array_push($tableList, "webuser");

	// $excelManager->tableList = $tableList;
	// $excelManager->AddTable("Card");
	// $excelManager->AddTable("CardContent");
	// $excelManager->AddTable("CardType");
	// $excelManager->AddTable("SpellClass");
	// $excelManager->AddTable("CardSpellClass");
	
	$excelManager->AddTable("CardContent");

	// $excelManager->SetExportColumnSequence("profile", "fullName");
	// $excelManager->SetExportColumnSequence("profile", "lastName");
	// $excelManager->SetExportColumnSequence("profile", "firstName");

	$excelManager->SetSkipExportColumn("Card", "nameRef");
	$excelManager->SetSkipExportColumn("Card", "descriptionRef");
	$excelManager->SetSkipExportColumn("Card", "cardImage");
	$excelManager->SetSkipExportColumn("Card", "contentImage");

	//$json_string = $excelManager->GetSkipExportColumn();
	//echo json_encode($json_string, JSON_PRETTY_PRINT);

	// export the excel in template for the user input data and import after
	// default is false
	$excelManager->isTemplate = false;

	// outputAsFileType default is xlsx
	// default is xlsx
	//$excelManager->outputAsFileType = "pdf";
	$excelManager->outputAsFileType = $requestData->ExportFileTypeAs;

	// custom the file name to be export, need not include extension
	//$excelManager->filename = "test-excel-export" . date('Y-m-d_His');
	$excelManager->filename = "hu01ca";

	// call Export will download directly, cannot see the content
	//echo "export ".$excelManager->table." table in ".$excelManager->outputAsFileType." file";

	$responseArray = $excelManager->Export();
	return $responseArray;
}

function ImportData($httpRequest){
	$responseArray = array();
	$fileExistsInUploadFolder = false;
	$fileExistsInUserFolder = false;

	$importManager = new ExcelManager();
	$importManager->Initialize();
	$importManager->AddTable("Card");
	$importManager->AddTable("CardContent");
	$importManager->AddTable("CardType");
	$importManager->AddTable("SpellClass");
	$importManager->AddTable("CardSpellClass");

	$responseArray = $importManager->CreateResponseArray();

	$requestData = new stdClass();
	$requestData = $httpRequest; //->Data->Header;

	$fileInfo = new stdClass();

	if(is_array($requestData->FileUploadedResult)){
		$fileInfo = $requestData->FileUploadedResult[0];
	}
	$excelFileLocation = $fileInfo->movedTo;

	// move file to user folder if user is valid
	$userID = "";
	$securityManager = new SecurityManager();

	// if($securityManager->isUserLoggedInBool()){
	// 	$sqlResultData = $securityManager->GetLoginData();
	// 	$userID = $sqlResultData['LOGIN_ID'];

	// 	$destination = BASE_USER_ATTACH . $userID .'/'. $fileInfo->name;
		
	// 	if(file_exists($fileInfo->movedTo))
	// 		$fileExistsInUploadFolder = true;
	// }

	// if($fileExistsInUploadFolder){
	// 	// $path_parts = pathinfo('/www/htdocs/inc/lib.inc.php');

	// 	// echo $path_parts['dirname'], "\n";
	// 	// echo $path_parts['basename'], "\n";
	// 	// echo $path_parts['extension'], "\n";
	// 	// echo $path_parts['filename'], "\n"; // since PHP 5.2.0

	// 	// /www/htdocs/inc
	// 	// lib.inc.php
	// 	// php
	// 	// lib.inc
	// 	$directory = pathinfo($destination);
	// 	if(!file_exists($directory['dirname']))
	// 		mkdir($destination);

	// 	if(rename($fileInfo->movedTo, $destination))
	// 		$excelFileLocation = $destination;
	// }

	if(file_exists($excelFileLocation))
		$fileExistsInUserFolder = true;

	if($fileExistsInUserFolder)
		$responseArray = $importManager->Import($excelFileLocation);

	// if(!$fileExistsInUploadFolder || !$fileExistsInUserFolder)
	// {
	// 	$responseArray['access_status'] = $importManager->access_status["Fail"];
	// 	$responseArray['error'] = "file was found at: $excelFileLocation";
	// }

	return $responseArray;
}
?>