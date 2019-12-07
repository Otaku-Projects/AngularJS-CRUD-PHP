<?php

class LicenseManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "licenseterms";
    
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
