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
    /****************************************************
	 * BEGIN CONFIG SECTION
	 * **************************************************/
	
	//Database Settings
	$gl_dbuser = "your database username";
	$gl_dbpwd  = "your database password";
	$gl_dbname = "your database name";
	$gl_dbhost = "your db hostename";
			
	//FTP Settings
	$gl_ftpserver = "ftpserver";
	$gl_ftpuser = "ftpuser";
	$gl_ftppwd = "ftppassword";			
	$gl_useftp = false;  //you can use a ftp account to store pictures and files, it must be a subdirectory of osmdatamanager, use picturedir and filedir otherwise
	$gl_ftpprefix = "";  
	
	/* DEBUG
	 * 
	 * 0 = OFF
	 * 1 = log in DB
	 * 2 = text output too => only for php debugging
	 * 
	*/
	
	//if you don't want to use ftp, you can use picturedir and filedir it's the relativ location to pictures and gpx files
	//files have to be stored under a subdirectory with userid (trf_+userid) e.g.  pictures/trf_1
	$gl_usepicturedir = true;
	$gl_picturedir = "pictures/";
	
	$gl_usefiledir = false;
	$gl_filedir = "files/";
	
	$gl_loglevel = 0;
	$gl_readonly = false;   //if this is true, no insert, update and delete statements are executed
		
	/****************************************************
	 * END CONFIG SECTION
	 * **************************************************/
?>
