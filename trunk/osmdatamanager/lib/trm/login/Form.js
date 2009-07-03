dojo.provide("trm.login.Form");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

dojo.requireLocalization("trm.login", "Form");

dojo.declare("trm.login.Form", [dijit._Widget, dijit._Templated], {
	action: "",
	//method: "POST",
	templatePath:    dojo.moduleUrl('trm.login', 'Form.html'),
	templateCssPath: dojo.moduleUrl('trm.login', 'Form.css'),
	baseClass: dojo.moduleUrl('trm.login', 'Form.css'),
	postCreate: function() {
		this.inherited(arguments);
		//Now, we need to get the translations
		//console.debug(arguments);
		var nls = dojo.i18n.getLocalization("trm.login", "Form");
		this.trmLoginLabelUserNode.textContent=nls.username;
		this.trmLoginLabelPasswordNode.textContent=nls.password;
		this.trmLoginBtnOkNode.textContent     = nls.ok;
		this.trmLoginBtnCancelNode.textContent = nls.cancel;
	},
	startup: function() {
		console.debug("startup");
	},/*
	_onSubmit: function(e) {
		//get our translations first...
		
		var nls = dojo.i18n.getLocalization("trm.login", "Form");
		//ok, so for validation we're just going to say that
		//if the username has spaces in it, don't submit it,
		//and alert the user that their username is incorrect.
		if(this.usernameInputNode.value.indexOf(" ") != -1) {
			//ok, we need to replace the '%s' in the translation with the inputted username
			this.errorNode.textContent = nls.invalidUsername.replace("%s", this.usernameInputNode.value);
			dojo.stopEvent(e);
			return false;
		}
		else
			this.errorNode.textContent = "";
	},*/
	_cancelClick: function(e) {
		console.debug("_cancelClick");
		this.hide();
	},
	show: function() {
		this.domNode.setAttribute("class","trmLoginForm");
	},
	hide: function() {
		console.debug(this.domNode.getAttribute("class"));
		this.domNode.setAttribute("class","trmLoginForm_hidden");
	},
	_onButtonClick: function(e) {
		console.debug(e);
	}
	
});