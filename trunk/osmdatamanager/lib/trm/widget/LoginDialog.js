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

dojo.provide("trm.widget.LoginDialog");
//dojo.require("dijit._Widget");
dojo.require("dijit.form.TextBox");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dojo.parser");

dojo.declare("trm.widget.LoginDialog", [trm.widget._TrmBaseDialog], {
	action: "",
	templatePath:    dojo.moduleUrl('trm.widget', 'LoginDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
		this.trmLoginLabelUserNode.textContent=this.nls["username"];
		this.trmLoginLabelPasswordNode.textContent=this.nls["password"];
	},
	onLoggedIn: function(user) {
		
	},
	_cb_loginUser: function(response, ioArgs) {
		if (response != "msg.loginfailed") {
			this.onLoggedIn(response);
		} else {
			this._resetFields();
			alert(this.nls["login_failed"]);
			
			if (this.trmLoginInputUserNode) {
				this.trmLoginInputUserNode.focus();
			}
		}
	},
	_resetFields: function() {
		this.trmLoginInputUserNode.setAttribute("value","");
		this.trmLoginInputPasswordNode.setAttribute("value","");
	},
	_okClick: function(e) {
		var username = this.trmLoginInputUserNode.value;
		//var password = this.trmLoginInputPasswordNode.value;
		var password = document.getElementById(this.trmLoginInputPasswordNode.id).value;
				
		if ((username == null) || (username  == "")) {
			alert(this.nls["invalidusername"]);
			return;	
		}
		
		if ((password == null) || (password == "")) {
			alert(this.nls["invalidpassword"]);
			return;
		}
		
		params = {
			"action": "msg.login",
			"username":username,
			"password":password
		}
		
		this.loadFromServer("userfunctions.php",params,this._cb_loginUser);
	},
	show: function() {
		this.inherited(arguments);
		this._resetFields();
		
		if (this.trmLoginInputUserNode) {
			this.trmLoginInputUserNode.focus();
		}
		
	},
	hide: function() {
		this.inherited(arguments);	
	}
	
});