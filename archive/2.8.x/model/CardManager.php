<?php
// require_once 'DatabaseManager.php';

class CardManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "card";
    
    function __construct() {
		parent::__construct();
        // parent::Initialize();
    }
	// function Initialize(){
	// 	// set parent dataSchema
	// 	parent::setDataSchemaForSet();
	// 	// set construct _ index
	// 	parent::setArrayIndex();
 //        echo "rwe";
	// }
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}

class CardContentManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "cardcontent";
    
    function __construct() {
		parent::__construct();
        // parent::Initialize();
    }
	// function Initialize(){
	// 	// set parent dataSchema
	// 	parent::setDataSchemaForSet();
	// 	// set construct _ index
	// 	parent::setArrayIndex();
 //        echo "rwe";
	// }
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}

class CardTypeManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "cardtype";
    
    function __construct() {
		parent::__construct();
        // parent::Initialize();
    }
	// function Initialize(){
	// 	// set parent dataSchema
	// 	parent::setDataSchemaForSet();
	// 	// set construct _ index
	// 	parent::setArrayIndex();
 //        echo "rwe";
	// }
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}

class SpellClass extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "spellclass";
    
    function __construct() {
		parent::__construct();
        // parent::Initialize();
    }
	// function Initialize(){
	// 	// set parent dataSchema
	// 	parent::setDataSchemaForSet();
	// 	// set construct _ index
	// 	parent::setArrayIndex();
 //        echo "rwe";
	// }
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}

class CardSpellClassManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "cardspellclass";
    
    function __construct() {
		parent::__construct();
        // parent::Initialize();
    }
	// function Initialize(){
	// 	// set parent dataSchema
	// 	parent::setDataSchemaForSet();
	// 	// set construct _ index
	// 	parent::setArrayIndex();
 //        echo "rwe";
	// }
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}
?>