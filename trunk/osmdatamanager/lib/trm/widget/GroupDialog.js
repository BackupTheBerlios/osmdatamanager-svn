dojo.provide("trm.widget.GroupDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

dojo.declare("trm.widget.GroupDialog", [trm.widget._TrmBaseDialog], {
	onOkClick: function(data) {
		
	},
	templatePath:    dojo.moduleUrl('trm.widget', 'GroupDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_getProtection: function() {
		var val = "private";
		/*
		if (dijit.byId('dlgcreategroup_rd_private').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_private').value;
		
		if (dijit.byId('dlgcreategroup_rd_protected').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_protected').value;
		  
		if (dijit.byId('dlgcreategroup_rd_public').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_public').value;
		*/	   
		return val;	
	},
	_dataOk: function() {
		//this.inherited(arguments);
		if (this.dlg_tbItemname) {
			if (this.dlg_tbItemname.attr("value").trim() == "")
				return false;
		}		
		return true;
	},
	_okClick: function(e) {
		//this.inherited(arguments);
		var data = this.getData();
		if (this._dataOk()) {
			var data = this.getData();
			this.onOkClick(data);
		} else {
			if (this.nls) {
		 		alert(this.nls["entervaliddata"]);
		 	}
		}
	},
	show: function(update,root) {
		this.inherited(arguments);
		if (this.onlyshow) {
			this._setTag(this.dataitem.tagname);
			return;
		}
		
		if (update) {
			this.parentitem = null;
			this._loadData();
			this.dlgGrp_tblUpdate.setAttribute("class", "table_update");
		} else {
			this._resetFields();
			this.dataitem = null;
			this.dlgGrp_tblUpdate.setAttribute("class", "table_update_hidden");
			if (root)
				this.parentitem = null;
		}
	}
});