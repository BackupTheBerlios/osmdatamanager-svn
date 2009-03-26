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
		var $path;
		var $fullfilename;
				
		function File($aUsrId, $aPath, $aFilename, $aDescription) {
			$this->usrid = $aUsrId;
			$this->path = $aPath;
			$this->filename = $aFilename;
			$this->description = $aDescription;
			$this->fullfilename = $aPath.$aFilename;
		}
		
		function getFilename() {
			return $this->filename;
		}
		
		function getDescription() {
			return $this->description;
		}
		
		function getPath() {
			return $this->path;
		}
		
		function getFullFilename() {
			return $this->fullfilename;
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
						$fl = new File($row[0],$row[1],$row[2],$row[3]);
						array_push($files, $fl);
					}
				}
				return $files;
			}
			return null;
		}
		
		/**
		 * updates only the file description
		 * @return 
		 * @param $aUsrId Object
		 * @param $aFilename Object
		 * @param $aDescription Object
		 */
		function updateFile($aUsrId, $aFilename, $aDescription) {
			$qry1   =  "UPDATE `tab_file` SET ";
		 	$qry1 = $qry1."`description`='".$aDescription."' ";
			//$qry1 = $qry1."`path`='".$aPath."' ";
			$qry1 = $qry1." WHERE   (`usrid` = ".$aUsrId.")";
			$qry1 = $qry1." AND   (`filename` = '".$aFilename."')";
			
			//echo $qry1;			
			if ($this->executeQuery($qry1) == null)
			{
				return false;
			}
			return true;
		}
		
		/**
		 * inserts a new file in the file table
		 * @return 
		 * @param $aUserId Object
		 * @param $aPath Object
		 * @param $aFilename Object
		 * @param $aDescription Object
		 */
		function createFile($aUserId, $aPath, $aFilename, $aDescription) {
			if ($aFilename == "")
				return false;
			
			$insquery = "INSERT INTO `tab_file` (`usrid`,`path`,`filename`,`description`) VALUES ($aUserId, '$aPath', '$aFilename','$aDescription')";
			
			if ($this->executeQuery($insquery) == null)
			{
				return false;
			}
			return true;
		}
		
		/**
		 * deletes a file entry from the database
		 * @return 
		 * @param $aUsrId Object
		 * @param $aFilename Object
		 */
		function deleteFile($aUsrId,$aFilename) {
			$delquery = "DELETE FROM `tab_file` WHERE (usrid = $aUsrId) AND (filename = '$aFilename')";
			if ($this->executeQuery($delquery) == null)
			{
				return false;
			}
			return true;
		}
		
		/**
		 * 
		 * @return 
		 */
		function updatePath($aUsrId,$aOldFilename,$aNewFilename,$aPath) {
						
			$qry1   =  "UPDATE `tab_file` SET ";
		 	//$qry1 = $qry1."`description`='".$aDescription."' ";
			$qry1 = $qry1."`path`='".$aPath."' ";
			//$qry1 = $qry1."`filename`='".$aNewFilename."' ";
			$qry1 = $qry1." WHERE   (`usrid` = ".$aUsrId.")";
			$qry1 = $qry1." AND   (`filename` = '".$aOldFilename."')";
			
			echo $qry1;			
			if ($this->executeQuery($qry1) == null)
			{
				return false;
			}
			return true;
		}
		
		/**
		 * only for a custom db update
		 */
		function updateFiles($aUserId) {
			echo "a";
			return;
			$lst1 = $this->getFiles($aUserId);
			foreach ($lst1 as $fl1) {
				$full = $fl1->getFilename();
				$fn = basename($full);
				$path = "traces/trf_2/";
				echo $full;
				
				/*
				if ($fl1->getDescription() == "") {
					$this->deleteFile($aUserId,$full);
				}
				*/
				
				if ($fl1->getPath() == "traces/traces/trf_2/") {
					$this->deleteFile($aUserId,$full);
				}
				
				//$this->updatePath($aUserId,$full,$fn,$path);
				
				/*
				if (($path == "") || ($fl1->getPath() == "./")) {
					$this->deleteFile($aUserId,$full);
				} else {
					$this->updatePath($aUserId,$full,$fn,$path);
				}
				*/
				
			}
		}
		
	}
	
	
?>