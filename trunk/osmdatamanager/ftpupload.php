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
   include_once("JSON.php");

if (application_userisvalid()) {
	$usr = application_getvaliduser();
	if ($usr != null) {	
		$df = new DirectoryFactory();
		$df->uploadFiles($usr);
	}
}

?>