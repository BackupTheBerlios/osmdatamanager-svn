dojo.declare("Groupmanager", Serverconnection, {
        
		/**
		 * groupmanager constructor
		 * @param {Object} app
		 */
		constructor: function(app){
                this.application = app
				this.grouptree = new GroupTree(document.getElementById("treecontainer"),document.getElementById("treedata"));
				this.dropitem = null;
        },
		/*********************************************************
		 * 
		 * callback function
		 * 
		 *********************************************************/
		
		/**
		 * callback after getRootGroups
		 */
		_cb_getRootGroups: function(response, ioArgs) {
			try {		
				//alert(response);
				if (response == null)
					return;
							
				if ((response != "msg.failed") && (response != ""))
				{
					this.grouptree.addRootGroups(response);
				}
				
			} catch (e)
			{console.error(e);}
		},
		
		/**
		 * callback after getGroupItems
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_getGroupItems: function(response, ioArgs) {
			try {
				if ((response != "msg.failed") && (response != "")) {
					if (this.callback != null) {
						this.callback(response);	
					}
				}		
			} catch (e) {
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
		},
		
		/**
		 * callback after createRootGroup and createSubGroup 
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_createGroup: function(response, ioArgs) {
			try {		
				if (response != "msg.failed")
				{
					//grouptree.addGroups(response);
					if (callback != null) {
						callback.func.apply(callback.target, [response, ioArgs]);
					}
					
				}
			} catch (e)
			{console.error(e);}
		},
		
		/*********************************************************
		 * 
		 * public useable functions
		 * 
		 *********************************************************/
		
		/**
		 * sets the dropitem
		 */
		setDropitem: function(item) {
			this.dropitem = item;
		},
		
		
		/**
		 * load all root groups
		 */
		getRootGroups: function() {
			params = {
				"action": "msg.getgrps",
				"parentgroupid":"-1"
			}
			this.dropitem = null;
			this.grouptree.reset();
			this.loadFromServer("groupfunctions.php",params,this._cb_getRootGroups);	
		},
		
		/**
		 * loads all child items from a group (subgroups, files, pois...)
		 * if dropitem is set, a new childitem will created
		 * @param {Object} groupid
		 * @param {Object} cb
		 */
		getGroupItems: function(groupid, cb){
			
			var grpitmid = null;
			var itemtype = null;
			console.debug(this.dropitem);
			if (this.dropitem) {
				grpitmid = this.dropitem.itemid;
				itemtype = this.dropitem.itemtype;	
			}
			
			params = {
				"action":"msg.getgrpitems",
				"groupid":groupid,
				"grpitmid":grpitmid,
				"itemtype":itemtype
			}
			this.callback = cb;
			this.loadFromServer("groupfunctions.php",params,this._cb_getGroupItems);
		},
		
		/**
		 * returns the grouptree object
		 */
		getGroupTree: function() {
			return this.grouptree;
		},
		
		/**
		 * creates a new rootgroup
		 * @param {Object} groupname
		 * @param {Object} cb
		 */
		createRootGroup: function(groupname,cb) {			
			params = {
				"action":"msg.crtgrp",
				"groupname":groupname,
				"parentgroupid":"-1"
			}
			this.grouptree.reset();
			this.callback = cb;
			this.loadFromServer("groupfunctions.php",params, this._cb_standard);		
		},
		
		/**
		 * creates a new subgroup
		 * @param {Object} groupname
		 * @param {Object} cb
		 */
		createSubGroup: function(parentgroupid, groupname,cb) {			
			
			params = {
				"action": "msg.crtgrp",
				"groupname": groupname,
				"parentgroupid": parentgroupid
			}
			this.callback = cb;
			this.loadFromServer("groupfunctions.php", params, this._cb_standard);
		},
		
		/**
		 * updates the group with given groupid
		 * @param {Object} groupid
		 * @param {Object} groupname
		 * @param {Object} protection
		 * @param {Object} zommlevel
		 * @param {Object} lat
		 * @param {Object} lon
		 * @param {Object} tagname
		 * @param {Object} cb
		 */
		updateGroup: function(groupid,groupname,protection,zommlevel,lat,lon,tagname,cb) {
			
			params = {
				"action": "msg.updategrp",
				"groupid":groupid,
				"groupname": groupname,
				"parentgroupid": "-1",
				"protection":protection,
				"zoomlevel":zommlevel,
				"lat":lat,
				"lon":lon,
				"tagname":tagname
			}
			this.callback = cb;
			this.loadFromServer("groupfunctions.php", params, this._cb_standard);
		}
		
});