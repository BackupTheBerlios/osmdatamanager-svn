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
	 
	 //actions
	 define ("msg_crtgrp","msg.crtgrp");
	 define ("msg_delgrp","msg.delgrp");
	 define ("msg_getgrps","msg.getgrps");
	 define ("msg_addgrpfiles","msg.addgrpfiles");
	 define ("msg_updategrp","msg.updategrp");
	 	 	 
	 define ("msg_getchildgrps","msg.getchildgrps");
	 define ("msg_getgrpfiles","msg.getgrpfiles");
	 define ("msg_getgrppois","msg.getgrppois");
	 define ("msg_getgrpfilesrecursiv","msg.getgrpfilesrecursiv");
	 define ("msg_getgrppoisrecursiv","msg.getgrppoisrecursiv");
	 define ("msg_getgrpitems","msg.getgrpitems");
	 define ("msg_getpublicgrpitems","msg.getpublicgrpitems");	
				 
	 define ("msg_createpoi","msg.createpoi");
	 define ("msg_getpois","msg.getpois");
	 define ("msg_getpoi","msg.getpoi");
	 define ("msg_updatepoi","msg.updatepoi");
	 define ("msg_addgrppois","msg.addgrppois");	 
	 define ("msg_remgrppois","msg.remgrppois");
	 define ("msg_remgrpfiles","msg.remgrpfiles");
	 
	 	 
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
	 define ("msg_delok","msg.delok");
	 define ("msg_failed","msg.failed");
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
		 
	 /****************************************************
	 * END KONSTANTS
	 ****************************************************/ 
	 
	session_start();
				
	function application_userisvalid()
	{
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
		$json = new Services_JSON;
		//$js2 = new Services_JSON;
		$encoded = $json->encode($aMessage);
		return $encoded;	
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
			     $sqlFile = fread($f,filesize($sqlFileToExecute));
			     $sqlArray = explode(';',$sqlFile);	
					
				if ($sqlArray != null) {
				   foreach ($sqlArray as $stmt) {
				       if (strlen($stmt)>3){
				       	  	$this->executeQuery($stmt);
							/*				
				              if (!) {
				              //if (!$result){
				                 $sqlErrorCode = mysql_errno();
				                 $sqlErrorText = mysql_error();
				                 $sqlStmt      = $stmt;
				                 echo "error executiong sql: ".$stmt."<br/>";
								 break;
				              }    
				            */
				       }
					}
				}
			}
			
			function executeQuery($aQuery)
			{  
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
					  }
				  }
				}
				mysql_close($con1);
				return $result;
			}
		}
		
		
		/**
		 * base class for all "group" items
		 */
		class GroupItem {
			var $itemtype;
			
			function GroupItem($aItemtype)
			{
				$this->itemtype = $aItemtype;
			}	
		}
		
	
?>
