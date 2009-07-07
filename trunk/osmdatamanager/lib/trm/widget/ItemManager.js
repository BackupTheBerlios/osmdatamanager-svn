dojo.provide("trm.widget.ItemManager");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojox.grid.DataGrid");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.ItemManager", [trm.widget._TrmWidget, dijit._Templated], {
	grid: null,
	widgetsInTemplate: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'ItemManager.html'),
	_gridStructure: [
		{ field: "itemname", name: "Part Number", width: 'auto' },
		{ field: "itemtype", name: "Minimum Temperature", width: "100px" }
	],
	_store: null,
	postCreate: function() {
		this.inherited(arguments);
		this.domNode.setAttribute("class","trmItemManager_hidden trmDialog");
		//this.grid = new dojox.grid.DataGrid(null,this.trmItemManagerGridNode);
		
		this._store = null; //new dojo.data.ItemFileReadStore({ url: "filefunctions.php?action=msg.getfiles" }); 
					
		this.grid = new dojox.grid.DataGrid({
					query: { itemname: '*' },
					//store: this._store,
					autoHeight: true,
					onCellMouseOver: dojo.hitch(this,this._onCellMouseOver),
					structure: this._gridStructure
		}, this.trmItemManagerGridNode);
		
		this.popup.targetNodeIds = this.grid.domNode.id;
		
		//var jsonStore = new dojo.data.ItemFileReadStore({ url: "filefunctions.php?action=msg.getfiles" });
		//this.grid.setStore(jsonStore);
		this.grid.startup();
		console.debug(this.grid.domNode);
	},
	_getIconname1: function(item) {
		if (item.tags != null) {
			
			return item.tags[3].icon1;
			
			for (var x = 0; x < item.tags.length; x++) {
				var tag1 = item.tags[x];
				
				console.debug(item.tags[x].tagname);
				console.debug(item.tagname);
				if (tag1.tagname == item.tagname) {
					return item.tags[x].icon1;
				}
			}	
		}
		return "";
	},
	_onCellMouseOver: function(sender) {
		console.debug(sender.target);
		console.debug(this);
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
				console.debug(itm1);
				img.setAttribute("src",this._getIconname1(itm1));
				gl_groupmanager.setDropitem(itm1);
			}
			
		}
	},
	hideDndSource: function() {
		var src1 = document.getElementById("dnd_source");
		if (src1) {
			src1.setAttribute("class", "dnd_source_hidden");
			src1.setAttribute("className", "dnd_source_hidden");
		}	
	},
	loadPois: function() {
		this.hideDndSource();
		
		/*
		if (this._store != null)
			this._store.destroy();
		*/
		
		this._store = new dojo.data.ItemFileReadStore({ url: "poifunctions.php?action=msg.getpois" });
		/*
		this._store.url = "poifunctions.php?action=msg.getpois";
		
		this._store.fetch({
			query: {
				itemname: '*'
			}
		});
		*/
		
		if (this.grid != null) {
			this.grid.setStore(this._store);
			this.grid.update();
		}
	},
	loadGpxFiles: function() {
		console.debug("show");
		console.debug(this.grid);
		
		this.hideDndSource();
				
		this._store = new dojo.data.ItemFileReadStore({ url: "filefunctions.php?action=msg.getfiles" });
		
		/*
		if (this._store != null)
			this._store.destroy();
		
		
		*/
		/*
		this._store.url = "filefunctions.php?action=msg.getfiles";
		
		
		s1.fetch({
			query: {
				itemname: '*'
			}
		})
		*/
		//var grid = dijit.byId('dlgfilelist_tab_grid');
		if (this.grid != null) {
			this.grid.setStore(this._store);
			this.grid.update();
			//s1.destroy();
		}
	},
	_cancelClick: function(e) {
		this.hide();
	},
	_okClick: function(e) {
		console.debug("_ok");
	},
	show: function() {
		console.debug("show");
		this._position();
		this.domNode.setAttribute("class","trmItemManager trmDialog");
		console.debug(this.grid);
		this.loadGpxFiles();
	},
	hide: function() {
		console.debug(this.domNode.getAttribute("class"));
		this.hideDndSource();
		this.domNode.setAttribute("class","trmItemManager_hidden trmDialog");
	}
		
});