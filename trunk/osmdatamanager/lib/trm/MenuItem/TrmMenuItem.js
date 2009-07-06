dojo.provide("trm.MenuItem.TrmMenuItem");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
//dojo.require("dijit.form.Button");
dojo.require("dojo.parser");

dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.MenuItem.TrmMenuItem", [dijit.MenuItem], {
	field: "empty",
	postCreate: function() {
		this.inherited(arguments);
		var nls = dojo.i18n.getLocalization("trm.translation", "tt");
		
		this.label = nls[this.field];
		this.containerNode.innerHTML = nls[this.field];
	}
		
});