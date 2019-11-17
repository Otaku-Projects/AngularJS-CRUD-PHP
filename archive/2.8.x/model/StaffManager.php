<?php

class StaffManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "staff";
    
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
