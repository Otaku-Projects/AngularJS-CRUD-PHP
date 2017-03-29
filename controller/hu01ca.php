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
	$excelManager->AddTable("Card");
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
	$excelManager->isTemplate = true;

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

function ImportData(){
	$importManager = new ExcelManager();
	$importManager->Initialize();
}
?>