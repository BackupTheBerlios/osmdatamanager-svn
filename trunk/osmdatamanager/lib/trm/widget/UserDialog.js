/**
    @license
    This file is part of osmdatamanager.

    osmdatamanager is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, only GPLv2.

    osmdatamanager is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with osmdatamanager.  If not, see <http://www.gnu.org/licenses/>.
	
*/

dojo.provide("trm.widget.UserDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.UserDialog", [trm.widget._TrmBaseDialog], {
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
