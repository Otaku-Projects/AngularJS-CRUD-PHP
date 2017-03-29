<?php
// require_once 'DatabaseManager.php';

class SenseiProfileManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "senseiprofile";
    
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
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}
?>
