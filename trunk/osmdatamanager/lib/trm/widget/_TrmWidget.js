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

dojo.provide("trm.widget._TrmWidget");
dojo.require("dijit._Widget");
//dojo.require("dijit._Templated");
dojo.require("dojo.parser");
//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget._TrmWidget", [dijit._Widget], {
	senderWidget: null,
	callback: null,
	clientane: "",
	application: null,
	onGetPoint: function(sender) {
		
	},
	onZoomlevelClick: function(sender) {
		
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
				if (this.application) {
					if (this.application.clientname != "") {
						params["clientname"] = this.application.clientname;
					}
				}
				
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
				console.error(e);
			}
	},
	
	_cb_standard: function(response, ioArgs) {
		try {		
			if (response != "msg.failed")
			{
				if (this.callback != null) {
					this.callback.func.apply(this.callback.target, [response, ioArgs]);
				}
				
			}
		} catch (e)
		{console.error(e);}
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
			var mb = dojo.marginBox(this.domNode);
			var style = this.domNode.style;
			style.left = Math.floor((viewport.l + (viewport.w - mb.w)/2)) + "px";
			style.top = Math.floor((viewport.t + (viewport.h - mb.h)/2)) + "px";
	},
	_changeCssClass: function(fromclass, toclass) {
		var cls = this.domNode.getAttribute("class");
		if (cls) {
			var lst1 = cls.split(" ");
			if (lst1) {
				var rslt = "";
				for (var i=0;i<lst1.length;i++) {
					var v1 =  lst1[i];
					if (v1.toLowerCase() == fromclass.toLowerCase()) {
					  rslt = rslt + " " + toclass;
					} else {
						rslt = rslt + " " + v1;
					}
				}
				this.domNode.setAttribute("class",rslt);
				return;
			}
		}
		this.domNode.setAttribute("class","trmVisible");
	},
	_zoomLevelClick: function() {
		this.onZoomlevelClick(this);
	},
	_getPointClick: function() {
		this.onGetPoint(this);
	},
	_cancelClick: function(e) {
		this.hide();
	},
	_okClick: function(e) {
		
	},
	show: function() {
		if (this.application) {
			if (this.application.opendialogs.length > 0) {
				var dlg = this.application.opendialogs.pop();
				dlg.hide();
			}
			
			this.application.opendialogs.push(this);
		}
		
		this._changeCssClass("trmHidden","trmVisible");
		this._position();
	},
	hide: function() {
		this._changeCssClass("trmVisible","trmHidden");
		
		if (this.application) {
			//this.application.opendialogs.push(this);
			this.application.opendialogs.pop();
			if (this.application.opendialogs.length > 0) {
				var dlg = this.application.opendialogs.pop();
				dlg.show();
			}
		}
	}
	
	
});