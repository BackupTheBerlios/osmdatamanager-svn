dojo.provide("trm.login.Form");
//dojo.require("dijit._Widget");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

dojo.requireLocalization("trm.login", "Form");

dojo.declare("trm.login.Form", [trm.widget._TrmWidget, dijit._Templated], {
	action: "",
	//method: "POST",
	templatePath:    dojo.moduleUrl('trm.login', 'Form.html'),
	templateCssPath: dojo.moduleUrl('trm.login', 'Form.css'),  //TODO does not work, you have to include the css in your html page
	baseClass: dojo.moduleUrl('trm.login', 'Form.css'),
	postCreate: function() {
		this.inherited(arguments);
		//Now, we need to get the translations
		var nls = dojo.i18n.getLocalization("trm.login", "Form");
		this.trmLoginLabelUserNode.textContent=nls.username;
		this.trmLoginLabelPasswordNode.textContent=nls.password;
		this.trmLoginBtnOkNode.textContent     = nls.ok;
		this.trmLoginBtnCancelNode.textContent = nls.cancel;
		this.domNode.setAttribute("class","trmLoginForm_hidden");
	},
	startup: function() {
		
	},
	onLoad: function(){
			// summary: when href is specified we need to reposition the dialog after the data is loaded
			this._position();
			this.inherited(arguments);
	},
	onLoggedIn: function(user) {
		console.debug(user);
	},
	_cb_loginUser: function(response, ioArgs) {
		var nls = dojo.i18n.getLocalization("trm.login", "Form");
		console.debug(response);
		if (response != "msg.loginfailed") {
			this.onLoggedIn(response);
		} else {
			alert(nls["loginfailed"]);
		}
	},
	_okClick: function(e) {
		console.debug("okclick");
		var nls = dojo.i18n.getLocalization("trm.login", "Form");
		var username = this.trmLoginInputUserNode.value;
		var password = this.trmLoginInputPasswordNode.value;
		
		if ((username == null) || (username  == "")) {
			alert(nls["invalidusername"]);
			return;	
		}
		
		if ((password == null) || (password == "")) {
			alert(nls["invalidpassword"]);
			return;
		}
		
		params = {
			"action": "msg.login",
			"username":username,
			"password":password
		}
		
		this.loadFromServer("userfunctions.php",params,this._cb_loginUser);
	},
	_cancelClick: function(e) {
		this.hide();
	},
	_position: function(){
			// summary: position modal dialog in center of screen		
			if(dojo.hasClass(dojo.body(),"dojoMove")){ return; }
			var viewport = dijit.getViewport();
			var mb = dojo.marginBox(this.domNode);

			var style = this.domNode.style;
			style.left = Math.floor((viewport.l + (viewport.w - mb.w)/2)) + "px";
			style.top = Math.floor((viewport.t + (viewport.h - mb.h)/2)) + "px";
	},
	show: function() {
		console.debug("show");
		this._position();
		this.domNode.setAttribute("class","trmLoginForm");
	},
	hide: function() {
		console.debug(this.domNode.getAttribute("class"));
		this.domNode.setAttribute("class","trmLoginForm_hidden");
	}
	
});