/**
 * base class for server connections 
 */
dojo.declare("Serverconnection", null, {
        
		constructor: function(){
                
        },
		
		/**
		 * 
		 * @param {Object} targetfile
		 * @param {Object} params
		 * @param {Object} callBack
		 */
		loadFromServer: function(targetfile, params, callBack){
			try {
				dojo.xhrPost({ //
					// The following URL must match that used to test the server.
					url: targetfile,
					handleAs: "json",
					content: params,
					
					timeout: 5000, // Time in milliseconds
					// The LOAD function will be called on a successful response.
					load: dojo.hitch(this,callBack),
					
					// The ERROR function will be called in an error case.
					error: function(response, ioArgs){ //
						alert(response);
						console.error("HTTP status code: ", ioArgs.xhr.status); //
						return response; //
					}
				});
			} 
			catch (e) {
				console.error(e);
			}
		},
		
		/**
		 * standard callback, check if answer is not msg.failed an call custom callback if defined
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_standard: function(response, ioArgs) {
			try {		
				if (response != "msg.failed")
				{
					if (this.callback != null) {
						this.callback.func.apply(this.callback.target, [response, ioArgs]);
					}
					
				}
			} catch (e)
			{console.error(e);}
		}
		
});


/**
 * base application object does not use any dijit widgets
 * @param {Object} name
 */
dojo.declare("Application2", Serverconnection, {
        
		constructor: function(name,map){
                this.name=name;
				this.activeuser=null;
				this.callback=null;
				this.map = map;
				this.docentermap = true; //call centerMap function in displayPoi when true  (used for group loading)
				this.isgrouploading = false; //to avoid recursiv item loading with several calls
				this.markermanager = null;
        },	
		
		/*******************************************************
		 * 
		 * callback functions
		 * 
		 *******************************************************/
		
		/**
		 * callback after updateFileList
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_updateFileList: function(response, ioArgs){ //TODO kann raus (_cb_standard)
			try {
				if ((response != "msg.failed") && (response != "")) {
					if (this.callback != null) {
						this.callback.func.apply(this.callback.target, [response, ioArgs]);
					}
				}
			} catch (e)
			{console.error(e)}
		},
		
		/**
		 * callback after checkUser
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_checkUser: function(response, ioArgs) {
			try {
				if (response == "msg.logout") {
					this.activeuser = null;
					return;
				}
				
				if (response == "msg.logoutok") {
					this.activeuser = null;
					//return;
				}
				
				if ((response != "msg.loginfailed") && (response != ""))
				{
					this.activeuser = response; 
				} 
				
				if (this.callback != null) {
					this.callback.func.apply(this.callback.target, [response, ioArgs]);
				}
				
			} catch (e)
			{console.error(e);}
		},
		
		/**
		 * callback after getPointFromMap
		 * @param {Object} e
		 */
		_cb_getPointFromMap: function(e) {
			console.debug(e);
			console.debug(this);
			if (this.callback != null) {
				this.callback.func.apply(this.callback.target, [e]);
			}	
		},
		
				
		/*******************************************************
		 * 
		 * public useable functions
		 * 
		 *******************************************************/
		
		/**
		 * sets the active user
		 * @param {Object} user
		 */
		setActiveUser: function(user) {
			this.activeuser = user;
		},
		
		/**
		 * returns the active user
		 */
		getActiveUser: function() {
			return this.activeuser;
		},
		
		/**
		 * check if the user is already logged in (user is stored in the php session)
		 * @param {Object} cb
		 */
		checkUser: function(cb)
		{
			var params = {
				"action":"msg.chklogin"
			}
			this.activeuser=null;
			this.callback = cb;
			this.loadFromServer("userfunctions.php",params,this._cb_checkUser);
		},
		
		/**
		 * logoutUser 
		 */
		logoutUser: function(cb)
		{
			var params = {
				"action":"msg.logout"
			}
			this.activeuser=null;		
			this.callback = cb;
			this.loadFromServer("userfunctions.php",params,this._cb_checkUser);
		},
		
		/**
		 * loginUser
		 * @param {Object} username
		 * @param {Object} password
		 * @param {Object} cb
		 */
		loginUser: function(username, password, cb) {
			params = {
				"action": "msg.login",
				"username":username,
				"password":password
			}
			this.callback = cb;
			this.loadFromServer("userfunctions.php",params,this._cb_checkUser);	
		},
		
		/**
		 * updates the filelist database table
		 * @param {Object} cb
		 */
		updateFileList: function(cb) {
			var params = {
				"action": "msg.updatefilelist"
			}
			this.callback = cb;
			this.loadFromServer("filefunctions.php",params,this._cb_standard);
		},
		
		/**
		 * 
		 * @param {Object} file
		 * @param {Object} cb
		 */
		deleteFile: function(file, cb) {
			var params = {
				"action": "msg.updatefilelist"
			}
			//TODO
			//this.callback = cb;
			//this.loadFromServer("filefunctions.php",params,this._cb_updateFileList);
		},
		
		/**
		 * removes all loaded items from the map
		 */
		clearMap: function() {
			
			//var mm = new MarkerManager();
			
			for (var x = (this.map.layers.length - 1); x > -1; x--) {
				var lyr = this.map.layers[x];
				
				/*
				if (this.markermanager) {
					if (lyr.name == "Markers") {
						this.markermanager.removeMarkers(lyr);
					}
				}
				
				
				if (lyr.name == "Markers") {
					mm.removeMarkers(lyr);
				}
				*/
				/*
				if (this.picturecomparator) {
					this.picturecomparator.resetPictures();
				}
				*/
				
				if ((lyr.name != "Mapnik") && (lyr.name != "CycleMap") && (lyr.name != "Osmarender")) {
					this.map.removeLayer(lyr);
				}
			}
					
			gl_markers = new OpenLayers.Layer.Markers( "Markers",{projection: new OpenLayers.Projection("EPSG:4326")});
	    	this.map.addLayer(gl_markers);
			
		},
		
		/**
		 * 
		 * @param {Object} child
		 */
		getIconname1: function(child) {
			if (this.activeuser) {
				if (this.activeuser.tags != null) {
					for (var i = 0; i < this.activeuser.tags.length; i++) {
						var tag1 = this.activeuser.tags[i];
						if (tag1.tagname == child.tagname) {
							return tag1.icon1;
						}
					}	
				}
			}
			return "";
		},
		
		/**
		 * removes all layers with given layername from the map
		 * @param {Object} layername
		 */
		removeLayers: function(layername) {
			var lst1 = this.map.getLayersByName(layername);
			if (lst1 != null) {
				for (var x = 0; x < lst1.length; x++) {
					lgpx = lst1[x];
					map.removeLayer(lgpx);
				}
			}
		},
		
		/**
		 * sets the map to given lat,lon and zoomlevel
		 * @param {Object} lat
		 * @param {Object} lon
		 * @param {Object} zoomlevel
		 */
		centerMap: function(lat, lon, zoomlevel) {		
			if (zoomlevel == null) 
				zoomlevel = 14;
				
			var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());	
			this.map.setCenter(lonLat, zoomlevel);
		},
		
		/**
		 * shows the homebase of the current user on the map
		 */
		centerHomebase: function() {
			var usr = this.getActiveUser();
			if (usr != null)
			{				
				if ((usr.lat != null) && (usr.lon != "")) {
					//this.createPoi(usr.location_lat, usr.location_lon, usr.abouthtml,gl_markers,"");
					//this.centerMap(usr.lat, usr.lon, usr.zoomlevel);
					this.displayPoi(usr);
				}
				else {
					var lat = 50.9350850727913;
					var lon = 6.95356597872225;
					this.centerMap(lat, lon, 6);
				}
			}
		},
		
		/**
		 * 
		 * @param {Object} layername
		 */
		layerExists: function(layername) {
			var lst1 = this.map.getLayersByName(layername);
			if (lst1 != null) {
				for (var x = 0; x < lst1.length; x++) {
					var lyr1 = lst1[x];
					if (lyr1.name == layername) {
						return true;
					}
				}
			}
			return false;
		},
		
		/**
		 * _getLayer
		 * @param {Object} layername
		 */
		getLayer: function(layername) {
			var lst1 = this.map.getLayersByName(layername);
			if (lst1 != null) {
				for (var x = 0; x < lst1.length; x++) {
					var lyr1 = lst1[x];
					if (lyr1.name == layername) {
						return lyr1;
					}
				}
			}
			return null;
		},
		
		/**
		 * getPointFromMap
		 * @param {Object} cb
		 */
		getPointFromMap: function(cb){
			this.callback = cb;
			
			var ctrl2 = this.map.getControlsByClass("OpenLayers.Control.Click");
			if (ctrl2.length < 1) {
				try {
					gl_dblclick = new OpenLayers.Control.Click({
	                        handlerOptions: {
	                            "single": false,
	                            "double": true,
								"clickhandler": dojo.hitch(this,this._cb_getPointFromMap)
	                        }
	                    });
					
					console.debug("hhh");
					this.map.addControl(gl_dblclick);
					gl_dblclick.activate();
				} catch (e) {
					alert(e);
				}
			}
		},
		
		/**
		 * loads childitems from a group 
		 * @param {Object} group
		 * @param {Object} cb
		 */
		getGroupItems: function(group, cb){			
			var params = {
				"action": "msg.getgrpitems",
				"groupid": group.itemid,
				"groupname": group.itemname
			}
			this.callback = cb;
			this.loadFromServer("groupfunctions.php", params,this. _cb_standard);
		},
		
		/**
		 * 
		 * @param {Object} description
		 * @param {Object} filename
		 */
		displayGpxFile: function(description, filename){
			if (!this.layerExists(description)) {
				
				// Track-style
				var styleTrack = {
				  strokeColor: "#ff00ff",
				  strokeWidth: 3
				};
				var lgpx = new OpenLayers.Layer.GML(description, filename, {
														format: OpenLayers.Format.GPX,
														projection: this.map.displayProjection,
														style: styleTrack
													});
										
				this.map.addLayer(lgpx);
				//workaround for firefox
				lgpx.setZIndex(301);
				return lgpx;
			} else {
				var lyr1 = this.getLayer(description);
				  if (lyr1 != null) {
				  	//lyr1.testloadURL(filename);
				  }
			}
			return null;
		},
		
		/**
		 * displays a poi on the map
		 * @param {Object} poi
		 */
		displayPoi: function(poi) {
			if (this.markermanager) {
				var mm = this.markermanager;
				var lonLat = new OpenLayers.LonLat(poi.lon, poi.lat).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
				mm.addPoiMarker(lonLat, gl_markers, poi.description, this.getIconname1(poi));
				if (this.docentermap) 
					this.centerMap(poi.lat, poi.lon, poi.zoomlevel);
			}
		},
		
		/**
		 * displays a item on the map
		 * @param {Object} item
		 */
		displayItem: function(item) {
			switch (item.itemtype.toLowerCase()) {
				case "group":
					if (!this.isgrouploading) {
						this.displayGroupItems(item);
					}
					break;
				case "poi":
					this.displayPoi(item);
					break;
				case "file":
					this.displayGpxFile(item.itemname,item.fullfilename);
					break;
			}
		},
		
		/**
		 * 
		 * @param {Object} itemist
		 */
		displayItemList: function(itemlist) {
			var prnt = itemlist[0];
			for (var i=1;i<itemlist.length;i++){
				var itm1 = itemlist[i];
				this.displayItem(itm1);
			}
			
			if (prnt) {
				this.centerMap(prnt.lat, prnt.lon, prnt.zoomlevel);		
			}
			this.isgrouploading = false;
		},
		
		/**
		 * 
		 */
		displayGroupItems: function(group) {
			var cb = {
				target: this,
				func: this.displayItemList
			}
			this.isgrouploading = true;
			this.getGroupItems(group,cb);
		}
		
		
});