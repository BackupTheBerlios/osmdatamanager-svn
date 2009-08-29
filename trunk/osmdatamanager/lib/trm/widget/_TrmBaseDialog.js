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

dojo.provide("trm.widget._TrmBaseDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");
dojo.requireLocalization("trm.translation", "tt");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.RadioButton");


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
	islongtextkey: false,
	nls: null,
	onlyshow: false,
	tinymce_loaded: false,
	tinymce_enabled: true,
	postCreate: function() {
		this.inherited(arguments);
		this.nls = dojo.i18n.getLocalization("trm.translation", "tt");
		this._setTranslations();		
		dojo.connect(this,"onKeyDown",this,"_onKeyDown");		
		
		dojo.connect(this.dlg_taLongText,"onKeyDown",this,"_onLongTextKeyDown");		
		
		/*
		this.dlg_tbItemname = null;
		this.dlg_tbLat = null;
		this.dlg_tbLon = null;
		this.dlg_spinZoomlevel = null;
		this.dlg_cmbTagname = null;
		this.dlg_taLongText = null;
		*/
		this._init_TinyMce();
	},
	
	ontinymceinit: function() {
		this._loadData();
	},
	
	_init_TinyMce: function() {
		if (! this.tinymce_enabled)
			return;
		
		if (! this.dlg_taLongText)
			return;
		
		if (this.tinymce_loaded)
			return;
			
		if (! tinyMCE)
			return;
		
		tinyMCE.init({
			// General options
			mode : "textareas",
			theme : "advanced",
			plugins : "safari,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount",
	
			// Theme options
			theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
			theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
			theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
			theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_resizing : true,
	
			// Example content CSS (should be your site CSS)
			content_css : "css/content.css",
			//cleanup_on_startup : false,
			// Drop lists for link/image/media/template dialogs
			template_external_list_url : "lists/template_list.js",
			external_link_list_url : "lists/link_list.js",
			external_image_list_url : "lists/image_list.js",
			media_external_list_url : "lists/media_list.js",
			oninit: dojo.hitch(this,this.ontinymceinit),
			file_browser_callback : "openSwampyBrowser"
		});
				
		this.tinymce_loaded = true;
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
			
			if (this.dlg_btnClose)
				this.dlg_btnClose.containerNode.innerHTML = this.nls["close"];	
			
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
		
		if (this.dlg_taLongText) {
			if (this.tinymce_loaded) {
				if (tinyMCE) {
					tinyMCE.execCommand('mceSetContent',false,"");
				}	
			} else {
				this.dlg_taLongText.attr("value","");	
			}
		}
		
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
			
			var idx=0;
			this.dlg_cmbTagname.selectedIndex = -1;
			for (var i = 0; i < this.dlg_cmbTagname.childNodes.length; i++) {
				if (this.dlg_cmbTagname.childNodes[i].nodeName.toLowerCase() == "option") {
					this.dlg_cmbTagname.options[idx].selected = false;
					if (this.dlg_cmbTagname.childNodes[i].value == tagname) {
						this.dlg_cmbTagname.options[idx].selected = true;
						this.dlg_cmbTagname.selectedIndex = idx;
					}
					idx++;
				}
			}
		}
	},
	
	/**
	 * load tag values into the html select
	 */
	_loadTags: function() {
		if (this.dlg_cmbTagname) {
			this._removeTags();
			if (this.application) {
				var usr1 = this.application.getActiveUser();
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
		
		
		if (this.dlg_rdPrivate) {
			if (this.dlg_rdPrivate.attr("checked") == true)
				val = document.getElementById(this.dlg_rdPrivate.id).value;
		}
		
		if (this.dlg_rdFriend) {
			if (this.dlg_rdFriend.attr("checked") == true)
				val = document.getElementById(this.dlg_rdFriend.id).value;
		}
		
		if (this.dlg_rdPublic) {
			if (this.dlg_rdPublic.attr("checked") == true)
				val = document.getElementById(this.dlg_rdPublic.id).value;
		}
		
		return val;	
	},
	
	_setProtection: function() {		
		if (this.dlg_rdPrivate) {
			if (!this.dataitem.protection) {
				this.dlg_rdPrivate.setAttribute("checked", true);
				return;
			}
		}
		
		if (this.dlg_rdPrivate) {
			if (String(this.dataitem.protection).toLowerCase() == "private") {
				this.dlg_rdPrivate.setAttribute("checked",true);
				return;
			}
		}
		
		if (this.dlg_rdFriend) {
			if (String(this.dataitem.protection).toLowerCase() == "friend") {
				this.dlg_rdFriend.setAttribute("checked",true);
				return;
			}
		}
		
		if (this.dlg_rdPublic) {
			if (String(this.dataitem.protection).toLowerCase() == "public") {
				this.dlg_rdPublic.setAttribute("checked",true);
				return;
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
		
		if (this.dlg_taLongText) {
			if (this.tinymce_loaded) {
				if (tinyMCE) {
					tinyMCE.execCommand('mceSetContent',false,this.dataitem.description);
				}
			}
			else {
				this.dlg_taLongText.attr("value", this.dataitem.description);
			}
		}	
		
		if (this.dlg_cmbTagname) {
			//this.dlg_cmbTagname.setAttribute("value", this.dataitem.tagname);
			this._setTag(this.dataitem.tagname);
		}
		
		this._setProtection();
	},
	
	/**
	 * checks if all components have data
	 */
	_dataOk: function() {
		if (this.dlg_tbItemname) {
			if (document.getElementById(this.dlg_tbItemname.id).value.trim() == "")
				return false;
		}

		if (this.dlg_tbLat) {
			if (document.getElementById(this.dlg_tbLat.id).value.trim() == "")
				return false;
		}
		
		if (this.dlg_tbLon) {
			if (document.getElementById(this.dlg_tbLon.id).value.trim() == "")
				return false;
		}
		
		if (this.dlg_spinZoomlevel) {
			if (document.getElementById(this.dlg_spinZoomlevel.id).value == "") 
				return false;
			
		}
		
		if (this.dlg_taLongText) {
			if (this.tinymce_loaded) {
				if (tinyMCE) {
					if (tinyMCE.get(this.dlg_taLongText.id).getContent().trim() == "") 
						return false;
				}
			}
			else {
				if (document.getElementById(this.dlg_taLongText.id).value.trim() == "") 
					return false;
			}
		}
		
		if (this.dlgGrp_cmbTagname) {
			if (document.getElementById(this.dlgGrp_cmbTagname.id).value.trim() == "")
				return false;
		}
							
		return true;	
	},
	
	_onKeyDown: function(e) {
				
		if (this.islongtextkey) {
			this.islongtextkey = false;
			return;
		}
		
		if (e.keyCode == 13) {
			this._okClick();
		}
		
		if (e.keyCode == 27) {
			this._cancelClick();
		}
	},
	
	_onLongTextKeyDown: function(e) {
		this.islongtextkey = true;
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
			var protection  = this._getProtection();
			
			if (this.dataitem)
				itemid = this.dataitem.itemid;
			
			if (this.parentitem)
				parentid = this.parentitem.itemid;
								
			if (this.dlg_tbItemname) {
				//itemname = this.dlg_tbItemname.attr("value");
				itemname = document.getElementById(this.dlg_tbItemname.id).value;
			}
			
			if (this.dlg_tbLat) {
				lat = document.getElementById(this.dlg_tbLat.id).value;
			}
			
			if (this.dlg_tbLon) {
				lon = document.getElementById(this.dlg_tbLon.id).value;
			}
			
			if (this.dlg_spinZoomlevel) {
				zoomlevel = document.getElementById(this.dlg_spinZoomlevel.id).value;
			}
			
			if (this.dlg_taLongText) {
				//description = this.dlg_taLongText.attr("value");
				if (this.tinymce_loaded) {
					if (tinyMCE) {
						description = tinyMCE.get(this.dlg_taLongText.id).getContent();
					}	
				} else {
					description = document.getElementById(this.dlg_taLongText.id).value;	
				}
				
				
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
		
		if (this.dlg_tbItemname) {
			this.dlg_tbItemname.focus();
		}
	}
	
	
});
