dojo.provide("trm.widget.SimpleDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dojo.parser");

dojo.declare("trm.widget.SimpleDialog", [trm.widget._TrmBaseDialog], {
	templatePath:    dojo.moduleUrl('trm.widget', 'SimpleDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_cancelClick: function(e) {
		this.inherited(arguments);
	},
	
	_cb_crtPoi: function(response, ioArgs) {
		console.debug(response);
		
		if (gl_application) {	
			gl_application.displayItem(response);
			this.hide();
		}
	},
	
	_okClick: function(e) {
		//this.inherited(arguments);
		if (! this._dataOk()) {
			alert("please enter valid data");
			return;
		}
		
		var data = this.getData();
		console.debug(data);
				
		var pm = new PoiManager();
		//pm.createPoiInGroup: function(poiname, description, lat,lon,tagname,zoomlevel,groupname,cb) {
		var cb = {
			target: this,
			func: this._cb_crtPoi
		}
			
		pm.createPoiInGroup(data.itemname,data.description,data.lat,data.lon,"user",12,"SimpleMap",cb);
	},
	show: function() {
		this.inherited(arguments);
		
		if (!this.onlyshow)
			this._resetFields(); 
		
	},
	hide: function() {
		this.inherited(arguments);
	}
		
});