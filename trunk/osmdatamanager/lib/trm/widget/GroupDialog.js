dojo.provide("trm.widget.GroupDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.GroupDialog", [trm.widget._TrmWidget, dijit._Templated], {
	isUpdate: false,
	group: null,
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
	_resetFields: function() {
		this.dlgGrp_tbDescription.value = "";
		this.dlgGrp_tbLat.value = "";
		this.dlgGrp_tbLon.value = "";
		this.dlgGrp_spinZoomlevel.value = "";
	},
	_loadGroupData: function() {
		if (this.group == null)
			return;
			
		this.dlgGrp_tbDescription.value = group.itemname;
		this.dlgGrp_tbLat.value = group.lat;
		this.dlgGrp_tbLon.value = group.lon;
		this.dlgGrp_spinZoomlevel.value = group.zoomlevel;
	},
	setGroup: function(group) {
		this.group = group;
		this._loadGroupData();
	},
	show: function() {
		this._position();
		this._resetFields();
		this.domNode.setAttribute("class","trmGroupDialog");
	},
	hide: function() {
		this._resetFields();
		this.domNode.setAttribute("class","trmGroupDialog_hidden");
	}
		
});