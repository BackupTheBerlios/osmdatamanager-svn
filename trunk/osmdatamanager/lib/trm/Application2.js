/**
 * base class for server connections 
 */
dojo.declare("Serverconnection", null, {
        constructor: function(){
                
        },
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
		_cb_updateFileList: function(response, ioArgs){
			try {
				if ((response != "msg.failed") && (response != "")) {
					if (callback != null) {
						callback.func.apply(callback.target, [response, ioArgs]);
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
			params = {
				"action":"msg.chklogin"
			}
			this.activeuser=null;
			this.callback = cb;
			this.loadFromServer("userfunctions.php",params,this._cb_checkUser);
		},
		
		/**
		 * updates the filelist database table
		 * @param {Object} cb
		 */
		updateFileList: function(cb) {
			params = {
				"action": "msg.updatefilelist"
			}
			callback = cb;
			loadFromServer("filefunctions.php",params,this._cb_updateFileList);
		},
		
		/**
		 * removes all loaded items from the map
		 */
		clearMap: function() {
			/*
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
			*/
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
				if ((usr.location_lat != null) && (usr.location_lat != "")) {
					//this.createPoi(usr.location_lat, usr.location_lon, usr.abouthtml,gl_markers,"");
					this.centerMap(usr.location_lat, usr.location_lon, 14);
				}
				else {
					var lat = 50.9350850727913;
					var lon = 6.95356597872225;
					this.centerMap(lat, lon, 6);
				}
			}
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
		}
		
		
});