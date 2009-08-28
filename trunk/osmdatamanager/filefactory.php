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
	include_once("itemparser.php");
	
	/**
	 * File
	 */
	class File extends GroupItem {
		
		//var $usrid;
		var $filename;
		//var $description;
		var $path;
		var $fullfilename;
		
		/*			
		function File($aUsrId, $aPath, $aFilename, $aDescription) {
			$this->usrid = $aUsrId;
			$this->path = $aPath;
			$this->filename = $aFilename;
			$this->description = $aDescription;
			$this->fullfilename = $aPath.$aFilename;
		}
		*/
		
		function File() {
			parent::GroupItem("File");
			$this->itemname = "empty file";
			$this->path = "";
			$this->filename = "";
			//$this->description = "";
			$this->fullfilename = "";
		}
		
		function getFilename() {
			return $this->filename;
		}
		
		function getDescription() {
			return $this->itemname;
		}
		
		function getPath() {
			return $this->path;
		}
		
		function getFullFilename() {
			return $this->fullfilename;
		}
		
		/**
		 * returns extension from a filename
		 * @return file extension
		 * @param $filename Object
		 */
		function getFileExtension()
		{
			return end(explode(".", $this->filename));
		}
	}
	
	
	/**
	 * FileContainer 
	 */
	class FileContainer {
		
		var $items;
		
		function FileContainer() {
			$this->items = array();
		}
		
		function addFile($aFile) {
			array_push($this->items, $aFile);	
		}
	}
	
	
	/**
	 * ExifFile
	 */
	/*
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
	*/
	
	
	/**
	 * Filefactory
	 */
	class Filefactory extends ItemParser {
						
		function Filefactory()
		{
			parent::ItemParser();
		}
		
		/**
		 * 
		 * @return 
		 * @param $aItem Object
		 * @param $aRow Object
		 * @param $aResult Object
		 */
		function parse_File(&$aItem, $aRow, $aResult) {
			
			$this->parseFieldnames($aResult);
			$this->parse_GroupItem($aItem, $aRow, $aResult);			
			
			if ($this->fieldnames == null)
				return;
			
			
			for ($i=0;$i<count($this->fieldnames);$i++) {
				$fn1 = $this->fieldnames[$i];
				switch ($fn1) {
					case "filename":
						$aItem->filename = $aRow[$i];
						//$aItem->itemname = $aRow[$i];
						break;
					case "path":
						$aItem->path = $aRow[$i];
						break;
					case "path":
						$aItem->filename = $aRow[$i];
						break;
				}
			}
			$aItem->fullfilename = $aItem->path.$aItem->filename;
			if (($aItem->tagname == "standard") || ($aItem->tagname == "null"))
				$aItem->tagname = "file_".$aItem->getFileExtension();
				
			if (($aItem->itemname == "") || ($aItem->itemname == "null")) {
				$aItem->itemname = $aItem->filename;
			}
		}
		
		/**
		 * returns true if file with given usrid and filename exists, othwerwise false
		 * @return 
		 * @param $aUsrId Object
		 * @param $aFilename Object
		 */
		function fileExists($aUsrId, $aFilename)
		{
			if ($aFilename == "")
				return false;
			
			$qry = "SELECT * FROM `tab_file` WHERE (usrid = $aUsrId) AND (filename = '$aFilename')";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					$filename = $row[3];
					if (strtolower($filename) == strtolower($aFilename))
						return true;
				}
			}
			return false;
		}
		
		/**
		 * set all files from given user to invalid state
		 * @return 
		 * @param $aUsrId Object
		 */
		function setInvalid($aUsrId) {
			$qry = "UPDATE `tab_file` SET valid = 0 WHERE (usrid = $aUsrId)";
			$result = $this->executeQuery($qry);
		}
		
		/**
		 * delete invalid files from database table
		 * @return 
		 * @param $aUsrId Object
		 */
		function deleteInvalid($aUsrId) {
			$lst1 = $this->getInvalidFiles($aUsrId);
			if ($lst1 != null) {
				for ($i=0;$i<count($lst1);$i++) {	
					$fl1 = $lst1[$i];
					$itemid   = $fl1->itemid; 
					$itemtype = $fl1->itemtype; 
					$qry = "DELETE FROM `tab_grp_item` WHERE (usrid = $aUsrId) AND (childid = $itemid)  AND (itemtype = '$itemtype')";
					$result = $this->executeQuery($qry);					
				}				
			} 
			
			$qry = "DELETE FROM `tab_file` WHERE (valid = 0) AND (usrid = $aUsrId)";
			$result = $this->executeQuery($qry);
		}
		
		
		/**
		 * sets given filename to valid status
		 * @return 
		 * @param $aUsrId Object
		 * @param $aFilename Object
		 */
		function setValid($aUsrId,$aFilename) {
			$qry = "UPDATE `tab_file` SET valid = 1 WHERE (usrid = $aUsrId) AND (filename = '$aFilename')";
			$result = $this->executeQuery($qry);
		}
		
		
		/**
		 * returns all files from user with given userid
		 * @return 
		 * @param $aUserid Object
		 */
		function getFiles($aUserid) {
			$files = array();
			
			$qry = "SELECT * FROM `tab_file` WHERE (usrid = $aUserid) ORDER BY itemname, filename";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$fl = new File();
						$this->parse_File($fl,$row,$result);
						array_push($files, $fl);
					}
				}
				return $files;
			}
			return null;
		}
		
		function getFile($aUserid, $aItemId) {
			$qry = "SELECT * FROM `tab_file` WHERE (usrid = $aUserid) AND (itemid = $aItemId) ORDER BY itemname, filename";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				$fl = new File();
				$this->parse_File($fl,$row,$result);
				return $fl;		
			}
			return null;	
		}
		
		/**
		 * 
		 * @return 
		 * @param $aUserid Object
		 */
		function getInvalidFiles($aUserid) {
			$files = array();
			
			$qry = "SELECT * FROM `tab_file` WHERE (usrid = $aUserid) AND (valid = 0) ORDER BY itemname, filename";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$fl = new File();
						$this->parse_File($fl,$row,$result);
						array_push($files, $fl);
					}
				}
				return $files;
			}
			return null;
		}
		
		/**
		 * 
		 * @return 
		 * @param $aLinkitemlist Object
		 * @param $aResultlist Object
		 */
		function addFiles($aUserId, $aLinkitemlist, &$aResultlist) {
			
			$qry = "SELECT * FROM `tab_file` WHERE itemid in (";
			
			if (count($aLinkitemlist) > 0) {
				for ($i=0;$i<count($aLinkitemlist);$i++) {
					$itm1 = $aLinkitemlist[$i];
					if ($i==0)
						$qry = $qry.$itm1->itemid;
					else
						$qry = $qry.",".$itm1->itemid;
				}		
			}
			$qry = $qry.") AND usrid = $aUserId";
			
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$fl = new File();
						$this->parse_File($fl,$row,$result);
						array_push($aResultlist, $fl);
					}
				}
			}
			
		}
		
		/**
		 * updates only the file description
		 * @return 
		 * @param $aUsrId Object
		 * @param $aFilename Object
		 * @param $aDescription Object
		 */
		function updateFile($aUsrId, $aItemId, $aItemname, $aLat, $aLon, $aZoomlevel, $aTagname) {
			if ($aZoomlevel == "")
				$aZoomlevel = -1;
			
			$qry1   =  "UPDATE `tab_file` SET ";
		 	$qry1 = $qry1."`itemname`='".$aItemname."' ";
			$qry1 = $qry1.", `lat`='".$aLat."' ";
			$qry1 = $qry1.", `lon`='".$aLon."' ";
			
			if ($aZoomlevel != "")
			  $qry1 = $qry1.", `zoomlevel`= ".$aZoomlevel."  ";
			
			$qry1 = $qry1.", `tagname`='".$aTagname."' ";
			$qry1 = $qry1." WHERE   (`usrid` = ".$aUsrId.")";
			$qry1 = $qry1." AND   (`itemid` = ".$aItemId.")";
			
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
			
			$insquery = "INSERT INTO `tab_file` (`usrid`,`path`,`filename`,`itemname`,`valid`) VALUES ($aUserId, '$aPath', '$aFilename','$aDescription',1)";
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