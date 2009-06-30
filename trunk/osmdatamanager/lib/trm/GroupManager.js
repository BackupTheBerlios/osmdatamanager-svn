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

Groupmanager.prototype = new TRM.ServerConnection;
/**
 * Groupmanager
 * @param {Object} app
 */
function Groupmanager(app){
	
	var grouptree = new GroupTree(document.getElementById("treecontainer"),document.getElementById("treedata"));
	var callback = null;
	var application = app;
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var getRootGroupsOk = function(response, ioArgs) {
		try {		
			//alert(response);
			if (response == null)
				return;
						
			if ((response != "msg.failed") && (response != ""))
			{
				grouptree.addRootGroups(response);
			}
			
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var getChildGroupsOk = function(response, ioArgs) {
		try {		
			if (callback != null) {
				callback(response);	
			}
				
			if ((response != "msg.failed") && (response != ""))
			{
				
			} else
			{}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after a group or subgroup is created
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_createGroup = function(response, ioArgs) {
		try {		
			if (response != "msg.failed")
			{
				grouptree.addGroups(response);
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
				
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after updateGroup
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_updateGroup = function(response, ioArgs) {
		try {		
			if (response != "msg.failed")
			{
				grouptree.updateGroup(response);
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var getGroupFilesOk = function(response, ioArgs){
		try {
			//if ((response != "msg.failed") && (response != "")) {
				//dbtree.addTraces(response);
				if (callback != null) {
					callback(response);	
				}
			//}		
		} catch (e) {
			alert(e);	
		}
	}
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var getGroupPoisOk = function(response, ioArgs){
		try {
			if ((response != "msg.failed") && (response != "")) {
				//dbtree.addTraces(response);
				if (callback != null) {
					callback(response);	
				}
			}		
		} catch (e) {
			alert(e);	
		}
	}
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var getGroupItemsOk = function(response, ioArgs){
		try {
			if ((response != "msg.failed") && (response != "")) {
				if (callback != null) {
					callback(response);	
				}
			}		
		} catch (e) {
			alert(e);	
		}
	}
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_addGroupFiles = function(response, ioArgs) {
		try {
			if (response != "msg.failed") {
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after addGroupPois
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_addGroupPois = function(response, ioArgs) {
		try {
			if (response == "msg.addok") {
				//alert('ok');
				grouptree.collapseSelected(true);
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after remGroupPois
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_remGroupPois = function(response, ioArgs) {
		try {
			if (response == null)
				return;
			
			if ((response != "msg.failed") && (response != "")) {
				grouptree.collapseParent(response.haschildren);
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * callback after remGroupFiles
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_remGroupFiles = function(response, ioArgs) {
		try {
			if (response == null)
				return;
			
			if ((response != "msg.failed") && (response != "")) {
				grouptree.collapseParent(response.haschildren);
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
		} catch (e)
		{alert(e);}
	}
	
	
	/**
	 * callback after deleteGroup
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_deleteGroup = function(response, ioArgs){
		try {
			if (response == "msg.delok") {
				grouptree.deleteSelected();	
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */	
	var _cb_updateFile = function(response, ioArgs){
		try {
			if (response != "msg.failed") {
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
			
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _cb_getFiles = function(response, ioArgs){
		try {
			if (response != "msg.failed") {
				if (callback != null) {
					callback.func.apply(callback.target, [response, ioArgs]);
				}
			}
		} catch (e)
		{alert(e);}
	}
	
	/**
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _loadTracesOk = function(response, ioArgs){
		try {
			for (var i=0;i<response.length;i++) {
			var fl1 = response[i];
			var desc = fl1.description;
			if ((desc == null) ||(desc == ""))
				desc = fl1.filename;
			
			application.showGpxFile(desc, fl1.filename);			
			}	
		}catch (e)
		{alert(e);}
	}
	
	/**
	 * asda
	 * @private
	 * @param {Object} response
	 * @param {Object} ioArgs
	 */
	var _removeTracesOk = function(response, ioArgs){
		try {
			for (var i=0;i<response.length;i++) {
			var fl1 = response[i];
			var desc = fl1.description;
			if ((desc == null) ||(desc == ""))
				desc = fl1.filename;
			
			application.removeLayers(desc);			
			}	
		}catch (e)
		{alert(e);}	
	}
	
	/*****************************************************************************************************
	 * PUBLIC
	 *****************************************************************************************************/
		
	/**
	 * getRootGroups
	 * @return all rootgroups
	 **/
	this.getRootGroups = function() {
		params = {
			"action": "msg.getgrps",
			"parentgroupid":"-1"
		}
		grouptree.reset();
		loadFromServer("groupfunctions.php",params,getRootGroupsOk);	
	}
	
	this.getChildgroups = function(parentgroupid, cb) {
		params = {
			"action":"msg.getchildgrps",
			"parentgroupid":parentgroupid
		}
		callback = cb;
		loadFromServer("groupfunctions.php",params,getChildGroupsOk);
	}
	
	this.createRootGroup = function(groupname,cb) {			
		params = {
			"action":"msg.crtgrp",
			"groupname":groupname,
			"parentgroupid":"-1"
		}
		grouptree.reset();
		callback = cb;
		loadFromServer("groupfunctions.php",params, _cb_createGroup);		
	}
		
	this.createSubGroup = function(groupname,cb) {			
		var prntgrpid = grouptree.getSelectedGroupId();
		if (prntgrpid) {
			params = {
				"action": "msg.crtgrp",
				"groupname": groupname,
				"parentgroupid": prntgrpid
			}
			callback = cb;
			loadFromServer("groupfunctions.php", params, _cb_createGroup);
		}
	}
	
	this.updateGroup = function(groupid,groupname,protection,zommlevel,lat,lon,tagname,cb) {
		var grpid = grouptree.getSelectedGroupId();
		if (grpid) {
			params = {
				"action": "msg.updategrp",
				"groupid":grpid,
				"groupname": groupname,
				"parentgroupid": "-1",
				"protection":protection,
				"zoomlevel":zommlevel,
				"lat":lat,
				"lon":lon,
				"tagname":tagname
			}
			callback = cb;
			loadFromServer("groupfunctions.php", params, _cb_updateGroup);
		}
	}
	
	this.getGroupFiles = function(groupid, cb) {
		params = {
			"action":"msg.getgrpfiles",
			"groupid":groupid
		}
		callback = cb;
		loadFromServer("groupfunctions.php",params,getGroupFilesOk);
	}
	
	//getGroupPois
	this.getGroupPois = function(groupid, cb) {
		params = {
			"action":"msg.getgrppois",
			"groupid":groupid
		}
		callback = cb;
		loadFromServer("groupfunctions.php",params,getGroupPoisOk);
	}
	
	//getGroupItems
	this.getGroupItems = function(groupid, cb){
		params = {
			"action":"msg.getgrpitems",
			"groupid":groupid
		}
		callback = cb;
		loadFromServer("groupfunctions.php",params,getGroupItemsOk);
	}
	
	//getGroupFiles_Recursiv
	this.getGroupFiles_Recursiv = function(cb) {
		var groupid = grouptree.getSelectedGroupId();
		params = {
			"action":"msg.getgrpfilesrecursiv",
			"groupid":groupid
		}
		callback = cb;
		loadFromServer("groupfunctions.php",params,getGroupFilesOk);
	}
	
	/**
	 * loads files from current user
	 * @param {Object} cb
	 */
	this.getFiles = function(cb) {
		params = {
			"action":"msg.getfiles",
		}
		callback = cb;
		loadFromServer("filefunctions.php",params,_cb_getFiles);
	}
	
	//getGroupPois_Recursiv
	this.getGroupPois_Recursiv = function(cb) {
		var groupid = grouptree.getSelectedGroupId();
		params = {
			"action":"msg.getgrppoisrecursiv",
			"groupid":groupid
		}
		callback = cb;
		loadFromServer("groupfunctions.php",params,getGroupPoisOk);
	}
	
	/**
	 * adds a list of file to the selected group
	 * @param {Object} filelist
	 * @param {Object} cb
	 */
	this.addGroupFiles = function(filelist,cb) {
		var fl = JSON.stringify(filelist);
		var grpid = grouptree.getSelectedGroupId();
		params = {
			"action":"msg.addgrpfiles",
			"files":fl,
			"groupid":grpid
		}
		//alert(fl);
		callback = cb;
		loadFromServer("groupfunctions.php",params,_cb_addGroupFiles);
	}
	
	this.remGroupFiles = function(groupid,filelist,cb) {
		var fl = JSON.stringify(filelist);
		params = {
			"action":"msg.remgrpfiles",
			"files":fl,
			"groupid":groupid
		}
		//alert(fl);
		callback = cb;
		loadFromServer("groupfunctions.php",params,_cb_remGroupFiles);
	}
	
	/**
	 * deletes the selected groupasds
	 * @private
	 */
	this.deleteGroup = function() {
		var groupid = grouptree.getSelectedGroupId();
		params = {
			"action":"msg.delgrp",
			"groupid":groupid
		}
		loadFromServer("groupfunctions.php",params,_cb_deleteGroup);
	}
	
	/**
	 * adds a list of poi's to the selected group
	 * @param {Object} poilist
	 * @param {Object} cb
	 */
	this.addGroupPois = function(poilist,cb) {
		var groupid = grouptree.getSelectedGroupId();
		var pl = JSON.stringify(poilist);
		params = {
			"action": "msg.addgrppois",
			"poilist":pl,
			"groupid":groupid
		}
		callback = cb;
		loadFromServer("poifunctions.php",params,_cb_addGroupPois);
	}
	
	/**
	 * removes a list of pois from a group
	 * @param {Object} poilist
	 * @param {Object} cb
	 */
	this.remGroupPois = function(groupid,poilist,cb) {
		var pl = JSON.stringify(poilist);
		params = {
			"action": "msg.remgrppois",
			"poilist":pl,
			"groupid":groupid
		}
		callback = cb;
		loadFromServer("poifunctions.php",params,_cb_remGroupPois);
	}
			
	//updateFile
	this.updateFile = function(description,cb) {
		var filename = grouptree.getFileName();
		params = {
			"action": "msg.updatefile",
			"filename":filename,
			"description":description
		}
		callback = cb;
		loadFromServer("filefunctions.php",params,_cb_updateFile);
	}
	
	this.getGroupTree = function() {
		return grouptree;
	}
			
	this.removeTraces = function(sender) {
		if (grouptree.isGroupSelected()) {
			this.getGroupFiles_Recursiv(_removeTracesOk);
			return;
		}
		
		if (grouptree.isFileSelected()) {
			var fn = grouptree.getFileName();
			var desc = grouptree.getFileDescription();
			if (fn != "") {
				if ((desc == null) || (desc == ""))
					desc = fn;
					
				application.removeLayers(desc);
			}
		}
	}
			
	this.loadTraces = function(sender) {
		if (grouptree.isGroupSelected()) {
			this.getGroupFiles_Recursiv(_loadTracesOk);
			return;
		}
		
		if (grouptree.isFileSelected()) {
			var fn = grouptree.getFileName();
			var desc = grouptree.getFileDescription();
			if (fn != "") {
				if ((desc == null) || (desc == ""))
					desc = fn;
					
				application.showGpxFile(desc, "traces/" + fn);
			}
		}
	}	
}