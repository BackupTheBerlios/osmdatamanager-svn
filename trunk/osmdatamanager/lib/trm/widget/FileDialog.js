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

dojo.provide("trm.widget.FileDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

dojo.declare("trm.widget.FileDialog", [trm.widget._TrmBaseDialog], {
	storedata: true,
	onOkClick: function(data) {
		
	},
	templatePath:    dojo.moduleUrl('trm.widget', 'FileDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_dataOk: function() {
		return true;
	},
	
	_setTranslations: function() {
		this.inherited(arguments);
		
		if (this.nls) {
			if (this.dlg_lblFilename) 
				this.dlg_lblFilename.innerHTML = this.nls["filename"];
		}
	},
	
	_updateOk: function(item) {
		//console.debug(item);
		if (this.application) {
			this.application._updateitem(item);
		}
		this.hide();
	},
		
	_okClick: function(e) {
		//this.inherited(arguments);
		var data = this.getData();
		if (this._dataOk()) {
			var data = this.getData();
						
			if (this.storedata) {
					var params = {
					"action": "msg.updatefile",
					"itemid": data.itemid,
					"itemname": data.itemname,
					"zoomlevel": data.zoomlevel,
					"lat":data.lat,
					"lon":data.lon,
					"tagname":data.tagname
				}
				var cb = {
					target: this,
					func: this._updateOk
				}
				
				this.callback = cb;
				this.loadFromServer("filefunctions.php", params,this._cb_standard);
			}
			else {
			
				this.onOkClick(data);
			}
		} else {
			if (this.nls) {
		 		alert(this.nls["entervaliddata"]);
		 	}
		}
	},
	
	_resetFields: function() {
		this.inherited(arguments);
		
		if (this.dlg_tbFilename)
			this.dlg_tbFilename.attr("value","");
	},
	
	_loadData: function() {
		this.inherited(arguments);
		
		if (this.dataitem == null)
			return;
			
		if (this.dlg_tbFilename)
			this.dlg_tbFilename.attr("value",this.dataitem.filename);
			
	},
	
	show: function(update,root) {
		this.inherited(arguments);
		if (this.onlyshow) {
			this._setTag(this.dataitem.tagname);
			return;
		}
		
		if (update) {
			this.parentitem = null;
			this._loadData();
		} else {
			this._resetFields();
			this.dataitem = null;
			if (root)
				this.parentitem = null;
		}
	}
});