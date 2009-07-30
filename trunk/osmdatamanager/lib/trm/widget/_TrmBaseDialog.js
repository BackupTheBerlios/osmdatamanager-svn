dojo.provide("trm.widget._TrmBaseDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");
dojo.requireLocalization("trm.translation", "tt");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.Textarea");


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
	parentitem: null,
	isupdate: false,
	nls: null,
	onlyshow: false,
	postCreate: function() {
		this.inherited(arguments);
		this.nls = dojo.i18n.getLocalization("trm.translation", "tt");
		this._setTranslations();		
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
	 * 
	 */
	_setTranslations: function() {
		if (this.nls) {
			
			if (this.dlg_lblItemname)
				this.dlg_lblItemname.innerHTML = this.nls["itemname"];
			
			if (this.dlg_lblPosition)
				this.dlg_lblPosition.innerHTML = this.nls["position"];
			
			if (this.dlg_lblTagname)
				this.dlg_lblTagname.innerHTML = this.nls["tagname"];
			
			if (this.dlg_lblZoomlevel)
				this.dlg_lblZoomlevel.innerHTML = this.nls["zoomlevel"];
			
			if (this.dlg_lblLongText)
				this.dlg_lblLongText.innerHTML = this.nls["longtext"];
				
			if (this.dlg_btnOk)
				this.dlg_btnOk.containerNode.innerHTML = this.nls["ok"];
				
			if (this.dlg_btnCancel)
				this.dlg_btnCancel.containerNode.innerHTML = this.nls["cancel"];
			
			if (this.dlg_btnZoomLevelFromMap)
				this.dlg_btnZoomLevelFromMap.containerNode.innerHTML = this.nls["zoomlevelfrommap"];	
		}
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
	 * removes all "option" elements from the html select
	 */
	_removeTags: function() {
		if (this.dlg_cmbTagname) {
			for (var i = (this.dlg_cmbTagname.childNodes.length - 1); i > -1; i--) {
				var e1 = this.dlg_cmbTagname.childNodes[i];
				if (e1.nodeName.toLowerCase() == "option") {
					this.dlg_cmbTagname.removeChild(e1);
				}
			}
		}
	},
	
	/**
	 * sets the html select to the given tagname
	 * @param {Object} tagname
	 */
	_setTag: function(tagname) {
		if (this.dlg_cmbTagname) {
			
			if (this.dlg_cmbTagname.childNodes.length < 2) {
				this._loadTags();
			}
			
			for (var i = 0; i < this.dlg_cmbTagname.childNodes.length; i++) {
				var e1 = this.dlg_cmbTagname.childNodes[i];
				if (e1.nodeName.toLowerCase() == "option") {
					e1.removeAttribute("selected");
					e1.selected = false;
					if (e1.value == tagname) {
						e1.setAttribute("selected","selected");
						e1.selected = true;
					}
				}
			}
		}
	},
	
	/**
	 * load tag values into the html select
	 */
	_loadTags: function() {
		//console.debug("loading tags");
		if (this.dlg_cmbTagname) {
			this._removeTags();
			if (gl_application) {
				var usr1 = gl_application.getActiveUser();
				if (usr1) {
					for (var i = 0; i < usr1.tags.length; i++) {
						var t1 = usr1.tags[i];
						var opt1 = document.createElement("option");
						opt1.innerHTML = t1.tagname;
						opt1.setAttribute("value", t1.tagname);					
						this.dlg_cmbTagname.appendChild(opt1);
					}
				}
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
		
		if (this.dlg_cmbTagname) {
			//this.dlg_cmbTagname.setAttribute("value", this.dataitem.tagname);
			this._setTag(this.dataitem.tagname);
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
			if (this.dlg_spinZoomlevel.attr("value") == "")
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
	 * returns the formula data
	 */
	getData: function() {
			var itemname = null;
			var itemid = -1;
			var lat = null;
			var lon = null;
			var zoomlevel = null;
			var description = null;
			var tagname 	= this.getTagname();
			var parentid    = -1;
			var protection  = null;
			
			if (this.dataitem)
				itemid = this.dataitem.itemid;
			
			if (this.parentitem)
				parentid = this.parentitem.itemid;
								
			if (this.dlg_tbItemname) {
				itemname = this.dlg_tbItemname.attr("value");
			}
				
			if (this.dlg_tbLat) {
				lat = this.dlg_tbLat.attr("value");
			}
			
			if (this.dlg_tbLon) {
				lon = this.dlg_tbLon.attr("value");
			}
			
			if (this.dlg_spinZoomlevel) {
				zoomlevel = this.dlg_spinZoomlevel.attr("value");
			}
			
			if (this.dlg_taLongText) {
				description = this.dlg_taLongText.attr("value");
			}
			
			var result = {
				"itemid": itemid,
				"parentid": parentid,
				"itemname":  itemname,
				"lat":  lat,
				"lon":  lon,
				"zoomlevel":  zoomlevel,
				"description":  description,
				"tagname":  tagname,
				"protection": protection
			};
	
			return result;
	},
	
	
	/**
	 * returns the selected tagname
	 */
	getTagname: function() {
		if (this.dlg_cmbTagname) {
			return this.dlg_cmbTagname[this.dlg_cmbTagname.selectedIndex].value;	
		}
		return null;
	},
	
	/**
	 * sets the dataitem
	 */
	setDataItem: function(item) {
		this.dataitem = item;
		this.parentitem = null;
		isupdate = true;
	},
	
	/**
	 * sets a parentitem
	 * @param {Object} item
	 */
	setParentItem: function(item) {
		this.parentitem = item;
	},
	
	/**
	 * sets lat lon textbox data
	 * @param {Object} latlon
	 */
	setPoint: function(latlon) {
		//console.debug("setPoint");
		//console.debug(latlon);
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
	},
	
	/**
	 * 
	 */
	show: function() {
		this.inherited(arguments);
		if (! this.isupdate) {
			this._loadTags();
		}
	}
	
	
});
