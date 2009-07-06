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
		}
		
});