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
		$latlon 		= $_REQUEST['latlon'];
		$georssurl		= $_REQUEST['georssurl'];
		$poilist		= $_REQUEST['poilist'];
		$groupid		= $_REQUEST['groupid'];
		$poiid	 		= $_REQUEST['poiid'];
		global $gl_loglevel;
		$gl_loglevel 	= 1;
	} else {
		//uncomment for debug
		/*
		$action  		= $_GET['action'];
		$poiname 		= $_GET['poiname'];
		$description	= $_GET['description'];
		$longtext		= $_GET['longtext'];
		$latlon 		= $_GET['latlon'];
		$georssurl		= $_GET['georssurl'];
		$poilist		= $_GET['poilist'];
		$groupid		= $_GET['groupid'];
		$poiid	 		= $_GET['poiid'];
		*/
	}
		
   	if (application_userisvalid()) {
   		$usr = application_gevaliduser();
		if ($usr != null) {
			$pof = new PoiFactory();
			$js2 = new Services_JSON;
			
			//msg_createpoi
			if ($action == msg_createpoi) {
				if (!$pof->poiExists($usr->getUid(),$poiname)) {
					if ($pof->createPoi($usr->getUid(),$poiname,$description,$latlon,$georssurl)) {
						echo application_getMessage(msg_crtok);	
					} else {
						echo application_getMessage(msg_failed);	
					}
				} else {
					echo application_getMessage(msg_exists);
				}
			}
			
			//msg_getpois
			if ($action == msg_getpois) {
				$lst1 = $pof->getPois($usr->getUid());
				if ($lst1 != null) {
					echo application_getMessage($lst1);	
				} else {
					echo application_getMessage(msg_failed);	
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
				$poi = $pof->updatePoi($usr->getUid(),$poiid,$poiname,$description,$latlon,$georssurl);
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
								
								if (!$gf->addGroupPoi($groupid,$usr->getUid(),$poi1->getPoiId())) {
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
								if (!$gf->remGroupPoi($groupid,$usr->getUid(),$poi1->getPoiId())) {
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
