<?php
class WebuserManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "webuser";
    
    function __construct() {
		parent::__construct();
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
