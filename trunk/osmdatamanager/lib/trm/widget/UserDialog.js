dojo.provide("trm.widget.UserDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.UserDialog", [trm.widget._TrmBaseWidget], {
	application: null,
	storedata: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'UserDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
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
					"email": "", //email,
					"lat": data.lat,
					"lon": data.lon,
					"htmltext": data.longtext,
					"zoomlevel": data.zoomlevel,
					"tagname": data.tagname,
					"picture": ""
				}
				
				this.loadFromServer("userfunctions.php", params, this._cb_updateuser);	
		} else {
			this.onOkClick(data);
		}
		
		/*
		if (this._dataOk()) {
			var itemid = -1;
			if (this.user)
				itemid = this.user.itemid;
			
			var itemname 	= 	this.dlgUsr_tbName.attr("value");
			var lat 		= 	this.dlgUsr_tbLat.attr("value");
			var lon 		= 	this.dlgUsr_tbLon.attr("value");
			var zoomlevel 	= 	this.dlgUsr_spinZoomlevel.attr("value");
			var tagname 	= 	this._getTagname();
			var htmltext	=   this.dlgUsr_tbHtmlText.attr("value");
			var email		=   this.dlgUsr_tbEmail.attr("value");
			
			if (this.storedata) {
				//callback = cb;
				var params = {
					"action": "msg.updateuser",
					"userid": itemid,
					"username": itemname,
					"email": email,
					"lat": lat,
					"lon": lon,
					"htmltext": htmltext,
					"zoomlevel": zoomlevel,
					"tagname": tagname,
					"picture": ""
				}
				
				this.loadFromServer("userfunctions.php", params, this._cb_updateuser);
			}
			else {
				this.onOkClick({
					"itemid": itemid,
					"itemname": itemname,
					"lat": lat,
					"lon": lon,
					"email": email,
					"zoomlevel": zoomlevel,
					"tagname": tagname,
					"htmltext": htmltext
				});
			}
		}
		*/
	},
	show: function() {
		if (this.onlyshow) {
			this.inherited(arguments);
			return;
		}
		
		if (!this.dataitem) {
			this._resetFields();
		} else {
			this._loadData();
		}
		this.inherited(arguments);
	}	
});
