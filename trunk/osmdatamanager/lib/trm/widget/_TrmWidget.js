dojo.provide("trm.widget._TrmWidget");
dojo.require("dijit._Widget");
//dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget._TrmWidget", [dijit._Widget], {
	senderWidget: null,
	postCreate: function() {
		this.inherited(arguments);
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
	_position: function(){
			// summary: position modal dialog in center of screen		
			if(dojo.hasClass(dojo.body(),"dojoMove")){ return; }
			var viewport = dijit.getViewport();
			var mb = dojo.marginBox(this.domNode);

			var style = this.domNode.style;
			style.left = Math.floor((viewport.l + (viewport.w - mb.w)/2)) + "px";
			style.top = Math.floor((viewport.t + (viewport.h - mb.h)/2)) + "px";
	}
});