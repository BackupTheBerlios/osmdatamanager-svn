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
	
	$gl_picturedir = "pictures/";
	$gl_filedir = "files/";
	
	/* DEBUG
	 * 
	 * 0 = OFF
	 * 1 = log in DB
	 * 2 = text output too => only for php debugging
	 * 
	*/
	
	$gl_loglevel = 0;
	$gl_readonly = false;   //if this is true, no insert, update and delete statements are executed
	
	$gl_baselat = 0;
	$gl_baselon = 0;
	$gl_basezoomlevel = 14;
	
	$gl_applicationlogins = array
	(
		array('clientname'=>"Example1",	'username'=>"test", 'password'=>"test")
	);
	
	/****************************************************
	 * END CONFIG SECTION
	 * **************************************************/
?>
