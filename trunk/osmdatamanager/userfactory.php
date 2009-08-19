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

  include_once("application.php");
  include_once("directoryfactory.php");
  include_once("groupfactory.php");
  include_once("poifactory.php");
  
  /**
   * User
   */
  class User extends GroupItem
  {
	var $email;
	var $homepage;
	var $description;
	var $picture;
	var $isadmin;
	
	function User()
	{
		parent::GroupItem("User");
		$this->zoomlevel=null;
		$this->lat=null;
		$this->lon=null;
		$this->isadmin=false;
	}
	
	function getUid() {
		return $this->itemid;
	}
	
	function getLocation()
	{
		return $this->lat.";".$this->lon;
	}
	
	function getUsername() {
		return $this->itemname;
	}
	
	function isAdmin() {
		return $this->isadmin;
	}
	
  }
  
  /**
   * Userfactory
   */
  class Userfactory extends ItemParser
  {
  		
	function Userfactory()
	{
		parent::ItemParser();		
	}
	
	/**
	 * 
	 * @return 
	 * @param $aRow Object
	 * @param $aResult Object
	 */
	function parse_User(&$aItem, $aRow, $aResult) {
		$this->parseFieldnames($aResult);
		
		$this->parse_GroupItem($aItem, $aRow, $aResult);
		for ($i=0;$i<count($this->fieldnames);$i++) {
			$fn1 = $this->fieldnames[$i];
			switch ($fn1) {
				case "description":
					$aItem->description = $aRow[$i];
					break;
				case "picture":
					$aItem->picture = $aRow[$i];
					break;
				case "homepage":
					$aItem->picture = $aRow[$i];
					break;
				case "email":
					$aItem->email = $aRow[$i];
					break;
				case "admin":
					if ($aRow[$i] == "1")
						$aItem->isadmin = true;
					else
						$aItem->isadmin = false;
					break;
			}
		}
	}
		
	/**	
	 * 
	 * @return 
	 * @param $username Object
	 */
	function getUser($username)
	{
		$qry = "SELECT * FROM `tab_usr` WHERE itemname = '$username'";
		$result = $this->executeQuery($qry);
				
		if ($result != NULL) 
		{   
			$row = mysql_fetch_row($result);
			if ($row != null){
				$usr = new User();
				$this->parse_User($usr,$row,$result);
				return $usr;
			}
		}
		return null;
	}
	
	/**
	 * returns a list with all users
	 * @return 
	 */
	function getAllUsers() {
		$users = array();
		
		$qry = "SELECT * FROM `tab_usr` WHERE 1";
		$result = $this->executeQuery($qry);
				
		if ($result != NULL) 
		{   
			while ($row = mysql_fetch_row($result))
			{
				if ($row != null){
					$usr = new User();
					$this->parse_User($usr,$row,$result);
					array_push($users, $usr);
				}
			}
			return $users;
		}
		return null;
	}
	
	/**
	 * 
	 * @return 
	 * @param $userid Object
	 */
	function getUserById($userid)
	{
		$qry = "SELECT * FROM `tab_usr` WHERE itemid = $userid";
		$result = $this->executeQuery($qry);
				
		if ($result != NULL) 
		{   
			$row = mysql_fetch_row($result);
			if ($row != null){
				$usr = new User();
				$this->parse_User($usr,$row,$result);
				return $usr;
			}
		}
		return null;
	}
		
	/**
	 * 
	 * @return 
	 * @param $userid Object
	 * @param $username Object
	 * @param $lat Object
	 * @param $lon Object
	 * @param $htmltext Object
	 * @param $tagname Object
	 * @param $email Object
	 * @param $picture Object
	 */
	function updateUser($userid, $username, $lat, $lon,$zoomlevel, $htmltext, $tagname, $email, $picture) {		 		 
		 $qry1   =  "UPDATE `tab_usr` SET ";
		 //$qry1 = $qry1 + "`username`='".$aVal1."' ";
		 $qry1 = $qry1."`email`='".$email."' ";
		 $qry1 = $qry1.", `itemname`='".$username."' ";
		 $qry1 = $qry1.", `lat`='".$lat."' ";
		 $qry1 = $qry1.", `lon`='".$lon."' ";
		 $qry1 = $qry1.", `zoomlevel`= ".$zoomlevel." ";
		 $qry1 = $qry1.", `tagname`='".$tagname."' ";
		 $qry1 = $qry1.", `description`='".$htmltext."' ";
		 $qry1 = $qry1.", `picture`='".$picture."' ";
		 $qry1 = $qry1." WHERE `itemid` = ".$userid."";
		 
		 $result = $this->executeQuery($qry1);
		 if ($result != null)
		 	return true;
		else
			return false;
		 //, `password`='".$aVal2."       ' WHERE `wd_id_es` = ".$id1;
	}
	
	/**
	 * returns true if a user with given username exists
	 * @return 
	 * @param $username Object
	 */	
	function userNameExists($username)
	{
		if ($username == "")
			return false;
		
		$qry = "SELECT * FROM `tab_usr` WHERE itemname = '$username'";
		$result = $this->executeQuery($qry);
				
		if ($result != NULL) 
		{   
			while ($row = mysql_fetch_row($result))
			{
				$usr = $row[1];
				if (strtolower($usr) == strtolower($username))
					return true;
			}
		}
		return false;
	}
	
	/**
	 * returns the itemid from given username
	 * @return 
	 * @param $username Object
	 */
	function getUserId($username)
	{
		if ($username == "")
			return -1;
		
		$qry = "SELECT * FROM `tab_usr` WHERE itemname = '$username'";
		$result = $this->executeQuery($qry);
				
		if ($result != NULL) 
		{   
			$row = mysql_fetch_row($result);
			if ($row != null) {
				return $row[0];
			}
		}
		return -1;
	}
	
	/**
	 * returns encrypted password from user with given username
	 * @return 
	 * @param $username Object
	 */
	function getPassword($username)
	{
		$qry = "SELECT * FROM `tab_usr` WHERE itemname = '$username'";
		$result = $this->executeQuery($qry);
				
		if ($result != NULL) 
		{   
			while ($row = mysql_fetch_row($result))
			{
				$usr = $row[1];
				if (strtolower($usr) == strtolower($username))
					return $row[2];
			}
		}
		return false;
	}
	
	/**
	 * login in a user (check password an return the user object if successful)
	 * @return 
	 * @param $username Object
	 * @param $password Object
	 */
	function loginUser($username, $password)
	{
		$pwd = $this->getPassword($username);
		if ($pwd != null)
		{
			if ($pwd == crypt($password,$pwd)) {
				$this->addLogMessage("User $username logged in","INFO");
				return $this->getUser($username);
			}
		}
		return null;
	}
	
	/** //TODO checken
	 * deletes a user an all his data
	 * @return 
	 * @param $username Object
	 */
	function deleteUser($username) {
		$usr = $this->getUser($username);
		if ($usr != null) {
			
			$usrid = $usr->getUid();
			if (($usrid != null) &&($usrid != "")) {
				$delquery = "DELETE FROM `tab_file` WHERE (usrid = $usrid)";				
				$this->executeQuery($delquery);	
				
				$delquery = "DELETE FROM `tab_grp` WHERE (usrid = $usrid)";				
				$this->executeQuery($delquery);	
				
				$delquery = "DELETE FROM `tab_grp_file` WHERE (usrid = $usrid)";				
				$this->executeQuery($delquery);	
				
				$delquery = "DELETE FROM `tab_grp_poi` WHERE (usrid = $usrid)";				
				$this->executeQuery($delquery);	
				
				$delquery = "DELETE FROM `tab_poi` WHERE (usrid = $usrid)";				
				$this->executeQuery($delquery);	
				
				$delquery = "DELETE FROM `tab_usr` WHERE (itemid = $usrid)";				
				$this->executeQuery($delquery);	
				
				$this->addLogMessage("User $usrid-$username deleted","INFO");
				
				$df = new DirectoryFactory();
				$df->login();
				$df->deleteUserDir($usrid);
				$df->logout();
			}
		}
	}
	
	/**
	 * creates a example group
	 * @param $user Object
	 */
	function createExampleGroup($user) {
		$gf = new Groupfactory();
		$gf->createGroup($user->getUid(),"Example Group",-1);
	}
	
	/**
	 * creates a example poi
	 * @param $user Object
	 */
	function createExamplePoi($user) {
		$pof = new PoiFactory();
		$gf = new Groupfactory();
		$pof->createPoi($user->getUid(),"Cologne City","<b><a href=\"http://www.koeln.de\" target=\"_blank\">Cologne</a></b><br><a>This is the city of cologne<a>","50.94317428566237","6.958074772076103","14","standard_poi");		
	
		$p1 = $pof->getPoi($user->getUid(),"Cologne City");
		$g1 = $gf->getGroupByName($user->getUid(),"Example Group");
		if (($p1 != null) && ($g1 != null)) {
			//$gf->addGroupPoi($g1->getGroupId(),$user->getUid(),$p1->getPoiId());
			//($aGroupId, $aUsrId, $aItemid,$aItemType) {
			$gf->addGroupItem($g1->itemid,$user->itemid,$p1->itemid,$p1->itemtype);
		}
	}
	
	/**
	 * changes the password
	 * @return 
	 * @param $username Object
	 * @param $oldpassword Object
	 * @param $newpassword Object
	 */
	function changePassword($username, $oldpassword, $newpassword) {
		$pwd = $this->getPassword($username);
		if ($pwd != null)
		{
			if ($pwd == crypt($oldpassword,$pwd)) {
				$cryptpwd = crypt($newpassword);
				
				$qry1   =  "UPDATE `tab_usr` SET ";
		 		$qry1 = $qry1."`password`='".$cryptpwd."' ";
		 		$qry1 = $qry1." WHERE `itemname` = '".$username."'";
								
				if ($this->executeQuery($qry1) == null)
				{
					return false;
				}
				
				$this->addLogMessage("password changed for user: $username","INFO");
				return true;
			}
		}
		return false;
	}
	
	/**
	 * registers a new user
	 * @return true if successful otherwise false
	 * @param $username Object
	 * @param $password Object
	 * @param $email Object
	 */
	function registerUser($username, $password, $email)
	{
		if (trim($username) == "")
			return false;
		
		if (! $this->userNameExists(trim($username)))
		{
			$cryptpwd = crypt($password);
			$insquery = "INSERT INTO `tab_usr` (`itemname`,`password`,`email`,`tagname`) VALUES ('$username', '$cryptpwd','$email','user')";
			if ($this->executeQuery($insquery) == null)
			{
				return false;
			}
			
			$this->addLogMessage("new user registrated $username - $email","INFO");
			return true;
		}
	}
  
  }
  
  
?>
