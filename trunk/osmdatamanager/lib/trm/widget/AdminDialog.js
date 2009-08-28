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

dojo.provide("trm.widget.AdminDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

dojo.declare("trm.widget.AdminDialog", [trm.widget._TrmBaseDialog], {
	storedata: true,
	onOkClick: function(data) {
		
	},
	templatePath:    dojo.moduleUrl('trm.widget', 'AdminDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_dataOk: function() {
		return true;
	},
	
	_setTranslations: function() {
		this.inherited(arguments);
		
		if (this.nls) {
			if (this.dlgAdmin_lblCrtUser)
				this.dlgAdmin_lblCrtUser.innerHTML = this.nls["createuser"];
				
			if (this.dlgAdmin_lblUsername) 
				this.dlgAdmin_lblUsername.innerHTML = this.nls["username"];
				
			if (this.dlgAdmin_lblPassword1) 
				this.dlgAdmin_lblPassword1.innerHTML = this.nls["password"];
			
			if (this.dlgAdmin_lblPassword2) 
				this.dlgAdmin_lblPassword2.innerHTML = this.nls["password"];
				
			if (this.dlgAdmin_btnCrtUser) 
				this.dlgAdmin_btnCrtUser.containerNode.innerHTML = this.nls["createuser"];			
		}
	},
	
	_updateOk: function(item) {
		//console.debug(item);
		if (this.application) {
			this.application._updateitem(item);
		}
		this.hide();
	},
	
	
	getData: function() {
		var username = document.getElementById(this.dlgAdmin_tbUsername.id).value.trim();
		var pwd1 = document.getElementById(this.dlgAdmin_tbPassword1.id).value.trim();
		var pwd2 = document.getElementById(this.dlgAdmin_tbPassword2.id).value.trim();
		
		var result = {
			"username": username,
			"password1":pwd1,
			"password2":pwd2
		}
	
		return result;
	},
	
	_okClick: function(e) {
		//this.inherited(arguments);
		var data = this.getData();
		if (this._dataOk()) {
			
		} else {
			if (this.nls) {
		 		alert(this.nls["entervaliddata"]);
		 	}
		}
	},
	
	_userDataOk: function() {
		if (this.dlgAdmin_tbUsername) {
			if (document.getElementById(this.dlgAdmin_tbUsername.id).value.trim() == "")
				return false;
		}
		var pwd1 = "";
		var pwd2 = "";
		
		if (this.dlgAdmin_tbPassword1) {
			pwd1 = document.getElementById(this.dlgAdmin_tbPassword1.id).value.trim();
			if (pwd1 == "")
				return false;
		}
		
		if (this.dlgAdmin_tbPassword2) {
			var pwd2 = document.getElementById(this.dlgAdmin_tbPassword2.id).value.trim();
			if (pwd2 == "")
				return false;
		}
			
		if (String(pwd1) != String(pwd2)) {
			return false;
		}
		
		return true;
	},
	
	_cb_createUser: function(user) {
		if (user == "msg.userexists") {
			alert("user exists");
			this._resetFields();
			return;
		}
		
		alert("successfully created user " + user.itemname);
		this._resetFields();
		//console.debug(user);
	},
	
	_createUserClick: function(e) {
		if (this._userDataOk()){
			var data = this.getData();
			
			if (this.storedata) {
				var params = {
					"action": "msg.registeruser",
					"username": data.username,
					"password": data.password1,
					"email": ""
				}
				var cb = {
					target: this,
					func: this._cb_createUser
				}
				
				this.callback = cb;
				this.loadFromServer("userfunctions.php", params,this._cb_standard);
			}	
		} else {
			alert(this.nls["entervaliddata"]);	
		}	
	},
	
	_resetFields: function() {
		this.inherited(arguments);
		
		if (this.dlgAdmin_tbUsername)
			this.dlgAdmin_tbUsername.attr("value","");
		
		if (this.dlgAdmin_tbPassword1)
			this.dlgAdmin_tbPassword1.attr("value","");
			
		if (this.dlgAdmin_tbPassword2)
			this.dlgAdmin_tbPassword2.attr("value","");
			
	},
	
	_loadData: function() {
		this.inherited(arguments);
		
		
			
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
		} else {
			this._resetFields();
			this.dataitem = null;
			if (root)
				this.parentitem = null;
		}
	}
});