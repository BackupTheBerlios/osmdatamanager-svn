dojo.declare("DijitClient2", Application2, {
        
		/**
         * DijitClient -> connection between dijit and the base application
         */
		constructor: function(name,map){
                // remember, Person constructor is called automatically
        	dojo.connect(dijit.byId("dlg_login"),"onLoggedIn",this,"_cb_LoggedIn");
			dojo.connect(dijit.byId("dlg_group"),"onOkClick",this,"_dlgGrp_onOkClick");
			dojo.connect(dijit.byId("dlg_group"),"onGetPoint",this,"_onGetPointClick");
			dojo.connect(dijit.byId("dlg_group"),"onZoomlevelClick",this,"_onZoomlevelClick");
			
			dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onGetPoint",this,"_onGetPointClick");
			dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onZoomlevelClick",this,"_onZoomlevelClick");
			dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"_cb_createPoi",this,"_updateitem");
			
			dojo.connect(dijit.byId("dlg_user"),"onGetPoint",this,"_onGetPointClick");
			dojo.connect(dijit.byId("dlg_user"),"onZoomlevelClick",this,"_onZoomlevelClick");
			//onDblClick
			
			this.senderdialog = null;        
			this.privatemode  = false;
        },
		
		/**
		 * called when ok click on the groupdialog is fired
		 * @param {Object} data
		 */
		_dlgGrp_onOkClick: function(data) {
			console.debug(data);
									
			if (data.itemid != -1) {
				var cb = {
					target: gl_groupmanager.getGroupTree(),
					func: gl_groupmanager.getGroupTree().updateGroup
				}
				//function(groupid,groupname,protection,zommlevel,lat,lon,tagname,cb) {
				gl_groupmanager.updateGroup(data.itemid,data.itemname,data.protection,data.zoomlevel,data.lat,data.lon,data.tagname,cb);
			}
			else {
				var cb = {
					target: gl_groupmanager.getGroupTree(),
					func: gl_groupmanager.getGroupTree().addGroups
				}
			
				if (data.parentid != -1) {
					gl_groupmanager.createSubGroup(data.parentid, data.itemname, cb);
				}
				else {
					gl_groupmanager.createRootGroup(data.itemname, cb);
				}
			}
			this.hideGroupDialog();
		},
		
		/**
		 * callback after _onGetPointClick
		 * @param {Object} e
		 */
		_cb_onGetPointClick: function(e) {
			var lonlat = this.map.getLonLatFromViewPortPx(e.xy).transform(this.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
			console.debug(lonlat.lon);
			if (this.senderdialog) {
				this.senderdialog.setPoint(lonlat);
				this.senderdialog.show(true);
			}
		},
		
		/**
		 * function to get a point from a map
		 * @param {Object} sender
		 */
		_onGetPointClick: function(sender) {
			this.senderdialog = sender;
			var cb = {
				func: this._cb_onGetPointClick,
				target: this
			}
			this.getPoint(cb,sender,"Punkt","machen Sie einen Doppelklick einen Punkt");				
		},
		
		/**
		 * gets the zoomlevel from the map and returns it to the sender
		 * @param {Object} sender
		 */
		_onZoomlevelClick: function(sender) {
			var zoom = this.map.getZoom();
			if (zoom) {
				sender.setZoomlevel(zoom);
			}
		},
		
		/**
		 * updates a item in the grouptree
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_updateitem: function(response, ioArgs) {
			if (response != "msg.failed") {
				var itm1 = response;
				gl_groupmanager.getGroupTree().updateItem(itm1);
			}
		},
		
		/**
		 * callback afer successful login
		 * @param {Object} user
		 */
		_cb_LoggedIn: function(user){
			this.setActiveUser(user);
			this.disablePrivatemode();
			this.updateFileList();
			
			var usr = this.getActiveUser();
			if (usr != null) {
				dijit.byId('btn_login').attr("label", "Logout [" + usr.itemname + "]");
				this.enablePrivatemode();
				gl_groupmanager.getRootGroups();
				this.centerHomebase();
				/*
				self.updateFileList(null);
								
				
				*/
				dijit.byId('dlg_login').hide();
			} else {
				//self.disablePrivatemode();
				var lat = 50.9350850727913;
				var lon = 6.95356597872225;
				this.centerMap(lat, lon, 6);
			}		
		},
		
		/**
		 * callback after login -> check if response is valid
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_loginUser: function(response, ioArgs) {
			var nls = dojo.i18n.getLocalization("trm.login", "Form");
			console.debug(response);
			if (response == "msg.logoutok") {
				dijit.byId('btn_login').attr("label", "::Login::");
				gl_groupmanager.getGroupTree().reset();
				this.clearMap();
				this.disablePrivatemode();
				var lat = 50.9350850727913;
				var lon = 6.95356597872225;
				this.centerMap(lat, lon, 6);
				return;
			}
			
			if (response != "msg.loginfailed") {
				this._cb_LoggedIn(response);
			} else {
				alert(nls["loginfailed"]);
			}
		},
		
		_cb_delete: function(response, ioArgs) {
			if (response == "msg.delok") {
				gl_groupmanager.getRootGroups();
			}
		},
		
		_cb_remove: function(response, ioArgs) {
			if (response == "msg.remok") {
				gl_groupmanager.getRootGroups();
			}
		},
		
		/**
		 * deletes a group
		 * @param {Object} item
		 */
		_deleteGroup: function(item) {
			var cb = {
				target: this,
				func: this._cb_delete
			}
			
			if (confirm("delete group " + item.itemname + " ?"))  //TODO mehrsprachig
				gl_groupmanager.deleteGroup(item.itemid,cb);
		},
						
		/**
		 * removes a poi from a group
		 * @param {Object} item
		 */
		_removeItem: function(item) {
			var grpid = gl_groupmanager.getGroupTree().getSelectedParentGroupId();
			if (grpid) {
				var cb = {
					target: this,
					func: this._cb_remove
				}
				
				if (confirm(item.itemname + " aus Gruppe entfernen ?"))  //TODO mehrsprachig
					gl_groupmanager.removeGroupItem(grpid,item.itemid,cb);	
			}
		},
		
		/**
		 * check the kind of item clicked in the tree and enable or disable items
		 * @param {Object} sender
		 */
		groupTreeOpenmenu: function(sender) {
			this.disabledAllMenuItems();
			
			if (! this.privatemode)
				return;
			
			dijit.byId('itm_submenu_groups').attr("disabled",false);
			dijit.byId('itm_createmaingroup').attr("disabled",false);
			dijit.byId('itm_submenu_settings').attr("disabled",false);
			
			var itm1 = this.getSelectedItem();
			if (itm1) {
				switch(itm1.itemtype.toLowerCase()) {
					case "poi":
						dijit.byId('itm_loaddata').attr("disabled",false);
						dijit.byId('itm_edit').attr("disabled",false);
						dijit.byId('itm_remove').attr("disabled",false);
						dijit.byId('itm_manager').attr("disabled",false);
						dijit.byId('itm_updatetree').attr("disabled",false);
						dijit.byId('itm_removeall').attr("disabled",false);
						break;
					case "group":
						dijit.byId('itm_loaddata').attr("disabled",false);
						dijit.byId('itm_edit').attr("disabled",false);
						//dijit.byId('itm_remove').attr("disabled",false);
						dijit.byId('itm_manager').attr("disabled",false);
						dijit.byId('itm_submenu_groups').attr("disabled",false);
						dijit.byId('itm_createmaingroup').attr("disabled",false);
						dijit.byId('itm_createsubgroup').attr("disabled",false);
						dijit.byId('itm_deletegroup').attr("disabled",false);
						dijit.byId('itm_removeall').attr("disabled",false);
						dijit.byId('itm_updatetree').attr("disabled",false);
						break;
					case "file":
						dijit.byId('itm_loaddata').attr("disabled",false);
						//dijit.byId('itm_edit').attr("disabled",false);
						dijit.byId('itm_remove').attr("disabled",false);
						dijit.byId('itm_manager').attr("disabled",false);
						dijit.byId('itm_updatetree').attr("disabled",false);
						dijit.byId('itm_removeall').attr("disabled",false);
						break;
				}
			}
		},
		
		/**
		 * enables private mode
		 */
		enablePrivatemode: function() {
			this.privatemode = true;	
		},
		
		/**
		 * disables private mode
		 */
		disablePrivatemode: function() {
			this.privatemode = false;
			this.disabledAllMenuItems();
		},
		
		/**
		 * disables all items in the popup menu
		 */
		disabledAllMenuItems: function() {
			dijit.byId('itm_loaddata').attr("disabled","disabled");
			dijit.byId('itm_edit').attr("disabled","disabled");
			dijit.byId('itm_remove').attr("disabled","disabled");
			
			dijit.byId('itm_manager').attr("disabled","disabled");
			dijit.byId('itm_submenu_groups').attr("disabled","disabled");
			
			dijit.byId('itm_createmaingroup').attr("disabled","disabled");
			dijit.byId('itm_createsubgroup').attr("disabled","disabled");
			dijit.byId('itm_deletegroup').attr("disabled","disabled");
			dijit.byId('itm_delete').attr("disabled","disabled");
			
			dijit.byId('itm_removeall').attr("disabled","disabled");
			dijit.byId('itm_updatetree').attr("disabled","disabled");
			dijit.byId('itm_submenu_settings').attr("disabled","disabled");
		},
		
		/**
		 * select a point from the map
		 * @param {Object} callback
		 * @param {Object} senderdialogid
		 * @param {Object} title
		 * @param {Object} message
		 */
		getPoint: function(callback, sender, title, message) {
			if (sender != null)
				sender.hide();
			
			if ((title != null) && (title != "")) {
				this.showMessageDialog(title, message);
			}
			this.getPointFromMap(callback);
		},
		
		/**
		 * returns the selected item from the grouptree
		 */
		getSelectedItem: function() {
			return gl_groupmanager.getGroupTree().getSelectedItem();	
		},
		
		/**
		 * shows a custom edit dialog for the selected item
		 */
		showEdit: function() {
			var itm1 = this.getSelectedItem();
			if (itm1) {
				switch(itm1.itemtype.toLowerCase()) {
					case "group":
						this.showGroupDialog(false,true);
						break;
					case "poi":
						this.showPoiDialog(itm1);
						break;
				}
			}
		},

		/**
		 * deletes the selected item (and all children) from db
		 */
		doDelete: function() {
			var itm1 = this.getSelectedItem();
			if (itm1) {
				switch(itm1.itemtype.toLowerCase()) {
					case "group":
						this._deleteGroup(itm1);
						break;
				}
			}
		},
		
		/**
		 * removes a groupitem from a group
		 */
		doRemove: function() {
			var itm1 = this.getSelectedItem();
			if (itm1) {
				switch(itm1.itemtype.toLowerCase()) {
					case "poi":
						this._removeItem(itm1);
						break;
					case "file":
						this._removeItem(itm1);
						break;
				}
			}
		},
		
		/**
		 * deletes a poi
		 * @param {Object} item
		 * @param {Object} callback
		 */
		deletePoi: function(item, callback) {
			if (confirm(item.itemname + " aus löschen ?")) { //TODO mehrsprachig
				var pm = new PoiManager();										
				pm.deletePoi(item.itemid, callback);
			}
		},
		
		/**
		 * displays the selected item on the map
		 */
		displaySelected: function() {
			var itm1 = this.getSelectedItem();
			if (itm1) {
				this.displayItem(itm1);
			}
		},
		
		/**
		 * shows the login dialog
		 */
		showLogin: function() {
			var dlg1 = dijit.byId('dlg_login');
			if (dlg1)  {
				if (this.activeuser) {
					var val1 = dijit.byId('btn_login').attr("label");
					
					if (val1 == "Logout [" + this.activeuser.itemname + "]") {
						var cb = {
							target: this,
							func: this._cb_loginUser
						}
						this.logoutUser(cb);
						return;
					}
				}
				dlg1.show();
			}
		},
		
		/**
		 * shows the item manager
		 */
		showItemManager: function() {
			var dlg1 = dijit.byId('dlg_itemmanager');
			if (dlg1)  {
				dlg1.clientapp = this;
				dlg1.show();
			}
		},
		
		/**
		 * shows the group dialog
		 */
		showGroupDialog: function(isroot,isupdate) {
			var dlg1 = dijit.byId('dlg_group');
			if (dlg1)  {
				if (isroot) {
					dlg1.show(isupdate,isroot);
				} else {
					var itm1 = this.getSelectedItem();
					if (itm1) {
					  if (isupdate) {
					  	dlg1.setGroup(itm1);
					  }
					  else {
					  	dlg1.setParentGroup(itm1);
					  }
					  
					  dlg1.show(isupdate,isroot);
					}
				}
			}
		},
		
		/**
		 * hides the group dialog
		 */
		hideGroupDialog: function() {
			var dlg1 = dijit.byId('dlg_group');
			if (dlg1)  {
				dlg1.hide();
			}
		},
		
		/**
		 * shows the poi dialog
		 */
		showPoiDialog: function(item) {
			var dlg1 = dijit.byId('dlg_itemmanager');
			if (dlg1)  {
				dlg1.poidialog.prevWidget = null;
				dlg1.poidialog.setPoi(item);
				dlg1.poidialog.show(true);
			}
		},
		
		/**
		 * hides the poi dialog
		 */
		hidePoiDialog: function() {
			var dlg1 = dijit.byId('dlg_poi');
			if (dlg1)  {
				dlg1.hide();
			}
		},
		
		/**
		 * shows the user dialog
		 */
		showUserDialog: function(item) {
			var dlg1 = dijit.byId('dlg_user');
			if (dlg1)  {
				dlg1.application = this;
				dlg1.setUser(this.activeuser);
				dlg1.show();
			}
		},
		
		/**
		 * hides the user dialog
		 */
		hideUserDialog: function() {
			var dlg1 = dijit.byId('dlg_user');
			if (dlg1)  {
				dlg1.hide();
			}
		},
		
		/**
		 * shows a message dialog
		 * @param {Object} title
		 * @param {Object} message
		 */
		showMessageDialog: function(title, message) {
			dijit.byId('dialog_info').setAttribute("title",title);
			//dijit.byId('dialog_info').setContent(text);
			document.getElementById('dlginfo_text').innerHTML = message;
			dijit.byId('dialog_info').show();
		},
		
		/**
		 * hides the message dialog
		 */
		hideMessageDialog: function() {
			dijit.byId('dialog_info').hide();
		}
		
		
});