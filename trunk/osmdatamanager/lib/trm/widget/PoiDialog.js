dojo.provide("trm.widget.PoiDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");
//dijit._Templated

dojo.declare("trm.widget.PoiDialog", [trm.widget._TrmBaseDialog], {
	storedata: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'PoiDialog.html'),
	onOkClick: function(data) {
		
	},
	postCreate: function() {
		this.inherited(arguments);
		//this.domNode.setAttribute("class","trmPoiDialog_hidden trmDialog");
	},
	/*
	_dataOk: function() {
		
		if (this.dlgPoi_tbDescription.attr("value").trim() == "")
				return false;
		
		if (this.dlgPoi_tbLat.attr("value").trim() == "")
				return false;
		
		if (this.dlgPoi_tbLon.attr("value").trim() == "")
				return false;
		
		if (this._getTagname() == "")
				return false;
				
		return true;
		
		return true;
	},
	*/
	_cb_createPoi: function(response, ioArgs) {
		this.hide();	
	},
	_okClick: function(e){
	  this.inherited(arguments);
	  
	  if (this._dataOk()) {
	  		var itemname 	= this.dlgPoi_tbDescription.attr("value");
			var lat 		= this.dlgPoi_tbLat.attr("value");
			var lon 		= this.dlgPoi_tbLon.attr("value");
			var zoomlevel 	= this.dlgPoi_spinZoomlevel.attr("value");
			var tagname 	=   this._getTagname();
			var htmltext 	=   this.dlgPoi_tbHtmlText.attr("value");
			
			if (this.storedata) {
				var pm = new PoiManager();
				//function(poiname, description, lat,lon,cb) {
				if (this.poiitem) {
					var cb = {
						func: this._cb_createPoi,
						target: this
					}
					//function(poiid,poiname, description,lat,lon,tagname,zoomlevel,cb) {
					pm.updatePoi(this.poiitem.itemid, itemname, htmltext, lat, lon, tagname, zoomlevel, cb);
				}
				else {
					var cb = {
						func: this._cb_createPoi,
						target: this
					}
					pm.createPoi(itemname, htmltext, lat, lon, tagname, zoomlevel, cb);
				}
			}
			else {
			
				this.onOkClick({
					"itemname": itemname,
					"lat": lat,
					"lon": lon,
					"zoomlevel": zoomlevel,
					"tagname": tagname,
					"htmltext": htmltext
				});
			}
	  }
	},
	
	_loadData: function() {
		this.inherited(arguments);
		
		/*
		if (this.poiitem == null)
			return;
		
		this._resetFields();
		this.dlgPoi_tbDescription.attr("value",this.poiitem.itemname);
		this.dlgPoi_tbLat.attr("value",this.poiitem.lat);
		this.dlgPoi_tbLon.attr("value",this.poiitem.lon);
		this.dlgPoi_spinZoomlevel.attr("value",this.poiitem.zoomlevel);
		this.dlgPoi_tbHtmlText.attr("value",this.poiitem.description);
		//this.dlgPoi_tbTagname.attr("value",this.poiitem.tagname);
		this.dlgPoi_cmbTagname.setAttribute("value",this.poiitem.tagname);
		for (var i=0;i<this.poiitem.tags.length;i++) {
			var t1 = this.poiitem.tags[i];
			var opt1 = document.createElement("option");
			opt1.innerHTML = t1.tagname;
			opt1.setAttribute("value",t1.tagname);
			if (t1.tagname.toLowerCase() == this.poiitem.tagname.toLowerCase())
			  opt1.setAttribute("selected","selected");
			
			this.dlgPoi_cmbTagname.appendChild(opt1);
		}
		*/
		
	},
	
	show: function(isupdate) {
		if (!isupdate) {
			this._resetFields();
			this.poiitem = null;
		}
		this.inherited(arguments);
	}
	
	/*
	show: function() {
		console.debug("show");
		this._position();
		this.domNode.setAttribute("class","trmPoiDialog trmDialog");
	},
	hide: function() {
		console.debug(this.domNode.getAttribute("class"));
		this.domNode.setAttribute("class","trmPoiDialog_hidden trmDialog");
		if (this.prevWidget != null)
			this.prevWidget.show();
	}
	*/
		
});
