<?php

class ThirdPartyManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "thirdparty";
    
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

class ThirdPartyReleaseHistoryManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "thirdpartyreleasehistory";
    
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

class ThirdPartyLangManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "thirdpartylang";
    
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
