<?php
/*
    This file is part of osmdatamanager.

    osmdatamanager is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, only GPLv2.

    osmdatamanager is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with osmdatamanager.  If not, see <http://www.gnu.org/licenses/>.
	
*/
	include_once("JSON.php");
	include_once("userfactory.php");
   	include_once("config.php");
		
	/****************************************************
	 * constants
	 ****************************************************/ 
	 
	 //group actions
	 define ("msg_crtgrp","msg.crtgrp");
	 define ("msg_delgrp","msg.delgrp");
	 define ("msg_getgrps","msg.getgrps");
	 define ("msg_updategrp","msg.updategrp");
	 define ("msg_addgrpitm","msg.addgrpitm");	
		 	 
	 define ("msg_getchildgrps","msg.getchildgrps");
	 define ("msg_getgrp","msg.getgrp");
	 
	 define ("msg_getpublicgrpitems","msg.getpublicgrpitems");	
     define ("msg_remgrpitm","msg.remgrpitm");
	 define ("msg_gettree","msg.gettree");
	 	 
	 //poi actions
	 define ("msg_createpoi","msg.createpoi");
	 define ("msg_deletepoi","msg.deletepoi");
	 define ("msg_getpois","msg.getpois");
	 define ("msg_getpoi","msg.getpoi");
	 define ("msg_updatepoi","msg.updatepoi");
	 // 
	 	 
	 //login - out - user
	 define ("msg_login","msg.login");	 
	 define ("msg_logout","msg.logout");
	 define ("msg_chklogin","msg.chklogin");
	 define ("msg_registeruser","msg.registeruser");
	 define ("msg_updateuser","msg.updateuser");
	 define ("msg_deleteuser","msg.deleteuser");
	 define ("msg_changepassword","msg.changepassword");
	 
	 //files
	 define ("msg_updatefile","msg.updatefile");
	 define ("msg_updatefilelist","msg.updatefilelist");
	 define ("msg_getfiles","msg.getfiles");
	 	 	
	 //ftp
	 define ("msg_getftpfiles","msg.getftpfiles");
	 
	 //return values
	 define ("msg_crtok","msg.crtok");
	 define ("msg_addok","msg.addok");
	 define ("msg_remok","msg.remok");
	 define ("msg_delok","msg.delok");
	 define ("msg_failed","msg.failed");
	 define ("msg_empty","{items: []}");
	 define ("msg_none","msg.none");
	 define ("msg_exists","msg.exists");
	 define ("msg_logoutok","msg.logoutok");
	 define ("msg_loginfailed","msg.loginfailed");
	 define ("msg_registerok","msg.registerok");
	 define ("msg_registerfailed","msg.registerfailed");
	 define ("msg_userexists","msg.userexists");
	 //define ("msg_updateuserok","msg.updateuserok");
	 //define ("msg_updateuserfailed","msg.updateuserfailed");
	 define ("msg_updateok","msg.updateok");
	 
	 
	 //db types
	 define ("protection_private","private");
	 define ("protection_friend","friend");
	 define ("protection_public,","public");
	 		 
	 /****************************************************
	 * END KONSTANTS
	 ****************************************************/ 
	 
	session_start();
				
	function application_userisvalid()
	{
		global $gl_applicationlogins;
		$clientname = $_REQUEST['clientname'];
		if (isset($clientname)) {
			foreach ($gl_applicationlogins as $app) {
			    if ($app["clientname"] == $clientname) {
			    	return true;
			    }
			}
		}
		
		if (isset($_SESSION['validuser'])) {
			return true;
		}
		return false;
	}
	
	function application_userisadmin()
	{
		$usr = application_gevaliduser();
		if ($usr != null) {
			if ($usr->isAdmin()) {
				return true;
			}
		}
		return false;
	}
	
	function application_activateuser($user) {
		$_SESSION['validuser'] = $user;
	}
	
	function application_logout() {
		$_SESSION['validuser'] = null;
	}
	
	function application_gevaliduser()
	{
		global $gl_applicationlogins;
		$clientname = $_REQUEST['clientname'];
		if (isset($clientname)) {
			foreach ($gl_applicationlogins as $app) {
			    if ($app["clientname"] == $clientname) {
			    	$userfactory = new Userfactory();
					$usr = $userfactory->loginUser($app["username"],$app["password"]);	
					return $usr;
			    }
			}
			$_SESSION['validuser'] = null;
			return null;
		}
		
		if (isset($_SESSION['validuser']))
		{
			$user = $_SESSION['validuser'];
			return $user;
		}
		return null;
	}
	
	
	function application_loginuser($username, $password)
	{
		$userfactory = new Userfactory();
		if ($userfactory->userNameExists(trim($username)))
		{
			$usr = $userfactory->loginUser($username,$password);
			if ($usr != null) {
				application_activateuser($usr);	
				return $usr;
			} else {
				return null;
			}

		  return $result_msg;
		} else
		{
			return null;
		}
	}
	
	function application_updateactiveuser($username, $email, $lat, $lon, $about, $picture) {
		if (isset($_SESSION['validuser']))
		{
			$user = $_SESSION['validuser'];
			$user->location_lat = $lat;
			$user->location_lon = $lon;
			$user->email = $email;
			$user->abouthtml = $about;
			$user->picture = $picture;
			$_SESSION['validuser'] = $user;
			$userfactory = new Userfactory();
			return $userfactory->updateUser($user);
		}
		return false;
	}
	
	function application_getMessage($aMessage) {
		if ($aMessage != "") {
			$json = new Services_JSON;
			//$js2 = new Services_JSON;
			$encoded = $json->encode($aMessage);
			return $encoded;	
		}
	}
	
				
		/**
		 * base class for all classes with database access
		 */
		class DatabaseAccess {
		
			var $dbuser;
			var $dbpwd;
			var $dbname;
			var $dbhost;
			var $errors;
			//var $loglevel;
			var $domessage;
			var $readonly;
			var $fieldnames;
			var $lastid;
									
			function DatabaseAccess()
			{
				global $gl_dbuser;
				global $gl_dbpwd;
				global $gl_dbname;
				global $gl_readonly;
				global $gl_dbhost;
								
				$this->dbuser = $gl_dbuser;
				$this->dbpwd  = $gl_dbpwd;
				$this->dbname =	$gl_dbname;
				$this->dbhost = $gl_dbhost;
				$this->readonly = $gl_readonly;
				//$this->loglevel =	$gl_loglevel;
				$this->errors = "";
				$this->domessage = true;
				$this->fieldnames = null;
				$this->lastid = -1;
			}
			
			function addLogMessage($aMessage, $aLevel) {
				
				$this->domessage = false;
				$level = "DEBUG";
				if ($aLevel != "") {
					$level = $aLevel;
				}
				
				global $gl_loglevel;
				if ($gl_loglevel > 1) {
					echo $aMessage." - ".$aLevel;
				}
				
				$insquery = "INSERT INTO `tab_message` (`date`,`loglevel`,`message`) VALUES (NOW(),'$level','$aMessage')";
				//echo $insquery;
				$this->executeQuery($insquery);
				$this->domessage = true;
			}
			
			function addMessage($aMessage) {
				$this->addLogMessage($aMessage,"");
			}
			
			/**
			 * check if the global db settings will work
			 * @return 
			 */
			function checkDbConnection() {
				$result = true;
				
				$con1 = mysql_connect($this->dbhost,$this->dbuser,$this->dbpwd);
				if ($con1)
			    {
			    	echo "database connection successful... <br/>";
				} else {
					$result = false;
					echo "could not connect with database<br/>";
				}
				
				if (!(mysql_select_db($this->dbname))) 
			    {
			    	echo "could not open database: ".$this->dbname."<br/>";
					$result = false;
				}
				
				if ($con1)
					mysql_close($con1);
					
				return $result;
			}
			
			/**
			 * creates the table structure
			 * @return 
			 */
			function createTableStructure() {
				 $sqlFileToExecute = "osmdatamanager.sql";
				 $f = fopen($sqlFileToExecute,"r");
			     if ($f === false) {
			     	echo "could not open: ".$sqlFileToExecute."!! <br/>"; 
			     } else {
					$sqlFile = fread($f,filesize($sqlFileToExecute));
				     $sqlArray = explode(';',$sqlFile);	
						
					if ($sqlArray != null) {
					   foreach ($sqlArray as $stmt) {
					       if (strlen($stmt)>3){
					       	  	$this->executeQuery($stmt);
					       }
						}
					}
				}
			}
			
			/**
			 * executes a sql query
			 * @return 
			 * @param $aQuery Object
			 */						
			function executeQuery($aQuery)
			{  
				
				$this->lastid = -1;
				
				//check if read only mode (no insert, update and delete allowed)
				if ($this->readonly) {
					$ro = strpos(strtolower($aQuery), "insert");
					if ($ro !== false) {
						return false;
					}
					$ro = strpos(strtolower($aQuery), "update");
					if ($ro !== false) {
						return false;
					}
					$ro = strpos(strtolower($aQuery), "delete");
					if ($ro !== false) {
						return false;
					}
				}
				
				global $gl_loglevel;
				if (($gl_loglevel > 0) && ($this->domessage)) {
					$this->addMessage($aQuery);
				}
								
				$con1 = mysql_connect($this->dbhost,$this->dbuser,$this->dbpwd);
				if (!$con1)
			    {
			      //logerror("Fehler mxsql_connect()",1);
			      $this->errors = $this->errors."Fehler mysql_connect()";
				  return null;
			    }
			  
			    if (!(mysql_select_db($this->dbname))) 
			    {
			      //logerror("Fehler mysql_select_db",1);
			      $this->errors = $this->errors."Fehler mysql_select_db";
				  mysql_close($con1);
				  return null;
			    }
				
				$result = mysql_query($aQuery);
				if (!$result) {
					$this->errors = $this->errors.mysql_error();
					mysql_close($con1);
					return null;
				} else {
				  $pos = strpos(strtolower($aQuery), "select");
				  if ($pos === 0) {
					  if (mysql_num_rows($result) < 1) {
					  	mysql_close($con1);
						return null;
					  }
				  } else {
				  	if (mysql_affected_rows() < 1) {
					  	mysql_close($con1);
						return null;
					  } else {
					  	$result = true;
					  }
				  }
				}
				
				$this->lastid = mysql_insert_id($con1);
				mysql_close($con1);
				
				/*
				$pos = strpos(strtolower($aQuery), "select");
				if ($pos === 0) {
					$this->parseFieldnames($result);
				}*/
				
				return $result;
			}
			
			
			function parseFieldnames($aResult) {
				if ($aResult == null)
					return;
				
				$this->fieldnames = null;
        		$field = mysql_num_fields($aResult);
        		for ( $i = 0; $i < $field; $i++ ) {
            		$names[] = mysql_field_name($aResult, $i);
        		}
        		$this->fieldnames = $names;
    		}
		}
		
		
		/**
		 * base class for items from database
		 */
		/*
		class DatabaseItem {
			
			var $fieldnames;
			
			function DatabaseItem() {
				$this->fieldnames = null;	
			}
			
			/**
			 * returns an array of fieldnames from a mysql result
			 * @return 
			 * @param $aResult Object
			 */
			/*
			
			
			/**
			 * 
			 * @return 
			 * @param $aResult Object
			 */
			/*
			function parseItem($aResult) {
				$this->parseFieldnames($aResult);
			}
		}
		*/
		
		/**
		 * base class for items wich can be displayed on the map
		 * -> protection, zoomlevel and lat lon 
		 */
		class MapItem {
			var $protection;
			var $zoomlevel;
			var $lat;
			var $lon;	
								
			function MapItem() {
				global $gl_baselat;
				global $gl_baselon;
				global $gl_basezoomlevel;
								
				$this->protection = protection_private;
				$this->zoomlevel  = $gl_basezoomlevel;
				$this->lat = $gl_baselat;
				$this->lon = $gl_baselon;
			}
		}
		
		/**
		 * 
		 */
		class TagData {
			var $tagname;
			var $icon1;
			var $icon2;
			var $icon3;
			
			function TagData($aTagname,$aIcon1,$aIcon2,$aIcon3) {
				$this->tagname = $aTagname;
				$this->icon1 = $aIcon1;
				$this->icon2 = $aIcon2;
				$this->icon3 = $aIcon3;
			}
		}
		
		/**
		 * base class for all "group" items
		 */
		class GroupItem extends MapItem {
			var $itemtype;
			var $tagname;
			var $itemid;
			var $parentid;
			var $usrid;
			var $itemname;
			var $tags;
			var $name;  //the same value as itemname, used for the tree
			var $id;    //unique id for the tree
			var $children;
			var $isvirtual;
						
			function GroupItem($aItemtype)
			{
				parent::MapItem();
				global $gl_standardtag;
							
				$this->itemtype = $aItemtype;
				$this->tagname  = $gl_standardtag;
				$this->itemid   = -1;
				$this->parentid = -1;
				$this->usrid    = -1;				
				$this->itemname = "new item";
				$this->tags = null;
				$this->children = array();
				$this->id = "";
				$this->isvirtual = false;
			}
			
			function addChild(&$aItem) {
				array_push($this->children,$aItem);
			}
			
			/**
			 * 
			 * @return 
			 */
			function prepareForTree($aParentId) {
				$this->name = $this->itemname;
				//array_push($this->children, "__Dummy");
				$this->parentid = $aParentId;
				$this->id = "__".$this->itemtype.$aParentId."_".$this->itemid;
				/*
				if ($this->haschildren) {
					$this->id = "__grpitm__".$aParentId."_".$this->itemname;
				}
				*/
				//echo $this->id;
			}
			
			
			function prepareForTree_virtual($aParentId) {
				$this->name = $this->itemname;
				$this->id = $aParentId."_".$this->itemtype."_".$this->itemname;
			}
						
			/**
			 * set's a new filename for the expanded icon displayed in the tree
			 * @return 
			 * @param $aIconname Object
			 */
			/*
			function setIcon_Expanded($aIconname) {
				$this->icon_expanded = $aIconname;	
			}
			*/
			
			/**
			 * set's a new filename for the collapsed icon in the tree;
			 * @return 
			 * @param $aIconname Object
			 */
			/*
			function setIcon_Collapsed($aIconname) {
				if (($aIconname != null) && ($aIconname != ""))
					$this->icon_collapsed = $aIconname;	
			}
			*/
		}
		
	
?>
