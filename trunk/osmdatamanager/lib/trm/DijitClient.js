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

dojo.provide("trm.DijitClient");
dojo.require("trm.Application");

dojo.declare("trm.DijitClient", trm.Application, {
        
		/**
		 * DijitClient -> connection between dijit and the base application
		 * @param {Object} name
		 * @param {Object} map
		 */
		constructor: function(name,map){
			this.nls = dojo.i18n.getLocalization("trm.translation", "tt");			
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
			if (data.itemid != -1) { //update group
				var cb = {
					target: this,
					func: this._updateitem
				}
				gl_groupmanager.updateGroup(data.itemid,data.itemname,data.protection,data.zoomlevel,data.lat,data.lon,data.tagname,cb);
				
			}
			else {
				if (data.parentid != -1) { //create subgroup
					var cb = {
						target: this,
						func: this._cb_addSubGroup
					}
					gl_groupmanager.createSubGroup(data.parentid, data.itemname, cb);
				}
				else { //create root group
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
			try {
				var lonlat = this.map.getLonLatFromViewPortPx(e.xy).transform(this.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
				if (this.senderdialog) {
					this.senderdialog.setPoint(lonlat);
					this.senderdialog.onlyshow = true;
					this.senderdialog.show(true);
					this.senderdialog.onlyshow = false;
				}
				this.map.removeControl(gl_dblclick);
				gl_dblclick.destroy();
			} catch(e) {
				console.error(e);
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
			this.getPoint(cb,sender,this.nls["info"],this.nls["dbl_clk_point"]);				
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
		 * updates an item in the tree
		 * @param {Object} item
		 */
		_updateitem: function(item) {
			try {
				gl_tree.updateItem(item);
				
				if (gl_markermanager.markerExistsById(item.itemid))
					this.displayItem(item);
				
			} catch (e) {
				console.error(e);
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
				this._initTree();
				this.centerHomebase();
				
				var dlg1 = dijit.byId('dlg_login');
				if (dlg1) {
					dlg1.hide();
				}
			} else {
				var lat = 50.9350850727913;
				var lon = 6.95356597872225;
				this.centerMap(lat, lon, 6);
				
				for (var i=(this.opendialogs.length-1);i>-1;i--) {
					var dlg1 = null;
					dlg1 = this.opendialogs.pop();
					if (dlg1) {
						dlg1.hide();
					}
				}
				
				gl_tree.clearNodes();
				this.disablePrivatemode();
			}		
		},
		
		/**
		 * callback after login or logout -> check if response is valid
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_loginUser: function(response, ioArgs) {
			if (response == "msg.logoutok") {
				dijit.byId('btn_login').attr("label", "::Login::");
				try {
					gl_tree.clearNodes();
					
				} catch (e) {
					console.error(e);
				}
				
				this.clearMap();
				this.disablePrivatemode();
				for (var i=(this.opendialogs.length-1);i>-1;i--) {
					var dlg1 = null;
					dlg1 = this.opendialogs.pop();
					if (dlg1) {
						dlg1.hide();
					}
				}
				var lat = 50.9350850727913;
				var lon = 6.95356597872225;
				this.centerMap(lat, lon, 6);
				return;
			}
			
			if (response != "msg.loginfailed") {
				this._cb_LoggedIn(response);
			} else {
				for (var i=(this.opendialogs.length-1);i>-1;i--) {
					var dlg1 = null;
					dlg1 = this.opendialogs.pop();
					if (dlg1) {
						dlg1.hide();
					}
				}
				var lat = 50.9350850727913;
				var lon = 6.95356597872225;
				this.centerMap(lat, lon, 6);
				this.disablePrivatemode();
			}
		},
		
		/**
		 * callback after userdata is updated
		 * @param {Object} user
		 */
		_cb_updateUser: function(user) {
			dijit.byId('btn_login').attr("label", "Logout [" + user.itemname + "]");	
		},
		
		/**
		 * calback after a delete call
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_delete: function(response, ioArgs) {
			try {
				if (response == "msg.delok") {
					//gl_groupmanager.getRootGroups();
					gl_tree.deleteSelectedItem();
				}
			} catch(e) {
				console.error(e);
			}
		},
		
		/**
		 * callback after a remove call
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_remove: function(response, ioArgs) {
			if (response == "msg.remok") {
				if (gl_tree.selectedTreeItem) {
					gl_tree.model.store.deleteItem(gl_tree.selectedTreeItem);
					gl_tree.selectedTreeItem = null;
				}	
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
			
			if (confirm(this.nls["delete"] + " " + item.itemname + " ?"))  //TODO mehrsprachig
				gl_groupmanager.deleteGroup(item.itemid,cb);
		},
						
		/**
		 * removes a poi from a group
		 * @param {Object} item
		 */
		_removeItem: function(item) {
			var grpid = gl_tree.getSelectedParentGroupId();
			if (grpid) {
				var cb = {
					target: this,
					func: this._cb_remove
				}
				
				if (confirm(this.nls["remove"] + " " + item.itemname + " ?"))  //TODO mehrsprachig
					gl_groupmanager.removeGroupItem(grpid,item.itemid,cb);	
			}
		},
		
		dndAccept: function(source,nodes){			
			if (source.node.id == "dnd_source")
				return true;
			
			return false;
		},
		
		_treeOnDblClick: function(item) {
			this.displaySelected();
		},
		
		/**
		 * starts the download of a file object
		 * @param {Object} file
		 */
		_startDownload: function(file) {
			console.debug(file);
			//window.location.href = "http://domain.blabla/download.zip";
			//window.open(file.fullfilename);
			var wnd1 = window.open("download.php?filename="+file.fullfilename);
		},
		
		/**
		 * check if node has already the current dnd_source as child
		 * @param {Object} node
		 * @param {Object} source
		 * @param {Object} position
		 */
		treeCheckItemAcceptance: function(node,source,position) {
			try {
				var dlg1 = dijit.byId('dlg_itemmanager');
				if (dlg1) {
					var item = dijit.getEnclosingWidget(node).item; //drag over item
					if (item) {
						if (String(item.itemtype).toLowerCase() != "group")
							return;
						
						if (String(item.isvirtual).toLowerCase() == "true")
							return;
						
						if (item.children) {
							for (var i = 0; i < item.children.length; i++) {
								var chld1 = item.children[i];
								
								var id1 = String(chld1.itemid);
								var tp1 = String(chld1.itemtype);
								
								var id2 = String(dlg1.currentItem.itemid);
								var tp2 = String(dlg1.currentItem.itemtype);
								
								if ((id1 == id2) && (tp1 == tp2)) {
									return false;
								}
							}
						}
					}
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		
		/**
		 * 
		 * @param {Object} item
		 */
		treeGetLabel: function(item){
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
						name1 = String(dlg1.currentItem.itemname);
						keywordArgs.name = name1;
						this._id_offset++;
					}
				}
			}
		},
				
		/**
		 * init's the tree widget
		 */
		_initTree: function() {
			if (gl_tree != null) {
				gl_tree.refresh();
				gl_tree.removeFocus();
				return;
			}
			this.showLoading();
							
			dojo.require("trm.widget.CustomForestStoreModel");
			dojo.require("trm.widget.DataTree");			
			dojo.require("dojo.data.ItemFileWriteStore");
			dojo.require("dijit.Tree");
			
			var store = new dojo.data.ItemFileWriteStore  ({
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
		    }, "thetree");
			dojo.connect(gl_tree,"onDblClick",this,"_treeOnDblClick");
			gl_tree.removeFocus();
			this.hideLoading();
		},
		
		/**
		 * check the kind of item clicked in the tree and enable or disable menuitems
		 * @param {Object} sender
		 */
		groupTreeOpenmenu: function(sender) {
			this.disableAllMenuItems();
						
			if (! this.privatemode)
				return;
			
			dijit.byId('itm_submenu_groups').attr("disabled",false);
			dijit.byId('itm_createmaingroup').attr("disabled",false);
			dijit.byId('itm_submenu_settings').attr("disabled",false);
			dijit.byId('itm_submenu_export').attr("disabled",false);
			
			var itm1 = this.getSelectedItem();
			if (itm1) {
				if (! itm1.itemtype) {
					console.error("itemtype not defined");
					console.error(itm1);
					return;
				}
				
				var isvirtual = false;
				if (String(itm1.isvirtual) == "true")
					isvirtual = true;
				
				switch(itm1.itemtype.toLowerCase()) {
					case "poi":
						dijit.byId('itm_loaddata').attr("disabled",false);
						
						if (! isvirtual) {
							dijit.byId('itm_edit').attr("disabled", false);
							dijit.byId('itm_remove').attr("disabled", false);
						}
						
						dijit.byId('itm_manager').attr("disabled",false);
						//dijit.byId('itm_updatetree').attr("disabled",false);
						dijit.byId('itm_removeall').attr("disabled",false);
						dijit.byId('itm_admin').attr("disabled",false);						
						break;
					case "group":
						dijit.byId('itm_loaddata').attr("disabled",false);
						//dijit.byId('itm_remove').attr("disabled",false);
						dijit.byId('itm_manager').attr("disabled",false);
						dijit.byId('itm_submenu_groups').attr("disabled",false);
						dijit.byId('itm_createmaingroup').attr("disabled",false);
						dijit.byId('itm_removeall').attr("disabled",false);
						//dijit.byId('itm_updatetree').attr("disabled",false);
						if (! isvirtual) {
							dijit.byId('itm_edit').attr("disabled",false);
							dijit.byId('itm_deletegroup').attr("disabled",false);	
							dijit.byId('itm_createsubgroup').attr("disabled",false);	
						}
						dijit.byId('itm_admin').attr("disabled",false);
						break;
					case "file":
						dijit.byId('itm_loaddata').attr("disabled",false);
						dijit.byId('itm_manager').attr("disabled",false);
						//dijit.byId('itm_updatetree').attr("disabled",false);
						dijit.byId('itm_removeall').attr("disabled",false);
						dijit.byId('itm_admin').attr("disabled",false);
						dijit.byId('itm_download').attr("disabled",false);
						if (! isvirtual) {
							dijit.byId('itm_edit').attr("disabled",false);
							dijit.byId('itm_remove').attr("disabled",false);
						}
						break;
				}
			}
		},
		
		/**
		 * enables private mode
		 */
		enablePrivatemode: function() {
			this.privatemode = true;
			dijit.byId('btn_search').attr("disabled",false);
			dijit.byId('btn_homebase').attr("disabled",false);	
		},
		
		/**
		 * disables private mode
		 */
		disablePrivatemode: function() {
			this.privatemode = false;
			dijit.byId('btn_search').attr("disabled","disabled");
			dijit.byId('btn_homebase').attr("disabled","disabled");
			this.disableAllMenuItems();
		},
		
		/**
		 * disables all items in the popup menu
		 */
		disableAllMenuItems: function() {
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
			//dijit.byId('itm_updatetree').attr("disabled","disabled");
			dijit.byId('itm_submenu_settings').attr("disabled","disabled");
			dijit.byId('itm_submenu_export').attr("disabled","disabled");
			dijit.byId('itm_admin').attr("disabled","disabled");
			dijit.byId('itm_download').attr("disabled","disabled");
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
					case "file":
						this.showFileDialog(itm1);
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
			if (confirm(this.nls["delete"] + " " + item.itemname + " ?")) { 
				var pm = new PoiManager();										
				pm.deletePoi(item.itemid, callback);
				gl_tree.deleteItemById(item.itemid);
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
		 * starts a download
		 */
		startDownload: function() {
			var itm1 = this.getSelectedItem();
			if (itm1) {
				switch(itm1.itemtype.toLowerCase()) {
					case "file":
						this._startDownload(itm1);
						break;
				}
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
			try {
				this.showLoading();
				var dlg1 = dijit.byId('dlg_login');
				if (!dlg1) {
					dojo.require("trm.widget.LoginDialog");
					dlg1 = new trm.widget.LoginDialog({}, "dlg_login");
					dojo.connect(dijit.byId("dlg_login"), "onLoggedIn", this, "_cb_LoggedIn");
				}
				
				this.hideLoading();
				
				var dlg1 = dijit.byId('dlg_login');
				if (dlg1) {
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
			} catch(e) {
				alert(e);
			}
		},
		
		/**
		 * returns the itemmanager widget, if not exist it will be created
		 */
		getItemManager: function() {
			this.showLoading();
			
			var dlg1 = dijit.byId('dlg_itemmanager');
			if (! dlg1) {
				dojo.require("trm.widget.ItemManager");
				dlg1 = new trm.widget.ItemManager({}, "dlg_itemmanager");	
				dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onGetPoint",this,"_onGetPointClick");
				dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onZoomlevelClick",this,"_onZoomlevelClick");
				dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"_cb_createPoi",this,"_updateitem");
				dojo.connect(dijit.byId("dlg_itemmanager").poidialog,"onUpdatePoi",this,"_updateitem");
				
				dojo.connect(dijit.byId("dlg_itemmanager").filedialog,"onGetPoint",this,"_onGetPointClick");
				dojo.connect(dijit.byId("dlg_itemmanager").filedialog,"onZoomlevelClick",this,"_onZoomlevelClick");
				dojo.connect(dijit.byId("dlg_itemmanager").filedialog,"_cb_createPoi",this,"_updateitem");
				dojo.connect(dijit.byId("dlg_itemmanager").filedialog,"onUpdatePoi",this,"_updateitem");
				
				dlg1.application = this;
				dlg1.poidialog.application = this;
				dlg1.filedialog.application = this;
				dlg1.clientapp = this;
			}
			
			this.hideLoading();
			return dlg1;
		},
		
		/**
		 * shows the item manager
		 */
		showItemManager: function() {
			var dlg1 = this.getItemManager();
			if (dlg1)  {
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
				dlg1.application = this;
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
			var dlg1 = this.getItemManager();
			if (dlg1)  {
				dlg1.poidialog.setDataItem(item);
				dlg1.poidialog.show(true);
			}
		},
		
		/**
		 * hides the poi dialog
		 */
		hidePoiDialog: function() {
			var dlg1 = this.getItemManager();
			if (dlg1)  {
				dlg1.poidialog.hide();
			}
		},
		
		/**
		 * shows the search dialog
		 */
		showSearchDialog: function() {
			this.showLoading();
			
			var dlg1 = dijit.byId('dlg_search');			
			if (! dlg1) {
				dojo.require("trm.widget.OsmSearchDialog");
				dlg1 = new trm.widget.OsmSearchDialog({}, 'dlg_search');	
				dlg1.application = this;
			}
			
			this.hideLoading();
			if (dlg1) {
			  dlg1.show();
			}	
		},
		
		/**
		 * hides the search dialog
		 */
		hideSearchDialog: function() {
			var dlg1 = dijit.byId('dlg_search');
			if (dlg1) {
				dlg1.hide();
			}	
		},
		
		/**
		 * shows the user dialog
		 */
		showUserDialog: function(item) {
			this.showLoading();
			
			var dlg1 = dijit.byId('dlg_user');
			if (!dlg1) {
				dojo.require("trm.widget.UserDialog");
				dlg1 = new trm.widget.UserDialog({}, "dlg_user");
				dojo.connect(dlg1,"onGetPoint",this,"_onGetPointClick");
				dojo.connect(dlg1,"onZoomlevelClick",this,"_onZoomlevelClick");		
				dojo.connect(dlg1,"onUpdateUser",this,"_cb_updateUser");
				dlg1.application = this;
			}
			
			this.hideLoading();
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
		 * shows the file dialog
		 */
		showFileDialog: function(item) {
			var dlg1 = this.getItemManager();
			if (dlg1)  {
				dlg1.filedialog.setDataItem(item);
				dlg1.filedialog.show(true);
			}
		},
		
		/**
		 * hides the file dialog
		 */
		hideFileDialog: function() {
			var dlg1 = this.getItemManager();
			if (dlg1)  {
				dlg1.filedialog.hide();
			}
		},
		
		/**
		 * shows the admin dialog
		 * @param {Object} item
		 */
		showAdminDialog: function(item) {
			this.showLoading();
			
			var dlg1 = dijit.byId('dlg_admin');
			if (!dlg1) {
				dojo.require("trm.widget.AdminDialog");
				dlg1 = new trm.widget.AdminDialog({}, "dlg_admin");
				dlg1.application = this;
				/*
				dojo.connect(dlg1,"onGetPoint",this,"_onGetPointClick");
				dojo.connect(dlg1,"onZoomlevelClick",this,"_onZoomlevelClick");		
				dojo.connect(dlg1,"onUpdateUser",this,"_cb_updateUser");
				*/
			}
			
			this.hideLoading();
			if (dlg1)  {
				dlg1.application = this;
				//dlg1.setDataItem(item);
				dlg1.show();
			}
		},
		
		/**
		 * hides the admin dialog
		 */
		hideAdminDialog: function() {
			var dlg1 = dijit.byId('dlg_admin');
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
			
			var dlg1 = dijit.byId('dialog_info');
			if (! dlg1) {
				dojo.require("trm.widget.InfoDialog");
				dlg1 = new trm.widget.InfoDialog({}, "dialog_info");
			}
			
			//dijit.byId('dialog_info').setAttribute("title",title);
			//dijit.byId('dialog_info').setContent(text);
			//document.getElementById('dlginfo_text').innerHTML = message;
			dlg1.show(message);
			//dijit.byId('dialog_info').show(message);
		},
		
		/**
		 * hides the message dialog
		 */
		hideMessageDialog: function() {
			dijit.byId('dialog_info').hide();
		}
		
		
});