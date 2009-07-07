dojo.provide("trm.widget.PoiDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.PoiDialog", [trm.widget._TrmWidget, dijit._Templated], {
	grid: null,
	widgetsInTemplate: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'PoiDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
		this.domNode.setAttribute("class","trmPoiDialog_hidden trmDialog");
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
		this.domNode.setAttribute("class","trmPoiDialog trmDialog");
		console.debug(this.grid);
		this.loadGpxFiles();
	},
	hide: function() {
		console.debug(this.domNode.getAttribute("class"));
		this.hideDndSource();
		this.domNode.setAttribute("class","trmPoiDialog_hidden trmDialog");
	}
		
});
