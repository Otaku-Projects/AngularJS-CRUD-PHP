<?php
/**
 *
 * @author KeithPoon <keith200620062006@yahoo.com.hk>
 * @version 3.5
 */
//require_once dirname(__FILE__).'/../globalVariable.php';
class DatabaseManager {

    protected $dbc;
    protected $previousInsertID;
    protected $i;
	
	// define by the getTheDataSchemaForSet;
	protected $showColumnList;
	protected $dataSchema;
	protected $tableIndex;
	protected $tablePrimaryKey;
	
	protected $debug = false;
	protected $isTableSchemaFound = false;
	protected $isAllowSetDefaultValue = true;
	
	protected $isDefaultValueSet = false;
	// dataType for data transform in GetSQLValueString
	protected $text = "text";
	protected $int = "int";
	protected $long = "long";
	protected $double = "double";
	protected $date = "date";
    protected		$hostname_fyp = "localhost";
    protected		$database_fyp = "acgni308_keithbox";
    protected		$username_fyp = "acgni308_kbuser";
    protected		$password_fyp = "Demo-DB3.2";
	
	private	$reserved_fields = array();
	private $responseArray = array("data"=>null, "sql"=>null);
	private $access_status = array();
    
	function ResetResponseArray(){
		$this->responseArray = array();
		
		$arrayIndex = array("data", 
			"sql", 
			"num_rows", 
			"insert_id", 
			"affected_rows", 
			"access_status", 
			"error");
		foreach ($arrayIndex as $indexValue){
			$this->responseArray[$indexValue] = null;
		}
		$this->responseArray["sql"] = "turn on debug mode to unhidden";
		$this->responseArray["access_status"] = $this->access_status["OK"];
	}
	
	/**
	 * Magic Methods: __construct(), Classes which have a constructor method call this method on each newly-created object,
	 * so it is suitable for any initialization that the object may need before it is used.
	 *
	 */
    function __construct(){
		//parent::__construct();
    	try {
    		$hostname_fyp = $this->hostname_fyp;
    		$database_fyp = $this->database_fyp;
    		$username_fyp = $this->username_fyp;
    		$password_fyp = $this->password_fyp;
			
    		$this->dbc = new mysqli($hostname_fyp, $username_fyp, $password_fyp, $database_fyp) or trigger_error(mysqli_error(), E_USER_ERROR);
         	mysqli_set_charset($this->dbc, "utf8");
         }catch (Exception $e ) {
         	echo "Service unavailable";
         	echo "message: " . $e->message;   // not in live code obviously...
            exit;
         }
		 date_default_timezone_set('Hongkong');
		 $this->reserved_fields = array(
			"createUser"=>"createUser",
			"createDate"=>"createDate",
			"lastUpdateUser"=>"lastUpdateUser",
			"lastUpdateDate"=>"lastUpdateDate",
			"systemUpdateDate"=>"systemUpdateDate",
			"systemUpdateUser"=>"systemUpdateUser",
			"systemUpdateProgram"=>"systemUpdateProgram"
		);
		$this->access_status = array(
			"OK" => "OK",
			"Duplicate" => "Duplicate",
			"Fail" => "Fail",
			"Error" => "Error",
			"TopOfFile" => "TopOfFile",
			"EndOfFile" => "EndOfFile",
			"Locked" => "Locked",
			"RecordNotFound" => "RecordNotFound",
			"SqlError" => "SqlError"
			
		);
    }

    function beginTransaction() {
        $this->dbc->autocommit(FALSE);
    }

    function commit() {
        $this->dbc->commit();
        $this->dbc->autocommit(TRUE);
    }

    function rollback() {
        $this->dbc->rollback();
        $this->dbc->autocommit(TRUE);
    }
    
    /**
     * execute sql query
     * 
     * @param string $sql_str, sql statemnet
     * @return mysqli_result, you may fetch array or read it own variable
     * //http://www.php.net/manual/en/class.mysqli-result.php
     * 
     */
    private function query($sql_str) {
    	sleep(3); // for testing
        $result = $this->dbc->query($sql_str);
        return $result;
    }
	function query_num_rows($sql_str, $isDebug=false) {
        $result = $this->dbc->query($sql_str);
		if($isDebug===true){
			echo "<br>";
			$this->debug($sql_str);  //debug
			echo "<br>";
			echo "result: ".var_dump($result);
			echo "<br>";
			echo "dbc->error_list".var_dump($this->dbc->error_list);
			echo "<br>";
		}
        if($result===false){
        	return $this->debug($sql_str)."<br><br>".$result."<br><br><pre>".print_r($this->dbc->error_list)."</pre>";
        	//return print_r($this->dbc->error);
        }
        return $result->num_rows;
	}
	
	function selectFirstRowFirstElement($sql_str, $isDebug=false) {
		$result = $this->dbc->query($sql_str);
		$row = $result->fetch_array(MYSQLI_NUM);
		//	echo $row[0]."hellp";
		//ec
		if($isDebug===true){
			echo "<br>";
			$this->debug($sql_str);  //debug
			echo "<br>";
			echo "result: ".var_dump($result);
			echo "<br>";
			echo "elelment".$row[0]."elelment";
		}
		if($row[0])
			return $row[0];
		else
			return false;
		/*
		if($result->num_rows)
		{
			$row = $result->fetch_array(MYSQLI_BOTH);
			echo $row[0]
			return $result->num_rows;
		}
		*/
        if($result===false){
        	return $this->debug($sql_str)."<br><br>".$result."<br><br><pre>".print_r($this->dbc->error_list)."</pre>";
        }
        return $result;
	}

	/**
	 * call query() to execute sql query and
	 * return the fetch result in array
	 *
	 * @param string $sql_str, sql statement
	 * @return Associative arrays, ['data'] = sql result, ['sql'] = sql statement, ['num_rows'] =  number of rows in a result, ['error'] = sql error
	 * 
	 * //http://www.php.net/manual/en/book.mysqli.php
	 * //http://www.php.net/manual/en/class.mysqli-result.php
	 *
	 */
    function queryForDataArray($sql_str, $fetchType=MYSQLI_NUM) {
		if($this->IsNullOrEmptyString($sql_str)){
			$this->responseArray['error'] = "sql query is empty";
			return;
		}
        $result = $this->query($sql_str);

		// Fixed: num_rows only work for select, num_rows maybe null
		if(isset($result->num_rows))
			$this->responseArray['num_rows'] = $result->num_rows;
		else
			$this->responseArray['num_rows'] = 0;
		// insert_id return the lasted AUTO_INCREMENT field value.
		// Returns zero if no previous query or the query did not update an AUTO_INCREMENT value
		$this->responseArray['insert_id'] = $this->dbc->insert_id;
		
		// affected_rows only work for create, insert, update, replace, delete
		// For SELECT statements mysqli_affected_rows() works like mysqli_num_rows().
		$this->responseArray['affected_rows'] = $this->dbc->affected_rows;
		
        $dataArray = array();
        // Debug mode - set sql, error 
		if($this->debug){
			$this->responseArray["sql"] = $sql_str;
			if(isset($this->dbc->error)){
				$this->responseArray['error'] = $this->dbc->error;
				if($this->IsNullOrEmptyString($this->dbc->error)){
					$this->responseArray['access_status'] = $this->access_status["SqlError"];
				}
			}else{
				$this->responseArray['error'] = NULL;
			}
		}
				
		// End - Debug mode
		if(isset($result->num_rows)){
			if($fetchType==MYSQLI_NUM){
				while ($row = $result->fetch_array(MYSQLI_ASSOC)) { // MYSQLI_BOTH, MYSQLI_ASSOC, MYSQLI_NUM
					//if(isset($row["Default"]))
					//echo $row['Default'];
					array_push($dataArray, $row);
				}
				$this->responseArray['data'] = $dataArray;
			}else if($fetchType=MYSQLI_ASSOC){
			}
        }
		return $this->responseArray;
    }
    function queryResultToArrayVertical($sql_str, $fetchType=MYSQLI_NUM) {
        $result = $this->query($sql_str);
		
		/*
		$arrayIndex = array("data", "sql", "num_rows", "insert_id", "affected_rows", "error");
		foreach ($arrayIndex as $indexValue){
			$this->responseArray[$indexValue] = null;
		}
		*/
		//error handling, if num_rows = null
		// num_rows only work for select
		if(isset($result->num_rows))
			$this->responseArray['num_rows'] = $result->num_rows;
		else
			$this->responseArray['num_rows'] = 0;
		// insert_id return the lasted AUTO_INCREMENT field value.
		// Returns zero if no previous query or the query did not update an AUTO_INCREMENT value
		$this->responseArray['insert_id'] = $this->dbc->insert_id;
		
		// affected_rows only work for create, insert, update, replace, delete
		// For SELECT statements mysqli_affected_rows() works like mysqli_num_rows().
		$this->responseArray['affected_rows'] = $this->dbc->affected_rows;
		
        $this->responseArray['data'] = array();
        // Debug mode - set sql, error 
		if($this->debug){
			$this->responseArray["sql"] = $sql_str;
			if(isset($this->dbc->error)){
				$this->responseArray['error'] = $this->dbc->error;
			}else{
				$this->responseArray['error'] = NULL;
			}
		}
		// End - Debug mode
		if(isset($result->num_rows)){
			if($fetchType==MYSQLI_NUM){
				while ($row = $result->fetch_array(MYSQLI_ASSOC)) { // MYSQLI_BOTH, MYSQLI_ASSOC, MYSQLI_NUM
					foreach($row as $key=>$value){
						if(!array_key_exists($key, $this->responseArray['data'])) {
							$this->responseArray['data'][$key] = array();
						}
						array_push($this->responseArray['data'][$key], $value);
					}
				}
			}else if($fetchType=MYSQLI_ASSOC){
			}
        }
		return $this->responseArray;
    }
	
    /**
     * TableManager basic and simple SELECT SQL Function
     *
     */
	function select(){
		$array = $this->_;
		$dataSchema = $this->dataSchema;
		
		$whereSQL = "";
		$isWhere = false;
		foreach ($array as $index => $value) {
			// if TableManager->value =null, ignore
			if(isset($value)){//$array[$index])){
				if(isset($this->SearchDataType($dataSchema['data'], 'Field', $index)[0]['Default']))
					if ($value == $this->SearchDataType($dataSchema['data'], 'Field', $index)[0]['Default'])
						continue;
				$whereSQL .= $index." = ". $value . " and ";
				$isWhere = true;
			}
		}
		if($isWhere){
			$whereSQL = rtrim($whereSQL, " and "); //would cut trailing 'and'.
			$sql_str = sprintf("SELECT * from %s where %s",
					$this->table,
					$whereSQL);
		}else{
			$sql_str = sprintf("SELECT * from %s",
					$this->table);
		}
		//echo $sql_str;
		//return $this->queryForDataArray($sql_str);
		$this->queryForDataArray($sql_str);
		return $this->responseArray;
	}

    /**
     * TableManager basic and simple INSERT SQL Function
     *
     */
	function insert(){
		$this->ResetResponseArray();
		$array = $this->_;
		$dataSchema = $this->dataSchema;

		$tableColumnSQL = "";
		$valuesSQL = "";
		$isSpecifiesColumn = false;
		$array_value = "";

		/*
		foreach ($array as $index => $value) {
			// if TableManager->value =null, ignore
			if(isset($array[$index])){
				// if the array value = default value, than ignore
				if(isset($this->SearchDataType($dataSchema['data'], 'Field', $index)['Default']))
					if ($value == $this->SearchDataType($dataSchema['data'], 'Field', $index)['Default'])
						continue;
				// if the data schema not allow null
				if(isset($this->SearchDataType($dataSchema['data'], 'Field', $index)['Default']))
				{
				}
				$tableColumnSQL .= $index." , ";
				$valuesSQL .= $value." , ";
				$isSpecifiesColumn = true;
			}
		}
		*/
		foreach ($dataSchema['data'] as $index => $value){
			$isColumnNullOrEmpty = false;
			$column = $value['Field'];
			$type = $value['Type'];
			
			//if($type == "datetime"){
			//echo $array[$column].ToString();
			//$array_value = "'".$array[$column]."'";
			//}else{
			// if value is null or empty
			if($this->IsNullOrEmptyString($array[$column])){
				$isColumnNullOrEmpty = true;
			}
			// if value exist are not null and empty
			else {
				$array_value = $this->GetSQLValueString($column);//$array[$column];
			}
			//}
			// if column cannot null
			if(strtolower($value['Null']) == 'no'){
				// skip column if auto increment
				if(strtolower($value['Extra']) == 'auto_increment'){
					continue;
				}
				// ignore column if the value = default value
				if(isset($value['Default']))
					if($array_value == $value['Default'])
						continue;
			}
			/*
			switch($value['Type']){
				case "date":
				case "datetime":
			}
			*/
			if(!$isColumnNullOrEmpty){
				$tableColumnSQL .= $column." , ";
				$valuesSQL .= $array_value." , ";
				$isSpecifiesColumn = true;
			}
		}
		
		// add the createDate and createUser if table exists those fields
		
		$sql_str = sprintf("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '%s' AND TABLE_NAME = '%s' AND COLUMN_NAME = '%s'",
			$this->database_fyp,
			$this->table,
			$this->reserved_fields["createDate"]);
		$resultData = $this->queryForDataArray($sql_str);
		if($resultData['num_rows'] > 0){
			$tableColumnSQL .= $this->reserved_fields['createDate']." , ";
			$valuesSQL .= "'". date("Y-m-d H:i:s")."' , ";
		}
		
		/*
		if($isSpecifiesColumn){
			// cut the trailing commas.
			$tableColumnSQL = rtrim($tableColumnSQL, " , ");
			$valuesSQL = rtrim($valuesSQL, " , ");
			
			$sql_str = sprintf("INSERT into %s ( %s ) values ( %s )",
				$this->table,
				$tableColumnSQL,
        		$valuesSQL);
		}else{
			
		}
		*/

		$sql_str = sprintf("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '%s' AND TABLE_NAME = '%s' AND COLUMN_NAME = '%s'",
			$this->database_fyp,
			$this->table,
			$this->reserved_fields["lastUpdateDate"]);
		$resultData = $this->queryForDataArray($sql_str);
		if($resultData['num_rows'] > 0){
			$tableColumnSQL .= $this->reserved_fields['lastUpdateDate']." , ";
			$valuesSQL .= "'". date("Y-m-d H:i:s")."' , ";
		}
		
		if($isSpecifiesColumn){
			// cut the trailing commas.
			$tableColumnSQL = rtrim($tableColumnSQL, " , ");
			$valuesSQL = rtrim($valuesSQL, " , ");
			
			$sql_str = sprintf("INSERT into %s ( %s ) values ( %s )",
				$this->table,
				$tableColumnSQL,
        		$valuesSQL);
		}else{
			
		}
		//echo $sql_str;
		//return $this->queryForDataArray($sql_str);
		$this->queryForDataArray($sql_str);
		return $this->responseArray;
	}

    /**
     * TableManager basic and simple UPDATE SQL Function
     * update but expect the key fields
     */
	function update(){
		$this->ResetResponseArray();
		$array = $this->_;
		$dataSchema = $this->dataSchema;
		$updateSetColumn = "";
		$updateWhereColumn = "";
		$isPKMissing = false;

		$primaryKeySchema = $this->getPrimaryKeyName();
		/*
		// refer to http://mysql-0v34c10ck.blogspot.com/2011/05/better-way-to-get-primary-key-columns.html
		//$showIndex_sql = "show index from ".$this->table;
		$showPrimaryKey_sql = sprintf("SELECT `COLUMN_NAME` AS `Field` FROM `information_schema`.`COLUMNS` WHERE (`TABLE_SCHEMA` = '%s') AND (`TABLE_NAME` = '%s') AND (`COLUMN_KEY` = 'PRI')",
				$this->database_fyp,
				$this->table);
		$primaryKeySchema = $this->queryResultToArrayVertical($showPrimaryKey_sql);
		*/
		
		// error handling
		// is primary key missing?
		foreach ($primaryKeySchema['data']['Field'] as $index => $value){
			if($this->IsNullOrEmptyString($array[$value])){
				$isPKMissing = true;
				break;
			}else{
				$updateWhereColumn.=$value."=".$this->GetSQLValueString($value)." AND ";
			}
		}
		
		// stop and return error msg if PK missing
		if($isPKMissing){
			$missingPK = "";
			foreach ($primaryKeySchema['data']['Field'] as $index => $value){
				if($this->IsNullOrEmptyString($array[$value])){
					$missingPK.=$value." , ";
				}
			}
			$missingPK = rtrim($missingPK, " , ");
			//return array("error"=>"Primary Key: ($missingPK) have not set, cannot update.");
			$this->responseArray['error'] = "Primary Key: ($missingPK) have not set, cannot update.";
			return $this->responseArray;
		}
		// stop and return error msg if all fields except PK are null or empty
		$isAllColumnNullOrEmpty = true;
		$nullOrEmptyColumn = "";
		foreach ($array as $key=>$value){
			if($this->IsSystemField($key)){
				continue;
			}
			$isColumnAPK = array_search($key, $primaryKeySchema['data']['Field']);
			// array_search return key index if found, false otherwise
			if($isColumnAPK === false){
				//$isAllColumnNullOrEmpty = false;

				$isAllColumnNullOrEmpty = $isAllColumnNullOrEmpty && $this->IsNullOrEmptyString($value);
				
				//$columnType = $this->SearchDataType($dataSchema['data'], 'Field', $key)[0]['Type'];
				
				//print_r($this->SearchDataType($dataSchema['data'], 'Field', $key)[0]["Type"]);
				
				//if($columnType == "datetime" || $columnType == "timestamp"){
				//	$updateSetColumn.=$key."=".$this->GetSQLValueString($key)." , ";
				//	$updateSetColumn.=$key."='".$value."' , ";
				//}
				//else{
					if(!$this->IsNullOrEmptyString($value)){
						$updateSetColumn.=$key."=".$this->GetSQLValueString($key)." , ";
					}else{
						$nullOrEmptyColumn.=$key." , ";
					}
				//}
			}
		}
		
		if($isAllColumnNullOrEmpty){
			//return array("error"=>"All Fields all null or empty: cannot update all fields to null or empty, it doesn't make sense.");
			$this->responseArray['error'] = "All Fields all null or empty: cannot update all fields to null or empty, it doesn't make sense.";
			return $this->responseArray;
		}
		
		//// check table exists lastUpdateDate column, identify is this update action valid.
		$sql_str = sprintf("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '%s' AND TABLE_NAME = '%s' AND COLUMN_NAME = '%s'",
			$this->database_fyp,
			$this->table,
			$this->reserved_fields["lastUpdateDate"]);
		$this->queryForDataArray($sql_str);
		
		$isLastUpdateDateFound = false;
		if($this->responseArray['num_rows'] > 0)
			$isLastUpdateDateFound = true;
		
		$this->ResetResponseArray();
		
		// assign last update date and set the last update date condition
		if($isLastUpdateDateFound){
			$updateSetColumn .= $this->reserved_fields["lastUpdateDate"]."='".date("Y-m-d H:i:s")."'";
			$updateWhereColumn .= $this->reserved_fields["lastUpdateDate"] . 
				"=" . 
				$this->GetSQLValueString($this->reserved_fields["lastUpdateDate"]) . 
				" AND ";
		}
		//// END - check the lastUpdateDate column
		
		$updateWhereColumn = rtrim($updateWhereColumn, " AND ");
		$updateSetColumn = rtrim($updateSetColumn, " , ");		
		$nullOrEmptyColumn = rtrim($nullOrEmptyColumn, " , ");
		// mapping a update sql
		$sql_str = sprintf("UPDATE %s set %s where %s",
			$this->table,
			$updateSetColumn,
        	$updateWhereColumn);
			
		//return $this->queryForDataArray($sql_str);
		$this->queryForDataArray($sql_str);
		return $this->responseArray;
	}

    /**
     * TableManager basic and simple UPDATE SQL Function
     * update the instance value according to the parameter
     */
	function updateAnyFieldTo($updateToMe){
		$this->ResetResponseArray();
		$tableObject = $this->_;
		//$dataSchema = $this->dataSchema;
		// refer to http://mysql-0v34c10ck.blogspot.com/2011/05/better-way-to-get-primary-key-columns.html
		//$showIndex_sql = "show index from ".$this->table;
// 		$showPrimaryKey_sql = sprintf("SELECT `COLUMN_NAME` AS `Field` FROM `information_schema`.`COLUMNS` WHERE (`TABLE_SCHEMA` = '%s') AND (`TABLE_NAME` = '%s') AND (`COLUMN_KEY` = 'PRI')",
// 				$this->database_fyp,
// 				$this->table);
// 		$primaryKeySchema = $this->queryResultToArrayVertical($showPrimaryKey_sql);

		$updateSetColumn = "";
		$updateWhereColumn = "";
		$isPKMissing = false;
		
		// prepare the where condition query
		foreach ($updateToMe as $index => $value){
			if($this->IsNullOrEmptyString($tableObject[$value])){
				$isPKMissing = true;
				break;
			}else{
				$updateWhereColumn.=$value."=".$this->GetSQLValueString($value)." AND ";
			}
		}
		$updateWhereColumn = rtrim($updateWhereColumn, " AND ");
		// stop and return error msg if PK missing
		if($isPKMissing){
			$missingPK = "";
			foreach ($primaryKeySchema['data']['Field'] as $index => $value){
				if($this->IsNullOrEmptyString($tableObject[$value])){
					$missingPK.=$value." , ";
				}
			}
			$missingPK = rtrim($missingPK, " , ");
			return array("error"=>"Primary Key: ($missingPK) have not set, cannot update.");
		}
		// stop and return error msg if all fields except PK are null or empty
		$isAllColumnNullOrEmpty = true;
		$nullOrEmptyColumn = "";
		foreach ($tableObject as $key=>$value){
			$isColumnAPK = array_search($key, $primaryKeySchema['data']['Field']);
			// array_search return key index if found, false otherwise
			if($isColumnAPK === false){
				$isAllColumnNullOrEmpty = $isAllColumnNullOrEmpty && $this->IsNullOrEmptyString($value);
				if(!$this->IsNullOrEmptyString($value)){
					$updateSetColumn.=$key."=".$this->GetSQLValueString($key)." , ";
				}else{
					$nullOrEmptyColumn.=$key." , ";
				}
			}
		}
		
		$updateSetColumn = rtrim($updateSetColumn, " , ");
		
		$nullOrEmptyColumn = rtrim($nullOrEmptyColumn, " , ");
		if($isAllColumnNullOrEmpty){
			return array("error"=>"All Fields all null or empty: cannot update all fields to null or empty, it doesn't make sense.");
		}
		
		// mapping a update sql
		$sql_str = sprintf("UPDATE %s set %s where %s",
			$this->table,
			$updateSetColumn,
        	$updateWhereColumn);
		echo $sql_str;
		//return $this->queryForDataArray($sql_str);
		$this->queryForDataArray($sql_str);
		return $this->responseArray;
	}
	
    /**
     * TableManager basic and simple DELETE SQL Function
     *
     */
	function delete(){
		$this->ResetResponseArray();
		$array = $this->_;
		$dataSchema = $this->dataSchema;

		$deleteWhereColumn = "";
		$isPKMissing = false;

		$primaryKeySchema = $this->getPrimaryKeyName();

		// error handling
		// is primary key missing?
		foreach ($primaryKeySchema['data']['Field'] as $index => $value){
			if($this->IsNullOrEmptyString($array[$value])){
				$isPKMissing = true;
				break;
			}else{
				$deleteWhereColumn.=$value."=".$this->GetSQLValueString($value)." AND ";
			}
		}
		// stop and return error msg if PK missing
		if($isPKMissing){
			$missingPK = "";
			foreach ($primaryKeySchema['data']['Field'] as $index => $value){
				if($this->IsNullOrEmptyString($array[$value])){
					$missingPK.=$value." , ";
				}
			}
			$missingPK = rtrim($missingPK, " , ");
			$this->responseArray['access_status'] = $this->access_status['Fail'];
			$this->responseArray['error'] = "Primary Key: ($missingPK) have not set, cannot delete.";
			return $this->responseArray;
		}
		// stop the delete action if all fields are null or empty under the case if table no PK
		$isAllColumnNullOrEmpty = true;
		$nullOrEmptyColumn = "";
		foreach ($array as $key=>$value){
			if($this->IsSystemField($key)){
				continue;
			}
			$isColumnAPK = array_search($key, $primaryKeySchema['data']['Field']);
			// array_search return key index if found, false otherwise
			if($isColumnAPK === false){
				$isAllColumnNullOrEmpty = $isAllColumnNullOrEmpty && $this->IsNullOrEmptyString($value);
					if($this->IsNullOrEmptyString($value)){
						$nullOrEmptyColumn.=$key." , ";
					}
			}
		}
		if($isAllColumnNullOrEmpty || $isPKMissing){
			$this->responseArray['error'] = "All Fields all null or empty: cannot allocate a record to delete.";
			return $this->responseArray;
		}

		//// check table exists lastUpdateDate column, identify is this update action valid.
		$sql_str = sprintf("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '%s' AND TABLE_NAME = '%s' AND COLUMN_NAME = '%s'",
			$this->database_fyp,
			$this->table,
			$this->reserved_fields["lastUpdateDate"]);
		$this->queryForDataArray($sql_str);
		
		$isLastUpdateDateFound = false;
		if($this->responseArray['num_rows'] > 0)
			$isLastUpdateDateFound = true;
		
		$this->ResetResponseArray();
		
		// assign last update date and set the last update date condition
		if($isLastUpdateDateFound){
			//$updateSetColumn .= $this->reserved_fields["lastUpdateDate"]."='".date("Y-m-d H:i:s")."'";
			$deleteWhereColumn .= $this->reserved_fields["lastUpdateDate"] . 
				"=" . 
				$this->GetSQLValueString($this->reserved_fields["lastUpdateDate"]) . 
				" AND ";
		}
		//// END - check the lastUpdateDate column
		
		$deleteWhereColumn = rtrim($deleteWhereColumn, " AND ");
		$nullOrEmptyColumn = rtrim($nullOrEmptyColumn, " , ");

		$sql_str = sprintf("DELETE from %s where %s",
			$this->table,
			$deleteWhereColumn);

		$this->queryForDataArray($sql_str);
		return $this->responseArray;
	}
	
	/*
	 * TableManager Initialize() function call, for futher action that is initialize getter and setter
	 */
	function getDataSchemaForSet(){
		$this->ResetResponseArray();
		$sql_str = sprintf("describe %s",
			$this->table);
		//$result = $this->queryForDataArray($sql_str);
		$this->queryForDataArray($sql_str);
		//print_r($result);
		//$this->dataSchema = $result;
		$this->dataSchema = $this->responseArray;
		/*
		
		$this->ResetResponseArray();
		$sql_str = sprintf("show %s columns",
			$this->table);
		$this->queryForDataArray($sql_str);
		
		$this->showColumnList = $this->responseArray;
		*/
	}
	function getTableIndex(){
		$this->ResetResponseArray();
		$sql_str = sprintf("show index from %s",
			$this->table);
		//$result = $this->queryForDataArray($sql_str);
		$this->queryForDataArray($sql_str);
		//$this->tableIndex = $result;
		$this->tableIndex = $this->responseArray;
	}
	/*
	function getTablePrimaryKey(){
		$this->ResetResponseArray();
		$sql_str = sprintf("show index from %s where key_name='primary'",
			$this->table);
		//$result = $this->queryForDataArray($sql_str);
		$this->queryForDataArray($sql_str);
		//$this->tablePrimaryKey = $result;
		$this->tablePrimaryKey = $this->responseArray;
		return $this->tablePrimaryKey;
	}
	*/
	function getPrimaryKeyName(){
		// refer to http://mysql-0v34c10ck.blogspot.com/2011/05/better-way-to-get-primary-key-columns.html
		//$showIndex_sql = "show index from ".$this->table;
		$showPrimaryKey_sql = sprintf("SELECT `COLUMN_NAME` AS `Field` FROM `information_schema`.`COLUMNS` WHERE (`TABLE_SCHEMA` = '%s') AND (`TABLE_NAME` = '%s') AND (`COLUMN_KEY` = 'PRI')",
				$this->database_fyp,
				$this->table);
		$primaryKeySchema = $this->queryResultToArrayVertical($showPrimaryKey_sql);
		return $primaryKeySchema;
	}
	
	/**
	 * according to the data schema, create the array index of table object
	 */
	function setArrayIndex(){
		$dataSchema = $this->dataSchema['data'];
		if(!empty($dataSchema)){
			foreach($dataSchema as $index=>$value){
				$this->_[$value['Field']] = NULL;
			}
		}
	}
	
	/**
	 * according to the data schema, set the default value of the table object value
	 */
	function setDefaultValue(){
		$dataSchema = $this->dataSchema['data'];
		if(!empty($dataSchema)){
			foreach($dataSchema as $index=>$value){
				$this->_[$value['Field']] = $value['Default'];
				//echo $details['Field'] ." : ". (string)$details['Default'].$details['Extra']." <br>";
			}
			$this->isDefaultValueSet = true;
		}
	}
	// End - TableManager Initialize() function call
	/*
    function close() {
        $this->dbc->close();
    }
    */
	
	/**
	 * Magic Methods: __destruct(), The destructor method will be called
	 * as soon as there are no other references to a particular object,
	 * or in any order during the shutdown sequence.
	 * 
	 */
    function __destruct() {
        $this->dbc->close();
    }

    /**
     * Magic Methods: __set(), __set() is run when writing data to inaccessible properties.
     * so it is suitable for any initialization that the object may need before it is used.
	 * 
	 * @param string $name, The $name argument is the name of the property being interacted with.
	 * @param string $value, The __set() method's $value argument specifies the value the $name'ed property should be set to.
     */
    function __set($name, $value) {
        $method = 'set' . ucfirst($name);
		//if($this->issetDefaultValue){
			if (method_exists($this, $method)) {
				// Top Priority - if TableNameManager have setName method
				$this->$method($value);
			}else if (array_key_exists($name, $this->_)) {//(isset($this->_[$name])) {
				// Second Priority - if TableNameManager have column name as $name
				//$this->_[$name] = $value;
				
				$this->SetSQLValueString($name, $value);
			}else if (isset($this->$name)) {
				// Last Priority - it DatabaseManager have variable name as $name
				$this->$name = $value;
			}else {
				//throw new Exception('Manager cannot found and set table column or Parent variable!');
			}
		//}else {
		//	$this->_[$name] = $value;
		//}
    }
    
	/**
	 * Magic Methods: __get(), __get() is utilized for reading data from inaccessible properties.
	 * 
	 * @param string $name, The $name argument is the name of the property being interacted with.
	 * //may be controller need not to get
	 */
    function __get($name) {
        $method = 'get' . ucfirst($name);
		//if($this->issetDefaultValue){
        if (method_exists($this, $method))
            return $this->$method();
        else if (isset($this->_[$name]))
            return $this->_[$name];
		else if (isset($this->$name))
			return $this->$name;
        //else
            //throw new Exception('Manager cannot found and get table column or Parent variable!');
		//}
    }
	
    public function __call($k, $args) {
        if (preg_match_all('/(set|get)([A-Z][a-z0-9]+)+/', $k, $words)) {
            $firstWord = $words[1][0]; // set or get
            $methodName = strtolower(array_shift($words[2]));
            //first word of property name

            foreach ($words[2] as $word) {
                $methodName .= ucfirst($word);
            }
            if (method_exists($this, $methodName)) {
                $methodObj = array(&$this, $methodName);
                if ($firstWord == 'set') {
                    call_user_func_array($methodObj, $args);
                    return;
                }
                else {
                    return call_user_func_array($methodObj, NULL);
                }
            }
        }
        throw new Exception('property undefined!');
    }
	
	/**
	 * assign $value to the TableManger.Object column
	 * 
	 * @param string $name columnName
	 * @param string $setValue a value you would like to assign to the TableManager.Object
	 * @return nothing, review is the value setted to the TableManager.Object, use print_r($this->_) to see TableManager.Object
	 */
	function SetSQLValueString($setColumn, $setValue)
	{
		$dataSchema = $this->dataSchema['data'];
		if(empty($dataSchema)){
			return;
		}
		if (PHP_VERSION < 6) {
			$setValue = get_magic_quotes_gpc() ? stripslashes($setValue) : $setValue;
		}
		
		//$setValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($setValue) : mysql_escape_string($setValue);
		// you may use mysqli->real_escape_string() to replace mysql_real_escape_string()
		
		$structure = $this->SearchDataType($dataSchema, 'Field', $setColumn);
		// $column structure
		//Array
		//(
		//	[0] => Array
		//		(
		//			[Field] => LoginID
		//			[Type] => varchar(255)
		//			[Null] => NO
		//			[Key] => UNI
		//			[Default] => 
		//			[Extra] => 
		//		)
		//)
		$type = $structure[0]['Type'];
		//echo "I am a $type type.";
		switch (true) {
			case strstr($type, "char"):
			case strstr($type, "varchar"):
			case strstr($type, "text"):
				$setValue = ($setValue != "") ? "'" . $setValue . "'" : "NULL";
				break;    
			//http://dev.mysql.com/doc/refman/5.0/en/integer-types.html
			case strstr($type, "tinyint"): // -128 to 127, 0 to 255
			case strstr($type, "smallint"): // -32768 to 32767, 0 to 65535
			case strstr($type, "mediumint"): // -8388608 to 8388607, 0 to 16777215
			case strstr($type, "int"): // -2147483648 to 2147483647, 0 to 4294967295
			case strstr($type, "bigint"): // -9223372036854775808 to 9223372036854775807, 0 to 18446744073709551615
				$setValue = ($setValue != "") ? intval($setValue) : "NULL";
				break;
			//http://dev.mysql.com/doc/refman/5.0/en/fixed-point-types.html
			//http://dev.mysql.com/doc/refman/5.0/en/floating-point-types.html
			case strstr($type, "float"):
			case strstr($type, "double"):
				$setValue = ($setValue != "") ? doubleval($setValue) : "NULL";
				break;
			case strstr($type, "datetime"):
			case strstr($type, "timestamp"):
			/*
				if($setValue==null || $setValue=='' || strlen($setValue) == 0){
					$setValue = date("Y-m-d H:i:s");
				}else{
					// convert string to date
					$tmpDate = date_parse($setValue);
					print_r($tmpDate);
					if(count($tmpDate["errors"]) == 0 && checkdate($tmpDate["month"], $tmpDate["day"], $tmpDate["year"]))
						$setValue = date("Y-m-d H:i:s"); // if convert with error, use the current date
					else
						$setValue = $tmpDate->format("Y-m-d H:i:s");
				}
				*/
					// convert string to date
					$tmpDate = date_parse($setValue);
					//print_r($tmpDate);
					if($tmpDate["error_count"] > 0)
						$setValue = date("Y-m-d H:i:s"); // if convert with error, use the current date
					else
						//$date = date_create_from_format("Y-m-d H:i:s", $setValue);
						$setValue = new DateTime($setValue);
				
				//echo $setValue." end";
				$setValue = $setValue->format("Y-m-d H:i:s");
				//$setValue = "'" . $setValue . "'";
				//echo $setValue;
				break;
			case strstr($type, "date"):
			/*
				if($this->IsNullOrEmptyString($setValue)){
					$setValue = date("Y-m-d");
				}else{
					// convert string to date
					$tmpDate = date_parse($setValue);
					if(!$tmpDate["errors"] == 0 && checkdate($tmpDate["month"], $tmpDate["day"], $tmpDate["year"]))
						$setValue = date("Y-m-d"); // if convert with error, use the current date
					else
						$setValue = $tmpDate->format("Y-m-d");
				}
				*/
					$tmpDate = date_parse($setValue);
					if($tmpDate["error_count"] > 0)
						$setValue = date("Y-m-d"); // if convert with error, use the current date
					else
						$setValue = new DateTime($setValue);
				
				$setValue = $setValue->format("Y-m-d");
				$setValue = "'" . $setValue . "'";
				break;
		}
		$this->_[$setColumn] = $setValue;
	}
	
	/**
	 * return a specifiy column value
	 * 
	 * @param string $getColumn, column name
	 * @return string
	 */
	function GetSQLValueString($getColumn)
	{
		$dataSchema = $this->dataSchema['data'];
		$structure = $this->SearchDataType($dataSchema, 'Field', $getColumn);
		$type = $structure[0]['Type'];
		$columnValue = $this->_[$getColumn];
		$returnValue = "NULL";
		
		// for debug and checking,
		// i don't kown why it must coding as $type===, otherwise $type='datetime' will cased as float/double
		$typeCaseAs = "";
		
		switch (true) {
			case strstr($type, "char"):
			case strstr($type, "varchar"):
			case strstr($type, "text"):
				if(is_string($columnValue)){
					$returnValue = $columnValue;
				}else{
					$returnValue = ($columnValue != "") ? "'" . $columnValue . "'" : "NULL";
				}
				$typeCaseAs = "text";
				break;
				//http://dev.mysql.com/doc/refman/5.0/en/integer-types.html
			case strstr($type, "tinyint"): // -128 to 127, 0 to 255
			case strstr($type, "smallint"): // -32768 to 32767, 0 to 65535
			case strstr($type, "mediumint"): // -8388608 to 8388607, 0 to 16777215
			case strstr($type, "int"): // -2147483648 to 2147483647, 0 to 4294967295
			case strstr($type, "bigint"): // -9223372036854775808 to 9223372036854775807, 0 to 18446744073709551615
				$returnValue = ($columnValue != "") ? intval($columnValue) : "NULL";
				$typeCaseAs = "integer";
				break;
				//http://dev.mysql.com/doc/refman/5.0/en/fixed-point-types.html
				//http://dev.mysql.com/doc/refman/5.0/en/floating-point-types.html
			case $type==="float":
			case $type==="double":
				$returnValue = ($columnValue != "") ? doubleval($columnValue) : "NULL";
				$typeCaseAs = "decimal";
				break;
			case $type==="date":
			/*
				if($this->IsNullOrEmptyString($columnValue)){
					$returnValue = date("Y-m-d");
				}else{
					// convert string to date
					$tmpDate = date_parse($columnValue);
					if(!$tmpDate["errors"] == 0 && checkdate($tmpDate["month"], $tmpDate["day"], $tmpDate["year"]))
						$returnValue = date("Y-m-d"); // if convert with error, use the current date
					else
						$returnValue = $tmpDate->format("Y-m-d");
				}
				$returnValue = "'" . $returnValue . "'";
				*/
				if(is_string($columnValue)){
					$returnValue = $columnValue;
				}else{
					$returnValue = ($columnValue != "") ? "'" . $columnValue . "'" : "NULL";
				}
				$typeCaseAs = "date";
				break;
			case $type==="datetime":
			case $type==="timestamp":
				if($this->IsNullOrEmptyString($columnValue)){
					$returnValue = date("Y-m-d H:i:s");
				}else{
					// convert string to date
					$tmpDate = date_parse($columnValue);
					if(count($tmpDate["errors"]) > 0)
						$returnValue = date("Y-m-d H:i:s"); // if convert with error, use the current date
					else
						//$returnValue = $tmpDate->format("Y-m-d H:i:s");
						// mktime(hour,minute,second,month,day,year)
						$returnValue = date("Y-m-d H:i:s", mktime(
							$tmpDate["hour"], 
							$tmpDate["minute"], 
							$tmpDate["second"], 
							$tmpDate["month"], 
							$tmpDate["day"], 
							$tmpDate["year"])
					);
				}
				$returnValue = "'" . $returnValue . "'";
				//return $columnValue;
				//if(is_string($columnValue)){
				//	$returnValue = $columnValue;
				//}else{
					//$returnValue = ($columnValue != "") ? "'" . $columnValue . "'" : "NULL";
				//}
				$typeCaseAs = "datetime";
				break;
		}
		
		//echo "value in:$columnValue, type:$type, entryType:$typeCaseAs, value out:$returnValue";
		return $returnValue;
	}
	
	function IsSystemField($fields){
		$isSystemField = false;
		
		$isSystemField = array_search($fields, $this->reserved_fields);
		/*
		switch($fields){
			case "systemCreateDate":
			case "systemUpdateDate":
			case "systemUpdateProgram":
			case "userUpdateDate":
			case "userUpdateProgram":
			case "createDate":
			case "createUser":
				$isSystemField = true;
				break;
		}*/
		
		
		return $isSystemField;
	}
	
	/**
	 *
	 * @param array $array a array or a nested array
	 * @param string $key search is the $key index exists in the array
	 * @param string $value find a array contain key index with $value value
	 * @return array, a array contains one or more array(s) which match $key as index and $value as value 
	 */
	function SearchDataType($array, $key, $value) {
		$results = array();
	
		if (is_array($array)) {
			if (isset($array[$key]) && $array[$key] == $value) {
				$results[] = $array;
			}
	
			foreach ($array as $subarray) {
				$results = array_merge($results, $this->SearchDataType($subarray, $key, $value));
			}
		}
	
		return $results;
	}
	
	/**
	 * 
	 * @param string $question input a sting
	 * @return boolean, true means that the string is null or empty otherwise false
	 */
	function IsNullOrEmptyString($question){
		return (!isset($question) || trim($question)==='');
	}
}

?>
