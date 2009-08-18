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
	/*
	startup: function() {
		
	},
	onLoad: function(){
			// summary: when href is specified we need to reposition the dialog after the data is loaded
			this._position();
			this.inherited(arguments);
	},
	*/
	onLoggedIn: function(user) {
		console.debug(user);
	},
	_cb_loginUser: function(response, ioArgs) {
		console.debug(response);
		if (response != "msg.loginfailed") {
			this.onLoggedIn(response);
		} else {
			//alert(nls["loginfailed"]);
			this._resetFields();
			alert(this.nls["login_failed"]);
		}
	},
	_resetFields: function() {
		this.trmLoginInputUserNode.setAttribute("value","");
		this.trmLoginInputPasswordNode.setAttribute("value","");
	},
	_okClick: function(e) {
		console.debug("okclick");
		
		var username = this.trmLoginInputUserNode.value;
		var password = this.trmLoginInputPasswordNode.value;
		
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
		console.debug("show");
		this.inherited(arguments);
		//this._position();
		this._resetFields();
		
	},
	hide: function() {
		this.inherited(arguments);	
	}
	
});