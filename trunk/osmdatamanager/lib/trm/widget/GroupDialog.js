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

dojo.provide("trm.widget.GroupDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

dojo.declare("trm.widget.GroupDialog", [trm.widget._TrmBaseDialog], {
	onOkClick: function(data) {
		
	},
	templatePath:    dojo.moduleUrl('trm.widget', 'GroupDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	
	/**
	 * 
	 */
	_dataOk: function() {
		//this.inherited(arguments);
		if (! this.isupdate) {
			if (this.dlg_tbItemname) {
				if (this.dlg_tbItemname.attr("value").trim() == "") 
					return false;
			}
			return true;
		} else {
			return this.inherited(arguments);
		}
	},
	
	/**
	 * 
	 * @param {Object} e
	 */
	_okClick: function(e) {
		//this.inherited(arguments);
		var data = this.getData();
		if (this._dataOk()) {
			var data = this.getData();
			this.onOkClick(data);
		} else {
			if (this.nls) {
		 		alert(this.nls["entervaliddata"]);
		 	}
		}
	},
	
	/**
	 * 
	 */
	_setTranslations: function() {
		this.inherited(arguments);
		
		if (this.nls) {
			if (this.dlgcreategroup_lbl_private) 
				this.dlgcreategroup_lbl_private.innerHTML = this.nls["private"];
			
			if (this.dlgcreategroup_lbl_friend) 
				this.dlgcreategroup_lbl_friend.innerHTML = this.nls["friend"];
				
			if (this.dlgcreategroup_lbl_public) 
				this.dlgcreategroup_lbl_public.innerHTML = this.nls["public"];		
		}
	},
	
	/**
	 * 
	 * @param {Object} update
	 * @param {Object} root
	 */
	show: function(update,root) {
		this.inherited(arguments);
		if (this.onlyshow) {
			this._setTag(this.dataitem.tagname);
			return;
		}
		
		if (update) {
			this.parentitem = null;
			this._loadData();
			this.dlgGrp_tblUpdate.setAttribute("class", "table_update");
		} else {
			this._resetFields();
			this.dataitem = null;
			this.dlgGrp_tblUpdate.setAttribute("class", "table_update_hidden");
			if (root)
				this.parentitem = null;
		}
	}
});