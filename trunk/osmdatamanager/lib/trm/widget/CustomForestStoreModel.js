dojo.provide("trm.widget.CustomForestStoreModel");
dojo.require("dijit.Tree");

dojo.declare("trm.widget.CustomForestStoreModel", [dijit.tree.ForestStoreModel], {
	
	//doload: true,
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	/**
	 * 
	 * @param {Object} item
	 */
	mayHaveChildren: function(item) {
		try {
			var val = this.inherited(arguments);
			if (item.root != true) {	
				if (this.store.getValue(item, 'haschildren') == true) 
					return true;
			}
		
		} catch (e) {
			console.error(e);
		}
		return false;
	},
	
	/**
	 * 
	 * @param {Object} keywordArgs
	 * @param {Object} parentInfo
	 */
	beforeNewItem: function(keywordArgs, parentInfo) {
		
	},
	
	/**
	 * 
	 * @param {Object} args
	 * @param {Object} parent
	 */
	newItem: function(args, parent) {
		this.beforeNewItem(args, /* Object? */ parent);
		return this.inherited(arguments);
	},
				
	/**
	 * 
	 * @param {Object} parentItem
	 * @param {Object} complete_cb
	 * @param {Object} error_cb
	 */
	getChildren: function(parentItem, complete_cb, error_cb) {
		console.debug("getChildren");
		console.debug(complete_cb);
		console.debug(error_cb);
		try {
			console.debug(parentItem);
			if (parentItem.root != true) {
				//if (this.doload) {
					var parentid = this.store.getValue(parentItem, 'itemid');
					if (parentid != -1) {
						//this.store.close();
						this.store.url = "groupfunctions.php?action=msg.getgrpitems&treedata=yes&groupid=" + parentid;
						console.debug("fetch");
						this.store.fetch({
							query: {
								'parentid': parentid
							},
							onComplete: complete_cb,
							onError: error_cb
						});
					}
				/*
				} else {
					console.debug("dontload")
					this.doload = true;
				}
				*/
			}
			return this.inherited(arguments);
		} catch (e) {
			console.error(e);
		}
	}
	
});