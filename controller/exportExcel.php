<?php
require_once '../model/ExcelManager.php';

// export single table
$excelManager = new ExcelManager("profile");

// export multiple table
$tableList = array();
array_push($tableList, "profile");
array_push($tableList, "webuser");

$excelManager->tableList = $tableList;

$excelManager->SetExportColumnSequence("profile", "fullName");
$excelManager->SetExportColumnSequence("profile", "lastName");
$excelManager->SetExportColumnSequence("profile", "firstName");

$excelManager->SetSkipExportColumn("profile", "localation");

// $json_string = $excelManager->GetSkipExportColumn();
// echo json_encode($json_string, JSON_PRETTY_PRINT);

// export the excel in template for the user input data and import after
// default is false
//$excelManager->isTemplate = true;

// outputAsFileType default is xlsx
// default is xlsx
//$excelManager->outputAsFileType = "pdf";

// custom the file name to be export
//$excelManager->filename = "test-excel-export" . date('Y-m-d_His');

// call Export will download directly, cannot see the content
//echo "export ".$excelManager->table." table in ".$excelManager->outputAsFileType." file";

echo $excelManager->Export();
?>