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

DijitClient = {
	Application: null,
	ExampleDialog: null,
	LoginDialog: null,
	RegisterDialog: null,
	GroupDialog: null,
	PoiDialog: null,
	PoiListDialog: null,
	ChangePasswordDialog:null,
	PictureListDialog: null,
	UserSettingsDialog: null,
	FileEditDialog: null,
	FileListDialog: null,
	AdminDialog: null,
	AboutDialog: null
}

/**
 * !! EXAMPLE !!, only for copy and paste
 * @param {Object} application
 */
DijitClient.ExampleDialog = {
	objectname: "ExampleDialog",
	app: null,
	initialize: function(application) {
		this.app = application;
		//dojo.connect(dijit.byId("dlg_changepassword_btn_ok"),"onClick",this,"okClick");
	},
	show: function() {
		//dijit.byId('dlg_changepassword_tb_password2').attr("value","");
		//dijit.byId('dlg_changepassword').show();	
	},
	hide: function() {
		//dijit.byId('dlg_changepassword').hide();
	},
	dataOk: function() {
		/*
		if (dijit.byId('dlgchangepassword_tb_oldpassword').value.trim() == "")
			return false;
		*/			
		return true;	
	},
	okClick: function() {
		if (! this.dataOk) {
			alert('Fehler')
			return;
		}
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}
}

/**
 * About Dialog
 * @param {Object} application
 */
DijitClient.AboutDialog = {
	objectname: "AboutDialog",
	app: null,
	initialize: function(application) {
		this.app = application;
		dojo.connect(dijit.byId("dlgabout_ok"),"onClick",this,"okClick");
	},
	show: function() {
		dijit.byId('dlg_about').show();	
	},
	hide: function() {
		dijit.byId('dlg_about').hide();
	},
	dataOk: function() {
		return true;	
	},
	okClick: function() {
		this.hide();
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}
}

/**
 * Login Dialog
 */
DijitClient.LoginDialog = {	
	objectname: "LoginDialog",
	app:null,
	initialize: function(application) {
		dojo.connect(dijit.byId("btn_dlglogin_ok"),"onClick",this,"okClick");
		dojo.connect(dijit.byId("dlg_login"),"onKeyPress",this,"onKeyPress");	
		this.app = application;
	},
	_cb_loginUser: function(response, ioArgs) {
		if ((response != "msg.loginfailed") && (response != "")) {
			this.app.disablePrivatemode();
			this.app.updateFilelist
			dijit.byId('dlg_register').hide();
			dijit.byId('dlg_login').hide();
			var usr = this.app.getActiveUser();
			if (usr != null) {
				dijit.byId('btn_login').attr("label", "Logout [" + usr.username + "]");
				this.app.updateFileList(null);
				this.app.enablePrivatemode();
				gl_groupmanager.getRootGroups();
				this.app.centerHomebase();
			}
		} else {
			//login failed
			var lat = 50.9350850727913;
			var lon = 6.95356597872225;
			this.app.centerMap(lat, lon, 6);
			dijit.byId('password').attr("value","");	
		}
	},
	dataOk: function() {
		if (document.getElementById('username').value.trim() == "") 
			return false;
		
		if (document.getElementById('password').value.trim() == "") 
			return false;
				
		return true;
	},
	show: function() {
		dijit.byId('username').attr("value","");
		dijit.byId('password').attr("value","");
		if (dijit.byId('btn_login').label != "::Login::") {
			//LOGOUT
			dijit.byId('btn_login').attr("label","::Login::");
			
			this.app.clearMap();
			this.app.logoutUser();
			this.app.disablePrivatemode();
			
			var lat=50.9350850727913;
			var lon=6.95356597872225;
			this.app.centerMap(lat,lon,6); 			
			return;
		}
		dijit.byId('dlg_login').show();
	},
	hide: function() {
		dijit.byId('dlg_login').hide();
	},
	okClick: function() {
		if (!this.dataOk())
		{
			alert('Sie haben keine g&uuml;ltigen Daten eingegeben');
			return;
		}
		var cb = {
			func:  this._cb_loginUser,
			target: this
		}
		
		this.app.loginUser(document.getElementById('username').value.trim(),document.getElementById('password').value.trim(), cb);		
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}
}


/**
 * UserSettingsDialog
 * @param {Object} application
 */
DijitClient.UserSettingsDialog = {
	objectname: "UserSettingsDialog",
	app: null,
	initialize: function(application) {
		this.app = application;
		//user dialog
		dojo.connect(dijit.byId("btn_usrpref_save"),"onClick",this,"okClick");
		dojo.connect(dijit.byId("btn_usrpref_cancel"),"onClick",this,"cancelClick");
		dojo.connect(dijit.byId("btn_usrpref_sethomebase"),"onClick",this,"setHomebase");
	},
	_cb_updateActiveUser: function(response, ioArgs) {
		if (response != "msg.failed") {
			dijit.byId('dlg_usersettings').hide();
		}	
	},
	show: function() {
		dijit.byId('tb_usrpref_name').attr("value","");
		dijit.byId('tb_usrpref_email').attr("value","");
		dijit.byId('tb_usrpref_lat').attr("value","");
		dijit.byId('tb_usrpref_lon').attr("value","");
		dijit.byId('tb_usrpref_info').attr("value","");
		dijit.byId('tb_usrpref_picture').attr("value","");
			
		var usr = this.app.getActiveUser();
		if (usr != null)
		{
			dijit.byId('tb_usrpref_name').attr("value", usr.username);
			dijit.byId('tb_usrpref_email').attr("value",usr.email);
			dijit.byId('tb_usrpref_lat').attr("value",usr.location_lat);
			dijit.byId('tb_usrpref_lon').attr("value",usr.location_lon);
			dijit.byId('tb_usrpref_info').attr("value",usr.abouthtml);
			dijit.byId('tb_usrpref_picture').attr("value",usr.picture);	
		}		
		dijit.byId('dlg_usersettings').show();	
	},
	hide: function() {
		dijit.byId('dlg_usersettings').hide();	
	},
	_cb_setHomebase: function(e) {
		var lonlat = this.app.map.getLonLatFromViewPortPx(e.xy).transform(this.app.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
		
		dijit.byId('tb_usrpref_lat').setValue(lonlat.lat);
		dijit.byId('tb_usrpref_lon').setValue(lonlat.lon);
		dijit.byId('dlg_usersettings').show();
		
		this.app.map.removeControl(gl_dblclick);
		gl_dblclick.deactivate();	
	},
	setHomebase: function() {
		var cb = {
			func:this._cb_setHomebase,
			target: this
		}
		this.app.getPoint(cb,'dlg_usersettings',"Punkt","machen Sie einen Doppelklick einen Punkt");			
	},
	okClick: function() {
		var usr = this.app.getActiveUser();
		if (usr != null) {
		
			usr.username = dijit.byId('tb_usrpref_name').value.trim();
			usr.email = dijit.byId('tb_usrpref_email').value.trim();
			usr.location_lat = dijit.byId('tb_usrpref_lat').value;
			usr.location_lon = dijit.byId('tb_usrpref_lon').value;
			
			if (dijit.byId('tb_usrpref_info').value != null) 
				usr.abouthtml = dijit.byId('tb_usrpref_info').value.trim();
			else 
				usr.abouthtml = "";
			
			if (dijit.byId('tb_usrpref_picture').value != null) 
				usr.picture = dijit.byId('tb_usrpref_picture').value.trim();
			else 
				usr.picture = "";
			
			var cb = {
				func: this._cb_updateActiveUser,
				target: this
			}
			this.app.updateActiveUser(cb);
		}		
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}
}


/**
 * RegisterDialog
 * @param {Object} application
 */
DijitClient.RegisterDialog = {
	objectname: "RegisterDialog",
	app: null,
	initialize: function(application) {
		this.app = application;
		dojo.connect(dijit.byId("btn_dlgregister_ok"),"onClick",this,"okClick");			
	},
	show: function() {
		dijit.byId('reg_username').attr("value","");
		dijit.byId('reg_password').attr("value","");
		dijit.byId('reg_password2').attr("value","");
		dijit.byId('reg_email').attr("value","");
		
		dijit.byId('dlg_login').hide();
		dijit.byId('dlg_register').show();	
	},
	hide: function() {
		
	},
	dataOk: function() {
		if (dijit.byId('reg_username').value.trim() == "")
			return false;
		
		if (dijit.byId('reg_password').value.trim() == "")
			return false;
		
		if (dijit.byId('reg_password2').value.trim() == "")
			return false;
		
		if (dijit.byId('reg_email').value.trim() == "")
			return false;
		
		return true;	
	},
	passwordOk: function() {
		if (dijit.byId('reg_password').value.trim() == dijit.byId('reg_password2').value.trim())
			return true;
				
		return false;	
	},
	okClick: function() {
		if (!this.dataOk())
		{
			alert('please enter valid data');
			return;
		}
		
		if (!this.passwordOk())
		{
			alert('please enter the same password twice');
			return;
		}
		
		var cb = {
			func: DijitClient.LoginDialog._cb_loginUser,
			target: DijitClient.LoginDialog
		}
		
		this.app.registerUser(dijit.byId('reg_username').value.trim(),dijit.byId('reg_password').value.trim(),dijit.byId('reg_email').value.trim(),cb);	
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}
	
}

/**
 * ChangePasswordDialog
 * @param {Object} application
 */
DijitClient.ChangePasswordDialog = {
	objectname: "RegisterDialog",
	app: null,
	initialize: function(application) {
		this.app = application;
		dojo.connect(dijit.byId("dlgchangepassword_btn_ok"),"onClick",this,"okClick");
		dojo.connect(dijit.byId("dlg_changepassword"),"onKeyPress",this,"onKeyPress");
	},
	show: function() {
		DijitClient.UserSettingsDialog.hide();
		dijit.byId('dlgchangepassword_tb_oldpassword').attr("value","");
		dijit.byId('dlgchangepassword_tb_password1').attr("value","");
		dijit.byId('dlgchangepassword_tb_password2').attr("value","");
		
		dijit.byId('dlg_changepassword').show();	
	},
	_cb_changePassword: function(response, ioargs) {
		if (response == null)		
			return;
			
		if (response != "msg.failed" && (response != "")) {
			this.hide();
			DijitClient.UserSettingsDialog.show();
		}	
	},
	hide: function() {
		dijit.byId('dlg_changepassword').hide();
	},
	dataOk: function() {
		if (document.getElementById('dlgchangepassword_tb_oldpassword').value.trim() == "") 
			return false;
			
		if (document.getElementById('dlgchangepassword_tb_password1').value.trim() == "") 
			return false;
		
		if (document.getElementById('dlgchangepassword_tb_password2').value.trim() == "") 
			return false;
							
		if (document.getElementById('dlgchangepassword_tb_password1').value.trim() != document.getElementById('dlgchangepassword_tb_password2').value.trim()) {
			alert('Sie haben 2 unterschiedliche Passwörter eingegeben');
			return false;
		}
		
		if (document.getElementById('dlgchangepassword_tb_oldpassword').value.trim() == document.getElementById('dlgchangepassword_tb_password1').value.trim()) {
			alert('Altes und neues Passwort sind identisch');
			return false;
		}
			
		return true;	
	},
	passwordOk: function() {				
		return false;	
	},
	okClick: function() {
		if (! this.dataOk()) {
			return;
		}
		var cb = {
			func: this._cb_changePassword,
			target: this
		}
		this.app.changePassword(dijit.byId('dlgchangepassword_tb_oldpassword').value.trim(),dijit.byId('dlgchangepassword_tb_password1').value.trim(),cb);
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}	
}

/**
 * GroupDialog
 * @param {Object} application
 */
DijitClient.GroupDialog = {
	objectname: "GroupDialog",
	app: null,
	grpman: null,
	initialize: function(application, groupmanager) {
		this.app = application;
		this.grpman = groupmanager;
		dojo.connect(dijit.byId("dlgcreategroup_btn_ok"),"onClick",this,"okClick");			
		dojo.connect(dijit.byId("dlg_creategroup"),"onKeyPress",this,"onKeyPress");	
		dojo.connect(dijit.byId("dlgcreategroup_btn_selectpoint"),"onClick",this,"selectPosition");	
		dojo.connect(dijit.byId("dlgcreategroup_btn_zoomlevel"),"onClick",this,"getZoomlevelFromMap");	
	},
	_cb_selectPosition: function(e) {
		var lonlat = this.app.map.getLonLatFromViewPortPx(e.xy).transform(this.app.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
		
		dijit.byId('dlgcreategroup_tb_poi_lat').attr("value",lonlat.lat);
		dijit.byId('dlgcreategroup_tb_poi_lon').attr("value",lonlat.lon);
			
		this.app.map.removeControl(gl_dblclick);
		gl_dblclick.deactivate();	
		
		dijit.byId('dlg_creategroup').show();
	},
	_cb_remGroupPois: function(response, ioargs) {
		this.grpman.getGroupTree().collapseParent();
	},
	selectPosition: function() {
		var cb = {
			func:this._cb_selectPosition,
			target: this
		}
		this.app.getPoint(cb,'dlg_creategroup',"Punkt","machen Sie einen Doppelklick einen Punkt");		
	},
	getZoomlevelFromMap: function() {
		dijit.byId('dlgcreatgroup_zommlevel').attr("value",gl_map.getZoom());	
	},
	getProtection: function() {
		var val = "private";
		if (dijit.byId('dlgcreategroup_rd_private').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_private').value;
		
		if (dijit.byId('dlgcreategroup_rd_protected').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_protected').value;
		  
		if (dijit.byId('dlgcreategroup_rd_public').attr("checked") == true)
		  val = dijit.byId('dlgcreategroup_rd_public').value;
		   
		return val;	
	},
	showGroupData: function(group) {
		dijit.byId('dlg_creategroup').attr("grpid", group.groupid);
		dijit.byId('tb_groupname').attr("value", group.groupname);
		
		dijit.byId('dlgcreategroup_rd_private').attr("checked","checked");
		if (group.protection == "private")
		  dijit.byId('dlgcreategroup_rd_private').attr("checked","checked");
		 
		if (group.protection == "protected")
		  dijit.byId('dlgcreategroup_rd_protected').attr("checked","checked");
		 
		if (group.protection == "public")
		  dijit.byId('dlgcreategroup_rd_public').attr("checked","checked");
					
		
		dijit.byId('dlgcreategroup_tb_poi_lat').attr("value",group.lat);
		dijit.byId('dlgcreategroup_tb_poi_lon').attr("value",group.lon);
		
		if (group.zoomlevel != null)
			dijit.byId('dlgcreatgroup_zommlevel').attr("value",group.zoomlevel);			
		else
			dijit.byId('dlgcreatgroup_zommlevel').attr("value",gl_map.getZoom());
	},
	/**
	 * show
	 * @param {boolean} isroot
	 * @param {boolean} isupdate
	 */
	show: function(isroot,isupdate) {
		dijit.byId('tb_groupname').attr("value","");
		
		if (isroot) {
			dijit.byId('dlg_creategroup').attr("option", "root");
		}
		else {
			dijit.byId('dlg_creategroup').attr("option", "subgroup");
		}
		
		if (isupdate) {
			dijit.byId('dlg_creategroup').attr("option", "update");
			dijit.byId('tb_groupname').attr("disabled", "");
			dijit.byId('dlgcreategroup_tb_poi_lat').attr("disabled","disabled");
			dijit.byId('dlgcreategroup_tb_poi_lon').attr("disabled","");
			dijit.byId('dlgcreatgroup_zommlevel').attr("disabled","");
			
			 var grp = this.grpman.getGroupTree().getSelectedItem();
			 if (grp) {
			 	this.showGroupData(grp);
			 }
		}
		else {
			dijit.byId('dlgcreategroup_tb_poi_lat').attr("disabled", "disabled");
			dijit.byId('dlgcreategroup_tb_poi_lon').attr("disabled", "disabled");
			dijit.byId('dlgcreatgroup_zommlevel').attr("disabled", "disabled");
			dijit.byId('dlgcreategroup_rd_private').attr("disabled", "disabled");
			dijit.byId('dlgcreategroup_rd_protected').attr("disabled", "disabled");
			dijit.byId('dlgcreategroup_rd_public').attr("disabled", "disabled");
		}
		
		dijit.byId('dlg_creategroup').show();	
	},
	hide: function() {
		dijit.byId('dlg_creategroup').hide();
	},
	dataOk: function() {
		
	},
	okClick: function() {
		var option = dijit.byId('dlg_creategroup').attr("option");
			
		var grpid = document.getElementById('dlg_creategroup').getAttribute("grpid");
		var grp = document.getElementById('tb_groupname').value.trim();
		var protection = this.getProtection();
		var zoomlevel = document.getElementById('dlgcreatgroup_zommlevel').value;
		var lat = document.getElementById('dlgcreategroup_tb_poi_lat').value;
		var lon = document.getElementById('dlgcreategroup_tb_poi_lon').value;
		
		if ((grp != "") && (grp != null)) {
			if (option == "root") {
				this.grpman.createRootGroup(grp);
			}
			else 
			if (option == "subgroup") {
				this.grpman.createSubGroup(grp);
			}
			else 
			if (option == "update") {
			  this.grpman.updateGroup(grpid,grp,protection,zoomlevel,lat,lon);
			}
		} else {
			alert("kein g&#252;ltiger Wert");
			return;
		}
		dijit.byId('dlg_creategroup').hide();		
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	},
	removeGroupPoi: function() {
		var poi = this.grpman.getGroupTree().getSelectedItem();
		if (poi) {
			var grpid = this.grpman.getGroupTree().getSelectedParentGroupId();
			if (grpid != null) {
				var lst1 = new Array();
				lst1.push(poi.poiid);
				var cb = {
					func: this._cb_remGroupPois,
					target: this
				}
				this.grpman.remGroupPois(grpid,lst1,cb);
			}
		}	
	},
	removeGroupFile: function() {
		var fl1 = this.grpman.getGroupTree().getSelectedItem();
		if (fl1) {
			var grpid = this.grpman.getGroupTree().getSelectedParentGroupId();
			if (grpid != null) {
				var lst1 = new Array();
				lst1.push(fl1.filename);
				var cb = {
					func: this._cb_remGroupPois,
					target: this
				}
				this.grpman.remGroupFiles(grpid,lst1,cb);
			}
		}
	}	
}


/**
 * PoiDialog
 * @param {Object} application
 */
DijitClient.PoiDialog = {
	objectname: "PoiDialog",
	app: null,
	grpman: null,
	initialize: function(application,groupmanager) {
		this.app = application;
		this.grpman = groupmanager;
		dojo.connect(dijit.byId("dlgpoi_btn_ok"),"onClick",this,"okClick");
		dojo.connect(dijit.byId("dlgpoi_btn_selectpoint"),"onClick",this,"selectPosition");
		dojo.connect(dijit.byId("dlgpoi_btn_showpiclist"),"onClick",this,"showPictureList");
	},
	_cb_updatePoi: function(response, ioargs) {
		var poi = response;
		if (poi != null) {
			this.app.updatePoi(poi.lat,poi.lon,poi.description);
			this.hide();
		}	
	},
	_cb_createPoi: function() {
		this.hide();	
	},
	_cb_selectPosition: function(e) {
		var lonlat = this.app.map.getLonLatFromViewPortPx(e.xy).transform(this.app.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
		
		dijit.byId('tb_poi_lat').attr("value",lonlat.lat);
		dijit.byId('tb_poi_lon').attr("value",lonlat.lon);
				
		this.app.map.removeControl(gl_dblclick);
		gl_dblclick.deactivate();
		
		dijit.byId('dlg_poi').show();
	},
	_cb_getPoi: function(response,ioArgs) {
		var poi = response[0];			
		dijit.byId('tb_poi_poiid').attr("value",poi.poiid);
		dijit.byId('tb_poidescription').attr("value",poi.poiname);
		//dijit.byId('ta_poilongtext').setValue("");
		dijit.byId('ta_poilongtext').attr("value",poi.description);
		dijit.byId('tb_georssurl').attr("value","");
		dijit.byId('tb_poi_lat').attr("value",poi.lat);
		dijit.byId('tb_poi_lon').attr("value",poi.lon);
		dijit.byId('dlg_poi').show();
	},
	show: function() {
		dijit.byId('tb_poidescription').attr("value","");
		//dijit.byId('ta_poilongtext').setValue("");
		dijit.byId('ta_poilongtext').attr("value","");
		dijit.byId('tb_georssurl').attr("value","");
		dijit.byId('tb_poi_lat').attr("value","");
		dijit.byId('tb_poi_lon').attr("value","");
		dijit.byId('tb_poi_poiid').attr("value","");
		dijit.byId('dlg_poi').show();
	},
	showEdit: function() {
		var grpTree = this.grpman.getGroupTree();
		if (grpTree) {
			var poiid = grpTree.getPoiId();
			if (poiid) {
				var pm = new PoiManager();
				var cb = {
					func: this._cb_getPoi,
					target: this
				}
				pm.getPoi(poiid, cb);
			}
		}		
	},
	hide: function() {
		dijit.byId('dlg_poi').hide();
	},
	selectPosition: function() {
		var cb = {
			func: this._cb_selectPosition,
			target: this
		}
		this.app.getPoint(cb,'dlg_poi',"Punkt","machen Sie einen Doppelklick einen Punkt");	
	},
	showPictureList: function() {
		DijitClient.PictureListDialog.show('dlg_poi');
	},
	dataOk: function() {
		if (dijit.byId('tb_poidescription').value.trim() == "") 
			return false;

		if (dijit.byId('tb_georssurl').value == "") {
			if (dijit.byId('tb_poi_lat').value == "") 
				return false;
			
			if (dijit.byId('tb_poi_lon').value == "") 
				return false;
		}else {
			if (dijit.byId('tb_georssurl').value == "") 
				return false;
		}	
		return true;
	},
	okClick: function() {
		if (!this.dataOk()) {
			alert('bitte geben Sie gültige Daten ein');
			return;
		}
		var pm = new PoiManager();
		var latlon = dijit.byId('tb_poi_lat').value + ";" + dijit.byId('tb_poi_lon').value;
		
		var longtext = "";
		var georssurl = "";
		var poiid = "";
		
		if (dijit.byId('ta_poilongtext').getValue().trim() != "")
		  longtext = dijit.byId('ta_poilongtext').getValue().trim();
		  
		if (dijit.byId('tb_georssurl').value.trim() != "")
		  georssurl = dijit.byId('tb_georssurl').value.trim();
		
		if (dijit.byId('tb_poi_poiid').value.trim() != "")
		  poiid = dijit.byId('tb_poi_poiid').value.trim();
		
		if (poiid != "") {
			var cb = {
				func: this._cb_updatePoi,
				target: this
			}
			pm.updatePoi(poiid, dijit.byId('tb_poidescription').value.trim(), longtext, latlon, georssurl, cb);
		}
		else {
			var cb = {
				func: this._cb_createPoi,
				target: this
			}
			pm.createPoi(dijit.byId('tb_poidescription').value.trim(), longtext, latlon, georssurl, cb);
		}
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}	
}


/**
 * PoiListDialog
 * @param {Object} application
 */
DijitClient.PoiListDialog = {
	objectname: "PoiListDialog",
	app: null,
	grpman: null,
	initialize: function(application,groupmanager) {
		this.app = application;
		this.grpman = groupmanager;
		dojo.connect(dijit.byId("dlgpoilist_btn_ok"),"onClick",this,"okClick");
	},
	_cb_getPois: function(response, ioargs) {
		try {
			var lst1 = document.getElementById('poilist');
			if (lst1 != null)
				this.app.removeChilds(lst1,"LI",true);
			
			if ((response != "msg.failed") && (response != ""))
			{
				for (var i=0;i<response.length;i++) {
					var poi1 = response[i]		;
					if (poi1 != "") {
						var node = dojo.doc.createElement("LI");
						node.innerHTML = poi1.poiname;
						node.value = poi1.poiid;
						var sl = dijit.byId("poilist");
						sl.containerNode.appendChild(node);
					}
				}
				dijit.byId('dlg_poilist').show();
			} else
			{alert("failed");}
		} catch (e)
		{alert(e);}		
	},
	show: function() {
		var pm = new PoiManager();
		var cb = {
			func:this._cb_getPois,
			target: this
		}
		pm.getPois(cb);				
	},
	hide: function() {
		dijit.byId('dlg_poilist').hide();	
	},
	dataOk: function() {	
		return true;	
	},
	okClick: function() {
		if (! this.dataOk) {
			alert('Fehler')
			return;
		}
		var lst1 = dijit.byId('poilist').selected;
		if ((lst1 != null) && (lst1 != "")) {
			var cb = {
				func: this.hide,
				target: this
			}
			this.grpman.addGroupPois(lst1,cb);
		}
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}	
}


/**
 * PictureListDialog
 * @param {Object} application
 */
DijitClient.PictureListDialog = {
	objectname: "PictureListDialog",
	app: null,
	sender: null,
	handle: null,
	initialize: function(application) {
		this.app = application;
		dojo.connect(dijit.byId("dlg_picturelist"),"hide",this,"beforeHide");
	},
	picClicked: function(packet) {
		var val = dijit.byId('ta_poilongtext').value;
		var img = "<img src=\"" + packet.url + "\" />"
		val += img;
		
		dijit.byId('ta_poilongtext').attr("value",val);
		dijit.byId('dlg_picturelist').hide();
	},
	updatePictures: function() {
		var tp = dijit.byId('thumbPicker1');
		if (tp != null) {
			var store = new dojo.data.ItemFileReadStore({
				url: "picturefunctions.php"
			});
			
			var itemRequest = {
				query: {},
				count: 20
			};
			
			var itemNameMap = {
				imageThumbAttr: "thumb",
				imageLargeAttr: "large"
			};
			tp.setDataStore(store, itemRequest, itemNameMap);
			//dojo.unsubscribe(this.handle);
			if (this.handle == null)
			  this.handle = dojo.subscribe(tp.getClickTopicName(),this,this.picClicked);
		}	
	},
	show: function(senderdialog) {
		if (senderdialog) {
			dijit.byId(senderdialog).hide();
			this.sender = senderdialog;
		}
		
		this.updatePictures();
		dijit.byId('dlg_picturelist').show();
	},
	beforeHide: function() {
		//alert("beforeHide" + this.objectname);
		if (this.sender != null) {
			dijit.byId(this.sender).show();	
		}
	},
	hide: function() {
		dijit.byId('dlg_picturelist').hide();
	},
	dataOk: function() {		
		return true;	
	},
	okClick: function() {
		if (! this.dataOk) {
			alert('Fehler')
			return;
		}
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}	
}


/**
 * FileEditDialog
 * @param {Object} application
 */
DijitClient.FileEditDialog = {
	objectname: "FileEditDialog",
	app: null,
	grpman: null,
	initialize: function(application, groupmanager) {
		this.app = application;
		this.grpman = groupmanager;
		dojo.connect(dijit.byId("dlgfileedit_btn_ok"),"onClick",this,"okClick");
		dojo.connect(dijit.byId("dlg_fileedit"),"onKeyPress",this,"onKeyPress");
	},
	show: function() {
		var grpTree = this.grpman.getGroupTree();
		if (grpTree) {
			dijit.byId('tb_filename').attr("value",grpTree.getFileName());
			dijit.byId('tb_filedescription').attr("value",grpTree.getFileDescription());
		}
		dijit.byId('dlg_fileedit').show();	
	},
	hide: function() {
		dijit.byId('dlg_fileedit').hide();
	},
	dataOk: function() {
		return true;	
	},
	okClick: function() {
		if (! this.dataOk) {
			alert('Fehler')
			return;
		}
		
		var fn = document.getElementById('tb_filedescription').value.trim();
		if ((fn != null) && (fn != "")) {
			var cb = {
				func: this.hide,
				target: this
			}
			this.grpman.updateFile(fn, cb);
		}
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}	
}


/**
 * FileListDialog
 * @param {Object} application
 */
DijitClient.FileListDialog = {
	objectname: "FileListDialog",
	app: null,
	grpman: null,
	initialize: function(application,groupmanager) {
		this.app = application;
		this.grpman = groupmanager;
		dojo.connect(dijit.byId("dlgfilelist_btn_ok"),"onClick",this,"okClick");
	},
	_cb_getFiles: function(response,ioArgs) {
		var sl = dijit.byId("filelist");
		for (var i=0;i<response.length;i++) {
			var fn1 = response[i]		;
			if (fn1 != "") {
				var node = dojo.doc.createElement('li');
				
				var txt1 = fn1.filename;
				if ((fn1.description != null) && (fn1.description != ""))
					txt1 = fn1.description;
				
				node.setAttribute("filename",fn1.filename);
				node.innerHTML = txt1;
				sl.containerNode.appendChild(node);
			}
		}
		dijit.byId('dlg_filelist').show();	
	},
	_cb_addGroupFiles: function(response, ioArgs) {
		var grpTree = this.grpman.getGroupTree();
		if (grpTree) {
			grpTree.collapseSelected(true);
		}
		dijit.byId('dlg_filelist').hide();
	},
	show: function() {
		var lst1 = document.getElementById('filelist');
		if (lst1 != null)
			this.app.removeChilds(lst1,"LI",true);
		
		var cb = {
			func: this._cb_getFiles,
			target: this
		}
		
		this.grpman.getFiles(cb);
	},
	hide: function() {
		//dijit.byId('dlg_changepassword').hide();
	},
	dataOk: function() {
		return true;	
	},
	fileIsSelected: function(name) {
		var lst1 = dijit.byId('filelist').selected;
		if ((lst1 != null) && (lst1 != "")) {
			for (var i=0;i<lst1.length;i++) {
				var txt1 = lst1[i];
				if (txt1 == name) {
					return true;
				}
			}
		}
		return false;
	},
	getSelectedFiles: function() {
		var result = new Array();
		
		var lst1 = dijit.byId("filelist").containerNode;
		if ((lst1 != null) && (lst1 != "")) {
			for (var i=0;i<lst1.childNodes.length;i++) {
				var fl1 = lst1.childNodes[i];
				if (fl1.nodeName != "#text") {
					if (fl1.getAttribute("filename") != null) {
						var fn1 = fl1.getAttribute("filename");
						if (this.fileIsSelected(fl1.innerHTML))
							result.push(fn1);
					}
				}
			}
		}
		if (result.length > 0)
			return result;
		else
			return null;	
	},
	okClick: function() {
		if (! this.dataOk) {
			alert('Fehler')
			return;
		}
		
		var lst1 = this.getSelectedFiles();
		if (lst1 != null) {		
			//gl_tracemanager.addTracefiles(lst1);
			var cb = {
				func: this._cb_addGroupFiles,
				target: this
			}
			gl_groupmanager.addGroupFiles(lst1,cb);
		}
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}	
}

/**
 * AdminDialog
 * @param {Object} application
 */
DijitClient.AdminDialog = {
	objectname: "AdminDialog",
	app: null,
	initialize: function(application) {
		this.app = application;
		dojo.connect(dijit.byId("dlgadmin_btn_deluser"),"onClick",this,"okClick");
	},
	_cb_deleteUser: function(response,ioArgs) {
		if (response == null)		
			return;
			
		if (response != "msg.failed" && (response != "")) {
			alert("Benutzer erfolgreich gelöscht");
		}
	},
	show: function() {
		var usr = this.app.getActiveUser();
		if ((usr != null) && (usr.isadmin))
			dijit.byId('dlg_admin').show();	
	},
	hide: function() {
		dijit.byId('dlg_admin').hide();
	},
	dataOk: function() {
		if (dijit.byId('dlgadmin_tb_username').value.trim() == "")
			return false;
		
		return true;	
	},
	okClick: function() {
		if (! this.dataOk()) {
			alert('Fehler')
			return;
		}
		var cb = {
			func: this._cb_deleteUser,
			target: this
		}
		this.app.deleteUser(dijit.byId('dlgadmin_tb_username').value.trim(),cb);
	},
	cancelClick: function() {
		this.hide();	
	},
	onKeyPress: function(event) {
		if (event.keyCode == '13') {
			this.okClick();	
		}
	}
}

/**
 * connection between dijit gui and client application
 */
DijitClient.Application = function(openlayersMap,mm)
{
	this.initialize(openlayersMap,mm);
	var self = this;		
	
	DijitClient.LoginDialog.initialize(this);
	DijitClient.UserSettingsDialog.initialize(this);
	DijitClient.RegisterDialog.initialize(this);
	DijitClient.ChangePasswordDialog.initialize(this);
	DijitClient.PictureListDialog.initialize(this);
	DijitClient.AdminDialog.initialize(this);
	DijitClient.AboutDialog.initialize(this);
			
	this.initGroupmanager = function(groupmanager)	 {
	  DijitClient.GroupDialog.initialize(this,groupmanager);
	  DijitClient.PoiDialog.initialize(this,groupmanager);
	  DijitClient.PoiListDialog.initialize(this,groupmanager);
	  DijitClient.FileEditDialog.initialize(this,groupmanager);
	  DijitClient.FileListDialog.initialize(this,groupmanager);
	}
	
	this.test = function() {
		document.getElementById('map').style.visibility = 'hidden';
		document.getElementById('filemanager').style.visibility = 'visible';
	}

	this._cb_getPoi = function(response, ioargs) {
		var poi = response[0];
		if (poi) {		
			self.createPoi(poi.lat,poi.lon,poi.description,gl_markers);
			self.centerMap(poi.lat,poi.lon,14);
		}
	}
		
	//TODO remove ?
	this.initEvents = function() {
	}
	
	/**
	 * shows a message dialog
	 * @param {Object} title
	 * @param {Object} message
	 */
	this.showMessage = function(title, message) {
		dijit.byId('dialog_info').setAttribute("title",title);
		//dijit.byId('dialog_info').setContent(text);
		document.getElementById('dlginfo_text').innerHTML = message;
		dijit.byId('dialog_info').show();
	}
	
	/**
	 * hides the message dialog
	 */
	this.hideMessage = function() {
		dijit.byId('dialog_info').hide();
	}

	/**
	 * select a point from the map
	 * @param {Object} callback
	 * @param {Object} senderdialogid
	 * @param {Object} title
	 * @param {Object} message
	 */
	this.getPoint = function(callback, senderdialogid, title, message) {
		if (senderdialogid != null)
			dijit.byId(senderdialogid).hide();	
		
		if ((title != null) && (title != "")) {
			this.showMessage(title, message);
		}
		this.getPointFromMap(callback);
	}

	
	/**
	 * disablePrivatemode
	 */
	this.disablePrivatemode = function() {
		this.disabledAllMenuItems();
		dijit.byId('btn_centerhomebase').attr("disabled","disabled");
		if (gl_groupmanager) {
			var grpTree = gl_groupmanager.getGroupTree();
			if (grpTree) {
				grpTree.reset();
			}
		}
	}
	
	/**
	 * enablePrivatemode 
	 */
	this.enablePrivatemode = function(){
		dijit.byId('btn_centerhomebase').setAttribute("disabled",false);
		this.enablePrivateMenuItems();
	}
			
	/**
	 * gotoPoi
	 * @param {Object} lat
	 * @param {Object} lon
	 * @param {Object} poiid
	 */	
	this.gotoPoi = function(lat, lon, poiid)
	{
		var usr = this.getActiveUser();
		if (usr != null) {
			var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
			if (!this.markermanager.markerExists(lonLat)) {
				var pm = new PoiManager();
				var cb = {
					func: this._cb_getPoi,
					target: this
				}
				pm.getPoi(poiid,cb);
				return;		
			}
			this.centerMap(lat,lon,14);
		}
	}
	
	/**
	 * updatePoi
	 * @param {Object} lat
	 * @param {Object} lon
	 * @param {Object} htmltext
	 */
	this.updatePoi = function(lat, lon, htmltext) {
		var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
		this.markermanager.updateMarker(lonLat,gl_markers,htmltext);
	}
	
	/**
	 * loads all data from selected group an shows it on the map
	 */
	this.loadGroupData = function() {
		var groupid = gl_groupmanager.getGroupTree().getSelectedGroupId();
		if (groupid != null) {
			params = {
				"action": "msg.getgrpitems",
				"groupid": groupid
			}
			loadFromServer("groupfunctions.php", params, this.showData);
		}
	}
	
	/**
	 * gotoSelectedPoi
	 * @param {Object} sender
	 */
	this.gotoSelectedPoi = function() {
		var grouptree = gl_groupmanager.getGroupTree();
		if (grouptree.isPoiSelected()) {
			var lat = grouptree.getPoiLat();
			var lon = grouptree.getPoiLon();
			var poiid = grouptree.getPoiId();
			if ((lat) && (lon)) {
				this.gotoPoi(lat,lon,poiid);	
			}
		}
	}	

	/**
	 * removeChilds
	 * @param {Object} node
	 * @param {Object} nodename
	 * @param {Object} recursiv
	 */
	this.removeChilds = function(node, nodename, recursiv) {
	    if (node.hasChildNodes()) {
	        for (var i = (node.childNodes.length - 1); i > -1; i--) {
				var e1 = node.childNodes[i];
				if (e1.nodeName == nodename)
					node.removeChild(e1);
					
				if (recursiv && node.hasChildNodes()) {
					this.removeChilds(e1,nodename,recursiv);
				}
	        }
	    }
	}

	/**
	 * enablePrivateMenuItems
	 */
	this.enablePrivateMenuItems = function() {
		dijit.byId('itm_createmaingroup').attr("disabled","");
		dijit.byId('itm_createpoi').attr("disabled","");
		dijit.byId('itm_doupload').attr("disabled","");
		dijit.byId('itm_submenu_settings').attr("disabled","");
		dijit.byId('itm_removeall').attr("disabled","");
		dijit.byId('itm_submenu_groups').attr("disabled","");
	}
	
	/**
	 * disabledAllMenuItems
	 */
	this.disabledAllMenuItems = function() {
		dijit.byId('itm_loadTraces').attr("disabled","disabled");
		dijit.byId('itm_removeTraces').attr("disabled","disabled");		
		//dijit.byId('itm_loadPois').attr("disabled","disabled");
		dijit.byId('itm_addFiles').attr("disabled","disabled");		
		dijit.byId('itm_addPoi').attr("disabled","disabled");
		dijit.byId('itm_createsubgroup').attr("disabled","disabled");		
		dijit.byId('itm_createmaingroup').attr("disabled","disabled");
		dijit.byId('itm_deletegroup').attr("disabled","disabled");
		dijit.byId('itm_editfile').attr("disabled","disabled");
		dijit.byId('itm_gotoPoi').attr("disabled","disabled");
		dijit.byId('itm_editPoi').attr("disabled","disabled");
		//dijit.byId('itm_removePois').attr("disabled","disabled");
		dijit.byId('itm_submenu_traces').attr("disabled","disabled");
		dijit.byId('itm_submenu_pois').attr("disabled","disabled");
		dijit.byId('itm_submenu_groups').attr("disabled","disabled");
		dijit.byId('itm_submenu_settings').attr("disabled","disabled");
		dijit.byId('itm_loaddata').attr("disabled","disabled");
		dijit.byId('itm_removeall').attr("disabled","disabled");
		dijit.byId('itm_createpoi').attr("disabled","disabled");
		dijit.byId('itm_doupload').attr("disabled","disabled");
		dijit.byId('itm_updategroup').attr("disabled","disabled");
		dijit.byId('itm_remPoi').attr("disabled","disabled");
		dijit.byId('itm_admin').attr("disabled","disabled");
		dijit.byId('itm_remFiles').attr("disabled","disabled");
		
	}
	
	/**
	 * groupTreeOpenmenu
	 * @param {Object} sender
	 */
	this.groupTreeOpenmenu = function(sender) {
		
		this.disabledAllMenuItems();		
		
		var usr = self.getActiveUser();
		if (usr != null) {
			this.enablePrivateMenuItems();
			if (usr.isadmin) {
				dijit.byId('itm_admin').attr("disabled","");	
			}
		} 
		
		//itm_editPoi
		var grpTree = gl_groupmanager.getGroupTree();
		if (grpTree) {
			if (grpTree.isGroupSelected()) {
				dijit.byId('itm_loadTraces').attr("disabled","");
				dijit.byId('itm_removeTraces').attr("disabled","");
				dijit.byId('itm_addFiles').attr("disabled","");
				dijit.byId('itm_createsubgroup').attr("disabled","");
				dijit.byId('itm_deletegroup').attr("disabled","");
				dijit.byId('itm_addPoi').attr("disabled","");
				//dijit.byId('itm_loadPois').attr("disabled","");
				dijit.byId('itm_submenu_traces').attr("disabled","");
				dijit.byId('itm_submenu_pois').attr("disabled","");
				dijit.byId('itm_loaddata').attr("disabled","");
				dijit.byId('itm_updategroup').attr("disabled","");
			}
			
			if (grpTree.isFileSelected()) {
				dijit.byId('itm_submenu_traces').attr("disabled","");
				dijit.byId('itm_submenu_pois').attr("disabled","");
				dijit.byId('itm_loadTraces').attr("disabled","");
				dijit.byId('itm_removeTraces').attr("disabled","");
				dijit.byId('itm_editfile').attr("disabled","");
				dijit.byId('itm_remFiles').attr("disabled","");
			}
			
			if (grpTree.isPoiSelected()) {
				dijit.byId('itm_submenu_traces').attr("disabled","");
				dijit.byId('itm_submenu_pois').attr("disabled","");
				dijit.byId('itm_gotoPoi').attr("disabled","");
				dijit.byId('itm_editPoi').attr("disabled","");
				dijit.byId('itm_remPoi').attr("disabled","");
			}
		}
	}
	
}
DijitClient.Application.prototype = new TRM.ClientApplication();
