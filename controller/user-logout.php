<?php
header('Content-Type: application/json');
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';

$securityManager = new SecurityManager();
echo json_encode($securityManager->doLogout());

?>