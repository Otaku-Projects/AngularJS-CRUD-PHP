<?php
//require_once '../model/config.php';
require_once '../model/ExcelManager.php';


// export single table
$excelManager = new ExcelManager();

// move uploaded file

$filename = $_FILES['file']['name'];
$filenameWithoutExtension = basename($filename);
$fileExtension = pathinfo($filename, PATHINFO_EXTENSION);

  //$destination = '../temp/upload/' . $filename;
//$destination = '../temp/upload/' . $filenameWithoutExtension .'-'.date('Y-m-d_His') .'.'. $fileExtension;
$destination = BASE_UPLOAD. $filenameWithoutExtension .'-'.date('Y-m-d_His') .'.'. $fileExtension;
  move_uploaded_file( $_FILES['file']['tmp_name'] , $destination );


// export multiple table
$tableList = array();
array_push($tableList, "webuser");
array_push($tableList, "profile");

$excelManager->tableList = $tableList;

echo $excelManager->Import($destination);

//$excelManager->Import();
?>