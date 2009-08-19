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
  
  $action    = $_REQUEST['action'];
  if (isset($action)) {  
	  $username  = $_REQUEST['username'];
	  $userid    = $_REQUEST['userid'];  
	  $password  = $_REQUEST['password'];
	  $email     = $_REQUEST['email'];
	  $lat  	 = $_REQUEST['lat'];
	  $lon  	 = $_REQUEST['lon'];
 	  $htmltext	 = $_REQUEST['htmltext'];
	  $tagname	 = $_REQUEST['tagname'];
	  $picture   = $_REQUEST['picture'];
	  $deleteuser =  $_REQUEST['deleteuser'];
	  $newpassword = $_REQUEST['newpassword'];
	  $zoomlevel = $_REQUEST['zoomlevel'];
	  
	  global $gl_loglevel;
  } else {
  	  //uncomment for debug
	  /*
	  $action    = $_GET['action'];
	  $username  = $_GET['username'];  
	  $password  = $_GET['password'];
	  $email     = $_GET['email'];
	  $lat  	 = $_GET['lat'];
	  $lon  	 = $_GET['lon'];
	  $about  	 = $_GET['about'];
	  $picture   = $_GET['picture'];
	  $deleteuser = $_GET['deleteuser'];
	  $newpassword = $_GET['newpassword'];
	  global $gl_loglevel;
	  $gl_loglevel 	= 1;
	   */
  }
    		   
  //msg_logout
  if ($action == msg_logout) {
  	 application_logout();	
	 echo application_getMessage(msg_logoutok);
	 return;
  }
  
  //msg_login
  if ($action == msg_login)
  {
	  $usr = application_loginuser($username,$password);
	  if ($usr != null)
	  {
		  echo application_getMessage($usr);
	  } else
	  {
		echo application_getMessage(msg_loginfailed);
	  }
  }
  
  //msg_chklogin
  if ($action == msg_chklogin)
  {
  	 $usr = application_gevaliduser();
	  if ($usr != null)
	  {
		echo application_getMessage($usr);
	  } else
	  {
		echo application_getMessage(msg_loginfailed);
	  }
  }
  
  //msg_registeruser
  if ($action == msg_registeruser) 
  {
  	$userfactory = new Userfactory();
	if (!$userfactory->userNameExists(trim($username)))
	{
		if ($userfactory->registerUser($username,$password,$email)) {
			$usr = application_loginuser($username,$password);
			if ($usr != null)
			{
				  $df = new DirectoryFactory();
				  $df->login();
				  $df->createDirectory("trf_".$usr->getUid());
				  $df->logout();			  
				  $userfactory->createExampleGroup($usr);
				  $userfactory->createExamplePoi($usr);
				  
				  echo application_getMessage($usr);				  
				  return;
			} 
		} else {
			echo application_getMessage(msg_registerfailed);
			return;
		}
	} else
	{		  
	   echo application_getMessage(msg_userexists);
	}	
  }
  
  //msg_updateuser
  if ($action == msg_updateuser)
  {
	if (application_userisvalid()) {
		$usr = application_gevaliduser();
		if ($usr != null)
		{
		  if ($usr->itemid == $userid) {
		  		$uf = new UserFactory();
				if ($usr->itemname != $username) {
		  			 if ($uf->userNameExists($username)) {
						echo application_getMessage(msg_failed);
						EXIT;
					 }
		  		}				
				
				if ($uf->updateUser($userid, $username, $lat, $lon,$zoomlevel, $htmltext, $tagname, $email, $picture)) {
					$usr = $uf->getUserById($userid);
					if ($usr != null) {
						application_activateuser($usr);
						echo application_getMessage($usr);
					}
				} else {
					echo application_getMessage(msg_failed);
				}
		  }
		}
	}	
  }
  
  //msg_changepassword
  if ($action == msg_changepassword)
  {
	if (application_userisvalid()) {
		$usr = application_gevaliduser();
		if ($usr != null)
		{	
			$uf = new UserFactory();
			if ($uf->changePassword($usr->getUsername(), $password, $newpassword)) {
				echo application_getMessage(msg_updateok);
			} else {
				echo application_getMessage(msg_failed);
			}
		}
	}	
  }
  
  //msg_deleteuser
  if ($action == msg_deleteuser)
  {
	if (application_userisadmin()) {
		$userfactory = new Userfactory();
		if ($userfactory->userNameExists(trim($deleteuser)))
		{
			$userfactory->deleteUser(trim($deleteuser));
			echo application_getMessage(msg_delok);
		} else {
			echo application_getMessage(msg_failed);
		}
	}	
 }
  
   
?>
