dojo.provide("trm.widget.UserDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.UserDialog", [trm.widget._TrmBaseDialog], {
	application: null,
	storedata: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'UserDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
		this.dlg_lblEmail.innerHTML = this.nls["email"];
	},
	
	onUpdateUser: function(user) {
	
	},
	
	_dataOk: function() {
		if (this.dlgUsr_tbName.attr("value").trim() == "")
			return false;
		
		return true;
	},
	_cb_updateuser: function(response, ioArgs) {
		if (response != "msg.failed") {
			if (this.application) {
				this.application.activeuser = response;
			}	
			this.onUpdateUser(response);
			this.hide();
		}
	},
	_okClick: function(e) {
		//this.inherited(arguments);
		var data = this.getData();
		if (this.storedata) {
				var params = {
					"action": "msg.updateuser",
					"userid": data.itemid,
					"username": data.itemname,
					"email": this.dlg_tbEmail.attr("value"),
					"lat": data.lat,
					"lon": data.lon,
					"htmltext": data.description,
					"zoomlevel": data.zoomlevel,
					"tagname": data.tagname,
					"picture": ""
				}
				
				this.loadFromServer("userfunctions.php", params, this._cb_updateuser);	
		} else {
			this.onOkClick(data);
		}
	},
	show: function() {
		this.inherited(arguments);
		if (this.onlyshow) {
			this.inherited(arguments);
			return;
		}
		
		if (!this.dataitem) {
			this._resetFields();
		} else {
			this._loadData();
		}
		
	}	
});
