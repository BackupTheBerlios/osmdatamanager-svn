dojo.provide("trm.widget.UserDialog");
dojo.require("trm.widget._TrmWidget");
dojo.require("dijit._Templated");
dojo.require("dojo.parser");

//dojo.requireLocalization("trm.translation", "tt");

dojo.declare("trm.widget.UserDialog", [trm.widget._TrmWidget, dijit._Templated], {
	user: null,
	application: null,
	storedata: true,
	widgetsInTemplate: true,
	templatePath:    dojo.moduleUrl('trm.widget', 'UserDialog.html'),
	postCreate: function() {
		this.inherited(arguments);
	},
	_cancelClick: function(e) {
		this.inherited(arguments);
	},
	_okClick: function(e) {
		this.inherited(arguments);
	},
	_dataOk: function() {
		if (this.dlgUsr_tbName.attr("value").trim() == "")
			return false;
		
		return true;
	},
	_cb_updateuser: function(response, ioArgs) {
		if (response != "msg.failed") {
			if (this.application) {
				this.application.activeuser = response;
			}	
			this.hide();
		}
	},
	_okClick: function(e) {
		this.inherited(arguments);
		if (this._dataOk()) {
			var itemid = -1;
			if (this.user)
				itemid = this.user.itemid;
			
			var itemname 	= 	this.dlgUsr_tbName.attr("value");
			var lat 		= 	this.dlgUsr_tbLat.attr("value");
			var lon 		= 	this.dlgUsr_tbLon.attr("value");
			var zoomlevel 	= 	this.dlgUsr_spinZoomlevel.attr("value");
			var tagname 	= 	this._getTagname();
			var htmltext	=   this.dlgUsr_tbHtmlText.attr("value");
			var email		=   this.dlgUsr_tbEmail.attr("value");
			
			if (this.storedata) {
				//callback = cb;
				var params = {
					"action": "msg.updateuser",
					"userid": itemid,
					"username": itemname,
					"email": email,
					"lat": lat,
					"lon": lon,
					"htmltext": htmltext,
					"zoomlevel": zoomlevel,
					"tagname": tagname,
					"picture": ""
				}
				
				this.loadFromServer("userfunctions.php", params, this._cb_updateuser);
			}
			else {
				this.onOkClick({
					"itemid": itemid,
					"itemname": itemname,
					"lat": lat,
					"lon": lon,
					"email": email,
					"zoomlevel": zoomlevel,
					"tagname": tagname,
					"htmltext": htmltext
				});
			}
		}
	},
	_resetFields: function() {
		this.dlgUsr_tbName.attr("value","");
		this.dlgUsr_tbLat.attr("value","");
		this.dlgUsr_tbLon.attr("value","");
		this.dlgUsr_spinZoomlevel.attr("value","");
		this.dlgUsr_tbHtmlText.attr("value","");
		this.dlgUsr_tbEmail.attr("value","");
		
		//this.dlgUsr_tbTagname.attr("value","");
		this.dlgUsr_cmbTagname.setAttribute("value","");
		for (var i=(this.dlgUsr_cmbTagname.childNodes.length-1);i> -1;i--) {
			var nd1 = this.dlgUsr_cmbTagname.childNodes[i];
			this.dlgUsr_cmbTagname.removeChild(nd1);
		}
	},
	_getTagname: function() {
		return this.dlgUsr_cmbTagname[this.dlgUsr_cmbTagname.selectedIndex].value;	
	},
	_loadUserData: function() {
		if (this.user == null)
			return;
			
		this._resetFields();
		this.dlgUsr_tbName.attr("value",this.user.itemname);
		this.dlgUsr_tbLat.attr("value",this.user.lat);
		this.dlgUsr_tbLon.attr("value",this.user.lon);
		this.dlgUsr_spinZoomlevel.attr("value",this.user.zoomlevel);
		
		this.dlgUsr_tbHtmlText.attr("value",this.user.description);
		this.dlgUsr_tbEmail.attr("value",this.user.email);
		
		//this.dlgUsr_tbTagname.attr("value",this.user.tagname);
		this.dlgUsr_cmbTagname.setAttribute("value",this.user.tagname);
		for (var i=0;i<this.user.tags.length;i++) {
			var t1 = this.user.tags[i];
			var opt1 = document.createElement("option");
			opt1.innerHTML = t1.tagname;
			opt1.setAttribute("value",t1.tagname);
			if (t1.tagname.toLowerCase() == this.user.tagname.toLowerCase())
			  opt1.setAttribute("selected","selected");
			
			this.dlgUsr_cmbTagname.appendChild(opt1);
		}
	},
	setUser: function(user) {
		this.user = user;
		this._loadUserData();
	},
	setPoint: function(latlon) {
		this.dlgUsr_tbLat.attr("value",latlon.lat);
		this.dlgUsr_tbLon.attr("value",latlon.lon);
	},
	setZoomlevel: function(zoomlevel) {
		this.dlgUsr_spinZoomlevel.attr("value",zoomlevel);	
	},
	show: function() {
		if (!this.user) {
			this._resetFields();
		}
		this.inherited(arguments);
	},
	hide: function() {
		this.inherited(arguments);
	}
		
});
