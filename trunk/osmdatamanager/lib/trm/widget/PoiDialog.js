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
		this._resetFields();
		this.hide();	
	},
	
	_cb_updatePoi: function(response, ioArgs) {
		if (response != "msg.failed") {
			this.onUpdatePoi(response);
		}
		this._resetFields();
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
			if (this.dataitem) {
				this._setTag(this.dataitem.tagname);
			//this.inherited(arguments);
			} else {
				this._setTag("standard_poi");
			}
			return;
		}
		
		if (isupdate) {
			this._loadData();
		} else {
			this._resetFields();
			this._setTag("standard_poi");
			this.dataitem = null;
		}
	}
		
});
