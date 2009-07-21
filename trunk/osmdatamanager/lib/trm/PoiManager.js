dojo.declare("PoiManager", Serverconnection, {
        
		/**
		 * PoiManager constructor
		 */
		constructor: function(){
        	
		},
		
		/**
		 * creates new poi
		 * @param {Object} poiname
		 * @param {Object} description
		 * @param {Object} latlon
		 * @param {Object} georssurl
		 * @param {Object} cb
		 */
		createPoi: function(poiname, description, lat,lon,tagname,zoomlevel,cb) {
							
			var params = {
				"action":"msg.createpoi",
				"poiname":poiname,
				"description":description,
				"lat":lat,
				"lon":lon,
				"tagname":tagname,
				"zoomlevel":zoomlevel
				//"georssurl":georssurl
			}
			this.callback = cb;
			this.loadFromServer("poifunctions.php",params,this._cb_standard);
		},
		
		/**
		 * updates an existing poi
		 * @param {Object} poiid
		 * @param {Object} poiname
		 * @param {Object} description
		 * @param {Object} latlon
		 * @param {Object} georssurl
		 * @param {Object} cb
		 */
		updatePoi: function(poiid,poiname, description,lat,lon,tagname,zoomlevel,cb) {
							
			 var params = {
				"action":"msg.updatepoi",
				"poiid": poiid,
				"poiname":poiname,
				"description":description,
				"lat":lat,
				"lon":lon,
				"tagname":tagname,
				"zoomlevel":zoomlevel
			}
			this.callback = cb;
			this.loadFromServer("poifunctions.php",params,this._cb_standard);
		},
		
		/**
		 * 
		 * @param {Object} cb
		 */
		getPois: function(cb) {
			this.callback = cb;
			var params = {
				"action": "msg.getpois"
			}
			this.loadFromServer("poifunctions.php",params,this._cb_standard);
		},
		
		/**
		 * loads poi from database
		 * @param {Object} poiid
		 * @param {Object} cb
		 */
		getPoi: function(poiid, cb) {
			this.callback = cb;
			var params = {
				"action": "msg.getpoi",
				"poiid":  poiid
			}
			this.loadFromServer("poifunctions.php",params,this._cb_standard);
		},
		
		/**
		 * loads poi from database
		 * @param {Object} poiid
		 * @param {Object} cb
		 */
		deletePoi: function(poiid, cb) {
			this.callback = cb;
			var params = {
				"action": "msg.deletepoi",
				"poiid":  poiid
			}
			this.loadFromServer("poifunctions.php",params,this._cb_standard);
		}
		
			
});
