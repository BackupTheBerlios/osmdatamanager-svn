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
		var $poiid;
		var $usrid;
		var $poitype;
		var $poiname;
		var $description;		
		var $latlon;
		var $lat;
		var $lon;
		var $georssurl;
				
		function Poi($aId, $aUsrId, $aPoiType, $aPoiname, $aDescription, $aLatLon, $aGeoRssUrl) {
			parent::GroupItem("Poi");
			
			$this->poiid = $aId;
			$this->usrid = $aUsrId;
			$this->poitype = $aPoiType;
			$this->poiname = $aPoiname;
			$this->description = $aDescription;
			$this->latlon = $aLatLon;
			$this->parseLocation($aLatLon);
			if ($aGeoRssUrl != null)
				$this->georssurl = $aGeoRssUrl;
			else
				$this->georssurl = "";
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
			return $this->poiid;
		}	
	}
	
	/**
	 * PoiFactory
	 */
	class PoiFactory extends DatabaseAccess {

		function PoiFactory()
		{
			parent::DatabaseAccess();
		}
		
		//
		function getPois($aUserId) {
									
			$pois = array();
			
			$qry = "SELECT * FROM `tab_poi` WHERE (usrid = $aUserId)";
			$result = $this->executeQuery($qry);
			
			if ($result != NULL) 
			{   
				while ($row = mysql_fetch_row($result))
				{
					if ($row != null){
						$poi = new Poi($row[0],$row[1],$row[2],$row[3],$row[4],$row[5],$row[6]);
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
		
		//
		function getPoi($aUserId, $aPoiName) {
			$qry = "SELECT * FROM `tab_poi` WHERE (usrid = $aUserId) AND (poiname = \"$aPoiName\")";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){					
					$poi = new Poi($row[0],$row[1],$row[2],$row[3],$row[4],$row[5],$row[6]);
					return $poi;
				}
			}
			return null;
		}
		
		function getPoiById($aUserId, $aPoiId) {
			$qry = "SELECT * FROM `tab_poi` WHERE (usrid = $aUserId) AND (poiid = $aPoiId)";
			$result = $this->executeQuery($qry);
			if ($result != NULL) 
			{   
				$row = mysql_fetch_row($result);
				if ($row != null){					
					$poi = new Poi($row[0],$row[1],$row[2],$row[3],$row[4],$row[5],$row[6]);
					return $poi;
				}
			}
			return null;
		}
		
		function poiExists($aUsrId, $aPoiName)
		{
			if ($aPoiName == "")
				return false;
			
			$qry = "SELECT * FROM `tab_poi` WHERE (usrid = $aUsrId) AND (poiname = \"$aPoiName\")";
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
		function createPoi($aUsrId, $aPoiName, $aDescription, $aLatLon, $aGeoRssUrl) {
			
			if (!$this->poiExists($aUsrId, $aPoiName)) {
				$insquery = "INSERT INTO `tab_poi` (`usrid`,`poitype`,`poiname`,`description`,`latlon`,`georssurl`) VALUES ('$aUsrId','-1','$aPoiName','$aDescription','$aLatLon','$aGeoRssUrl')";
				if ($this->executeQuery($insquery) == null)
				{
					return false;
				}
				return true;			
			}
			return false;
		}
		
		function updatePoi($aUsrId,	$aPoiId, $aPoiName, $aDescription, $aLatLon, $aGeoRssUrl) {		 
			$qry1   =  "UPDATE `tab_poi` SET ";
						
			$qry1 = $qry1."`poiname`='".$aPoiName."' ";
			$qry1 = $qry1.", `description`='".$aDescription."' ";
			$qry1 = $qry1.", `latlon`='".$aLatLon."' ";
			$qry1 = $qry1.", `georssurl`='".$aGeoRssUrl."' ";
			$qry1 = $qry1." WHERE ((`poiid` = ".$aPoiId.")";
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
