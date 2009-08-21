dojo.provide("trm.widget.DataTree");
dojo.require("dijit._Widget");
dojo.require("dojo.parser");
dojo.require("dijit.Tree");
dojo.require("dijit._tree.dndSource");
//

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.DataTree", [dijit.Tree], {
	selectedItem: {},
	
	selectedTreeItem: null,
	postCreate: function() {
		this.inherited(arguments);
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
	},
	
	getItemFromTree: function(item) {
		var result = {
			children: []
		};
		
		for (var key in item) {
			var val = item[key][0];
			var key1 = String(key);
			if ((key1.indexOf("_") == -1) && (key1 != "children")) {
				if ((val != "undefined") && (val != null)) 
					result[key] = item[key][0];
			}
		}
		
		if (item.children) {
			for (var i=0;i<item.children.length;i++) {
				var chld1 = item.children[i];
				result.children[i] = this.getItemFromTree(chld1);
			}
			//result.children = item.children;
		}
		
		return result;
	},
	
	onClick: function(item, node) {
		this.selectedItem = item;
		this.inherited(arguments);
		this.selectedTreeItem = item;			
		this.selectedItem = this.getItemFromTree(item);
	},
	
	onMouseOver: function(event) {
		this.inherited(arguments);
	},
	
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
		
		if (this.lastFocused) {
			var prnt = this.lastFocused.getParent();
			if (prnt) {
				this.focusNode(prnt);
			}
		}
	},
	
	/**
	 * deletes the item with the given itemid from the tree and also from the itemstore
	 * @param {Object} itemid
	 */
	deleteItemById: function(itemid) {
		for (var i = (this.model.store._arrayOfAllItems.length - 1); i > -1; i--) {
			var nd1 = this.model.store._arrayOfAllItems[i];
			if (nd1) {
				if (String(nd1.itemid) == String(itemid)) {
					this.model.store.deleteItem(nd1);
				}
			}
		}
	},
	
	/**
	 * deletes the current selected item
	 */
	deleteSelectedItem: function() {
		if (this.selectedTreeItem) {
			this.model.store.deleteItem(this.selectedTreeItem);
			this.selectedTreeItem = null;
			this.selectedItem = null;
			this.lastFocused = null;
		}
		this.removeFocus();
	},
	
	/**
	 * removes the dijitTreeNodeSelected css class from given node 
	 * @param {Object} node
	 */
	_removeFocus: function(node) {
		if (node.children) {
			for (var i=0;i<node.children.length;i++) {
			  var nd1 = node.children[i];
			  dojo.removeClass(nd1, "dijitTreeNodeSelected");	
			  this._removeFocus(nd1);
			}
		}
	},
	
	/**
	 * removes the dijitTreeNodeSelected css class from all nodes
	 */
	removeFocus: function() {
		this._removeFocus(this.domNode);
	},
	
	/**
	 * 
	 */
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
	
	/**
	 * 
	 * @param {Object} tagname
	 * @param {Object} opened
	 */
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