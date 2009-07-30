dojo.provide("trm.widget.CustomQueryStore");
dojo.require("dojox.data.QueryReadStore");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.declare("trm.widget.CustomQueryStore", [dojox.data.QueryReadStore], {
//dojo.declare("trm.widget.CustomQueryStore", [dojo.data.ItemFileWriteStore], {
	
	dndTargetItem: null,
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	newItem___: function(keywordArgs, parentInfo) {
		console.debug("newItem");
				
		console.debug(keywordArgs);
		console.debug(parentInfo);
		console.debug(dojo.dnd.manager().source);
		console.debug(dojo.dnd.manager().target);
		console.debug("=== end newItem ====");
		
		return {itemname: "Halloaaa", name: "aloha", itemid: 255};
		/*
		console.debug(this.dndTargetItem);
		*/
		/*
		this.url = "groupfunctions.php?action=msg.getgrpitems&treedata=yes&groupid=" + 247;
		this.fetch({
					query: {
						'parentid': 247
					}
		});
		
		return null;
		*/
	},
	
	newItem: function(/* Object? */ keywordArgs, /* Object? */ parentInfo){
		console.debug("::: newItem");
		//var val = this.inherited(arguments);
		//console.debug(val);
		console.debug("===end newItem");
		return {name:"Warpkern", itemname: "Rockt",itemtype: "Group", itemid: 233};
		return val;
	}
	
	
});