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
	include_once("poifactory.php");
	include_once("filefactory.php");
	
	/**
	 * Group
	 */
	class Group extends GroupItem {
		/*
		var $groupid;
		var $usrid;
		var $groupname;
		var $parentgroup;
		*/
		var $files;
		var $haschildren;	
		
				
		function Group() {
			parent::GroupItem("Group");
			/*
			$this->groupid = null;
			$this->usrid = null;
			$this->parentgroup = null;
			$this->groupname = null;
			*/
			$this->files = array();
			$this->haschildren=false;
			$this->protection=null;
			$this->zoomlevel=null;
			$this->lat=null;
			$this->lon=null;
		}
		
		/*	
		function Group($aGroupId,$aUsrId,$aParentGroup,$aGroupname,$aHasChildren,$aProtection,$aZoomlevel,$aLat,$aLon,$aIconExpanded,$aIconCollapsed) {
			parent::GroupItem("Group",$aIconExpanded,$aIconCollapsed);
			
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
		*/
		
		function getGroupId() {
			return $this->itemid;
		}
		
		/*
		function setName($aName) {
			$this->name = $aName;
		}
		*/
			
	}
	
	/**
	 * Tracefile
	 */
	/*
	class Tracefile extends GroupItem {
		
		var $groupid;
		var $userid;
		var $filename;
		var $description;
		
		function Tracefile() {
			parent::GroupItem("Tracefile");
			
			$this->groupid = null;
			$this->userid = null;
			$this->filename = null;
		}
		*/
		/*
		function Tracefile($aGroupId, $aUserId, $aFilename) {
			parent::GroupItem("Tracefile",$aIconExpanded,$aIconCollapsed);			
			
			global $gl_icon_file;
			
			if (($aIcon2 == null) || ($aIcon2 == ""))
				$this->setIcon_Collapsed($gl_icon_file);
			
			$this->groupid = $aGroupId;
			$this->userid = $aUserId;
			$this->filename = $aFilename;				
		}
		*/
		/*
		
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
	*/
	
	/**
	 * GroupContainer
	 */
	class GroupContainer {
		
		var $items;
		var $identifier;
		var $label;
		
		function GroupContainer($aIdentifier,$aLabel) {
			$this->items = array();
			$this->identifier = $aIdentifier;
			$this->label = $aLabel;
		}
		
		function addGroup($aGroup) {
			array_push($this->items, $aGroup);	
		}
	}
	
	/**
	 * Groupfactory
	 * 
	 */
	class Groupfactory extends ItemParser {
						
		function Groupfactory()
		{
			parent::ItemParser();
		}
				
		
		/**
		 * 
		 * @return 
		 * @param $aRow Object
		 * @param $aResult Object
		 */
		function parse_Group(&$aItem, $aRow, $aResult) {
			$this->parseFieldnames($aResult);
			
			$this->parse_GroupItem($aItem, $aRow, $aResult);
			if ($this->hasChildren($aItem->usrid,$aItem->itemid)) {
				$aItem->haschildren = true;	
			} else {
				$aItem->haschildren = false;
			}
		}
		
		/*
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
		*/
		
		/**
		 * 
		 * @return 
		 * @param $aFilellist Object
		 * @param $aNewFiles Object
		 * @param $aFile Object
		 * @param $aIcon1 Object
		 * @param $aIcon2 Object
		 */
		/*
		function setCustomData(&$aFilellist,&$aNewFiles, $aFile, $aIcon1, $aIcon2) {
			for ($i=0;$i<count($aFilellist);$i++) {
				$fl1 = $aFilellist[$i];
				if ($fl1->getFilename() == $aFile->getFilename()) {
					$fl1->setCustomData($aFile->getDescription());
					$fl1->setFilename($aFile->getFullFilename());
					$fl1->setIcon_Expanded($aIcon1);
					$fl1->setIcon_Collapsed($aIcon2);
					array_push($aNewFiles, $fl1);
					return;
				}
			}
		}
		*/
		
		/**
		 * 
		 * @return 
		 * @param $aUserId Object
		 * @param $aFilellist Object
		 */		
		/*
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
						$gpxfile = new File($row[0],$row[1],$row[2],$row[3]);
						$this->setCustomData($aFilellist,$newfiles,$gpxfile,$row[4],$row[5]);
					}
				}
			}
			
			if (count($newfiles) > 0) {
				return $newfiles;
			} else {
				return null;
			}
			
		}
		*/
		
		/**
		 * only for a custom update
		 * @return 
		 * @param $aUsrId Object
		 * @param $aGroupId Object
		 * @param $aOldFilename Object
		 * @param $aNewFilename Object
		 */
		/*
		function updateGroupFile($aUsrId,$aGroupId,$aOldFilename,$aNewFilename) {
			return;
									
			$qry1   =  "UPDATE `tab_grp_file` SET ";
		 	//$qry1 = $qry1."`description`='".$aDescription."' ";
			$qry1 = $qry1."`filename`='".$aNewFilename."' ";
			//$qry1 = $qry1."`filename`='".$aNewFilename."' ";
			$qry1 = $qry1." WHERE   (`usrid` = ".$aUsrId.")";
			$qry1 = $qry1." AND   (`filename` = '".$aOldFilename."')";
			//$qry1 = $qry1." AND   (`grpid` = ".$aGroupId.")";
			
			//echo $qry1;			
			if ($this->executeQuery($qry1) == null)
			{
				return false;
			}
			return true;
	
		}
		*/
		
		/**
		 * getGroupFiles
		 * @return 
		 * @param $aUserId Object
		 * @param $aGroupId Object
		 */
		/*
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
		*/
		
		/**
		 * returns true if the group has child items, otherwise false
		 * @return 
		 * @param $aUserId Object
		 * @param $aGroupId Object
		 */
		function hasGroupItems($aUserId, $aGroupId) {
			$qry = "SELECT * FROM `tab_grp_item` WHERE (itemid = $aGroupId) AND (usrid = $aUserId)";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				return true;
			}
			return false;
		}
		
		/*
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
		*/
		
		//TODO
		/*
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
		*/
		
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
		//TODO
		/*
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
		/*
		//TODO
		function remGroupPoi($aGroupId, $aUsrId, $aPoiId) {
			$delquery = "DELETE FROM `tab_grp_poi` WHERE (grpid = $aGroupId) AND (usrid = $aUsrId) AND (poiid = $aPoiId)";
			if ($this->executeQuery($delquery) == null)
			{
				return false;
			}
			return true;						
		}
		*/
		
		/**
		 * adds a groupitem to a group
		 * @return 
		 * @param $aGroupId Object
		 * @param $aUsrId Object
		 * @param $aItemid Object
		 */
		function addGroupItem($aGroupId, $aUsrId, $aItemid,$aItemType) {
			$insquery = "INSERT INTO `tab_grp_item` (`itemid`,`usrid`,`childid`,`itemtype`) VALUES ($aGroupId, $aUsrId,$aItemid,'$aItemType')";
			if ($this->executeQuery($insquery) == null)
			{
				return false;
			}
			return true;						
		}
		
		/**
		 * removes a groupitem from a group
		 * @return 
		 * @param $aGroupId Object
		 * @param $aUsrId Object
		 * @param $aItemid Object
		 */
		function remGroupItem($aGroupId, $aUsrId, $aItemid,$aItemType) {
			$delquery = "DELETE FROM `tab_grp_item` WHERE (itemid = $aGroupId) AND (usrid = $aUsrId) AND (childid = $aItemid) AND (itemtype = '$aItemType')";
			if ($this->executeQuery($delquery) == null)
			{
				return false;
			}
			return true;						
		}
		
		/**
		 * returns a group with given userid and groupid (itemid)
		 * @return 
		 * @param $aUserId Object
		 * @param $aGroupId Object
		 */
		function getGroup($aUserId, $aGroupId) {
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserId) AND (itemid = $aGroupId))";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){
					$grp = new Group();
					$this->parse_Group($grp,$row,$result);
					return $grp;
				}
			}
			return null;
		}
		
		/**
		 * returns group with given userid and given groupname 
		 * @return 
		 * @param $aUserId Object
		 * @param $aGroupName Object
		 */
		function getGroupByName($aUserId, $aGroupName) {
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserId) AND (itemname = '$aGroupName'))";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){
					$grp = new Group();
					$this->parse_Group($grp,$row,$result);
					return $grp;
				}
			}
			return null;
		}
		
		
		/**
		 * 
		 * @return 
		 * @param $aUserId Object
		 * @param $aGroupName Object
		 */
		function getPublicGroupByName($aUserId, $aGroupName) {
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserId) AND (itemname = '$aGroupName') AND (protection = 'public'))";
			//echo $qry;
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){
					$grp = new Group();
					//$grp->parseItem($row,$result);
					$this->parse_Group($grp,$row,$result);
					return $grp;
				}
			}
			return null;
		}
		
		/**
		 * returns all root groups from user with given userid
		 * @return array of Groups
		 * @param $aUserid Object
		 */
		function getRootGroups($aUserid) {
			$groups = array();
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserid) AND (parentid IS NULL)) ORDER BY itemname";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$grp = new Group();
						$this->parse_Group($grp,$row,$result);
						array_push($groups, $grp);
						
					}
				}
				return $groups;
			}
			return null;
		}
		
		/**
		 * 
		 * @return 
		 * @param $aUserid Object
		 */
		function getAllGroups($aUserid) {
			$groups = array();
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserid) ORDER BY itemname";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$grp = new Group();
						$this->parse_Group($grp,$row,$result);
						array_push($groups, $grp);
						
					}
				}
				return $groups;
			}
			return null;
		}
		
		
		/**
		 * returns all child groups from user with given userid and given parentgroupid
		 * @return array of Groups
		 * @param $aUserid Object
		 */
		function getChildGroups($aUserid,$aParentGroupId) {
			if ($aParentGroupId == "")
				return null;
							
			$groups = array();
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserid) AND (parentid = $aParentGroupId)) ORDER BY itemname";
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$grp = new Group();
						$this->parse_Group($grp,$row,$result);
						array_push($groups, $grp);
					}
				}
				return $groups;
			}
			return null;
		}
		
		/**
		 * 
		 */
		function getGroupItems($aUserid,$aParentGroupId) {
			$items = array();
			
			$pois = array();
			$files = array();
			
			$qry = "SELECT * FROM `tab_grp_item` WHERE ((usrid = $aUserid) AND (itemid = $aParentGroupId))";
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$itemtype = strtolower($row[3]);
						switch($itemtype) {
							case "file":
						  		$fl1 = new File();
								$this->parse_ItemLink($fl1,$row,$result);
								array_push($files,$fl1);								
								break;
							case "poi":
								$poi = new Poi();
								$this->parse_ItemLink($poi,$row,$result);
								array_push($pois,$poi);
								break;
						}
					}
					
				}
				if (count($pois) > 0) {
					$pf = new PoiFactory();
					$pf->addPois($pois,$items);
				}
				
				if (count($files) > 0) {
					$ff = new FileFactory();
					$ff->addFiles($files,$items);
				}
			}
			return $items;
		}
		
		
		/**
		 * returns true if group with given userid and groupid has children, otherwise false
		 * @return 
		 * @param $aUserid Object
		 * @param $aGroupId Object
		 */
		/*
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
		*/
		
		function hasChildren($aUserid, $aItemId) {
			
			if ($this->hasGroupItems($aUserid, $aItemId))
				return true;
			
			$lst1 = $this->getChildGroups($aUserid, $aItemId);
			if ($lst1 != null)
				return true;
		}
			
		/**
		 * 
		 * @return 
		 * @param $aUserId Object
		 * @param $aTracegroupId Object
		 */	
		/*
		function deletGroupFiles($aUserId, $aTracegroupId) {
			$delquery = "DELETE FROM `tab_grp_file` WHERE (usrid = $aUserId) AND (grpid = $aTracegroupId)";				
			$this->executeQuery($delquery);
		}
		
		/**
		 * 
		 * @return 
		 * @param $aUserId Object
		 * @param $aFilename Object
		 */
		/*
		function deleteGroupFile($aUserId, $aFilename) {
			$delquery = "DELETE FROM `tab_grp_file` WHERE (usrid = $aUserId) AND (filename = $aFilename)";				
			$this->executeQuery($delquery);
		}
		*/
		
		/**
		 * deletes all child items from the tab_grp_item table
		 * @return 
		 * @param $aUserId Object
		 * @param $aItemid Object
		 */
		function deleteGroupItems($aUserId, $aItemid) {
			$delquery = "DELETE FROM `tab_grp_item` WHERE (usrid = $aUserId) AND (itemid = $aItemid)";				
			$this->executeQuery($delquery);
		}
		
		/**
		 * removes a child item from a group
		 * @return 
		 * @param $aUserId  Object
		 * @param $aGroupId Object
		 * @param $aItemid 	Object
		 */
		function removeGroupItem($aUserId, $aGroupId, $aItemid) {
			$delquery = "DELETE FROM `tab_grp_item` WHERE (usrid = $aUserId) AND (itemid = $aGroupId) AND (childid = $aItemid)";				
			if ($this->executeQuery($delquery))
				return true;
				
			return false;
		}
		
		/**
		 * deletes group with given userid an groupid (itemid)
		 * @return 
		 * @param $aUserId Object
		 * @param $aGroupId Object
		 */
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
			
			$this->deleteGroupItems($aUserId, $aGroupId);
			
			$delquery = "DELETE FROM `tab_grp` WHERE (usrid = $aUserId) AND (itemid = $aGroupId)";				
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
				$insquery = "INSERT INTO `tab_grp` (`usrid`,`parentid`,`itemname`) VALUES ($aUserId, NULL,'$aGroupname')";
			else
				$insquery = "INSERT INTO `tab_grp` (`usrid`,`parentid`,`itemname`) VALUES ($aUserId, $aParentGroupId,'$aGroupname')";
			
			if ($this->executeQuery($insquery) == null)
			{
				return false;
			}
			return true;
		}
		
		/**
		 * updates group data
		 * @return 
		 * @param $aUserId Object
		 * @param $aGroupId Object
		 * @param $aGroupname Object
		 * @param $aProtection Object
		 * @param $aZoomlevel Object
		 * @param $aLat Object
		 * @param $aLon Object
		 * @param $aIcon1 Object
		 * @param $aIcon2 Object
		 */
		function updateGroup($aUserId,$aGroupId,$aGroupname,$aProtection,$aZoomlevel,$aLat,$aLon,$aTagName) {
			$qry1   =  "UPDATE `tab_grp` SET ";
			 //$qry1 = $qry1 + "`username`='".$aVal1."' ";
			 $qry1 = $qry1."`itemname`='".$aGroupname."' ";
			 $qry1 = $qry1.", `protection`='".$aProtection."' ";
			 $qry1 = $qry1.", `zoomlevel`= ".$aZoomlevel." ";
			 $qry1 = $qry1.", `lat`='".$aLat."' ";
			 $qry1 = $qry1.", `lon`='".$aLon."' ";
			 $qry1 = $qry1.", `tagname`='".$aTagName."' ";
			 $qry1 = $qry1." WHERE  (`itemid` = ".$aGroupId.")";
			 $qry1 = $qry1." AND (`usrid` = ".$aUserId.")";
			 			 
			 $result = $this->executeQuery($qry1);
			 if ($result != null)
			 	return true;
			else
				return false;
		}		 
	}
	
	
?>
