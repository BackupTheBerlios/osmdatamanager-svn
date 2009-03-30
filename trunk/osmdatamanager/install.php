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
	
	/*
	 * at the moment this file does not the complete installation, it's a little helper !!
	 * 
	 */
	include_once("application.php");
	include_once("userfactory.php");
	include_once("directoryfactory.php");
	
	/*
	 * Begin General Settings (you can edit this)
	 */
	
	$refusr       =  "Testuser";
	$refusr_pwd	  =  "Testuser";
	$refusr_email =  "x@y.de";
	
	
	/*
	 * End General Settings, do not edit the following code
	 */
	
	//check the db connection
	$dba1 = new DatabaseAccess();
	if ($dba1->checkDbConnection()) {
		$dba1->createTableStructure();
		
		$uf1 = new UserFactory();
		if ($uf1->registerUser($refusr,$refusr_pwd,$refusr_email)) {
			echo "user created successfully<br/>";
			
			//try to login
			$usr = application_loginuser($refusr,$refusr_pwd);
			if ($usr != null)
			{
				$df = new DirectoryFactory();
			  	$df->login();
			  	if ($df->createDirectory("trf_".$usr->getUid())) {
			  		echo "user directory created successfully<br/>";
			  	} else {
			  		echo "could not create user directory you can do it manually<br/>";
			  	}
			  	
				$df->logout();
				
				$uf1->createExampleGroup($usr);
				$uf1->createExamplePoi($usr);
			} else {
				echo "could not login user: ".$username."<br/>"	;
			}
		} else {
			echo "could not create user: ".$refusr."<br/>";
			//$uf1->deleteUser($refusr);
		}
	}
	
	
	echo "<hr><br/>";
	phpinfo();
?>
