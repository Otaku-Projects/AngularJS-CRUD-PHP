<?php
// require_once 'DatabaseManager.php';

class ForgetAccountManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "forgetaccount";
    
    function __construct() {
		parent::__construct();
        $this->Initialize();
    }
	function Initialize(){
		// set parent dataSchema
		parent::setDataSchemaForSet();
		// set construct _ index
		parent::setArrayIndex();

		$this->isSelectAllColumns = false;
		$this->selectWhichCols = "p.userID, p.profileID, loginID, status, isDisable, activateDate, permissionID, fullName";

		$this->SetDefaultValue();
	}
	function SetDefaultValue(){
		parent::setDefaultValue();
		
		$this->requestDateTime = date("Y-m-d H:i:s");
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }

    // an idea was join query
    function selectValidUser($profileObj, $webuserObj){
		$array = $this->_;
		$dataSchema = $this->dataSchema;
		$tempSelectWhichCols = "*";
		if(!$this->isSelectAllColumns)
			$tempSelectWhichCols = $this->selectWhichCols;
		
		$whereSQL = "";
		$isWhere = false;
		foreach ($array as $index => $value) {
			// if TableManager->value =null, ignore
			if(isset($value)){
				if(isset($this->SearchDataType($dataSchema['data'], 'Field', $index)[0]['Default']))
					if ($value == $this->SearchDataType($dataSchema['data'], 'Field', $index)[0]['Default'])
						continue;

				if($profileObj->IsColumnExists($index)){
					$whereSQL .= "`w.".$index."` = ". $value . " and ";
					$isWhere = true;
				}
			}
		}
		if($isWhere){
			$whereSQL = rtrim($whereSQL, " and "); //would cut trailing 'and'.
			$sql_str = sprintf("SELECT $tempSelectWhichCols from %s where %s",
					"webuser w, profile p",
					$whereSQL." and p.userID = w.userID");
		}

		$this->sql_str = $sql_str;
		$this->queryForDataArray();

		return $this->GetResponseArray();
    }
}
?>
