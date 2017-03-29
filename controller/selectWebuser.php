<?php
require_once '../model/WebuserManager.php';
$webuserManager = new WebuserManager();
$webuserManager->debug = true;
$webuserManager->Initialize();

print_r($webuserManager->_)."<br>";

$webuserManager->userID=4;
$webuserManager->test=1;
$webuserManager->loginID='leo';

echo "<pre>";
print_r($webuserManager->_)."<br>";
echo "</pre>";

echo "data Schema...: <br>";
echo "<pre>";
print_r($webuserManager->dataSchema);
echo "</pre>";
//print_r($webuserManager->_);


echo "<br><br>json_encode...: <br><br>";
echo json_encode($webuserManager->select());
//echo "<br><br>json_encode... insert: <br><br>";
//echo json_encode($webuserManager->insert());
//echo "<br><br>json_encode... insert: <br><br>";
//echo json_encode($webuserManager->update());
?>