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

dojo.provide("trm.widget.InfoDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.InfoDialog", [trm.widget._TrmBaseDialog], {
	widgetsInTemplate: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'InfoDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_cancelClick: function(e) {
		this.inherited(arguments);
	},
	_okClick: function(e) {
		//this.inherited(arguments);
		this.hide();
	},
	show: function(infotext) {
		this.inherited(arguments);
		this.dlg_lblInfo.innerHTML = infotext;
	},
	hide: function() {
		this.inherited(arguments);
	}
		
});