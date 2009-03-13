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
   include_once("filefactory.php");	
   include_once("directoryfactory.php");
    
	$action  		= $_REQUEST['action'];
	if (isset($action)) {
		$filename		= $_REQUEST['filename'];	
		$description    = $_REQUEST['description'];	

		global $gl_loglevel;
		$gl_loglevel 	= 1;
	} else {
		//uncomment for debug
		/*
		$action  		= $_GET['action'];
		$filename		= $_GET['filename'];
		$description    = $_GET['description'];	

		global $gl_loglevel;
		$gl_loglevel 	= 1;
		*/
	}
	
	if (application_userisvalid()) { 
		$usr = application_gevaliduser();
	  	if ($usr != null) {	
	  		$df = new DirectoryFactory();
			$ff = new FileFactory();
			
			global $gl_usefiledir;
			global $gl_filedir;
			
			//msg_updatefilelist
			//TODO delete file from db if the file does not exist in directory
			if ($action == msg_updatefilelist) {
				if ($gl_usefiledir) {
					$lst1 = $df->listFiles_Dir($usr->getUid(),$gl_filedir,array("gpx","xml"));
				} else {
					$df->login();
					$lst1 = $df->listFiles_Ftp($usr->getUid(),array("gpx","xml"));
					$df->logout();
				}
				
				if ($lst1 != null) {
					for ($i=0;$i<count($lst1);$i++) {
						$fn = $lst1[$i];
						if (! $ff->fileExists($usr->getUid(), $fn)) {
							$ff->createFile($usr->getUid(),$fn,NULL);
						}
					}
				}
			}
			
			//msg_getfiles
			if ($action == msg_getfiles) {
				$lst1 = $ff->getFiles($usr->getUid());
				if ($lst1 != null) {
					echo application_getMessage($lst1);
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			
			//msg_updatefile
			if ($action == msg_updatefile) {				
				if ($ff->updateFile($usr->getUid(), $filename, $description)) {
					echo application_getMessage(msg_updateok);
				} else {
					echo application_getMessage(msg_failed);
				}	
			}
		}
	}
	
	
?>