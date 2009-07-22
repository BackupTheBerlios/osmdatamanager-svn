dojo.provide("trm.widget._TrmBaseDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");


/*
 * contains functions for all general components
 * 
 * dlg_tbItemname
 * dlg_tbLat
 * dlg_tbLon
 * dlg_spinZoomlevel
 * dlg_cmbTagname
 * dlg_taLongText
 * 
 */


dojo.declare("trm.widget._TrmBaseDialog", [trm.widget._TrmWidget, dijit._Templated], {
	widgetsInTemplate: true,
	//templatePath:    dojo.moduleUrl('trm.widget', 'UserDialog.html'),
	dataitem: null,
	isupdate: false,
	postCreate: function() {
		this.inherited(arguments);
		/*
		this.dlg_tbItemname = null;
		this.dlg_tbLat = null;
		this.dlg_tbLon = null;
		this.dlg_spinZoomlevel = null;
		this.dlg_cmbTagname = null;
		this.dlg_taLongText = null;
		*/
	},
	
	/**
	 * resets all fields
	 */
	_resetFields: function() {
		if (this.dlg_tbItemname)
			this.dlg_tbItemname.attr("value","");
		
		if (this.dlg_tbLat)
			this.dlg_tbLat.attr("value","");
		
		if (this.dlg_tbLon)
			this.dlg_tbLon.attr("value","");
			
		if (this.dlg_spinZoomlevel)
			this.dlg_spinZoomlevel.attr("value","");
		
		if (this.dlg_taLongText)
			this.dlg_taLongText.attr("value","");
		
		if (this.dlgGrp_cmbTagname) {
			this.dlg_cmbTagname.setAttribute("value","");
			for (var i = (this.dlg_cmbTagname.childNodes.length - 1); i > -1; i--) {
				var nd1 = this.dlg_cmbTagname.childNodes[i];
				this.dlg_cmbTagname.removeChild(nd1);
			}
		}
	},
	
	/**
	 * loads data into the components if a dataitem is set
	 */
	_loadData: function() {
		if (this.dataitem == null)
			return;
		
		this._resetFields();
		
		if (this.dlg_tbItemname)
			this.dlg_tbItemname.attr("value",this.dataitem.itemname);
		
		if (this.dlg_tbLat)
			this.dlg_tbLat.attr("value",this.dataitem.lat);
			
		if (this.dlg_tbLon)
			this.dlg_tbLon.attr("value",this.dataitem.lon);
		
		if (this.dlg_spinZoomlevel)
			this.dlg_spinZoomlevel.attr("value",this.dataitem.zoomlevel);
		
		if (this.dlg_taLongText)
			this.dlg_taLongText.attr("value",this.dataitem.description);
		
		
		if (this.dlgGrp_cmbTagname) {
			this.dlg_cmbTagname.setAttribute("value", this.dataitem.tagname);
			for (var i = 0; i < this.dataitem.tags.length; i++) {
				var t1 = this.dataitem.tags[i];
				var opt1 = document.createElement("option");
				opt1.innerHTML = t1.tagname;
				opt1.setAttribute("value", t1.tagname);
				if (t1.tagname.toLowerCase() == this.dataitem.tagname.toLowerCase()) 
					opt1.setAttribute("selected", "selected");
				
				this.dlg_cmbTagname.appendChild(opt1);
			}
		}
	},
	
	/**
	 * checks if all components have data
	 */
	_dataOk: function() {
		
		if (this.dlg_tbItemname) {
			if (this.dlg_tbItemname.attr("value").trim() == "")
				return false;
		}
		
		if (this.dlg_tbLat) {
			if (this.dlg_tbLat.attr("value").trim() == "")
				return false;
		}
		
		if (this.dlg_tbLon) {
			if (this.dlg_tbLon.attr("value").trim() == "")
				return false;
		}
		
		if (this.dlg_spinZoomlevel) {
			if (this.dlg_spinZoomlevel.attr("value").trim() == "")
				return false;
		}
		
		if (this.dlg_taLongText) {
			if (this.dlg_taLongText.attr("value").trim() == "")
				return false;
		}
		
		if (this.dlgGrp_cmbTagname) {
			if (this.dlgGrp_cmbTagname.attr("value").trim() == "")
				return false;
		}
					
		return true;	
	},
	
	/**
	 * returns the selected tagname
	 */
	getTagname: function() {
		if (this.dlg_cmbTagname) {
			return this.dlg_cmbTagname[this.dlg_cmbTagname.selectedIndex].value;	
		}
	},
	
	/**
	 * sets the dataitem
	 */
	setDataItem: function(item) {
		this.dataitem = item;
		isupdate = true;
	},
	
	/**
	 * sets lat lon textbox data
	 * @param {Object} latlon
	 */
	setPoint: function(latlon) {
		this.showPrevWidget = true;
		this.dlg_tbLat.attr("value",latlon.lat);
		this.dlg_tbLon.attr("value",latlon.lon);
	},
	
	/**
	 * sets zoomlevel data
	 * @param {Object} zoomlevel
	 */
	setZoomlevel: function(zoomlevel) {
		this.dlg_spinZoomlevel.attr("value",zoomlevel);	
	}
	
	
});
