dojo.declare("DijitClient2", Application2, {
        
		/**
         * DijitClient -> connection between dijit and the base application
         */
		constructor: function(name,map){
                // remember, Person constructor is called automatically
        	dojo.connect(dijit.byId("dlg_login"),"onLoggedIn",this,"_cb_LoggedIn");        
        },
		
		/**
		 * callback afer successful login
		 * @param {Object} user
		 */
		_cb_LoggedIn: function(user){
			this.setActiveUser(user);
			this.disablePrivatemode();
			//this.updateFilelist();
			
			var usr = this.getActiveUser();
			console.debug(usr);
			console.debug(self);
			if (usr != null) {
				dijit.byId('btn_login').attr("label", "Logout [" + usr.username + "]");
				this.enablePrivatemode();
				gl_groupmanager.getRootGroups();
				this.centerHomebase();
				/*
				self.updateFileList(null);
								
				
				*/
				dijit.byId('dlg_login').hide();
			} else {
				//self.disablePrivatemode();
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
			if (response != "msg.loginfailed") {
				this._cb_LoggedIn(response);
			} else {
				alert(nls["loginfailed"]);
			}
		},
		/**
		 * check the kind of item clicked in the tree and enable or disable items
		 * @param {Object} sender
		 */
		groupTreeOpenmenu: function(sender) {
			this.disabledAllMenuItems();
			
			var grpTree = gl_groupmanager.getGroupTree();
			if (grpTree) {
				var itm1 = grpTree.getSelectedItem();
				if (itm1) {
					switch(itm1.itemtype.toLowerCase()) {
						case "group":
							dijit.byId('itm_loaddata').attr("disabled",false);
							dijit.byId('itm_edit').attr("disabled",false);
							dijit.byId('itm_remove').attr("disabled",false);
							dijit.byId('itm_manager').attr("disabled",false);
							dijit.byId('itm_submenu_groups').attr("disabled",false);
							dijit.byId('itm_createmaingroup').attr("disabled",false);
							dijit.byId('itm_createsubgroup').attr("disabled",false);
							dijit.byId('itm_deletegroup').attr("disabled",false);
							break;
					}
				}
			}
		},
		enablePrivatemode: function() {
			
		},
		disablePrivatemode: function() {
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
		},
		
		/**
		 * shows the login dialog
		 */
		showLogin: function() {
			var dlg1 = dijit.byId('dlg_login');
			if (dlg1)  {
				dlg1.show();
			}
		},
		
		/**
		 * shows the item manager
		 */
		showItemManager: function() {
			var dlg1 = dijit.byId('dlg_itemmanager');
			if (dlg1)  {
				dlg1.show();
			}
		},
		
		showGroupDialog: function() {
			var dlg1 = dijit.byId('dlg_group');
			if (dlg1)  {
				dlg1.show();
			}
		}
		
		
		
		
});