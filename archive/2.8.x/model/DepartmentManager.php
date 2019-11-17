<?php

class DepartmentManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "department";
    
    function __construct() {
		parent::__construct();
    }
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}
?>
