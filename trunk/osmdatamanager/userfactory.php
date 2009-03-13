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
  class User
  {
  	var $uid;
	var $username;
	var $email;
	var $homepage;
	var $location_lat;
	var $location_lon;
	var $abouthtml;
	var $picture;
	var $isadmin;
	
	function User($uid, $username, $email,$homepage, $latlon, $abouthtml, $picture)
	{
		$this->uid = $uid;
		$this->username = $username;
		$this->email = $email;
		$this->homepage = $homepage;
		$this->abouthtml = $abouthtml;
		$this->picture = $picture;
		$this->parseLocation($latlon);
		$this->isadmin = false;		
	}
	
	function parseLocation($latlon)
	{
		$tmp = split(";",$latlon);
		if ($tmp != null)
		{
			if (count($tmp) > 1)
			{
				$this->location_lat = $tmp[0];
				$this->location_lon = $tmp[1];
			}
		}
	}
	
	function getUid() {
		return $this->uid;
	}
	
	function getLocation()
	{
		return $this->location_lat.";".$this->location_lon;
	}
	
	function getUsername() {
		return $this->username;
	}
	
	function isAdmin() {
		//TODO
		return false;
	}
	
  }
  
  /**
   * Userfactory
   */
  class Userfactory extends DatabaseAccess
  {
  		
	function Userfactory()
	{
		parent::DatabaseAccess();		
	}
				
	function getUser($username)
	{
		$qry = "SELECT * FROM `tab_usr` WHERE username = '$username'";
		$result = $this->executeQuery($qry);
				
		if ($result != NULL) 
		{   
			$row = mysql_fetch_row($result);
			if ($row != null){
				$usr = new User($row[0],$row[1],$row[3],$row[4],$row[5],$row[6],$row[7]);
				return $usr;
			}
		}
		return null;
	}
	
	function updateUser($user) {		 
		 $qry1   =  "UPDATE `tab_usr` SET ";
		 //$qry1 = $qry1 + "`username`='".$aVal1."' ";
		 $qry1 = $qry1."`email`='".$user->email."' ";
		 $qry1 = $qry1.", `homepage`='".$user->homepage."' ";
		 $qry1 = $qry1.", `location`='".$user->getLocation()."' ";
		 $qry1 = $qry1.", `abouthtml`='".$user->abouthtml."' ";
		 $qry1 = $qry1.", `picture`='".$user->picture."' ";
		 $qry1 = $qry1." WHERE `id` = ".$user->uid."";
		 
		 $result = $this->executeQuery($qry1);
		 if ($result != null)
		 	return true;
		else
			return false;
		 //, `password`='".$aVal2."       ' WHERE `wd_id_es` = ".$id1;
	}
		
	function userNameExists($username)
	{
		if ($username == "")
			return false;
		
		$qry = "SELECT * FROM `tab_usr` WHERE username = '$username'";
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
	
	function getUserId($username)
	{
		if ($username == "")
			return -1;
		
		$qry = "SELECT * FROM `tab_usr` WHERE username = '$username'";
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
	
	
	function getPassword($username)
	{
		$qry = "SELECT * FROM `tab_usr` WHERE username = '$username'";
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
				
				$delquery = "DELETE FROM `tab_usr` WHERE (id = $usrid)";				
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
		$pof->createPoi($user->getUid(),"Cologne City","<b><a href=\"http://www.koeln.de\" target=\"_blank\">Cologne</a></b><br><a>This is the city of cologne<a>","50.94317428566237;6.958074772076103","");		
	
		$p1 = $pof->getPoi($user->getUid(),"Cologne City");
		$g1 = $gf->getGroupByName($user->getUid(),"Example Group");
		if (($p1 != null) && ($g1 != null)) {
			$gf->addGroupPoi($g1->getGroupId(),$user->getUid(),$p1->getPoiId());
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
		 		$qry1 = $qry1." WHERE `username` = '".$username."'";
								
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
		if (! $this->userNameExists(trim($username)))
		{
			$cryptpwd = crypt($password);
			$insquery = "INSERT INTO `tab_usr` (`username`,`password`,`email`) VALUES ('$username', '$cryptpwd','$email')";
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
