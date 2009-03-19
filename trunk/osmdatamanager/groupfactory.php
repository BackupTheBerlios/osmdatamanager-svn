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
	include_once("poifactory.php");
	include_once("filefactory.php");
	
	/**
	 * Group
	 */
	class Group extends GroupItem {
		
		var $groupid;
		var $usrid;
		var $groupname;
		var $parentgroup;
		var $files;
		var $haschildren;	
		var $protection;
		var $zoomlevel;
		var $lat;
		var $lon;
		
		function Group($aGroupId, $aUsrId, $aParentGroup, $aGroupname, $aHasChildren,$aProtection, $aZoomlevel, $aLat, $aLon) {
			parent::GroupItem("Group");
			
			$this->groupid = $aGroupId;
			$this->usrid = $aUsrId;
			$this->parentgroup = $aParentGroup;
			$this->groupname = $aGroupname;
			$this->files = array();
			$this->haschildren=$aHasChildren;
			$this->protection=$aProtection;
			$this->zoomlevel=$aZoomlevel;
			$this->lat=$aLat;
			$this->lon=$aLon;
		}
		
		function getGroupId() {
			return $this->groupid;
		}	
	}
	
	/**
	 * Tracefile
	 */
	class Tracefile extends GroupItem {
		
		var $groupid;
		var $userid;
		var $filename;
		var $description;
		
		function Tracefile($aGroupId, $aUserId, $aFilename) {
			parent::GroupItem("Tracefile");			
			$this->groupid = $aGroupId;
			$this->userid = $aUserId;
			$this->filename = $aFilename;				
		}
		
		function setCustomData($aDescription) {
			$this->description = $aDescription;
		}
		
		function getFilename() {
			return $this->filename;
		}
		
		function setFilename($aFilename) {
			$this->filename = $aFilename;
		}
		
		function getDescription() {
			return $this->description;
		}
	}
	
	/**
	 * Groupfactory
	 * 
	 */
	class Groupfactory extends DatabaseAccess {
						
		function Groupfactory()
		{
			parent::DatabaseAccess();
		}
				
		function getGroupFile($aGroupId, $aFilename) {
			
			if ($aFilename == null)
				return null;
			
			$qry = "SELECT * FROM `tab_grp_file` WHERE ((grpid = $aGroupId) AND (filename = '$aFilename'))";
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){
					$tracefile = new Tracefile($row[0],$row[1],$row[2]);
					return $tracefile;
				}
			}
			return null;
		}
		
		function setCustomData(&$aFilellist,&$aNewFiles, $aFilename, &$aRow) {
												
			global $gl_ftpprefix;
			
			for ($i=0;$i<count($aFilellist);$i++) {
				$fl1 = $aFilellist[$i];
				if ($fl1->getFilename() == $aFilename) {
					$fl1->setCustomData($aRow[2]);
					$fl1->setFilename($gl_ftpprefix.$fl1->getFilename());
					array_push($aNewFiles, $fl1);
					return;
				}
			}
		}
		
		function fillFiledata($aUserId, &$aFilellist) {
			$newfiles = array();
			$ff = new FileFactory();
			
			$qry1 = "SELECT * FROM `tab_file` WHERE (usrid = $aUserId)";
			$qry1 = $qry1." AND   (`filename` IN (";// '".$aFilename."')";
						
			for ($i=0;$i<count($aFilellist);$i++) {
				$fl1 = $aFilellist[$i];
				if ($i==0)
					$qry1=$qry1." '".$fl1->getFilename()."'";
				else
					$qry1=$qry1.", '".$fl1->getFilename()."'";
			}
			$qry1=$qry1."))";
			$result = $this->executeQuery($qry1);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$this->setCustomData($aFilellist,$newfiles,$row[1],$row);
					}
				}
			}
			
			if (count($newfiles) > 0) {
				return $newfiles;
			} else {
				return null;
			}
			
		}
		
		
		function getGroupFiles($aUserId, $aGroupId) {
									
			$files = array();
			
			$qry = "SELECT * FROM `tab_grp_file` WHERE (grpid = $aGroupId)";
			$result = $this->executeQuery($qry);
						
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$tracefile = new Tracefile($row[0],$row[1],$row[2]);
						array_push($files, $tracefile);
					}
				}
				if (count($files) > 0) {
					$newlst = $this->fillFiledata($aUserId, $files);
					if ($newlst != null);
						return $newlst;
						
					return $files;
				} else {
					return null;
				}
			}
			return null;
		}
		
		function getGroupFiles_Recursiv($aUserId, $aGroupId, &$aFileArray) {			
			$childs = $this->getChildGroups($aUserId, $aGroupId); 
			if (count($childs) > 0)
			{
				if ($childs != null) {
					for ($i=0;$i<count($childs);$i++) {
						$grp1 = $childs[$i];
						$this->getGroupFiles_Recursiv($aUserId,$grp1->getGroupId(),$aFileArray);
					}
				}
			}
			
			
			$lst1 = $this->getGroupFiles($aUserId, $aGroupId);
			if ($lst1 != null) {
				for ($i=0;$i<count($lst1);$i++) {
					$fl1 = $lst1[$i];
					array_push($aFileArray,$fl1);
				}
			}
			return true;
		}
		
		function hasGroupPois($aUserId, $aGroupId) {
			$qry = "SELECT * FROM `tab_grp_poi` WHERE (grpid = $aGroupId) AND (usrid = $aUserId)";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				return true;
			}
			return false;
		}
		
		function getGroupPois($aUserId, $aGroupId) {
									
			$pois = array();
			
			$qry = "SELECT * FROM `tab_grp_poi` WHERE (grpid = $aGroupId) AND (usrid = $aUserId)";
			$result = $this->executeQuery($qry);
			$pof = new PoiFactory();
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$poi = $pof->getPoiById($aUserId, $row[2]);
						if ($poi != null)	
							array_push($pois, $poi);
					}
				}
				if (count($pois) > 0)
					return $pois;
				else
					return null;
			}
			return null;
		}
		
		function getGroupPois_Recursiv($aUserId, $aGroupId, &$aPoiArray) {			
			$childs = $this->getChildGroups($aUserId, $aGroupId); 
			if (count($childs) > 0)
			{
				if ($childs != null) {
					for ($i=0;$i<count($childs);$i++) {
						$grp1 = $childs[$i];
						$this->getGroupFiles_Recursiv($aUserId,$grp1->getGroupId(),$aPoiArray);
					}
				}
			}
			
			
			$lst1 = $this->getGroupPois($aUserId, $aGroupId);
			if ($lst1 != null) {
				for ($i=0;$i<count($lst1);$i++) {
					$fl1 = $lst1[$i];
					array_push($aPoiArray,$fl1);
				}
			}
			return true;
		}
		
		function addGroupFile($aGroupId, $aUsrId, $aFilename) {
			$tracefile = $this->getGroupFile($aGroupId, $aFilename);
						
			if ($tracefile == null) {
				$insquery = "INSERT INTO `tab_grp_file` (`grpid`,`usrid`,`filename`) VALUES ($aGroupId, $aUsrId,'$aFilename')";
				if ($this->executeQuery($insquery) == null)
				{
					return false;
				}
				return true;			
			}
			return false;
		}
		
		function remGroupFile($aGroupId, $aUsrId, $aFilename) {
			$delquery = "DELETE FROM `tab_grp_file` WHERE (grpid = $aGroupId) AND (usrid = $aUsrId) AND (filename = '$aFilename')";
			if ($this->executeQuery($delquery) == null)
			{
				return false;
			}
			return true;						
		}
		
		/*
		function updateGroupFile($aGroupId, $aUsrId, $aFilename, $aDescription) {
			$qry1   =  "UPDATE `tab_grp_file` SET ";
		 	$qry1 = $qry1."`description`='".$aDescription."' ";
			$qry1 = $qry1." WHERE (`grpid` = ".$aGroupId.")";
			$qry1 = $qry1." AND   (`usrid` = ".$aUsrId.")";
			$qry1 = $qry1." AND   (`filename` = '".$aFilename."')";
						
			if ($this->executeQuery($qry1) == null)
			{
				return false;
			}
			return true;
		}
		*/
		
		/**
		 * adds a poi to a group
		 * @return 
		 * @param $aGroupId Object
		 * @param $aUsrId Object
		 * @param $aPoiId Object
		 */
		function addGroupPoi($aGroupId, $aUsrId, $aPoiId) {
			$insquery = "INSERT INTO `tab_grp_poi` (`grpid`,`usrid`,`poiid`) VALUES ($aGroupId, $aUsrId,$aPoiId)";
			if ($this->executeQuery($insquery) == null)
			{
				return false;
			}
			return true;						
		}
		
		/**
		 * removes a poi from a group
		 * @return 
		 * @param $aGroupId Object
		 * @param $aUsrId Object
		 * @param $aPoiId Object
		 */
		function remGroupPoi($aGroupId, $aUsrId, $aPoiId) {
			$delquery = "DELETE FROM `tab_grp_poi` WHERE (grpid = $aGroupId) AND (usrid = $aUsrId) AND (poiid = $aPoiId)";
			if ($this->executeQuery($delquery) == null)
			{
				return false;
			}
			return true;						
		}
		
		function getGroup($aUserId, $aGroupId) {
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserId) AND (grpid = $aGroupId))";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){
					$grp = new Group($row[0],$row[1],null,$row[3],$this->hasChildren($aUserId, $aGroupId),$row[5],$row[6],$row[7],$row[8]);
					return $grp;
				}
			}
			return null;
		}
		
		function getGroupByName($aUserId, $aGroupName) {
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserId) AND (grpname = '$aGroupName'))";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){
					$grp = new Group($row[0],$row[1],null,$row[3],$this->hasChildren($aUserId, $aGroupId),$row[5],$row[6],$row[7],$row[8]);
					return $grp;
				}
			}
			return null;
		}
		
		
		function getPublicGroupByName($aUserId, $aGroupName) {
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserId) AND (grpname = '$aGroupName') AND (protection = 'public'))";
			//echo $qry;
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){
					$grp = new Group($row[0],$row[1],null,$row[3],$this->hasChildren($aUserId, $aGroupId),$row[5],$row[6],$row[7],$row[8]);
					return $grp;
				}
			}
			return null;
		}
		
		function getRootGroups($aUserid) {
			$groups = array();
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserid) AND (prntgrp IS NULL)) ORDER BY grpname";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$grp = new Group($row[0],$row[1],null,$row[3],$this->hasChildren($aUserid, $row[0]),$row[5],$row[6],$row[7],$row[8]);
						array_push($groups, $grp);
					}
				}
				return $groups;
			}
			return null;
		}
		
		function getChildGroups($aUserid,$aParentGroupId) {
			if ($aParentGroupId == "")
				return null;
							
			$groups = array();
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserid) AND (prntgrp = $aParentGroupId)) ORDER BY grpname";
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$grp = new Group($row[0],$row[1],$row[2],$row[3],$this->hasChildren($aUserid, $row[0]),$row[5],$row[6],$row[7],$row[8]);
						array_push($groups, $grp);
					}
				}
				return $groups;
			}
			return null;
		}
		
		function hasChildren($aUserid, $aGroupId) {
						
			if ($this->hasGroupPois($aUserid, $aGroupId))
				return true;
						
			$lst1 = $this->getChildGroups($aUserid, $aGroupId);
			if ($lst1 != null)
				return true;
			
			$lst1 = $this->getGroupFiles($aUserid, $aGroupId);
			if ($lst1 != null)
				return true;
			
			return false;
		}
		
		function deletGroupFiles($aUserId, $aTracegroupId) {
			$delquery = "DELETE FROM `tab_grp_file` WHERE (usrid = $aUserId) AND (grpid = $aTracegroupId)";				
			$this->executeQuery($delquery);
		}
		
		function deleteGroupFile($aUserId, $aFilename) {
			$delquery = "DELETE FROM `tab_grp_file` WHERE (usrid = $aUserId) AND (filename = $aFilename)";				
			$this->executeQuery($delquery);
		}
		
		function deleteGroup($aUserId, $aGroupId) {
			
			$childs = $this->getChildgroups($aUserId, $aGroupId); 
			if (count($childs) > 0)
			{
				if ($childs != null) {
					for ($i=0;$i<count($childs);$i++) {
						$grp1 = $childs[$i];
						$this->deleteGroup($aUserId,$grp1->getGroupId());
					}
				}
			}
			
			$this->deletGroupFiles($aUserId, $aGroupId);
			
			$delquery = "DELETE FROM `tab_grp` WHERE (usrid = $aUserId) AND (grpid = $aGroupId)";				
			$this->executeQuery($delquery);
			return true;
		}
			
		/**
		 * creates a new group
		 * @return true if creation was successful, otherwise false
		 * @param $aUserId Object
		 * @param $aGroupname Object
		 * @param $aParentGroupId Object for rootgroup $aParentGroupId is -1
		 */
		function createGroup($aUserId, $aGroupname, $aParentGroupId) {
			if ($aGroupname == "")
				return false;
			
			if ($aParentGroupId == -1)
				$insquery = "INSERT INTO `tab_grp` (`usrid`,`prntgrp`,`grpname`) VALUES ($aUserId, NULL,'$aGroupname')";
			else
				$insquery = "INSERT INTO `tab_grp` (`usrid`,`prntgrp`,`grpname`) VALUES ($aUserId, $aParentGroupId,'$aGroupname')";
			
			if ($this->executeQuery($insquery) == null)
			{
				return false;
			}
			return true;
		}
		
		
		function updateGroup($aUserId, $aGroupId, $aGroupname, $aProtection, $aZoomlevel, $aLat, $aLon) {
			$qry1   =  "UPDATE `tab_grp` SET ";
			 //$qry1 = $qry1 + "`username`='".$aVal1."' ";
			 $qry1 = $qry1."`grpname`='".$aGroupname."' ";
			 $qry1 = $qry1.", `protection`='".$aProtection."' ";
			 $qry1 = $qry1.", `zoomlevel`= ".$aZoomlevel." ";
			 $qry1 = $qry1.", `lat`='".$aLat."' ";
			 $qry1 = $qry1.", `lon`='".$aLon."' ";
			 $qry1 = $qry1." WHERE  (`grpid` = ".$aGroupId.")";
			 $qry1 = $qry1." AND (`usrid` = ".$aUserId.")";
			 			 
			 $result = $this->executeQuery($qry1);
			 if ($result != null)
			 	return true;
			else
				return false;
		}		 
	}
	
	
?>
