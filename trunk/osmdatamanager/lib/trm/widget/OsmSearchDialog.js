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


dojo.provide("trm.widget.OsmSearchDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dojo.parser");
//dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.widget.SortList");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.dtl.filter.strings");


dojo.declare("trm.widget.OsmSearchDialog", [trm.widget._TrmBaseDialog], {
	templatePath:    dojo.moduleUrl('trm.widget', 'OsmSearchDialog.html'),
	
	postCreate: function() {
		this.inherited(arguments);
		this.searcher = new OsmSearcher();
		this.issearching = false;
		this.findname = "";
		var myData = { identifier: 'id',
			label: 'name',
			items: []};
			
		
		this.store = new dojo.data.ItemFileWriteStore({data:myData,clearOnClose: true,urlPreventCache: false});
		
		this._gridStructure = [
			{ field: "name", name: this.nls["itemname"], width: 'auto' },
			{ field: "info", name: this.nls["itemtype"], width: "100px" },
			{ field: "nearby", name: this.nls["nearby"], width: "100px" }
		] 
		
		this.grid = new dojox.grid.DataGrid({
					query: { name: '*' },
					store: this.store,
					autoHeight: false,
					elasticView: false,
					height: 300,
					width:600,
					//rowsPerPage: 2,
					//onCellMouseOver: dojo.hitch(this,this._onCellMouseOver),
					//onCellContextMenu: dojo.hitch(this,this._onCellContextMenu),
					//onStyleRow: dojo.hitch(this,this._onStyleRow),
					onRowDblClick: dojo.hitch(this,this._onRowDblClick),
					structure: this._gridStructure
		}, this.dlg_gridResult);
		this.grid.startup();
	},
	_cancelClick: function(e) {
		this.inherited(arguments);
	},
	_okClick: function(e) {
		this.inherited(arguments);
	},
	
	_getInfotext: function(item) {
	  var result = "";
	  
	  if (item.name != "")
	    result += "<b>"+item.name+"</b><br/><br/>";
	
	  if (item.description != "")
	    result += item.description+"<br/><hr><br/>";
		
	  if (item.is_in != "")
	    result += item.is_in;
			
	  return result;
	},
	
	_onRowDblClick: function(sender) {
		var itm1 = this.grid.getItem(sender.rowIndex);
		if (itm1) {
		  if (this.application) {
		  	this.application.createPoi(itm1.lat,itm1.lon,16,this._getInfotext(itm1),itm1.itemid);
		  }
		}
	},
	
	_setTranslations: function() {
		this.inherited(arguments);
		
		if (this.nls) {
			try {
				if (this.dlg_lblSearchtext) 
					this.dlg_lblSearchtext.innerHTML = this.nls["searchtext"];
					
				if (this.dlg_btnSearch) 
					this.dlg_btnSearch.containerNode.innerHTML = this.nls["search"];
			} 
			catch (e) {
				console.error(e);
			}
		}
	},
	
	/**
	 * clears the store => clear grid
	 */
	_clearStore: function() {
		if (this.issearching) 
			return;
		
		if (this.grid.store._arrayOfAllItems.length < 1)
			return;
		
		this.grid.store.save();
		this.store.close();
		this.grid._refresh();
	},
	
	_getNearestPlaces: function(item) {
	  var result = "";	
	  
	  var lst1 = dojo.query("> nearestplaces", item);
	  if (lst1.length == 0)
	  	lst1 = dojo.query("> places", item);
		
	  if (lst1.length > 0) {
	    var lst2 = dojo.query("> named", lst1[0]);
		if (lst2.length > 0) {
			for (var i = 0; i < lst2.length; i++) {
				var itm1 = lst2[i];
				var itemname = itm1.getAttribute("name");
				if (i == 0) {
					result += itemname;
				} else {
					result += ", " + itemname;
				}
			}
		}
	  }
	  
	  return result;
	},
	
	/**
	 * callback after search
	 * @param {Object} result
	 */
	_cb_Search: function(result) {
		try {
			var l1 = this.searcher.getResultList();
			var c1 = this.searcher.getFirstChild();
			var findname = "";
			if (c1 != null) {
				findname = c1.getAttribute("findname");
			}
			
			if (l1 != null) {
				for (var i = 0; i < l1.length; i++) {
					var itm1 = l1[i];
					
					var itemname = itm1.getAttribute("name");
					var itemid = itm1.getAttribute("id");
					var infotext = itm1.getAttribute("info");
					var lat = itm1.getAttribute("lat");
					var lon = itm1.getAttribute("lon");
					
					var description = "";
					var d1 = dojo.query("> description",itm1);
					if (d1.length > 0)
					  var description = d1[0].textContent;
										
					var is_in = itm1.getAttribute("is_in");
					var nearby = this._getNearestPlaces(itm1);
										
					this.grid.store.newItem({
						name: itemname,
						info: infotext,
						lat: lat,
						lon: lon,
						itemid: itemid,
						description: description,
						is_in: is_in,
						nearby: nearby,
						value: "4",
						id: "__" + i.toString()
					}, null);
				}
			}
			this.dlg_lblHitcount.innerHTML = String(l1.length) + " Hits for " + findname;
			this.issearching = false;
		} catch(e) {
			console.error(e);
			this.dlg_lblHitcount.innerHTML = "";
			this.issearching = false;
		}
	},
	
	/**
	 * called when the search button is clicked
	 * @param {Object} e
	 */
	_searchClick: function(e) {
		if (this.issearching) 
			return;
			
		this._clearStore();
		this.issearching = true;
		this.dlg_lblHitcount.innerHTML = "searching, please wait...";
		
		var searchtext = document.getElementById(this.dlg_tbSearchtext.id).value.trim();
		if (searchtext != "") {
			this.searcher.search(String(searchtext), dojo.hitch(this,this._cb_Search));
		} else {
			this.issearching = false;
		}
	},
	
	/**
	 * shows the searchdialog, if there is a previous search result, this will be displayed
	 */
	show: function() {
		this.inherited(arguments);
		this.issearching = false;
		
		if (this.searcher.searchresult != null) {
			this._clearStore();
			this._cb_Search(null);	
		}
	},
	hide: function() {
		this.inherited(arguments);
	}
		
});
