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
	postCreate: function() {
		this.inherited(arguments);
		//this.tags = new Array();
	},
	
	getIconClass: function(/*dojo.data.Item*/item, /*Boolean*/ opened){
		
		try {
			if (item.root != true) {
				//console.debug(item);
				//console.debug(this.model.store.getValue(item, 'tagname'));
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
		
		if (gl_application) {
			return this.inherited(arguments);
		}
	},
	
	
	onClick: function(item, node) {
		this.selectedItem = item;
		this.inherited(arguments);
		this.selectedItem = {};
		
		for (var key in item) {
			//console.debug(key);
			var val = item[key][0];
			//console.debug(val);
			if ((val != "undefined") && (val != null))
				this.selectedItem[key] = item[key][0];
		}
		console.debug(this.selectedItem);
		
		/*
		var itm1 = this.model.store.getItemByIdentifier(item.id[0]);
		console.debug(itm1);
		if (item.i) {
			console.debug(item);
			this.selectedItem = item.i;
		}
		*/
	},
	
	onMouseOver: function(event) {
		this.inherited(arguments);
		console.debug(onMouseOver);
		console.debug(event);
	},
	
	_loadTags: function() {
		if (tags.length > 0)
			return;	
	
		if (gl_application) {
			var usr1 = gl_application.getActiveUser();
			if (usr1) {
				for (var i = 0; i < usr1.tags.length; i++) {
					var t1 = usr1.tags[i];
					this.tags.push(t1);
				}
			}
		}
	}
	
		
	
});