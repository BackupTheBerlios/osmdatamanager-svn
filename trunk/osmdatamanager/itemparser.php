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
	
	class TagContainer {
		
		var $items;
				
		function TagContainer() {
			$this->items = array();
		}
		
		function addTag(&$aTagData) {
			array_push($this->items, $aTagData);	
		}
	}
	
	class ItemParser extends DatabaseAccess {
								
		function ItemParser()
		{
			parent::DatabaseAccess();
		}
	
		/*******************************************************************************************
		 * 
		 * parse functions
		 * 
		 *******************************************************************************************/
		
		function getTags() {
			$tags = array();
			
			$qry = "SELECT * FROM `tab_icon`";
		
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$tags = array();
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$tag = new TagData($row[1],$row[2],$row[3],$row[4]);
						array_push($tags, $tag);
					}
				}
			}
			
			if (count($tags) > 0)
				return $tags;	
			else
				return null;
		}
		
		
		function parse_Tags(&$aItem) {
			global $gl_parsetags;
			if (! $gl_parsetags)
				return;
			
			
			if (($aItem->tagname == "") || ($aItem->tagname == null))
				return;
			
			//$qry = "SELECT * FROM `tab_icon` WHERE tagname = '".$aItem->tagname."'";
			$qry = "SELECT * FROM `tab_icon`";
		
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$tags = array();
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$tag = new TagData($row[1],$row[2],$row[3],$row[4]);
						array_push($tags, $tag);
					}
				}
				$aItem->tags = $tags;
			}
		}
		
		/**
		 * parse data from mysql data row 
		 * @return 
		 * @param $aRow Object
		 * @param $aResult Object
		 */
		function parse_MapItem(&$aItem, $aRow, $aResult) {						
			if ($this->fieldnames == null)
				return;
			
			for ($i=0;$i<count($this->fieldnames);$i++) {
				$fn1 = $this->fieldnames[$i];
				
				switch ($fn1) {
					case "protection":
						$aItem->protection = $aRow[$i];
						break;
					case "zoomlevel":
						$aItem->zoomlevel = $aRow[$i];
						break;
					case "lat":
						$aItem->lat = $aRow[$i];
						break;
					case "lon":
						$aItem->lon = $aRow[$i];
						break;
				}
			}
		}	
		
		/**
		 * 
		 * @return 
		 * @param $aRow Object
		 * @param $aResult Object
		 */
		function parse_GroupItem(&$aItem, $aRow, $aResult) {
			$this->parse_MapItem($aItem, $aRow, $aResult);
			
			if ($this->fieldnames == null)
				return;
			
			for ($i=0;$i<count($this->fieldnames);$i++) {
				$fn1 = $this->fieldnames[$i];
				switch ($fn1) {
					case "tagname":
						if (($aRow[$i] != "") && ($aRow[$i] != "null"))
							$aItem->tagname = $aRow[$i];
						else
							$aItem->tagname = "standard";
							
						break;
					case "itemid":
						$aItem->itemid = $aRow[$i];
						break;
					case "parentid":
						$aItem->parentid = $aRow[$i];
						break;
					case "itemname":
						$aItem->itemname = $aRow[$i];
						break;
					case "usrid":
						$aItem->usrid = $aRow[$i];
						break;
				}
			}
			
			if (($aItem->itemtype == "User") || application_ismappeduser())
				$this->parse_Tags($aItem);
		}
		
		/**
		 * 
		 * @return 
		 * @param $aItem Object
		 * @param $aRow Object
		 * @param $aResult Object
		 */
		function parse_ItemLink(&$aItem, $aRow, $aResult) {
			$this->parseFieldnames($aResult);
			
			if ($this->fieldnames == null)
				return;
			
			for ($i=0;$i<count($this->fieldnames);$i++) {
				$fn1 = $this->fieldnames[$i];
				switch ($fn1) {
					case "usrid":
						$aItem->usrid = $aRow[$i]; 
						break;
					
					case "itemid":
						break;
					
					case "childid":
						$aItem->itemid = $aRow[$i]; 
						break;
				}
			}
		}
		
				
		/**
		 * 
		 * @return 
		 * @param $aItem Object
		 * @param $aRow Object
		 * @param $aResult Object
		 */
		function parse_UserFriend(&$aItem, $aRow, $aResult) {
			$this->parseFieldnames($aResult);
			
			if ($this->fieldnames == null)
				return;
			
			for ($i=0;$i<count($this->fieldnames);$i++) {
				$fn1 = $this->fieldnames[$i];
				switch ($fn1) {
					case "friendid":
						$aItem->itemid = $aRow[$i]; 
						break;
				}
			}
		}
		
						
		/*******************************************************************************************
		 * 
		 * end parse functions
		 * 
		 *******************************************************************************************/
		
	}
	
	
?>
