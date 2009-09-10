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
	include_once("userfactory.php");
	
	/**
	 * Group
	 */
	class Group extends GroupItem {

		var $haschildren;
			
		function Group() {
			parent::GroupItem("Group");
			$this->haschildren=false;
			$this->protection=null;
			$this->zoomlevel=null;
			$this->lat=null;
			$this->lon=null;
		}
		
		
		function getGroupId() {
			return $this->itemid;
		}
	}
	
		
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
		
		function addGroup(&$aGroup) {
			array_push($this->items, $aGroup);	
		}
	}
	
	/**
	 * Groupfactory
	 * 
	 */
	class Groupfactory extends ItemParser {
						
		var $parentStack;
				
		function Groupfactory()
		{
			parent::ItemParser();
			$this->parentStack = array();
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
			$this->parseItems($aItem->usrid,$aItem);
		}
		
		/**
		 * 
		 * @return 
		 * @param $aUserid Object
		 * @param $aGroup Object
		 */
		function parseItems($aUserid, &$aGroup) {
			$lst1 = $this->getGroupItems($aUserid,$aGroup->itemid);
			if ($lst1 != null) {				
				for ($i=0;$i<count($lst1);$i++) {
						//$itm1 = $lst1[$i];
						$lst1[$i]->prepareForTree($aGroup->itemid);
						$aGroup->addChild(&$lst1[$i]);
					}	
			}
		}
		
		/**
		 * 
		 * @return 
		 * @param $aGroup Object
		 */
		function parseChildren($aUserid, &$aGroup) {
			$lst1 = $this->getChildGroups($aUserid,$aGroup->itemid);
			if ($lst1 != null) {
				for ($i=0;$i<count($lst1);$i++) {	
					$lst1[$i]->prepareForTree($aGroup->itemid);
					$this->parseChildren($aUserid,$lst1[$i]);
					$aGroup->addChild(&$lst1[$i]);
				}				
			} 
		}	
		
		/**
		 * for debug only
		 * @return 
		 * @param $aGroup Object
		 */
		function printGroup(&$aGroup) {
			
			echo "<br>Gruppe:<br>";
			echo "id".$aGroup->itemid."<br>";
			echo "childcount".count($aGroup->children)."<br>";
			
			for ($i=0;$i<count($aGroup->children);$i++) {
				$this->printGroup($aGroup->children[$i]);
			}
			echo "<br>::: ENDE :::</br>";
		}
				
		
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
		 * 
		 * @return 
		 * @param $aUserId Object
		 * @param $aGroupName Object
		 */
		function getFriendGroupByName($aUserId,$aGroupName) {
			$lst1 = $this->getAllFriendGroups($aUserId);
			if ($lst1 != null) {
				for ($i=0;$i<count($lst1);$i++) {
					$grp1 = $lst1[$i];
					if ($grp1->itemname == $aGroupName) {
						return $grp1;
					}
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
			
			$grp1 = $this->getFriendGroupByName($aUserId,$aGroupName);
			if ($grp1 != null) {
				return $grp1;
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
		function getRootGroups($aUserid,$aWithVirtual) {
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
				
				if ($aWithVirtual) {
					$this->addVirtualGroups($aUserid,$groups);
				}
				
				return $groups;
			}
			return null;
		}
		
		
		function updateFriendItems(&$aFriendGroup) {
			for ($i=0;$i<count($aFriendGroup->children);$i++) {
				//$itm1 = $aFriendGroup->children[$i];
				$aFriendGroup->children[$i]->prepareForTree_virtual($aFriendGroup->id);
				$aFriendGroup->children[$i]->isvirtual = true;
				//echo $itm1->id;
			}
		}
		
		/**
		 * 
		 * @return 
		 * @param $aUser Object
		 */
		function addFriendGroups($aUserid, &$aFriendUser) {
			$lst1 = $this->getFriendGroups($aFriendUser->itemid);
			if ($lst1 != null) {
				$aFriendUser->haschildren = true;	
				for ($i=0;$i<count($lst1);$i++) {
					//$lst1[$i]->itemid  =	
					$lst1[$i]->prepareForTree_virtual($aFriendUser->id);
					$lst1[$i]->tags = null;
					$lst1[$i]->isvirtual = true;
					$this->updateFriendItems($lst1[$i]);
					$aFriendUser->addChild(&$lst1[$i]);
					
				}	
			}
		}
		
		/**
		 * 
		 * @return 
		 * @param $aGroup Object
		 */
		function addUsers($aUserid, &$aGroup) {
			$uf = new UserFactory();
			$lst1 = $uf->getFriendUsers($aUserid);
			if ($lst1 != null) {
				$aGroup->haschildren = true;	
				for ($i=0;$i<count($lst1);$i++) {	
					//$lst1[$i]->itemid = $aGroup->itemid."_".$lst1[$i]->itemname;
					$lst1[$i]->prepareForTree_virtual($aGroup->itemid);
					$lst1[$i]->tags = null;
					$lst1[$i]->isvirtual = true;
					$this->addFriendGroups($aUserid, $lst1[$i]);
					$aGroup->addChild(&$lst1[$i]);
				}	
			}
		}
		
		
		/**
		 * adds a list of all files into a virtual group
		 * @return 
		 * @param $aUserid Object
		 * @param $aGroup Object
		 */
		function addFiles($aUserid, &$aGroup) {
			/*
			$uf = new UserFactory();
			$lst1 = $uf->getFriendUsers($aUserid);
			if ($lst1 != null) {
				$aGroup->haschildren = true;	
				for ($i=0;$i<count($lst1);$i++) {	
					//$lst1[$i]->itemid = $aGroup->itemid."_".$lst1[$i]->itemname;
					$lst1[$i]->prepareForTree_virtual($aGroup->itemid);
					$lst1[$i]->tags = null;
					$lst1[$i]->isvirtual = true;
					$this->addFriendGroups($aUserid, $lst1[$i]);
					$aGroup->addChild(&$lst1[$i]);
				}	
			}
			*/
			$ff = new FileFactory();
			$lst1 = $ff->getFiles($aUserid);
			if ($lst1 != null) {
				//$fc = new FileContainer();
				$aGroup->haschildren = true;
				for ($i=0;$i<count($lst1);$i++) {
					$lst1[$i]->prepareForTree($aGroup->itemid);
					$lst1[$i]->tags = null;
					$lst1[$i]->isvirtual = false;
					$aGroup->addChild(&$lst1[$i]);
				}
				
			}
		}
		
		/**
		 * 
		 * @return 
		 * @param $aUserid Object
		 * @param $aList Object
		 */
		function addVirtualGroups($aUserid, &$aList) {
			
			//Users
			$grp = new Group();
			$grp->itemname = "Friends";
			$grp->itemid = "__Friends";
			$grp->tagname = "standard";
			$grp->prepareForTree(-1);
			$grp->isvirtual = true;
			$this->addUsers($aUserid, $grp);
			array_push($aList, $grp);	
			
			//Files
			$grp = new Group();
			$grp->itemname = "Files";
			$grp->itemid = "__Files";
			$grp->tagname = "standard";
			$grp->prepareForTree(-1);
			$grp->isvirtual = false;
			$this->addFiles($aUserid, $grp);
			array_push($aList, $grp);	
		}
		
		
		/**
		 * 
		 * @return 
		 * @param $aUserid Object
		 */
		function getAllGroups($aUserid) {
			$groups = array();
			$qry = "SELECT * FROM `tab_grp` WHERE (usrid = $aUserid) ORDER BY itemname";
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
		 * @param $aFriendId Object
		 */
		function getFriendGroups($aFriendId) {
			$groups = array();
			$qry = "SELECT * FROM `tab_grp` WHERE (usrid = $aFriendId) AND (protection = 'friend') ORDER BY itemname";
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
		 * returns a list of all friendgroups
		 * @return 
		 */
		function getAllFriendGroups($aUserid) {
			$groups = array();
			
			$uf = new UserFactory();
			$lst1 = $uf->getFriendUsers($aUserid);
			if ($lst1 != null) {
				for ($i=0;$i<count($lst1);$i++) {	
					$lst1[$i]->prepareForTree_virtual("__Friends");
					$lst2 = $this->getFriendGroups($lst1[$i]->itemid);
					if ($lst2 != null) {
						for ($x=0;$x<count($lst2);$x++) {	
							$lst2[$x]->prepareForTree_virtual($lst1[$i]->id);
							$this->updateFriendItems($lst2[$x]);
							array_push($groups, $lst2[$x]);	
						}
					}
				}	
				return $groups;
			}
			return null;
		}
		
		/**
		 * 
		 * @return 
		 * @param $aUserId Object
		 */
		function getPublicGroups($aUserId) {
			$groups = array();
			$qry = "SELECT * FROM `tab_grp` WHERE (protection = 'public') AND (itemid <> $aUserId) ORDER BY itemname";
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
						$grp = &new Group();
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
		 * @param $aParentGroup Object
		 */
		function addChildGroups($aUserid,&$aParentGroup) {								
			$prnt = &$aParentGroup;
			
			$prntId = $aParentGroup->itemid;
			$qry = "SELECT * FROM `tab_grp` WHERE ((usrid = $aUserid) AND (parentid = $prntId)) ORDER BY itemname";
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$grp = new Group();
						$this->parse_Group($grp,$row,$result);
						$grp->prepareForTree($aParentGroup->itemid);
						$aParentGroup->addChild($grp);
					}
				}
				
				
				for ($i=0;$i<count($aParentGroup->children);$i++) {
					$grp2 = $aParentGroup->children[$i];
					$this->addChildGroups($aUserid,$grp2);
				}
			}
			return $prnt;
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
					$pf->addPois($aUserid,$pois,$items);
				}
								
				if (count($files) > 0) {
					$ff = new FileFactory();
					$ff->addFiles($aUserid,$files,$items);
				}
			}
			return $items;
		}
				
		function hasChildren($aUserid, $aItemId) {
			
			if ($this->hasGroupItems($aUserid, $aItemId))
				return true;
			
			$lst1 = $this->getChildGroups($aUserid, $aItemId);
			if ($lst1 != null)
				return true;
				
			return false;
		}
		
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
			 
			 if ($aZoomlevel != "")
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
