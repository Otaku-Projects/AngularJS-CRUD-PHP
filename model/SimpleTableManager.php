<?php
require_once 'DatabaseManager.php';

class SimpleTableManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "";
    
    function __construct() {
		parent::__construct();
    }
	function Initialize($tableName=""){
		$this->table = $tableName;
		
		// set parent dataSchema
		parent::getDataSchemaForSet();
		// set construct _ index
		parent::setArrayIndex();
		
	}
	
	function get(){
		return $this->table;
	}
	
	function set($tableName){
		$this->table = $tableName;
	}
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}
?>
