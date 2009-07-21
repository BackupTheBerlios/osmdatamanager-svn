dojo.provide("trm.widget.ItemManager");
dojo.require("trm.widget._TrmWidget");
dojo.require("trm.widget.PoiDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojox.grid.DataGrid");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.ItemManager", [trm.widget._TrmWidget, dijit._Templated], {
	grid: null,
	clientapp: null,
	currentItem: null,
	widgetsInTemplate: true,
	viewMode: "",
	templatePath:    dojo.moduleUrl('trm.widget', 'ItemManager.html'),
	_gridStructure: [
		{ field: "itemname", name: "Part Number", width: 'auto',cellStyles: 'padding-left:40px' },
		{ field: "itemtype", name: "Minimum Temperature", width: "100px" }
	],
	_store: null,
	postCreate: function() {
		this.inherited(arguments);
				
		this._store = null; //new dojo.data.ItemFileReadStore({ url: "filefunctions.php?action=msg.getfiles" }); 
		this.grid = new dojox.grid.DataGrid({
					query: { itemname: '*' },
					//store: this._store,
					autoHeight: true,
					rowsPerPage: 2,
					onCellMouseOver: dojo.hitch(this,this._onCellMouseOver),
					onCellContextMenu: dojo.hitch(this,this._onCellContextMenu),
					onStyleRow: dojo.hitch(this,this._onStyleRow),
					structure: this._gridStructure
		}, this.trmItemManagerGridNode);
		
		this.popup.targetNodeIds = this.grid.domNode.id;
		this.grid.startup();
	},
	_getIconname1: function(item) {
		if (item.tags != null) {	
			for (var x = 0; x < item.tags.length; x++) {
				var tag1 = item.tags[x];
								
				if (tag1.tagname[0] == item.tagname[0]) {
					return item.tags[x].icon1;
				}
			}	
		}
		return "";
	},
	_onCellMouseOver: function(sender) {
		this.currentItem = null;
		var c1 = dojo.coords(sender.target.parentNode,true);
		if (c1) {
			
			var s1 = document.getElementById("dnd_source");
			if (s1) {
				s1.setAttribute("class","dnd_source_visible");
				s1.setAttribute("className","dnd_source_visible");
				s1.style.left = c1.x;
				s1.style.top = c1.y;
			}
			
			var img  = document.getElementById("dnd_source_image");
			var itm1 = this.grid.getItem(sender.rowIndex);
			if ((itm1) && (img)) {
				this.currentItem = itm1;
				img.setAttribute("src",this._getIconname1(itm1));
				gl_groupmanager.setDropitem(itm1);
			}	
		}
	},
	_onStyleRow: function(inrow) {
		this.popup.bindDomNode(inrow.node);
	},
	_onCellContextMenu: function(e) {
		//_onCellContextMenu
	},
	hideDndSource: function() {
		var src1 = document.getElementById("dnd_source");
		if (src1) {
			src1.setAttribute("class", "dnd_source_hidden");
			src1.setAttribute("className", "dnd_source_hidden");
		}	
	},
	_crtPoiClick: function() {
		this.poidialog.prevWidget = this;
		this.hide();
		this.poidialog.show();	
	},
	_edtPoiClick: function() {
	
	},
	_cb_delete: function() {
		if (this.viewMode.toLowerCase() == "file") {
			this.loadGpxFiles();
		}
		if (this.viewMode.toLowerCase() == "poi") {
			this.loadPois();
		}
	},
	_delClick: function() {
		if ((this.currentItem) && (this.clientapp)) {
			var cb = {
				target: this,
				func: this._cb_delete
			}
			console.debug(this.currentItem[0]);
			if (this.currentItem.itemtype[0].toLowerCase() == "poi") {
				this.clientapp.deletePoi(this.currentItem,cb);
			}
			if (this.currentItem.itemtype[0].toLowerCase() == "file") {
				this.clientapp.deleteFile(this.currentItem,cb);
			}
		}
	},
	loadPois: function() {
		this.hideDndSource();
		this.viewMode = "poi";
		this._store = new dojo.data.ItemFileReadStore({ url: "poifunctions.php?action=msg.getpois" });
				
		if (this.grid != null) {
			this.grid.setStore(this._store);
			this.grid.update();
		}
	},
	loadGpxFiles: function() {		
		this.hideDndSource();		
		this.viewMode = "file";
		this._store = new dojo.data.ItemFileReadStore({ url: "filefunctions.php?action=msg.getfiles" });
		
		if (this.grid != null) {
			this.grid.setStore(this._store);
			this.grid.update();
		}
	},
	_okClick: function(e) {
		this.inherited(arguments);
	},
	show: function() {
		this.inherited(arguments);
		this.loadGpxFiles();
	},
	hide:function() {
		this.inherited(arguments);
		this.hideDndSource();
		this.currentItem = null;
	}
});