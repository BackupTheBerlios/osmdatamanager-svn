dojo.provide("trm.widget.GroupDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.GroupDialog", [trm.widget._TrmBaseDialog], {
	onOkClick: function(data) {
		
	},
	templatePath:    dojo.moduleUrl('trm.widget', 'GroupDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_getProtection: function() {
		var val = "private";
		/*
		if (dijit.byId('dlgcreategroup_rd_private').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_private').value;
		
		if (dijit.byId('dlgcreategroup_rd_protected').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_protected').value;
		  
		if (dijit.byId('dlgcreategroup_rd_public').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_public').value;
		*/	   
		return val;	
	},
	_dataOk: function() {
		this.inherited(arguments);
		if (this.dlg_tbItemname) {
			if (this.dlg_tbItemname.attr("value").trim() == "")
				return false;
		}		
		return true;
	},
	_okClick: function(e) {
		this.inherited(arguments);
		
		
		var data = this.getData();
		alert(data.itemid);
		alert(data.parentid);
		console.debug(data);
		return;
		if (this._dataOk()) {
			var data = this.getData();
			console.debug(data);
			//this.onOkClick(data);
			
			
			/*
			var itemid = -1;
			if (this.group)
				itemid = this.group.itemid;
			
			var itemname = this.dlgGrp_tbDescription.attr("value");
			var lat = this.dlgGrp_tbLat.attr("value");
			var lon = this.dlgGrp_tbLon.attr("value");
			var zoomlevel = this.dlgGrp_spinZoomlevel.attr("value");
			var protection = this._getProtection();
			var tagname = this._getTagname();
			var parentid = -1;
			if (this.parentgroup) {
				parentid = this.parentgroup.itemid;
			}
			
			this.onOkClick({
				"itemid": itemid,
				"parentid": parentid,
				"itemname": itemname,
				"lat": lat,
				"lon": lon,
				"zoomlevel": zoomlevel,
				"protection": protection,
				"tagname": tagname
			});
			*/
		} else {
			if (this.nls) {
		 		alert(this.nls["entervaliddata"]);
		 	}
		}
	},
	_loadGroupData: function() {
		/*
		if (this.group == null)
			return;
		
		this._resetFields();	
		this.dlgGrp_tbDescription.attr("value",this.group.itemname);
		this.dlgGrp_tbLat.attr("value",this.group.lat);
		this.dlgGrp_tbLon.attr("value",this.group.lon);
		this.dlgGrp_spinZoomlevel.attr("value",this.group.zoomlevel);
		
		this.dlgGrp_cmbTagname.setAttribute("value",this.group.tagname);
		for (var i=0;i<this.group.tags.length;i++) {
			var t1 = this.group.tags[i];
			var opt1 = document.createElement("option");
			opt1.innerHTML = t1.tagname;
			opt1.setAttribute("value",t1.tagname);
			if (t1.tagname.toLowerCase() == this.group.tagname.toLowerCase())
			  opt1.setAttribute("selected","selected");
			
			this.dlgGrp_cmbTagname.appendChild(opt1);
		}
		*/
	},
	/*
	setGroup: function(group) {
		this.group = group;
		this._loadGroupData();
	},
	*/
	
	show: function(update,root) {
		this.inherited(arguments);
		
		if (update) {
			this._loadData();
			this.dlgGrp_tblUpdate.setAttribute("class", "table_update");
		} else {
			this._resetFields();
			this.dataitem = null;
			this.dlgGrp_tblUpdate.setAttribute("class", "table_update_hidden");
			if (root)
				this.parentgroup = null;
		}
		
		/*
		this.isUpdate = update;
				
		if (this.isUpdate) {
			this.dlgGrp_tblUpdate.setAttribute("class", "table_update");
		}
		else {
			this._resetFields();
			this.group = null;
			if (root)
				this.parentgroup = null;
			
			this.dlgGrp_tblUpdate.setAttribute("class", "table_update_hidden");
		}
		*/
	}
		
});