<?php
// require_once 'DatabaseManager.php';

class WebuserManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "webuser";
    
    function __construct() {
		parent::__construct();
        $this->Initialize();
    }
	function Initialize(){
		// set parent dataSchema
		parent::setDataSchemaForSet();
		// set construct _ index
		parent::setArrayIndex();
	}
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
	
	function SelectGeneralUserInfo(){
        $this->isSelectAllColumns = false;
        $this->selectWhichCols = "userID, loginID, status, isDisable, activeDate, premissionID";
		
		$responseArray = $this->select();
        $this->isSelectAllColumns = true;
		
		return $responseArray;
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}
?>
