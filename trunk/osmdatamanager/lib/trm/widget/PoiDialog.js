dojo.provide("trm.widget.PoiDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");


dojo.declare("trm.widget.PoiDialog", [trm.widget._TrmBaseDialog], {
	storedata: true,  //if set to true the dialog stores poidata by itself using the poimanager
	templatePath:    dojo.moduleUrl('trm.widget', 'PoiDialog.html'),
	onOkClick: function(data) {
		
	},
	postCreate: function() {
		this.inherited(arguments);
	},
	_cb_createPoi: function(response, ioArgs) {
		this.hide();	
	},
	_okClick: function(e){
	  this.inherited(arguments);
	  
	  if (this._dataOk()) {
	  		var data = this.getData();
						
			if (this.storedata) {
				var pm = new PoiManager();
				
				if (this.dataitem) {
					var cb = {
						func: this._cb_createPoi,
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
		if (isupdate) {
			this._loadData();
		} else {
			this._resetFields();
			this.dataitem = null;
		}
		this.inherited(arguments);
	}
		
});
