dojo.provide("trm.widget.PoiDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");


dojo.declare("trm.widget.PoiDialog", [trm.widget._TrmBaseDialog], {
	storedata: true,  //if set to true the dialog stores poidata by itself using the poimanager
	templatePath:    dojo.moduleUrl('trm.widget', 'PoiDialog.html'),
	onOkClick: function(data) {
		
	},
	
	onUpdatePoi: function(poi) {
		
	},
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	_cb_createPoi: function(response, ioArgs) {
		this.hide();	
	},
	
	_cb_updatePoi: function(response, ioArgs) {
		if (response != "msg.failed") {
			this.onUpdatePoi(response);
		}
		this.hide();	
	},
	
	_okClick: function(e){
	  this.inherited(arguments);
	  
	  if (this._dataOk()) {
	  		var data = this.getData();
						
			if (this.storedata) { //if storedata is true, the dialog will execute the serverside functions
				var pm = new PoiManager();
				
				if (this.dataitem) {
					var cb = {
						func: this._cb_updatePoi,
						target: this
					}
					pm.updatePoi(this.dataitem.itemid, data.itemname, data.description, data.lat, data.lon, data.tagname, data.zoomlevel, cb);
				}
				else {
					var cb = {
						func: this._cb_createPoi,
						target: this
					}
					pm.createPoi(data.itemname, data.description, data.lat, data.lon, data.tagname, data.zoomlevel, cb);
				}	
			} else {
				this.onOkClick(data);
			}
	  } else {
	  	 if (this.nls) {
		 	alert(this.nls["entervaliddata"]);
		 }
	  }
	},
	
	show: function(isupdate) {
		this.inherited(arguments);
		if (this.onlyshow) {
			this._setTag(this.dataitem.tagname);
			//this.inherited(arguments);
			return;
		}
		
		if (isupdate) {
			this._loadData();
		} else {
			this._resetFields();
			this.dataitem = null;
		}
		
	}
		
});
