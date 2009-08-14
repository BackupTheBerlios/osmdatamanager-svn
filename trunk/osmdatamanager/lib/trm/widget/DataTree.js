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