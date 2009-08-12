/**
*
* DijitClient -> connection between dijit and the base application
*
*/
dojo.declare("DijitClient2", Application2, {
        
		constructor: function(name,map){
			/*
        	dojo.connect(dijit.byId("dlg_login"),"onLoggedIn",this,"_cb_LoggedIn");
			
			dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onGetPoint",this,"_onGetPointClick");
			dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onZoomlevelClick",this,"_onZoomlevelClick");
			dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"_cb_createPoi",this,"_updateitem");
			
			dojo.connect(dijit.byId("dlg_user"),"onGetPoint",this,"_onGetPointClick");
			dojo.connect(dijit.byId("dlg_user"),"onZoomlevelClick",this,"_onZoomlevelClick");
			*/
						
			this.senderdialog = null;        
			this.privatemode  = false;
			this._id_offset = 1;
        },
		
		/**
		 * add a root group
		 * @param {Object} group
		 */
		_cb_addGroup: function(group) {
						
			var pInfo = {
				parent: gl_tree.model.root,
				attribute: "children"
			}
						
			group.parentid = -1;
			gl_tree.model.newItem(group,null);
		},
		
		/**
		 * add a subgroup
		 * @param {Object} group
		 */
		_cb_addSubGroup: function(group) {
			//gl_tree.model.store.dofetch = false;
			var itm1 = gl_tree.selectedTreeItem;
			if (itm1) {
				gl_tree.model.newItem(group, itm1);
			}
		},
		
		/**
		 * called when ok click on the groupdialog is fired
		 * @param {Object} data
		 */
		_dlgGrp_onOkClick: function(data) {									
			if (data.itemid != -1) {
				var cb = {
					target: gl_groupmanager.getGroupTree(),
					func: gl_groupmanager.getGroupTree().updateGroup
				}
				//function(groupid,groupname,protection,zommlevel,lat,lon,tagname,cb) {
				gl_groupmanager.updateGroup(data.itemid,data.itemname,data.protection,data.zoomlevel,data.lat,data.lon,data.tagname,cb);
			}
			else {
				if (data.parentid != -1) {
					var cb = {
						target: this,
						func: this._cb_addSubGroup
					}
					gl_groupmanager.createSubGroup(data.parentid, data.itemname, cb);
				}
				else {
					var cb = {
						target: this,
						func: this._cb_addGroup
					}
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
				this.senderdialog.onlyshow = true;
				this.senderdialog.show(true);
				this.senderdialog.onlyshow = false;
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
			//TODO checken ob benötigt
			console.debug("_updateitem");
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
				//gl_groupmanager.getRootGroups();
				this._initTree();
				this.centerHomebase();
				/*
				self.updateFileList(null);
								
				
				*/
				var dlg1 = dijit.byId('dlg_login');
				if (dlg1) {
					dlg1.hide();
				}
			} else {
				//self.disablePrivatemode();
				var lat = 50.9350850727913;
				var lon = 6.95356597872225;
				this.centerMap(lat, lon, 6);
				
			}		
		},
		
		/**
		 * callback after login or logout -> check if response is valid
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_loginUser: function(response, ioArgs) {
			//var nls = dojo.i18n.getLocalization("trm.login", "Form");
			console.debug(response);
			if (response == "msg.logoutok") {
				dijit.byId('btn_login').attr("label", "::Login::");
				
				try {
					gl_tree.model.store.close();
					gl_tree.model.fetch();
				} catch (e) {
					console.error(e);
				}
				//gl_tree.destroy();
				//gl_tree = null;
				
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
				//alert(nls["loginfailed"]);
				var lat = 50.9350850727913;
				var lon = 6.95356597872225;
				this.centerMap(lat, lon, 6);
			}
		},
		
		/**
		 * calback after a delete call
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_delete: function(response, ioArgs) {
			if (response == "msg.delok") {
				gl_groupmanager.getRootGroups();
			}
		},
		
		/**
		 * callback after a remove call
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
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
		
		dndAccept: function(source,nodes){			
			console.debug("dndAccept");
			if (source.node.id == "dnd_source")
				return true;
			
			return false;
		},
		
		/**
		 * 
		 * @param {Object} node
		 * @param {Object} source
		 * @param {Object} position
		 */
		treeCheckItemAcceptance: function(node,source,position) {
			console.debug("treeCheckItemAcceptance");
			var item = dijit.getEnclosingWidget(node).item;
			if (item.i) {
				gl_tree.model.store.dndTargetItem = item.i
			}
									
			if (source.node.id == "dnd_source") {
				return true;
			}
			
			if (source.node.id == "source2") {
				return true;
			}
			
			
			return false;
		},
		
		/**
		 * 
		 * @param {Object} item
		 */
		treeGetLabel: function(item){
			console.debug("treeGetLabel");
			console.debug(item);
			if (item.i) {
				return item.i.itemname;
			}
			
			if (item.id) {
				return item.id;
			}
			return "nix";
		},
		
		/**
		 * 
		 * @param {Object} item
		 * @param {Object} pInfo
		 */
		_storeOnNew: function(item, pInfo) {			
			console.debug("_storeOnNew");
			console.debug(item);
			console.debug(pInfo);
			if (String(item.itemtype) != "Group") {				
				var gm = new Groupmanager();
				gm.addGroupItem(String(pInfo.item.itemid),String(item.itemid),String(item.itemtype));
			}			
		},
			
		/**
		 * called before a new item will be created => copy data from the dnd item
		 * @param {Object} keywordArgs
		 * @param {Object} parentInfo
		 */
		
		_storeBeforeNewItem: function(keywordArgs, parentInfo) {
			console.debug("_storeBeforeNewItem");
			if (String(keywordArgs.itemtype) != "Group") {
				var dlg1 = dijit.byId('dlg_itemmanager');
				if (dlg1) {
				
					if (dlg1.currentItem) {
						var id1 = keywordArgs.id;
						var name1 = keywordArgs.name;
						for (var key in dlg1.currentItem) {
							var val = String(dlg1.currentItem[key]);
							var key1 = String(key);
							if (key1.indexOf("_") == -1) {
								if ((val != "undefined") && (val != null)) 
									keywordArgs[key] = val;
							}
						}
						keywordArgs.id = id1 + "_" + this._id_offset;
						keywordArgs.name = name1;
						this._id_offset++;
					}
				}
			}
		},
				
		/**
		 * 
		 */
		_initTree: function() {
			if (gl_tree != null)
				return;
			
			console.debug("init tree...");
			dojo.require("trm.widget.CustomForestStoreModel");
			dojo.require("trm.widget.DataTree");			
			dojo.require("dojo.data.ItemFileWriteStore");
			dojo.require("dijit.Tree");
			
			var store = new dojo.data.ItemFileWriteStore  ({
			   //var store = new trm.widget.CustomQueryStore ({
				url: "groupfunctions.php?action=msg.gettree&parentgroupid=-1",
				clearOnClose: true
		    });				
			dojo.connect(store,"onNew",this,"_storeOnNew");
						
			var treeModel = new trm.widget.CustomForestStoreModel({
		        store: store,
				query: {"parentid":  -1},
				rootId: "root"
		    });
			dojo.connect(treeModel,"beforeNewItem",this,"_storeBeforeNewItem");		
			
			gl_tree = new trm.widget.DataTree({
		        model: treeModel,
				showRoot: false,
				betweenThreshold: 5,
				dndController: dijit._tree.dndSource,
				checkAcceptance: this.dndAccept,
				checkItemAcceptance: this.treeCheckItemAcceptance
		    }, "treeThree");
		},
		
		/**
		 * check the kind of item clicked in the tree and enable or disable menuitems
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
				if (! itm1.itemtype) {
					console.error("itemtype not defined");
					console.error(itm1);
					return;
				}
				
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
			//return gl_groupmanager.getGroupTree().getSelectedItem();	
			if (gl_tree) {
				console.debug(gl_tree.selectedItem);
				return gl_tree.selectedItem;	
			}
			return null;
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
		
		showLoading: function() {
			var dlg1 = document.getElementById('dlg_loading');
			if (dlg1) {
				dlg1.setAttribute("class","loading_visible");
			}
		},
		
		hideLoading: function() {
			var dlg1 = document.getElementById('dlg_loading');
			if (dlg1) {
				dlg1.setAttribute("class","loading_hidden");
			}
		},
		
		/**
		 * shows the login dialog
		 */
		showLogin: function() {
			
			//dojo.connect(dijit.byId("dlg_login"),"onLoggedIn",this,"_cb_LoggedIn");
			this.showLoading();
			
			var dlg1 = dijit.byId('dlg_login');
			if (! dlg1) {
				dojo.require("trm.login.Form");
				dlg1 = new trm.login.Form({}, "dlg_login");
				dojo.connect(dijit.byId("dlg_login"),"onLoggedIn",this,"_cb_LoggedIn");		
			}
			
			this.hideLoading();
						
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
			
			
			//dojoType="trm.widget.ItemManager"
			this.showLoading();
			
			var dlg1 = dijit.byId('dlg_itemmanager');
			if (! dlg1) {
				dojo.require("trm.widget.ItemManager");
				dlg1 = new trm.widget.ItemManager({}, "dlg_itemmanager");	
				dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onGetPoint",this,"_onGetPointClick");
				dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onZoomlevelClick",this,"_onZoomlevelClick");
				dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"_cb_createPoi",this,"_updateitem");
			}
			
			this.hideLoading();
			
			if (dlg1)  {
				dlg1.clientapp = this;
				dlg1.show();
			}
		},
		
		/**
		 * shows the group dialog
		 */
		showGroupDialog: function(isroot,isupdate) {
			this.showLoading();
			
			var dlg1 = dijit.byId('dlg_group');			
			if (! dlg1) {
				dojo.require("trm.widget.GroupDialog");
				dlg1 = new trm.widget.GroupDialog({}, "dlg_group");	
				dojo.connect(dlg1,"onOkClick",this,"_dlgGrp_onOkClick");
				dojo.connect(dlg1,"onGetPoint",this,"_onGetPointClick");
				dojo.connect(dlg1,"onZoomlevelClick",this,"_onZoomlevelClick");
			}
			
			this.hideLoading();
			if (dlg1)  {
				if (isroot) {
					dlg1.show(isupdate,isroot);
				} else {
					var itm1 = this.getSelectedItem();
					if (itm1) {
					  if (isupdate) {
					  	dlg1.setDataItem(itm1);
					  }
					  else {
					  	dlg1.setParentItem(itm1);
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
			this.showLoading();
			
			var dlg1 = dijit.byId('dlg_itemmanager');
			if (dlg1)  {
				this.hideLoading();
				
				dlg1.poidialog.prevWidget = null;
				dlg1.poidialog.setDataItem(item);
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
				dlg1.setDataItem(this.activeuser);
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