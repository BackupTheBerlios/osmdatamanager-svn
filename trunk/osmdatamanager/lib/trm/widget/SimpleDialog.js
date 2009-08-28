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
		
		if (this.application) {	
			this.application.displayItem(response);
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
			
		pm.createPoiInGroup(data.itemname,data.description,data.lat,data.lon,"user",12,"Demogroup1",cb);
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