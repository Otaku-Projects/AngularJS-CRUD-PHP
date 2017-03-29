<?php
header('Content-Type: application/json');
require_once 'FormSubmitManager.php';
require_once 'ManagerLoader.php';

// $currentFilename = basename(__FILE__);

// foreach (scandir(dirname(__FILE__)) as $filename) {
//     $path = dirname(__FILE__) . '/' . $filename;

//     if($filename == $currentFilename)
//     	continue;

//     if($filename == "config.php")
//     	continue;

//     if($filename == "FormSubmitManager.php")
//     	continue;

//     if($filename == "DatabaseManager.php")
//     	continue;

//     if(strpos($filename, "Manager") < 0)
//     	continue;

//     if (is_file($path)) {
//         // echo $path."<br>";
//         require_once $path;
//     }
// }

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

// new Object();
// Standard Defined Classes in PHP
$requestJson = new stdClass();
$responseData = new stdClass();
$responseData->Status = "success";
$responseData->Message = [];

$sqlResultData = [];

$postBody = file_get_contents('php://input');
$requestJson = json_decode($postBody);
$action = $requestJson->Action;

$tableManager = new stdClass();

// securityManager
$securityManager = new SecurityManager();
try{
	switch ($action) {
		case 'Login':
			Login();
			break;
		case 'Logout':
			Logout();
			break;
		default:
			// Create Table Manager
			try{
				$prgmName = $requestJson->Table;
				$prgmPath = "../controller/$prgmName.php";

				require_once $prgmPath;

			}catch (Exception $e) {
				$responseData->Status = "PrgmNotFound";
				array_unshift($responseData->Message, "TableManager $prgmName not found.");
			}
			break;
	}
}catch (Exception $e) {
	$responseData->Status = "Error";
	array_unshift($responseData->Message, $e->getMessage());
}

$isProgramExists = false;
$funcName = "";
switch ($action) {
	// get single record
	case 'GetTableStructure':
		$funcName = "GetTableStructure";
		break;
	// get single record
	case 'FindData':
		$funcName = "FindData";
		break;
	// get records in result set
	case 'GetData':
		$funcName = "GetData";
		break;
	case 'CreateData':
		$funcName = "CreateData";
		break;
	case 'UpdateData':
		$funcName = "UpdateData";
		break;
	case 'DeleteData':
		$funcName = "DeleteData";
		break;
	case 'IsKeyExists':
		$funcName = "IsKeyExists";
		break;
	default:
		$responseData->Status = "UnkownAction";
		array_unshift($responseData->Message, $e->getMessage());
		break;
}

$isProgramExists = function_exists($funcName);

if(!$isProgramExists){
	$responseData->Status = "FuncNotFound";
	array_unshift($responseData->Message, "Function $funcName() not found in $prgmName");
}else{
	try{
		switch ($action) {
			// get single record
			case 'GetTableStructure':
				$sqlResultData['dataColumns'] = call_user_func($funcName);
				break;
			// get single record
			case 'FindData':
				call_user_func($funcName);
				break;
			// get records in result set
			case 'GetData':
				call_user_func($funcName);
				break;
			case 'CreateData':
				call_user_func($funcName);
				break;
			case 'UpdateData':
				call_user_func($funcName);
				break;
			case 'DeleteData':
				call_user_func($funcName);
				break;
			case 'IsKeyExists':
				call_user_func($funcName);
				break;
			
			default:
				# code...
				break;
		}
	}catch (Exception $e) {
		$responseData->Status = "Error";
		array_unshift($responseData->Message, $e->getMessage());
	}
}

function GetData(){
	global $requestJson;
	global $securityManager;
	global $sqlResultData;
}

function Login(){
	global $requestJson;
	global $securityManager;
	global $sqlResultData;

	$username = $requestJson->UserCode;
	$password = $requestJson->Password;

	if($securityManager->isUserLoggedInBool()){
		$sqlResultData = ($securityManager->GetLoginData());
	}else{
		$sqlResultData = ($securityManager->DoLogin($username, $password));
	}
}

function Logout(){
	global $securityManager;
	global $sqlResultData;
	$sqlResultData = $securityManager->doLogout();
}


$responseData =  (object)array_merge((array)$responseData, (array)$sqlResultData);

echo json_encode($responseData);

?>