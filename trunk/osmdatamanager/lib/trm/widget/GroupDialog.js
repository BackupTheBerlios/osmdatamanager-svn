dojo.provide("trm.widget.GroupDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.GroupDialog", [trm.widget._TrmWidget, dijit._Templated], {
	templatePath:    dojo.moduleUrl('trm.widget', 'GroupDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
		this.domNode.setAttribute("class","trmGroupDialog_hidden");
	},
	_cancelClick: function(e) {
		this.hide();
	},
	_okClick: function(e) {
		console.debug("_ok");
	},
	show: function() {
		console.debug("show");
		this._position();
		this.domNode.setAttribute("class","trmGroupDialog");
		console.debug(this.grid);
		this.loadGpxFiles();
	},
	hide: function() {
		console.debug(this.domNode.getAttribute("class"));
		this.hideDndSource();
		this.domNode.setAttribute("class","trmGroupDialog_hidden");
	}
		
});