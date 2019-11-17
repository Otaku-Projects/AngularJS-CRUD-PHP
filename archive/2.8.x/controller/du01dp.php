<?php
function ExportData($httpRequest){
	$responseArray = array();

	$exportManager = new ExcelManager();
	$exportManager->Initialize();

	$requestData = new stdClass();
	$requestData = $httpRequest; //->Data->Header;
	
	$isTemplate = isset($requestData->IsTemplate) ? $requestData->IsTemplate : false;

	// export multiple table
	$exportManager->AddTable("department");
	
	// set excel header sequence

	//$json_string = $exportManager->GetSkipExportColumn();
	//echo json_encode($json_string, JSON_PRETTY_PRINT);

	// export the excel in template for the user input data and import after
	// default is false
	$exportManager->isTemplate = $isTemplate;

	// outputAsFileType default is xlsx
	// default is xlsx
	//$exportManager->outputAsFileType = "pdf";
	$exportManager->outputAsFileType = $requestData->ExportFileTypeAs;

	// custom the file name to be export, need not include extension
	//$exportManager->filename = "test-excel-export" . date('Y-m-d_His');
	//$exportManager->filename = "Master Table Template";

	// call Export will download directly, cannot see the content
	//echo "export ".$exportManager->table." table in ".$exportManager->outputAsFileType." file";

	$responseArray = $exportManager->Export();
	return $responseArray;
}

function ImportData($httpRequest){
	$responseArray = array();
	$fileExistsInUploadFolder = false;
	$fileExistsInUserFolder = false;

	$importManager = new ExcelManager();
	$importManager->Initialize();
	
	$importManager->AddTable("department");

	$responseArray = Core::CreateResponseArray();

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