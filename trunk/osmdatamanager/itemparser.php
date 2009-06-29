<?php
    
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
		
		function parse_Tags(&$aItem) {
			
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
						
		/*******************************************************************************************
		 * 
		 * end parse functions
		 * 
		 *******************************************************************************************/
		
	}
	
	
?>
