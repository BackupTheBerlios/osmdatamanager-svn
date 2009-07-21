/**
    @license
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
 
PoiManager.prototype = new TRM.ServerConnection;

/**
 * PoiManager
 */
function PoiManager(){
	
	var callback = null;
	
	/**
	 * callback after getPois
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_getPois = function(response, ioArgs) {
		try {		
			if (response == null)
				return;
			
			if ((response != "msg.failed") && (response != ""))
			{
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}	
			} else
			{alert("failed");}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after getPoi
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_getPoi = function(response, ioArgs) {
		try {		
			if (response == null)
				return;
			
			if ((response != "msg.failed") && (response != ""))
			{
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}	
			} else
			{alert("failed");}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after createPoi
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */	
	var _cb_createPoi = function(response, ioArgs) {
		try {		
			if (response == null)
				return;
			
			if ((response == "msg.crtok") && (response != ""))
			{
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			} else
			{alert("failed");}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after updatePoi
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_updatePoi = function(response, ioArgs){
		try {		
			if (response == null)
				return;
			
			if ((response != "msg.failed") && (response != ""))
			{
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			} else
			{alert("failed");}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * creates new poi
	 * @param {Object} poiname
	 * @param {Object} description
	 * @param {Object} latlon
	 * @param {Object} georssurl
	 * @param {Object} cb
	 */
	this.createPoi = function(poiname, description, lat,lon,cb) {
						
		params = {
			"action":"msg.createpoi",
			"poiname":poiname,
			"description":description,
			"lat":lat,
			"lon":lon
			//"georssurl":georssurl
		}
		callback = cb;
		loadFromServer("poifunctions.php",params,_cb_createPoi);
	}
	
	/**
	 * updates an existing poi
	 * @param {Object} poiid
	 * @param {Object} poiname
	 * @param {Object} description
	 * @param {Object} latlon
	 * @param {Object} georssurl
	 * @param {Object} cb
	 */
	this.updatePoi = function(poiid,poiname, description,lat,lon,tagname,zoomlevel,cb) {
						
		params = {
			"action":"msg.updatepoi",
			"poiid": poiid,
			"poiname":poiname,
			"description":description,
			"lat":lat,
			"lon":lon,
			"tagname":tagname,
			"zoomlevel":zoomlevel
		}
		callback = cb;
		loadFromServer("poifunctions.php",params,_cb_updatePoi);
	}
	
	
	this.getPois = function(cb) {
		callback = cb;
		params = {
			"action": "msg.getpois"
		}
		loadFromServer("poifunctions.php",params,_cb_getPois);
	}
	
	/**
	 * loads poi from database
	 * @param {Object} poiid
	 * @param {Object} cb
	 */
	this.getPoi = function(poiid, cb) {
		callback = cb;
		params = {
			"action": "msg.getpoi",
			"poiid":  poiid
		}
		loadFromServer("poifunctions.php",params,_cb_getPoi);
	}
}