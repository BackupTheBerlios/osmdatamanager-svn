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
	
	/**
	 * File
	 */
	class File {
		
		var $usrid;
		var $filename;
		var $description;
				
		function File($aUsrId, $aFilename, $aDescription) {
			$this->usrid = $aUsrId;
			$this->filename = $aFilename;
			$this->description = $aDescription;
		}
	
	}
	
	/**
	 * ExifFile
	 */
	class ExifFile {
		
		var $filename;
		var $originaldate;
		var $mapped;
		
		function ExifFile($aFilename, $aOriginalDate) {
			$this->filename = $aFilename;
			$this->setOriginaldate($aOriginalDate);
			$this->mapped = false;
		}
		
		function setOriginaldate($aDateTime) {
			$x1 = ereg_replace("/","-",$aDateTime);
			$x1 = ereg_replace(" ","T",$x1);
			$this->originaldate = $x1."Z";
		}
		
	}
	
	/**
	 * Filefactory
	 */
	class Filefactory extends DatabaseAccess {
						
		function Filefactory()
		{
			parent::DatabaseAccess();
		}
		
		function fileExists($aUsrId, $aFilename)
		{
			if ($aFilename == "")
				return false;
			
			$qry = "SELECT * FROM `tab_file` WHERE (usrid = $aUsrId) AND (filename = \"$aFilename\")";
			$result = $this->executeQuery($qry);
					
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					$filename = $row[2];
					if (strtolower($filename) == strtolower($aFilename))
						return true;
				}
			}
			return false;
		}
		
		function getFiles($aUserid) {
			$files = array();
			
			$qry = "SELECT * FROM `tab_file` WHERE (usrid = $aUserid) ORDER BY description, filename";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$fl = new File($row[0],$row[1],$row[2]);
						array_push($files, $fl);
					}
				}
				return $files;
			}
			return null;
		}
		
		function updateFile($aUsrId, $aFilename, $aDescription) {
			$qry1   =  "UPDATE `tab_file` SET ";
		 	$qry1 = $qry1."`description`='".$aDescription."' ";
			$qry1 = $qry1." WHERE   (`usrid` = ".$aUsrId.")";
			$qry1 = $qry1." AND   (`filename` = '".$aFilename."')";
			
			//echo $qry1;			
			if ($this->executeQuery($qry1) == null)
			{
				return false;
			}
			return true;
		}
		
		function createFile($aUserId, $aFilename, $aDescription) {
			if ($aFilename == "")
				return false;
			
			$insquery = "INSERT INTO `tab_file` (`usrid`,`filename`,`description`) VALUES ($aUserId, '$aFilename','$aDescription')";
			
			if ($this->executeQuery($insquery) == null)
			{
				return false;
			}
			return true;
		}
	}
	
	
?>