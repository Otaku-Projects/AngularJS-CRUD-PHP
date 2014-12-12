<?php
header('Content-Type: application/json');
require_once '../model/SimpleTableManager.php';
require_once '../model/FormSubmitManager.php';

$tableManager = new SimpleTableManager();
$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$tableName = FormSubmit::POST("table");
$crudType = FormSubmit::POST("crud-type");

/*
$tableName = FormSubmit::GET("table");
$crudType = FormSubmit::GET("crud-type");
*/

$tableManager = new SimpleTableManager();
$tableManager->Initialize($tableName);

$tableManager->debug = true;

//$tableManager::set("originalName", "POON");
if(isset($_POST["create"]))
foreach($_POST["create"] as $key => $value) {
	if(isset($_POST["createDate"])){
		if(!array_key_exists($key, $_POST["createDate"]))
			$tableManager->$key = $value;
	}else{
			$tableManager->$key = $value;
	}
}

if(isset($_POST["createDate"]))
	foreach($_POST["createDate"] as $key => $value) {
		$tableManager->$key = $value;
	}


//echo json_encode($tableManager->_);
echo json_encode($tableManager->insert());

?>