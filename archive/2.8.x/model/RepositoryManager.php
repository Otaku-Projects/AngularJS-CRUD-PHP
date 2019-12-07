<?php

class RepositoryManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "repository";
    
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

class RepositoryDependencyManager extends DatabaseManager {
    protected $_ = array(
    );
	
	protected $table = "repositorydependency";
    
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
