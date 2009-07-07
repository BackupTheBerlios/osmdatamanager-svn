dojo.provide("trm.widget._TrmWidget");
dojo.require("dijit._Widget");
//dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget._TrmWidget", [dijit._Widget], {
	senderWidget: null,
	postCreate: function() {
		this.inherited(arguments);
		dojo.body().appendChild(this.domNode);
	},
		/**
		 * loadFromServer
		 * @param {Object} targetfile
		 * @param {Object} params
		 * @param {Object} callBack
		 */
	loadFromServer: function(targetfile, params, callBack){
			try {
				dojo.xhrPost({ //
					// The following URL must match that used to test the server.
					url: targetfile,
					handleAs: "json",
					content: params,
					timeout: 5000, // Time in milliseconds
					// The LOAD function will be called on a successful response.
					load: dojo.hitch(this, callBack),
					
					// The ERROR function will be called in an error case.
					error: function(response, ioArgs){ //
						alert(response);
						console.error("HTTP status code: ", ioArgs.xhr.status); //
						return response; //
					}
				});
			} 
			catch (e) {
				//alert(e);
				console.error(e);
			}
	},
	layout: function(node){
		// summary: Sets the background to the size of the viewport
		//
		// description:
		//	Sets the background to the size of the viewport (rather than the size
		//	of the document) since we need to cover the whole browser window, even
		//	if the document is only a few lines long.

		var viewport = dijit.getViewport();
		var is = this.node.style;
		var	os = this.domNode.style;

		os.top = viewport.t + "px";
		os.left = viewport.l + "px";
		is.width = viewport.w + "px";
		is.height = viewport.h + "px";

		// process twice since the scroll bar may have been removed
		// by the previous resizing
		var viewport2 = dijit.getViewport();
		if(viewport.w != viewport2.w){ is.width = viewport2.w + "px"; }
		if(viewport.h != viewport2.h){ is.height = viewport2.h + "px"; }
	},
	_position: function(){
			// summary: position modal dialog in center of screen		
			if(dojo.hasClass(dojo.body(),"dojoMove")){ return; }
			
			var viewport = dijit.getViewport();
			console.debug(viewport);
			var mb = dojo.marginBox(this.domNode);
			console.debug(this.domNode);
			console.debug(mb);
			var style = this.domNode.style;
			style.left = Math.floor((viewport.l + (viewport.w - mb.w)/2)) + "px";
			style.top = Math.floor((viewport.t + (viewport.h - mb.h)/2)) + "px";
	}
});