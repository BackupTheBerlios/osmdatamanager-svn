dojo.provide("trm.widget.InfoDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.InfoDialog", [trm.widget._TrmBaseDialog], {
	widgetsInTemplate: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'InfoDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_cancelClick: function(e) {
		this.inherited(arguments);
	},
	_okClick: function(e) {
		//this.inherited(arguments);
		this.hide();
	},
	show: function(infotext) {
		this.inherited(arguments);
		this.dlg_lblInfo.innerHTML = infotext;
	},
	hide: function() {
		this.inherited(arguments);
	}
		
});