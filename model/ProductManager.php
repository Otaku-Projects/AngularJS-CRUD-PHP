<?php
// require_once 'DatabaseManager.php';

class ProductManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "product";
    
    function __construct() {
		parent::__construct();
        $this->Initialize();
    }
	function Initialize(){
		$this->debug = true;

		// set parent dataSchema
		parent::setDataSchemaForSet();
		// set construct _ index
		parent::setArrayIndex();
        
        //$this->isSelectAllColumns = false;
        //$this->selectWhichCols = "userID, loginID, status, isDisable, activeDate, premissionID";
	}
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}
?>
