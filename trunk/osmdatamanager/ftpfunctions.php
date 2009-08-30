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
   	include_once("JSON.php");
 	include_once("directoryfactory.php");
 	
	$action  		= $_REQUEST['action'];
	if (isset($action)) {
		//add other variables here
	} else {
		//uncomment for debug
		/* 
		$action  		= $_GET['action'];
		*/
	}
	  
   if (application_userisvalid()) { 
	  $usr = application_getvaliduser();
	  if ($usr != null) {	
	  	
		//msg_getftpfiles
		if ($action == msg_getftpfiles) {
			$df = new DirectoryFactory();
			$geslist = $df->listFiles_Ftp($usr);		
			if ($geslist != null) {
				echo application_getMessage($geslist);
			} else {
				echo application_getMessage(msg_failed);
			}
		}
	  }
	}


?>