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
		$itemid  		= $_REQUEST['itemid'];	
		$itemname   	= $_REQUEST['itemname'];	
		$tagname     	= $_REQUEST['tagname'];	
		$zoomlevel  	= $_REQUEST['zoomlevel'];
		$lat 		    = $_REQUEST['lat'];
		$lon            = $_REQUEST['lon'];
		
		global $gl_loglevel;
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
						
			global $gl_filedir;
		
			//msg_updatefilelist
			//TODO delete file from db if the file does not exist in directory
			if ($action == msg_updatefilelist) {
				//$ff->updateFiles($usr->getUid());
				$ff->setInvalid($usr->getUid());
				
				$lst1 = $df->listFiles_Dir($usr->getUid(),$gl_filedir,array("gpx","xml"));
				if ($lst1 != null) {
					for ($i=0;$i<count($lst1);$i++) {
						$fn = $lst1[$i];
						if (! $ff->fileExists($usr->getUid(),basename($fn))) {
							$path = $gl_ftpprefix.dirname($fn)."/";
							$filename = basename($fn);																						
							$ff->createFile($usr->getUid(),$path,$filename,NULL);
						} else {
							$ff->setValid($usr->getUid(),basename($fn));
						}
					}
				}
				$ff->deleteInvalid($usr->getUid());
			}
					
			//$files = array();
			if ($action == msg_getfiles) {
				$lst1 = $ff->getFiles($usr->getUid());
				if ($lst1 != null) {
					$fc = new FileContainer();
					for ($i=0;$i<count($lst1);$i++) {
						$fn = $lst1[$i];
						$fc->addFile($fn);
					}
					
					echo application_getMessage($fc);
				} else {
					echo msg_empty;
				}
			}
			
			
			//msg_updatefile
			if ($action == msg_updatefile) {				
				if ($ff->updateFile($usr->getUid(),$itemid,$itemname,$lat,$lon,$zoomlevel,$tagname)) {
					$fl1 = $ff->getFile($usr->getUid(),$itemid);
					if ($fl1 != null) {
						echo application_getMessage($fl1);
					} else {
						echo application_getMessage(msg_failed);	
					}
				} else {
					echo application_getMessage(msg_failed);
				}	
			}
			/*
			if ($action == "") {
				echo "{\"timestamp\":1193692111,\"items\":[{\"namespace\":\"dijit\",\"className\":\"dijit.ColorPalette\",\"summary\":\"Grid showing\"}]}";
				
				$lst1 = $ff->getFiles($usr->getUid());
				if ($lst1 != null) {
					echo application_getMessage($lst1);
				} else {
					echo application_getMessage(msg_failed);
				}
				
			}
			*/
		}
	}
	
	
?>