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

TRM = {
	Version: "0.1",
	ClientApplication: null,
	Serverconnection: null,
	TargetPrefix: null
}


/**
 * base class for async dataloading
 */
TRM.ServerConnection = function()
{	   
}

TRM.ServerConnection.prototype
{ 			
		/**
		 * loadFromServer
		 * @param {Object} targetfile
		 * @param {Object} params
		 * @param {Object} callBack
		 */
		function loadFromServer(targetfile, params, callBack){
			if (TRM.TargetPrefix) 
				targetfile = TRM.TargetPrefix + targetfile;
			
			try {
				dojo.xhrPost({ //
					// The following URL must match that used to test the server.
					url: targetfile,
					handleAs: "json",
					content: params,
					
					timeout: 5000, // Time in milliseconds
					// The LOAD function will be called on a successful response.
					load: callBack,
					
					// The ERROR function will be called in an error case.
					error: function(response, ioArgs){ //
						alert(response);
						console.error("HTTP status code: ", ioArgs.xhr.status); //
						return response; //
					}
				});
			} 
			catch (e) {
				alert(e);
			}
		}
}


//TRM.ClientApplication.prototype.picturecomparator = null;
/**
 * Base Client Application Class
 * 
 * possible optional classes:
 * 
 * ->markermanager
 * 
 * 
 * @classDescription you can use this class for your own websites when you want to use the OSM Trackmanager classes
 */

TRM.ClientApplication = function(openlayersMap)
{			
	var activeuser=null;
	var callback = null;
	var self = this;
		
	this.initialize = function(openlayersMap,mm) {
		this.map = openlayersMap; 	
		this.markermanager = mm;
		self=this;
	}
	this.initialize(openlayersMap);
			
	/**
	 * callback after registerUser
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_registerUser = function(response, ioArgs) {
		try {
			//user exists
			if (response == "msg.userexists") {
				alert('Benutzername existiert bereits');
				return;
			}
			
			if ((response != "msg.failed") && (response != ""))
			{
				activeuser = response; //new User(response.uid,response.username,response.email,response.location_lat,response.location_lon,response.abouthtml,response.picture);
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			} else {
				alert("failed");
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback from loginUser
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_loginUser = function(response, ioArgs) {
		try {
			if (response == "msg.logoutok") {
				return;
			}
			
			if (callback != null) {
				if ((response != "msg.loginfailed") && (response != "")) {
					activeuser = response;
				}
				callback.func.apply(callback.target, [response, ioArgs]);
			}			
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * checkUserOk
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_checkUser = function(response, ioArgs) {
		try {
			if (response == "msg.logout") {
				activeuser = null;
				return;
			}
			
			if ((response != "msg.loginfailed") && (response != ""))
			{
				activeuser = response; //new User(response.uid, response.username,response.email,response.location_lat,response.location_lon,response.abouthtml,response.picture);
			} 
			
			if (callback != null) {
				callback.func.apply(callback.target, [response, ioArgs]);
			}
			
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after updateActiveUser
	 * @see updateActiveUser
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_updateActiveUser = function(response, ioArgs){
		if (callback != null) {
			callback.func.apply(callback.target, [response, ioArgs]);
		}
	}
	
	/**
	 * callback after changePassword 
	 * @see changePassword
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_changePassword = function(response, ioArgs){
		if (callback != null) {
			callback.func.apply(callback.target, [response, ioArgs]);
		}
	}
	
	/**
	 * callback after getPointFromMap
	 * @param {Object} e
	 */
	var _cb_getPointFromMap = function(e) {
		if (callback != null) {
			callback.func.apply(callback.target, [e]);
		}	
	}
	
	/**
	 * callback after updateFileList 
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_updateFileList = function(response, ioArgs){
		try {
			if ((response != "msg.failed") && (response != "")) {
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after deleteUser
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_deleteUser = function(response, ioArgs){
		try {
			if ((response != "msg.failed") && (response != "")) {
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * _createPoi
	 * @param {Object} lat
	 * @param {Object} lon
	 * @param {Object} contentHtml
	 * @param {Object} layer
	 */
	var _createPoi = function(lat, lon, contentHtml, layer) {
		if (self.map && self.markermanager) {
			var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), self.map.getProjectionObject());
			self.markermanager.addPoiMarker(lonLat, gl_markers, contentHtml);
		}
	}
	
	/**
	 * _layerExists
	 * @param {Object} layername
	 */
	var _layerExists = function(layername) {
		var lst1 = self.map.getLayersByName(layername);
		if (lst1 != null) {
			for (var x = 0; x < lst1.length; x++) {
				lyr1 = lst1[x];
				if (lyr1.name == layername) {
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * _getLayer
	 * @param {Object} layername
	 */
	var _getLayer = function(layername) {
		var lst1 = self.map.getLayersByName(layername);
		if (lst1 != null) {
			for (var x = 0; x < lst1.length; x++) {
				lyr1 = lst1[x];
				if (lyr1.name == layername) {
					return lyr1;
				}
			}
		}
		return null;
	}
	
	/**
	 * _getLastLayer
	 */
	var _getLastLayer = function() {
		/*
		var lst1 = self.map.getLayersByName(layername);
		if (lst1 != null) {
			for (var x = 0; x < lst1.length; x++) {
				lyr1 = lst1[x];
				if (lyr1.name == layername) {
					return lyr1;
				}
			}
		}
		*/
		return self.map.layers[self.map.layers.length-1];
	}
	
	/**
	 * _drawNode (not used at the moment)
	 * @param {Object} xmlNode
	 */
	var _drawNode = function(xmlNode) {
		//console.log(xmlNode.getAttribute('time'));
		for (var i=0;i<xmlNode.childNodes.length;i++) {
			n1 = xmlNode.childNodes[i];
			if (n1.nodeName == "time") {
				//console.log(OpenLayers.Util.getXmlNodeValue(n1));
				//console.log(n1.nodeValue);
				//console.log(self.picturecomparator);
				if (self.picturecomparator != null) {
					var p1 = self.picturecomparator.pictureMatches(OpenLayers.Util.getXmlNodeValue(n1));
					if (p1 != null) {
						var lat = xmlNode.getAttribute('lat');
						var lon = xmlNode.getAttribute('lon');
						var layer = _getLastLayer();
						var contentHtml = "<img src=\"http://dirk-lehmeier.de/gpxtracer/"+p1.filename+"\"/><br>";
						contentHtml += "<b>" + p1.originaldate + "</b><br>";
						//contentHtml += OpenLayers.Util.getXmlNodeValue(n1) + "<br>";
						_createPoi(lat,lon,contentHtml,layer);	
					}
				}
				
				break;
			}
		}
	}
	
	/**
	 * _containsGpxFile
	 * @param {Object} response
	 */
	var _containsGpxFile = function(response) {
		for (var i = 1; i < response.length; i++) {			
			itm1 = response[i];		
			if (itm1.itemtype == "Tracefile") {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * _showGpxFile (old version)
	 * @param {Object} description
	 * @param {Object} filename
	 */
	/*
	var _showGpxFile = function(description, filename) {	
		filename = TRM.TargetPrefix + filename;
		if (!_layerExists(description)) {
			lgpx = new OpenLayers.Layer.GPX(description, filename);
			lgpx.setDrawnodeEvent(_drawNode);
			self.map.addLayer(lgpx);
			return lgpx;
		} else {
			  var lyr1 = _getLayer(description);
			  if (lyr1 != null) {
			  	lyr1.testLoadUrl(filename);
			  }
		}
		return null;
	}
	*/	
	
	/**
	 * adds a gpx file to the map
	 * @param {Object} description
	 * @param {Object} filename
	 */
	var _showGpxFile = function(description, filename){
		filename = TRM.TargetPrefix + filename;
		if (!_layerExists(description)) {
			
			// Track-style
			var styleTrack = {
			  strokeColor: "#ff00ff",
			  strokeWidth: 3
			};

			var lgpx = new OpenLayers.Layer.GML(description, filename, {
													format: OpenLayers.Format.GPX,
													projection: self.map.displayProjection,
													style: styleTrack
												});
									
			self.map.addLayer(lgpx);
			//workaround for firefox
			//lgpx.setZIndex(gl_markers.getZIndex()+1);
			//alert('m: '+gl_markers.getZIndex());
			//alert('vl: '+lgpx.getZIndex());
			lgpx.setZIndex(301);
			
			return lgpx;
		} else {
			var lyr1 = _getLayer(description);
			  if (lyr1 != null) {
			  	lyr1.testloadURL(filename);
			  }
		}
		return null;
	}

	
	/*************************************************************************************************
	 * 
	 * PUBLIC FUNCTIONS
	 * 
	 *************************************************************************************************/
		
	
	/**
	 * getActiveUser
	 */
	this.getActiveUser = function()
	{
		return activeuser;
	}
	
	/**
	 * updates the data from the current (logged in) user
	 * @param {Object} cb - callback function
	 */
	this.updateActiveUser = function(cb)
	{
		try {
			if (activeuser != null)
			{
				callback = cb;
				params = {
					"action": "msg.updateuser",
					"username": activeuser.username,
					"email": activeuser.email,
					"lat": activeuser.location_lat,
					"lon": activeuser.location_lon,
					"about": activeuser.abouthtml,
					"picture": activeuser.picture
				}
				
				loadFromServer("userfunctions.php", params, _cb_updateActiveUser);
			}
		} catch(e)
		{alert(e);}
	}
	
	/**
	 * updates the password from current user
	 * @param {Object} oldpass 
	 * @param {Object} newpass
	 * @param {Object} cb - callback
	 */
	this.changePassword = function(oldpass,newpass,cb) {
		try {
			if (activeuser != null)
			{
				callback = cb;
				params = {
					"action": "msg.changepassword",
					"password": oldpass,
					"newpassword": newpass
				}
				
				loadFromServer("userfunctions.php", params, _cb_changePassword);
			}
		} catch(e)
		{alert(e);}
	}
	
	
	/**
	 * loginUser
	 * @param {Object} username
	 * @param {Object} password
	 * @param {Object} cb
	 */
	this.loginUser = function(username,password,cb)
	{
		params = {
			"action": "msg.login",
			"username":username,
			"password":password
		}
		callback = cb;
		loadFromServer("userfunctions.php",params,_cb_loginUser);
	}
	
	/**
	 * checkUser
	 * @param {Object} cb
	 */
	this.checkUser = function(cb)
	{
		params = {
			"action":"msg.chklogin"
		}
		activeuser=null;
		callback = cb;
		loadFromServer("userfunctions.php",params,_cb_checkUser);
	}
	
	/**
	 * logoutUser 
	 */
	this.logoutUser = function()
	{
		params = {
			"action":"msg.logout"
		}
		activeuser=null;		
		loadFromServer("userfunctions.php",params,_cb_loginUser);
	}
	
	/**
	 * registerUser
	 * @param {Object} username
	 * @param {Object} password
	 * @param {Object} email
	 * @param {Object} cb
	 */
	this.registerUser = function(username, password, email,cb) {
		params = {
			"action":"msg.registeruser",
			"username":username,
			"password":password,
			"email":email
		}
		activeuser=null;
		callback = cb;
		loadFromServer("userfunctions.php",params,_cb_registerUser);
	}
	
	/**
	 * centerMap
	 * @param {Object} lat
	 * @param {Object} lon
	 * @param {Object} zommlevel
	 */
	this.centerMap = function(lat, lon, zommlevel) {		
		var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());	
		this.map.setCenter(lonLat, zommlevel);
	}
			
	/**
	 * centerHomebase 
	 */
	this.centerHomebase = function() {
		var usr = this.getActiveUser();
		if (usr != null)
		{				
			if ((usr.location_lat != null) && (usr.location_lat != "")) {
				this.createPoi(usr.location_lat, usr.location_lon, usr.abouthtml,gl_markers);
				this.centerMap(usr.location_lat, usr.location_lon, 14);
			}
			else {
				var lat = 50.9350850727913;
				var lon = 6.95356597872225;
				this.centerMap(lat, lon, 6);
			}
		}
	}
	
	/**
	 * removeLayers
	 * @param {Object} layername
	 */
	this.removeLayers = function(layername) {
		var lst1 = this.map.getLayersByName(layername);
		if (lst1 != null) {
			for (var x = 0; x < lst1.length; x++) {
				lgpx = lst1[x];
				map.removeLayer(lgpx);
			}
		}
	}
	
	/**
	 * clearMap
	 */
	this.clearMap = function() {
		
		for (var x = (this.map.layers.length - 1); x > -1; x--) {
			var lyr = this.map.layers[x];
			
			if (this.markermanager) {
				if (lyr.name == "Markers") {
					this.markermanager.removeMarkers(lyr);
				}
			}
			
			if (this.picturecomparator) {
				this.picturecomparator.resetPictures();
			}
			
			if ((lyr.name != "Mapnik") && (lyr.name != "CycleMap") && (lyr.name != "Osmarender")) {
				this.map.removeLayer(lyr);
			}
		}
				
		gl_markers = new OpenLayers.Layer.Markers( "Markers",{projection: new OpenLayers.Projection("EPSG:4326")});
    	this.map.addLayer(gl_markers);
	}
	
	/**
	 * showGpxFile
	 * @param {Object} description
	 * @param {Object} filename
	 */
	this.showGpxFile = function(description, filename) {
		/*
		if (!this.layerExists(description)) {
			lgpx = new OpenLayers.Layer.GPX(description, filename);
			this.map.addLayer(lgpx);
		}
		*/
		_showGpxFile(description,filename);
	}
	
	/**
	 * createPoi
	 * @param {Object} lat
	 * @param {Object} lon
	 * @param {Object} contentHtml
	 * @param {Object} layer
	 */	
	this.createPoi = function(lat, lon, contentHtml, layer) {		
		_createPoi(lat,lon,contentHtml,layer);
	}
	
	/**
	 * shows data of a group
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	this.showData = function(response, ioArgs) {
		if ((response != null) && (response != "")) {
		
			//var description = "";
			//var lyrname = null;
			var desc = "empty";
			var lyr = null;
			if (response != "msg.failed") {
				
				var itm1 = response[0];
				if (itm1.itemtype == "Group") {
					self.centerMap(itm1.lat,itm1.lon,itm1.zoomlevel);
					desc = itm1.groupname;
					if (!_containsGpxFile(response))
						lyr = gl_markers;
				}
								
				for (var i = 1; i < response.length; i++) {
					itm1 = response[i];
										
					if (itm1.itemtype == "Tracefile") {
					  var fn = "traces/" + itm1.filename;
					  					  				  
					  var l1 = _showGpxFile(desc,fn);
					  if (lyr == null) 
					    lyr = l1;
					  	//createFile(clickednodeelem.parentNode, itm1);	
					}
					
					
					if (itm1.itemtype == "Poi") {
						_createPoi(itm1.lat,itm1.lon,itm1.description,lyr);
					}
										
					/*
					if (itm1.itemtype == "Group")
						createGroup(clickednodeelem.parentNode, itm1);
					*/
							
				}
			}
		}
	}
	
	/**
	 * getGroupItems
	 * @param {Object} groupname
	 * @param {Object} cb
	 */
	this.getGroupItems = function(groupname,cb){
		var groupid = -1;
		
		params = {
			"action": "msg.getgrpitems",
			"groupid": groupid,
			"groupname": groupname
		}
		loadFromServer("groupfunctions.php", params, cb);
	}
	
	/**
	 * getPublicGroupItems
	 * @param {Object} fromuser
	 * @param {Object} groupname
	 * @param {Object} recursiv
	 * @param {Object} cb
	 */
	this.getPublicGroupItems = function(fromuser, groupname,recursiv,cb){
		var groupid = -1;
		
		params = {
			"action": "msg.getpublicgrpitems",
			"groupid": groupid,
			"groupname": groupname,
			"username": fromuser,
			"recursiv": recursiv
		}
		loadFromServer("groupfunctions.php", params, cb);
	}
	
	/**
	 * getPointFromMap
	 * @param {Object} cb
	 */
	this.getPointFromMap = function(cb){
		callback = cb;
		
		var ctrl2 = this.map.getControlsByClass("OpenLayers.Control.Click");
		if (ctrl2.length < 1) {
			try {
				gl_dblclick = new OpenLayers.Control.Click({
                        handlerOptions: {
                            "single": false,
                            "double": true,
							"clickhandler": _cb_getPointFromMap
                        }
                    });
				
				this.map.addControl(gl_dblclick);
				gl_dblclick.activate();
			} catch (e) {
				alert(e);
			}
		}
	}
	
	/**
	 * updates the filelist (filetable in database)
	 */
	this.updateFileList = function(cb) {
		params = {
			"action": "msg.updatefilelist"
		}
		callback = cb;
		loadFromServer("filefunctions.php",params,_cb_updateFileList);
	}
	
	/**
	 * deletes a user in database (and all data from this user)
	 * @param {Object} delusername
	 * @param {Object} cb
	 */
	this.deleteUser = function(delusername, cb) {
		if (activeuser != null) {
			if (activeuser.isadmin) {
				params = {
					"action": "msg.deleteuser",
					"deleteuser": delusername
				}
				callback = cb;
				loadFromServer("userfunctions.php", params, _cb_deleteUser);
			}
		}
	}
	
}
TRM.ClientApplication.prototype = new TRM.ServerConnection();




