<?php
    	if (session_status() == PHP_SESSION_NONE) {
		    session_start();
		}
header('Content-Type: application/json');
//require_once '../model/SimpleSQLManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';
/*
$sqlManager = new SimpleSQLManager();

			$selectGlobalRightCols = "`globalCreateRight` as 'create', `globalReadRight` as 'select', `globalUpdateRight` as 'update', `globalDeleteRight` as 'delete'";

			// get permissionID
			$permsID = $_SESSION['USER_PermissionID'];

				$sql_str = sprintf("SELECT $selectGlobalRightCols FROM `permission` WHERE permissionID = %s",
						$permsID);

			$tempCR = false;
			$tempRR = false;
			$tempUR = false;
			$tempDR = false;

*/
$crudTypePermission = "select";
			$securityManager = new SecurityManager();
			//$securityManager->Initialize();
    	$isPermissionAllow = false;
    	$isPermissionAllow = $securityManager->CRUD_PermissionCheck($crudTypePermission);
    	
    	echo $isPermissionAllow."123";

echo json_encode($securityManager->GetResponseArray(),JSON_PRETTY_PRINT)
//echo json_encode($sqlManager->queryForDataArray($sql_str), JSON_PRETTY_PRINT);

?>