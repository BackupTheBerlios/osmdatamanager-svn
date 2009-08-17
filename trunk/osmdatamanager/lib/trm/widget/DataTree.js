dojo.provide("trm.widget.DataTree");
dojo.require("dijit._Widget");
dojo.require("dojo.parser");
dojo.require("dijit.Tree");
dojo.require("dijit._tree.dndSource");
//

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.DataTree", [dijit.Tree], {
	tags: null,
	selectedItem: {},
	selectedTreeItem: null,
	postCreate: function() {
		this.inherited(arguments);
		//this.tags = new Array();
	},
	
	getIconClass: function(/*dojo.data.Item*/item, /*Boolean*/ opened){
		try {
			if (item.root != true) {	
				if (opened) {
					return this.model.store.getValue(item, 'tagname') + "_open";
				}
				else {
					return this.model.store.getValue(item, 'tagname');
				}
			}	
		} catch (e) {
			console.error(e);
		}
		/*
		if (gl_application) {
			return this.inherited(arguments);
		}
		*/
	},
	
	
	onClick: function(item, node) {
		this.selectedItem = item;
		this.inherited(arguments);
		this.selectedItem = {};
		this.selectedTreeItem = item;
		for (var key in item) {
			var val = item[key][0];
			if ((val != "undefined") && (val != null))
				this.selectedItem[key] = item[key][0];
		}
	},
	
	onMouseOver: function(event) {
		this.inherited(arguments);
	},
	
	/* //TODO kann weg
	_clearNode: function(node) {
		try {
			
			if (node.children) {
				for (var i = (node.children.length - 1); i > -1; i--) {
					var nd1 = node.children[i];
					//console.debug(String(nd1.itemname));
					this._clearNode(nd1);
				}
			}
			/*
			var parent = node.getParent();
			if (parent) {
				parent.removeChild(node);
			}* /
				
			console.debug(node);
			this.model.store.deleteItem(node);
			//node.destroyRecursive();
			
			/*
			for (var i = (this.model.store._arrayOfAllItems.length - 1); i > 0; i--) {
					var nd1 = this.model.store._arrayOfAllItems[i];
					//this._clearNode(nd1);
					console.debug(String(nd1.itemname));
					this.model.store.deleteItem(nd1);
				}
			* /
			
			
		} catch (e) {
			console.error(e);
		}
	},
	*/
	
	/**
	 * copy's data from sourceItem into a destItem in the ItemFileWriteStore
	 * @param {Object} sourceItem
	 * @param {Object} destItem
	 */
	_copyData: function(sourceItem, destItem) {
		for (var key in sourceItem) {
			var val = String(sourceItem[key]);
			var key1 = String(key);
			if ((key1.indexOf("_") == -1) && (key1.toLowerCase() != "children") &&
				(key1.toLowerCase() != "id")) {
				if ((val != "undefined") && (val != null)) 
					//destItem[key] = sourceItem[key];
					this.model.store.setValue(destItem,key1,val);
			}
		}
		this.model.store.setValue(destItem,"name",sourceItem.itemname);
	},
	
	/**
	 * updates the data in the ItemFileWriteStore
	 * @param {Object} item
	 */
	updateItem: function(item) {
		for (var i = (this.model.store._arrayOfAllItems.length - 1); i > -1; i--) {
			var nd1 = this.model.store._arrayOfAllItems[i];
			if (String(nd1.itemid) == String(item.itemid)) {
			  this._copyData(item,nd1);
			}
		}
		
		console.debug(this.lastFocused);
		if (this.lastFocused) {
			var prnt = this.lastFocused.getParent();
			if (prnt) {
				this.focusNode(prnt);
			}
		}
	},
	
	getSelectedParentGroupId: function() {
		if (this.lastFocused) {
			var prnt = this.lastFocused.getParent();
			if (prnt) {
				if (String(prnt.item.itemtype).toLowerCase() == "group") {
					return String(prnt.item.itemid);
				}
			}
		}
		return null;
	},
	
	/**
	 * clears all nodes in the tree
	 */
	clearNodes: function() {
		for (var i = (this.model.store._arrayOfAllItems.length - 1); i > -1; i--) {
			var nd1 = this.model.store._arrayOfAllItems[i];
			this.model.store.deleteItem(nd1);
		}
		this.model.store._loadFinished = false;
	},
	
	/**
	 * refresh the tree => reload the root nodes
	 */
	refresh: function() {
        try {
			this.model.store._loadFinished = false;
			
			this._itemNodeMap = {};
			//this.model.root = null;
			this.model.rootId = "root";
			this.model.rootLabel = "ROOT"
			
			if (this.rootNode) {
				this.rootNode.destroyRecursive();
			}
			this.showRoot = false;
			this.state = 'UNCHECKED';
			this._load();
		} catch(e) {
			console.error(e);
		}
	},
	
	_getIconName: function(tagname, opened) {
			
		if (gl_application) {
			var usr1 = gl_application.getActiveUser();
			if (usr1) {
				for (var i = 0; i < usr1.tags.length; i++) {
					var t1 = usr1.tags[i];
					if (String(t1.tagname) == tagname) {
					  if (opened)
					  	return String(t1.icon2);
					  else
						return String(t1.icon1);
					}
				}
			}
		}
	}
		
});