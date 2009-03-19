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
   	include_once("picturefactory.php");
	
	
	if (application_userisvalid()) {
   		global $gl_usepicturedir;
   		global $gl_picturedir;
   		
   		$usr = application_gevaliduser();
		if ($usr != null) {
			$df = new DirectoryFactory();
			$piclist = new Picturelist();
			//$piclist->addPicture(new Picture("images/test1.jpg","images/test1.jpg","I'm wide, me","http://www.heise.de"));
			if ($gl_usepicturedir) {
				$lst1 = $df->listFiles_Dir($usr->getUid(),$gl_picturedir,array("jpg","jpeg","gif","png"));
				for ($i=0;$i<count($lst1);$i++) {
					$pic = $lst1[$i];
					$piclist->addPicture(new Picture($pic,$pic,"",""));
				}
			} else {
				$df->login();
				$lst1 = $df->listFiles_Ftp($usr->getUid(),array("jpg","jpeg","gif","png"));
				if ($lst1 != null) {
					for ($i=0;$i<count($lst1);$i++) {
						$fn = $lst1[$i];
						$piclist->addPicture(new Picture($fn,$fn,"",""));
					}
				}
				$df->logout();
			}
			
			echo application_getMessage($piclist);
		}
	}
	
	
	
?>
