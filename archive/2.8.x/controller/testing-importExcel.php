<?php
//require_once '../model/config.php';
require_once '../model/DatabaseManager.php';
require_once '../model/ExcelManager.php';
require_once '../model/SimpleTableManager.php';

// if(isset($_POST["import"])){
	// export single table
	$excelManager = new ExcelManager();

	// move uploaded file
	// $filename = $_FILES['file']['name'];
	// $filenameWithoutExtension = basename($filename);
	// $fileExtension = pathinfo($filename, PATHINFO_EXTENSION);

	// $destination = BASE_UPLOAD . $filenameWithoutExtension .'-'.date('Y-m-d_His') .'.'. $fileExtension;
	// move_uploaded_file( $_FILES['file']['tmp_name'] , $destination );

	$destination = BASE_UPLOAD . "hu01ca.20160927_173202.xlsx";


	// export multiple table
	// $tableList = array();
	// array_push($tableList, "webuser");
	// array_push($tableList, "profile");

	// $excelManager->tableList = $tableList;

	$excelManager->AddTable("Card");

	$importResult = $excelManager->Import($destination);
// }

echo json_encode($importResult, JSON_PRETTY_PRINT);
?>