dojo.provide("trm.translation.tt");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.translation.tt", [dijit._Widget], {
	field: "empty",
	translation: "empty",
	postCreate: function() {
		console.debug(arguments);
		this.inherited(arguments);
		console.debug(this.domNode.innerHTML);
		console.debug("pc");
		var nls = dojo.i18n.getLocalization("trm.translation", "tt");
		
		console.debug(this.field);
		console.debug(nls[this.field]);
		this.domNode.textContent = nls[this.field];
		this.translation = nls[this.field];
		console.debug(this.domNode.innerHTML);
					
		//Now, we need to get the translations
		//console.debug(arguments);
		/*
		
		this.trmLoginLabelUserNode.textContent=nls.username;
		this.trmLoginLabelPasswordNode.textContent=nls.password;
		this.trmLoginBtnOkNode.textContent     = nls.ok;
		this.trmLoginBtnCancelNode.textContent = nls.cancel;
		*/
	},
	preamble: function(){
			console.log("preamble - args:", arguments);
			console.log("preamble - args:", arguments[0].field);
			/*
			arguments[0].name = 
				arguments[0].prefix + arguments[0].suffix;
				
			*/
	},
	constructor: function(){
			console.debug("constructor (", 
				this.name, ") - args:", arguments);
		},
	postMixInProperties: function(){
		//console.debug(this.domNode.innerHTML);
	},
	startup: function() {
		console.debug("startup");
		console.debug(this.domNode.innerHTML);
	}
});