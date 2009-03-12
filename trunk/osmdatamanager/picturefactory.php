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
	/**
	 * Picture
	 */
	class Picture {
		var $thumb;
		var $large;
		var $title;
		var $link;
		
		function Picture($aThumb, $aLarge, $aTitle, $aLink) {
			$this->thumb = $aThumb;
			$this->large = $aLarge;
			$this->title = $aTitle;
			$this->link = $aLink;
		}
	}
	
	/**
	 * Picturelist
	 */
	class Picturelist
  	{
		var $items;
  		
		function Picturelist() {
			$this->items = array();	
		}
		
		function addPicture($aPicture) {
			array_push($this->items, $aPicture);
		}
	}
	
?>
