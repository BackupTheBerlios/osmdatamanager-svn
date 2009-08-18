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
	 * Poi
	 */
	class Poi extends GroupItem {

		//var $poitype;  //TODO benötigt ?
		var $description;
				
		function Poi() {
			parent::GroupItem("Poi");
			
			//$this->poitype = "Poi";
			$this->description = "";
		}
		
		function parseLocation($latlon)
		{
			$tmp = split(";",$latlon);
			if ($tmp != null)
			{
				if (count($tmp) > 1)
				{
					$this->lat = $tmp[0];
					$this->lon = $tmp[1];
				}
			}
		}
		
		function getPoiId() {
			return $this->itemid;
		}	
	}
	
	/**
	 * PoiContainer
	 */
	class PoiContainer {
		
		var $items;
		
		function PoiContainer() {
			$this->items = array();
		}
		
		function addPoi($aPoi) {
			array_push($this->items, $aPoi);	
		}
	}
	
	/**
	 * PoiFactory
	 */
	class PoiFactory extends ItemParser {

		function PoiFactory()
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
		function parse_Poi(&$aItem, $aRow, $aResult) {
			$this->parseFieldnames($aResult);
			$this->parse_GroupItem($aItem, $aRow, $aResult);			
			if ($this->fieldnames == null)
				return;
			
			for ($i=0;$i<count($this->fieldnames);$i++) {
				$fn1 = $this->fieldnames[$i];
				switch ($fn1) {
					case "description":
						$aItem->description = $aRow[$i];
						break;
				}
			}
			if (($aItem->tagname == "standard") || ($aItem->tagname == "null"))
				$aItem->tagname = "standard_poi";
		}
		
		/**
		 * returns all pois from user with given userid
		 * @return 
		 * @param $aUserId Object
		 */
		function getPois($aUserId) {
									
			$pois = array();
			
			$qry = "SELECT * FROM `tab_poi` WHERE (usrid = $aUserId) ORDER BY itemname";
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$poi = new Poi();
						$this->parse_Poi($poi,$row,$result);
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
		
		/**
		 * 
		 * @return 
		 * @param $aLinkitemlist Object
		 * @param $aResultlist Object
		 */
		function addPois($aLinkitemlist, &$aResultlist) {
			$qry = "SELECT * FROM `tab_poi` WHERE itemid in (";
			
			if (count($aLinkitemlist) > 0) {
				for ($i=0;$i<count($aLinkitemlist);$i++) {
					$itm1 = $aLinkitemlist[$i];
					if ($i==0)
						$qry = $qry.$itm1->itemid;
					else
						$qry = $qry.",".$itm1->itemid;
				}		
			}
			$qry = $qry.")";
			
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$poi = new Poi();
						$this->parse_Poi($poi,$row,$result);
						array_push($aResultlist, $poi);
					}
				}
			}
			
		}
		
		/**
		 * returns poi with given userid an given poiname (itemname)
		 * @return 
		 * @param $aUserId Object
		 * @param $aPoiName Object
		 */
		function getPoi($aUserId, $aPoiName) {
			$qry = "SELECT * FROM `tab_poi` WHERE (usrid = $aUserId) AND (itemname = \"$aPoiName\")";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){					
					$poi = new Poi();
					$this->parse_Poi($poi,$row,$result);
					return $poi;
				}
			}
			return null;
		}
		
		/**
		 * returns poi with given userid and poiid (itemid)
		 * @return 
		 * @param $aUserId Object
		 * @param $aPoiId Object
		 */
		function getPoiById($aUserId, $aPoiId) {
			$qry = "SELECT * FROM `tab_poi` WHERE (usrid = $aUserId) AND (itemid = $aPoiId)";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){					
					$poi = new Poi();
					$this->parse_Poi($poi,$row,$result);
					return $poi;
				}
			}
			return null;
		}
		
		/**
		 * returns true if poi with given poiname (itemname) exists, otherwise false
		 * @return 
		 * @param $aUsrId Object
		 * @param $aPoiName Object
		 */
		function poiExists($aUsrId, $aPoiName)
		{
			if ($aPoiName == "")
				return false;
			
			$qry = "SELECT * FROM `tab_poi` WHERE (usrid = $aUsrId) AND (itemname = \"$aPoiName\")"; //TODO
			$result = $this->executeQuery($qry);
					
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					$poiname = $row[3];
					if (strtolower($poiname) == strtolower($aPoiName))
						return true;
				}
			}
			return false;
		}
		
		/**
		 * creates a new poi
		 * @return 
		 * @param $aUsrId Object
		 * @param $aPoiName Object
		 * @param $aDescription Object
		 * @param $aLatLon Object
		 * @param $aGeoRssUrl Object
		 */
		function createPoi($aUsrId, $aPoiName, $aDescription, $aLat,$aLon,$aZoomlevel,$aTagname) {
			
			if (!$this->poiExists($aUsrId, $aPoiName)) {
				$insquery = "INSERT INTO `tab_poi` (`usrid`,`poitype`,`itemname`,`description`,`lat`,`lon`,`zoomlevel`,`tagname`) VALUES ('$aUsrId','-1','$aPoiName','$aDescription','$aLat','$aLon','$aZoomlevel','$aTagname')";
				if ($this->executeQuery($insquery) == null)
				{
					return false;
				}
				return true;			
			}
			return false;
		}
		
		/**
		 * deletes poi with given poiid
		 * @return 
		 * @param $aUsrId Object
		 * @param $aPoiId Object
		 */
		function deletePoi($aUsrId,	$aPoiId) {
			$delquery1 = "DELETE FROM `tab_poi` WHERE (itemid = $aPoiId) AND (usrid = $aUsrId)";
			if ($this->executeQuery($delquery1) == null)
			{
				return false;
			}
			
			$delquery2 = "DELETE FROM `tab_grp_item` WHERE (childid = $aPoiId) AND (usrid = $aUsrId)";
			if ($this->executeQuery($delquery2) == null)
			{
				return false;
			}
			
			return true;							
		}
		
		/**
		 * updates poi data
		 * @return 
		 * @param $aUsrId Object
		 * @param $aPoiId Object
		 * @param $aPoiName Object
		 * @param $aDescription Object
		 * @param $aLat Object
		 * @param $aLon Object
		 * @param $aZoomlevel Object
		 * @param $aTagname Object
		 */
		function updatePoi($aUsrId,	$aPoiId, $aPoiName, $aDescription, $aLat, $aLon,$aZoomlevel,$aTagname) {		 
			$qry1   =  "UPDATE `tab_poi` SET ";
						
			$qry1 = $qry1."`itemname`='".$aPoiName."' ";
			$qry1 = $qry1.", `description`='".$aDescription."' ";
			$qry1 = $qry1.", `lat`='".$aLat."' ";
			$qry1 = $qry1.", `lon`='".$aLon."' ";
			$qry1 = $qry1.", `zoomlevel`=".$aZoomlevel." ";
			//$qry1 = $qry1.", `georssurl`='".$aGeoRssUrl."' ";
			$qry1 = $qry1.", `tagname`='".$aTagname."' ";
			$qry1 = $qry1." WHERE ((`itemid` = ".$aPoiId.")";
			$qry1 = $qry1." AND    (`usrid` = ".$aUsrId."))";
						
			$result = $this->executeQuery($qry1);
			if ($result != null) {
				return $this->getPoiById($aUsrId,$aPoiId);
			} else {
				return null;
			}
		}
		
		/*
		function addTracegroupPoi($aTraceGroupId,$aPoiId,$aUsrId) {
			//$tracefile = $this->getTracefile($aTraceId, $aFilename);
						
			//if ($tracefile == null) {
				$insquery = "INSERT INTO `tr_trgrp_poi` (`trgrpid`,`poiid`,`usrid`) VALUES ($aTraceGroupId, $aPoiId, $aUsrId)";
				if ($this->executeQuery($insquery) == null)
				{
					return false;
				}
				return true;			
			//}
			//return false;
		}
		*/
		
		
	}
?>
