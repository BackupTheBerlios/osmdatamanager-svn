dojo.provide("trm.widget.PoiDialog");
dojo.require("trm.widget._TrmBaseDialog");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");


dojo.declare("trm.widget.PoiDialog", [trm.widget._TrmBaseDialog], {
	storedata: true,  //if set to true the dialog stores poidata by itself using the poimanager
	templatePath:    dojo.moduleUrl('trm.widget', 'PoiDialog.html'),
	tinymce_loaded: false,
	onOkClick: function(data) {
		
	},
	
	onUpdatePoi: function(poi) {
		
	},
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	_cb_createPoi: function(response, ioArgs) {
		this._resetFields();
		this.hide();	
	},
	
	_cb_updatePoi: function(response, ioArgs) {
		if (response != "msg.failed") {
			this.onUpdatePoi(response);
		}
		this._resetFields();
		this.hide();	
	},
	
	_init_TinyMce: function() {
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
	
			// Drop lists for link/image/media/template dialogs
			template_external_list_url : "lists/template_list.js",
			external_link_list_url : "lists/link_list.js",
			external_image_list_url : "lists/image_list.js",
			media_external_list_url : "lists/media_list.js",
			
			file_browser_callback : "openSwampyBrowser",
			
			// Replace values for the template plugin
			template_replace_values : {
				username : "Some User",
				staffid : "991234"
			}
		});
		
		this.tinymce_loaded = true;
		this._loadData();
		//tinyMCE.get('elm1').show();
	},
	
	_okClick: function(e){
	  this.inherited(arguments);
	  
	  if (this._dataOk()) {
	  		
			var data = this.getData();
						
			if (this.storedata) { //if storedata is true, the dialog will execute the serverside functions
				var pm = new PoiManager();
				
				if (this.dataitem) {
					var cb = {
						func: this._cb_updatePoi,
						target: this
					}
					pm.updatePoi(this.dataitem.itemid, data.itemname, data.description, data.lat, data.lon, data.tagname, data.zoomlevel, cb);
				}
				else {
					var cb = {
						func: this._cb_createPoi,
						target: this
					}
					pm.createPoi(data.itemname, data.description, data.lat, data.lon, data.tagname, data.zoomlevel, cb);
				}	
			} else {
				this.onOkClick(data);
			}
	  } else {
	  	 if (this.nls) {
		 	alert(this.nls["entervaliddata"]);
		 }
	  }
	},
	
	show: function(isupdate) {
		this.inherited(arguments);
		if (this.onlyshow) {
			if (this.dataitem) {
				this._setTag(this.dataitem.tagname);
			//this.inherited(arguments);
			} else {
				this._setTag("standard_poi");
			}
			return;
		}
		
		if (isupdate) {
			this._loadData();
		} else {
			this._resetFields();
			this._setTag("standard_poi");
			this.dataitem = null;
		}
		this._init_TinyMce();
	}
		
});
