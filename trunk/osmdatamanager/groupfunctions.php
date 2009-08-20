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
   include_once("groupfactory.php");	   
   	
	$action  		= $_REQUEST['action'];
	if (isset($action)) {
		$groupname  	= $_REQUEST['groupname'];
		$groupid  		= $_REQUEST['groupid'];
		$parentgroupid 	= $_REQUEST['parentgroupid'];
		$files 			= $_REQUEST['files'];	
		$filename		= $_REQUEST['filename'];	
		$description    = $_REQUEST['description'];	
		$protection     = $_REQUEST['protection'];
		$zoomlevel  	= $_REQUEST['zoomlevel'];
		$lat 		    = $_REQUEST['lat'];
		$lon            = $_REQUEST['lon'];
		$username		= $_REQUEST['username'];
		$recursiv	    = $_REQUEST['recursiv'];
		$tagname       	= $_REQUEST['tagname'];
		$grpitmid       = $_REQUEST['grpitmid'];
		$itemtype       = $_REQUEST['itemtype'];
		$treedata       = $_REQUEST['treedata'];
		global $gl_loglevel;
	} else {
		//uncomment for debug
		/*		
		$action  		= $_GET['action'];
		$groupname  	= $_GET['groupname'];
		$groupid  		= $_GET['groupid'];
		$parentgroupid 	= $_GET['parentgroupid'];
		$files 			= $_GET['files'];	
		$filename		= $_GET['filename'];
		$description    = $_GET['description'];
		$protection     = $_GET['protection'];
		$zoomlevel  	= $_GET['zoomlevel'];
		$lat 		    = $_GET['lat'];
		$lon            = $_GET['lon'];	
		$username		= $_GET['username'];
		$recursiv	    = $_GET['recursiv'];
		$tagname       	= $_GET['tagname'];
		*/
	}
		
   	if (application_userisvalid()) {
   		$usr = application_gevaliduser();
		if ($usr != null) {
			$fac = new Groupfactory();
			//$json = new json;
			$js2 = new Services_JSON;
			
			//msg_crtgrp
			if ($action == msg_crtgrp) {
				if ($fac->createGroup($usr->getUid(),$groupname,$parentgroupid)) {
					//echo application_getMessage(msg_crtok);	
					$grp = $fac->getGroup($usr->getUid(),$fac->lastid);
					if ($grp != null) {
						$grp->prepareForTree($parentgroupid);
						echo application_getMessage($grp);
					} else {
						echo application_getMessage(msg_failed);
					}
					/*
					$lst1 = null;
					if ($parentgroupid == -1) {
						$lst1 = $fac->getRootGroups($usr->getUid());
					} else {
						$lst1 = $fac->getChildGroups($usr->getUid(),$parentgroupid);
					}
					
					if ($lst1 != null) {
						echo application_getMessage($lst1);
					} else {
						echo application_getMessage(msg_failed);
					}
					*/
				}	else {
					echo application_getMessage(msg_failed);
				}
			}
			
			//msg_delgrp
			if ($action == msg_delgrp) {
				if (isset($groupid)) {
					if ($fac->deleteGroup($usr->getUid(), $groupid)) {
						echo application_getMessage(msg_delok);
					} else {
						echo application_getMessage(msg_failed);
					}
				}
			}
			
			//msg_remgrpitm
			if ($action == msg_remgrpitm) {				
				if (isset($groupid)) {
					if ($fac->removeGroupItem($usr->getUid(), $groupid, $grpitmid)) {
						echo application_getMessage(msg_remok);
					} else {
						echo application_getMessage(msg_failed);
					}
				}				
			}
			
			//msg_getgrps
			if ($action == msg_getgrps) {
				$lst1 = null;
				if ($parentgroupid == -1) {
					$lst1 = $fac->getRootGroups($usr->getUid());
				}
				
				if ($lst1 != null) {
					echo application_getMessage($lst1);
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			
			//msg_gettree
			if ($action == msg_gettree) {
				$lst1 = null;
				$gc = new GroupContainer("id","name");
				
				if ($parentgroupid == -1) {
					$lst1 = $fac->getRootGroups($usr->getUid());
				} 
				
				if ($lst1 != null)
				{
					for ($i=0;$i<count($lst1);$i++) {
							$fac->parseChildren($usr->getUid(),$lst1[$i]);							
							$lst1[$i]->prepareForTree(-1);
							$gc->addGroup($lst1[$i]);
					}
				}
								
				echo application_getMessage($gc);
			}
						
			//msg_remgrpfiles
			/*
			if ($action == msg_remgrpfiles) {							
				//$fac->addMessage("msg_addgrpfiles");				
				if (isset($files))
				{
					$lst1 = $js2->decode(str_replace("\\\"","\"",$files));
					
					//$encoded = $files;
					if ($lst1 != null)
					{						
						$ok = true;
						$fn = "";
						for ($i=0;$i<count($lst1);$i++) {
							$fn = $lst1[$i];
							if (! ($fac->remGroupFile($groupid, $usr->getUid(), $fn))) {
								$ok = false;
							}
						}
						
						if ($ok) {
							$grp = $fac->getGroup($usr->getUid(),$groupid);
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
			*/
			
			
			//msg_getgrpfiles
			/*
			if ($action == msg_getgrpfiles) {
				$lst1 = $fac->getGroupFiles($usr->getUid(), $groupid);
				if ($lst1 != null) {
					echo application_getMessage($lst1);
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			
			//msg_getgrpfilesrecursiv
			if ($action == msg_getgrpfilesrecursiv) {
				$files = array();
				
				if ($fac->getGroupFiles_Recursiv($usr->getUid(),$groupid,$files)) {
					echo application_getMessage($files);
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			
			//msg_getgrppoisrecursiv
			if ($action == msg_getgrppoisrecursiv) {
				$pois = array();
				
				if ($fac->getGroupPois_Recursiv($usr->getUid(),$groupid,$pois)) {
					echo application_getMessage($pois);
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			
			//msg_getgrppois
			if ($action == msg_getgrppois) {
				$lst1 = $fac->getGroupPois($usr->getUid(), $groupid);
				if ($lst1 != null) {
					echo application_getMessage($lst1);
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			*/
			
			//msg_getchildgrps
			if ($action == msg_getchildgrps) {
				$lst1 = $fac->getChildGroups($usr->getUid(), $parentgroupid);
				if ($lst1 != null) {
					if (count($lst1) == 0)
						echo application_getMessage(msg_none);
					else
						echo application_getMessage($lst1);
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			
			//msg_addgrpitm
			if ($action == msg_addgrpitm) {
				//addGroupItem($aGroupId, $aUsrId, $aItemid,$aItemType) {
				if ($fac->addGroupItem($parentgroupid, $usr->getUid(),$grpitmid,$itemtype)) {
					echo application_getMessage(msg_addok);
				} else {
					echo application_getMessage(msg_failed);
				}
			}
			
			
			//msg_getgrpitems
			if ($action == msg_getgrpitems) {
				$items = array();
																
				//get groupitems by groupname
				if (($groupname != "") &&($groupid == -1)) {
					$grp = $fac->getGroupByName($usr->getUid(),$groupname);
					if ($grp != null) {
						$groupid = $grp->getGroupId();
						array_push($items,$grp);
					}
				} else {
					$grp = $fac->getGroup($usr->getUid(),$groupid);
					if ($grp != null) {
						array_push($items,$grp);
					}
				}
				
				if (isset($grpitmid)) {
				   $fac->addGroupItem($groupid,$usr->getUid(),$grpitmid,$itemtype);
				}
									
				if (count($items) > 0) {
						
					//if (isset($treedata)) {
						$gc = new GroupContainer("id","name");
																
						if ($items != null)
						{
							for ($i=1;$i<count($items);$i++) {
									$itm = $items[$i];
									$itm->prepareForTree($groupid);
									$gc->addGroup($itm);
							}
						}
										
						echo application_getMessage($gc);
					/*
					} else {
						echo application_getMessage($items);
					}
					*/
				
				} else {
					echo application_getMessage(msg_failed);	
				}
			}
			
			//msg_getpublicgrpitems
			if ($action == msg_getpublicgrpitems) {
				$items = array();
				
				if (!isset($recursiv))
					$recursiv = -1;
				
				$uf = new Userfactory();
				$uid = $uf->getUserId($username);
				if ($uid > -1) {
					//echo $uid;
					$grp = $fac->getPublicGroupByName($uid,$groupname);
					if ($grp != null) {
						$groupid = $grp->getGroupId();
						array_push($items,$grp);
									
						//childgroups
						/*
						$lst1 = $fac->getChildGroups($usr->getUid(), $groupid);
						if ($lst1 != null) {
							for ($i=0;$i<count($lst1);$i++) {
								$grp1 = $lst1[$i];
								array_push($items,$grp1);
							}
						}
						*/
						
						if ($recursiv == 1) {
							$fac->getGroupFiles_Recursiv($uid, $groupid,$items);
							$fac->getGroupPois_Recursiv($uid, $groupid,$items);
						} else {
							//groupfiles
							$lst1 = $fac->getGroupFiles($uid, $groupid);
							if ($lst1 != null) {
								for ($i=0;$i<count($lst1);$i++) {
									$fl1 = $lst1[$i];
									array_push($items,$fl1);
								}
							}
											
							//grouppois
							$lst1 = $fac->getGroupPois($uid, $groupid);
							if ($lst1 != null) {
								for ($i=0;$i<count($lst1);$i++) {
									$poi1 = $lst1[$i];
									array_push($items,$poi1);
								}
							}
						}
						
						if (count($items) > 0) {
							echo application_getMessage($items);	
						} else {
							echo application_getMessage(msg_failed);	
						}		
					}
				}
			}
			
			//msg_updatefile
			if ($action == msg_updatefile) {
				//($aGroupId, $aUsrId, $aFilename, $aDescription)
				if ($fac->updateGroupFile($groupid,$usr->getUid(),$filename,$description) )
					echo application_getMessage(msg_ok);
				else
					echo application_getMessage(msg_failed);
			}
			
			//msg_updategrp
			if ($action == msg_updategrp) {
			
				//($aGroupId, $aUsrId, $aFilename, $aDescription)
				if ($fac->updateGroup($usr->getUid(),$groupid,$groupname,$protection,$zoomlevel,$lat,$lon,$tagname) ) {
					//echo $groupid.$usr->getUid();
					$grp = $fac->getGroup($usr->getUid(),$groupid);
					if ($grp != null) {
						//echo $grp;
						echo application_getMessage($grp);
					} else {
						echo application_getMessage(msg_ok);
					}
				} else {
					echo application_getMessage(msg_failed);
				}
			}
		}
	}
	
?>
