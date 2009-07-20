/*
 * copy and paste code for a custom widget
 * 
 * 
 * 
dojo.provide("trm.widget.UserDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.UserDialog", [trm.widget._TrmWidget, dijit._Templated], {
	widgetsInTemplate: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'UserDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_cancelClick: function(e) {
		this.inherited(arguments);
	},
	_okClick: function(e) {
		this.inherited(arguments);
	},
	show: function() {
		this.inherited(arguments);
	},
	hide: function() {
		this.inherited(arguments);
	}
		
});
*/