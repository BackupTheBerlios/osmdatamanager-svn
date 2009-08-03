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
			
			if (parent === this.root) {
				console.debug("rootmatch");
			}
			
			console.debug("=== end newItem Forest ====");
			return val;
			//return {name:"Warpkern", itemname: "Rockt",itemtype: "Group", itemid: 233};
			
		} catch(e) {
			console.error(e);
		}
	},
	
	onChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
			// summary:
			//		Callback to do notifications about new, updated, or deleted items.
			console.debug("onChildrenChange");
			console.debug(parent);
			console.debug(newChildrenList);
			console.debug("::: end onChildrenChange")
			return this.inherited(arguments);
	},
	
	onDelete: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
			// summary:
			//		Callback when an item has been deleted.
			// description:
			//		Note that there will also be an onChildrenChange() callback for the parent
			//		of this item.
			console.debug("onDelete");
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
	},
	
	_onNewItem: function(/* dojo.data.Item */ item, /* Object */ parentInfo){
		console.debug("_onNewItem");
		return this.inherited(arguments);
	},
	
	_requeryTop: function(){
		console.debug("_requeryTop");
		return this.inherited(arguments);
	},
	
	_onSetItem: function(/* item */item, /* attribute-name-string */
		attribute, /* object | array */
		oldValue, /* object | array */
		newValue){
		
		console.debug("_onSetItem");
		return this.inherited(arguments);
	}
	
	
	
});