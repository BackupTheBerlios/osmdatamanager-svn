dojo.provide("trm.widget.CustomForestStoreModel");
dojo.require("dijit.Tree");

dojo.declare("trm.widget.CustomForestStoreModel", [dijit.tree.ForestStoreModel], {
	
	doload: true,
	
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
			
	newItem: function(args, parent) {
		try {
			var val = this.inherited(arguments);
			
			console.debug("newItem Forest");
			console.debug(args);
			console.debug(parent);
			console.debug(val);
			console.debug("=== end newItem Forest ====");
			return val;
			//return {name:"Warpkern", itemname: "Rockt",itemtype: "Group", itemid: 233};
			
		} catch(e) {
			console.error(e);
		}
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
			if (parentItem.root != true) {
				if (this.doload) {
					var parentid = this.store.getValue(parentItem, 'itemid');
					if (parentid != -1) {
						//this.store.close();
						this.store.url = "groupfunctions.php?action=msg.getgrpitems&treedata=yes&groupid=" + parentid;
						this.store.fetch({
							query: {
								'parentid': parentid
							},
							onComplete: complete_cb,
							onError: error_cb
						});
					}
				} else {
					console.debug("dontload")
					this.doload = true;
				}
			}
			return this.inherited(arguments);
		} catch (e) {
			console.error(e);
		}
	}
});