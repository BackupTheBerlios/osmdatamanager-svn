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
   include_once("groupfactory.php");	
   		
	$action  		= $_REQUEST['action'];
	if (isset($action)) {
		$poiname 		= $_REQUEST['poiname'];
		$description	= $_REQUEST['description'];
		$lat 		    = $_REQUEST['lat'];
		$lon            = $_REQUEST['lon'];
		//$georssurl		= $_REQUEST['georssurl'];
		$poilist		= $_REQUEST['poilist'];
		$groupid		= $_REQUEST['groupid'];
		$groupname		= $_REQUEST['groupname'];
		$poiid	 		= $_REQUEST['poiid'];
		$tagname 		= $_REQUEST['tagname'];
		$zoomlevel 		= $_REQUEST['zoomlevel'];
		//$itemtype       = $_REQUEST['itmetype'];
		global $gl_loglevel;
	} else {
		//uncomment for debug
		/*
		$action  		= $_GET['action'];
		$poiname 		= $_GET['poiname'];
		$description	= $_GET['description'];
		$longtext		= $_GET['longtext'];
		$lat 		    = $_GET['lat'];
		$lon            = $_GET['lon'];
		$georssurl		= $_GET['georssurl'];
		$poilist		= $_GET['poilist'];
		$groupid		= $_GET['groupid'];
		$poiid	 		= $_GET['poiid'];
		$tagname 		= $_GET['tagname'];
		$zoomlevel 		= $_GET['zoomlevel'];
		//$itemtype       = $_GET['itmetype'];
		*/
	}
		
   	if (application_userisvalid()) {
   		$usr = application_getvaliduser();
		if ($usr != null) {
			$pof = new PoiFactory();
			$js2 = new Services_JSON;
			
			//msg_createpoi
			if ($action == msg_createpoi) {
				if (!$pof->poiExistsByPos($usr->getUid(),$lat,$lon)) {
					if ($pof->createPoi($usr->getUid(),$poiname,$description,$lat,$lon,$zoomlevel,$tagname,"Poi")) {						
						$poi = $pof->getPoiById($usr->getUid(),$pof->lastid);
						if ($poi != null) {
							if (isset($groupname)) { //add created poi into a group
								$gf = new GroupFactory();
								$grp = $gf->getGroupByName($usr->getUid(),$groupname);
								if ($grp != null) {
									$gf->addGroupItem($grp->itemid, $usr->getUid(),$poi->itemid,$poi->itemtype);
								}
							}
							echo application_getMessage($poi);		
						}
					} else {
						echo application_getMessage(msg_failed);	
					}
				
				} else {
					echo application_getMessage(msg_exists);
				}
			}
			
			//msg_deletepoi
			if ($action == msg_deletepoi) {
				if ($pof->deletePoi($usr->getUid(),$poiid)) {
					echo application_getMessage(msg_delok);	
				} else {
					echo application_getMessage(msg_failed);	
				}
			}
			
			//msg_getpois
			if ($action == msg_getpois) {
				$lst1 = $pof->getPois($usr->getUid());
				if ($lst1 != null) {
					$pc = new PoiContainer();
					for ($i=0;$i<count($lst1);$i++) {
						$poi = $lst1[$i];
						$pc->addPoi($poi);
					}
					
					echo application_getMessage($pc);
					//echo application_getMessage($lst1);	
				} else {
					echo msg_empty;	
				}
			}
			
			//msg_getpoi
			if ($action == msg_getpoi) {
				$lst1 = array();
				
				$poi = $pof->getPoiById($usr->getUid(), $poiid);
				if ($poi != null) {
					array_push($lst1, $poi);
					echo application_getMessage($lst1);	
				} else {
					echo application_getMessage(msg_failed);	
				}				
			}
			
			//msg_updatepoi
			if ($action == msg_updatepoi) {
				//updatePoi($aUsrId,	$aPoiId, $aPoiName, $aDescription, $aLatLon, $aGeoRssUrl) {	
				$poi = $pof->updatePoi($usr->getUid(),$poiid,$poiname,$description,$lat,$lon,$zoomlevel,$tagname);
				if ($poi != null) {
					echo application_getMessage($poi);	
				} else {
					echo application_getMessage(msg_failed);	
				}
			}
			
			//msg_addgrppois
			if ($action == msg_addgrppois) {
				if (isset($poilist))
				{
					$lst1 = $js2->decode(str_replace("\\\"","\"",$poilist));
					//echo $poilist;
					//$encoded = $files;
					
					if ($lst1 != null)
					{						
						$ok = true;
						$poiid = "";
						$poi1 = null;
						$gf = new GroupFactory();
						for ($i=0;$i<count($lst1);$i++) {
							$poiid = $lst1[$i];
							$poi1 = $pof->getPoi($usr->getUid(), $poiid);
							if ($poi1 != null) {
								
								if (!$gf->addGroupItem($groupid,$usr->getUid(),$poi1->getPoiId(),"Poi")) {
									$ok = false;
								}
							}
						}
						
						if ($ok) {
							echo application_getMessage(msg_addok);
						} else {
							echo application_getMessage(msg_failed);
						}
						
					}
				} else {
					echo application_getMessage(msg_failed);
				}
			}
					
			//msg_remgrppois
			if ($action == msg_remgrppois) {
				if (isset($poilist))
				{
					$lst1 = $js2->decode(str_replace("\\\"","\"",$poilist));
					
					if ($lst1 != null)
					{						
						$ok = true;
						$poiid = "";
						$poi1 = null;
						$gf = new GroupFactory();
						for ($i=0;$i<count($lst1);$i++) {
							$poiid = $lst1[$i];
							$poi1 = $pof->getPoiById($usr->getUid(), $poiid);
							if ($poi1 != null) {
								if (!$gf->remGroupItem($groupid,$usr->getUid(),$poi1->getPoiId(),"Poi")) {
									$ok = false;
								}
							}
						}
						
						if ($ok) {
							$grp = $gf->getGroup($usr->getUid(),$groupid);
							if ($grp != null) {
								echo application_getMessage($grp);
							} else {
								echo application_getMessage(msg_failed);
							}
						} else {
							echo application_getMessage(msg_failed);
						}
						
					}
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			
		}
	}
?>
