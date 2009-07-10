dojo.provide("trm.widget._TrmWidget");
dojo.require("dijit._Widget");
//dojo.require("dijit._Templated");
dojo.require("dojo.parser");
//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget._TrmWidget", [dijit._Widget], {
	senderWidget: null,
	prevWidget: null,
	showPrevWidget: true,
	onGetPoint: function(sender) {
		console.debug(sender);
	},
	onZoomlevelClick: function(sender) {
		console.debug(sender);
	}, 
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
	},
	_changeCssClass: function(fromclass, toclass) {
		var cls = this.domNode.getAttribute("class");
		if (cls) {
			console.debug(cls);
			var lst1 = cls.split(" ");
			if (lst1) {
				var rslt = "";
				for (var i=0;i<lst1.length;i++) {
					var v1 =  lst1[i];
					console.debug(v1);
					if (v1.toLowerCase() == fromclass.toLowerCase()) {
					  rslt = rslt + " " + toclass;
					} else {
						rslt = rslt + " " + v1;
					}
				}
				console.debug(rslt);
				this.domNode.setAttribute("class",rslt);
				return;
			}
		}
		this.domNode.setAttribute("class","trmVisible");
	},
	_zoomLevelClick: function() {
		console.debug("_zoomLevelClick");
		this.onZoomlevelClick(this);
	},
	_getPointClick: function() {
		console.debug("_getPointClick");
		this.showPrevWidget = false;
		this.onGetPoint(this);
	},
	_cancelClick: function(e) {
		this.hide();
	},
	_okClick: function(e) {
		console.debug("_ok_");
	},
	show: function() {
		this._changeCssClass("trmHidden","trmVisible");
		this._position();
	},
	hide: function() {
		this._changeCssClass("trmVisible","trmHidden");
		if ((this.prevWidget) && (this.showPrevWidget)) {
			this.prevWidget.show();
		}
	}
	
	
});