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

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

 function TreeNode(span, href, image) {
 	this.c_span = span;
	this.c_href = href;
	this.c_image = image;
	
	/*
	this.href = function() {
		return 
	}
	*/
		
 }
 
 function TreeObject(id,object) {
 	this.c_id = id;
	this.c_object = object;
 }
 
 function GroupTree(parentelement, treedataelement)
 {
 	var c_parentelement = parentelement;
    var c_treedata = treedataelement;
	var clickednode = null;
    var clickednodeelem = null;
	var idx=1;
	var isloading = false;
	var self = this;
	
	var treeobjects = new Array();
	
	/*
	 * private functions
	 */
    
	var handleException = function(e) {
        alert(e);
    }
	
	var _addObject = function(id, object) {
		var to = new TreeObject(id,object);
		treeobjects.push(to);
	}
	
	var _objectExists = function(id) {
		for (var i=0;i<treeobjects.length;i++) {
			var to = treeobjects[i];
			if (to.c_id == id)
			  return true;
		}
		return false;
	}
	
	var _getObject = function(id) {
		for (var i=0;i<treeobjects.length;i++) {
			var to = treeobjects[i];
			if (to.c_id == id)
			  return to.c_object;
		}
		return null;
	}
	
	var _getObjectPos = function(id) {
		for (var i=0;i<treeobjects.length;i++) {
			var to = treeobjects[i];
			if (to.c_id == id)
			  return i;
		}
		return null;
	}
	
	var _removeObject = function(node) {
		var to = _getObjectPos(node.Id);
		if (to != null) {
			treeobjects.remove(to);
		}
	}
	
	var _getParentgroup = function(node) {
		if (node == null)
			return null;
			
		if (node.getAttribute("type") == "group") {
				return node;
		} else {
			return _getParentgroup(node.parentNode);
		}
	}
	
	var _removeAllChilds = function(node, classname) {
        if (node.hasChildNodes()) {
            for (var i = (node.childNodes.length - 1); i > -1; i--) {
				var e1 = node.childNodes[i];
				if (e1.nodeName != "#text") {
					if (e1.getAttribute("class") == classname) {
						node.removeChild(e1);
						_removeObject(e1);
					}
				}
            }
        }
    }
	
	
	var removeChildnodes = function() {
        if (clickednodeelem != null) {
            var prnt = clickednodeelem.parentNode;
            //alert(prnt.innerHTML);
			_removeAllChilds(prnt, "nodespan");
        }
    }
	
	
	var _expandNode = function(node){
		//
		var n1 = _getChildnode(node,"IMG")
		if (n1 != null) {
			var obj = _getObject(clickednodeelem.Id);
			if (obj != null) {
				n1.setAttribute("src", obj.icon_expanded);
			}
		}
	}
	
	var _collapseNode = function(node){
		//
		var n1 = _getChildnode(node,"IMG")
		if (n1 != null) {
			if (node.getAttribute("haschildren") == "true") {
				var obj = _getObject(clickednodeelem.Id);
				if (obj != null) {
					n1.setAttribute("src", obj.icon_collapsed);
				}
			}
			else {
				n1.setAttribute("src", "images/treeExpand_none.gif");
			}
		}
		_removeAllChilds(node, "nodespan");
	}
	
	var _getChildnode = function(node, nodename) {
		if (node.hasChildNodes()) {
            for (var i = (node.childNodes.length - 1); i > -1; i--) {
				var e1 = node.childNodes[i];
				if (e1.nodeName == nodename) {
					return e1;
				}
            }
        }
		return null;
	}
	/*
	var loadChildGroupsOk = function(response) {
		if (response != "msg.failed") {
			if (clickednodeelem != null) {
				for (var i = 0; i < response.length; i++) {
					var t1 = response[i];
					createGroup(clickednodeelem.parentNode, t1);
				}
			}
		}
		isloading = false;
	}
	*/
	
	var isOnMap = function(filename) {
		if (gl_map) {
			if (! filename)
				return;
			
			var desc = filename.description;
			if ((desc == null) || (desc == ""))
				desc = filename.filename;
			
			var lst1 = gl_map.getLayersByName(desc);
			if (lst1 != null) {
				for (var x = 0; x < lst1.length; x++) {
					lgpx = lst1[x];
					//map.removeLayer(lgpx);
					if (lgpx.visibility == true)
						return true;
				}
			}	
		}
		return false;
	}
			
	var _cb_loadGroupItems = function(response) {
		if (response != "msg.failed") {
			for (var i = 1; i < response.length; i++) {
				//var poi1 = response[i];
				//createPoi(clickednodeelem.parentNode, poi1);
				var itm1 = response[i];
				if (itm1.itemtype == "Poi")
					_createPoi(clickednodeelem, itm1);
				
				if (itm1.itemtype == "Tracefile")
					_createFile(clickednodeelem, itm1);	
				
				if (itm1.itemtype == "Group")
					_createGroup(clickednodeelem, itm1);
						
			}
		}
		isloading = false;
	}
	
		
	var _loadGroupItems = function() {
		//
		var grpId = self.getSelectedGroupId();
		if (grpId) {
			isloading = true;
			gl_groupmanager.getGroupItems(grpId,_cb_loadGroupItems);
		}
	}
	
	var _nodeClicked = function(sender) {
        try {
            if (isloading)
                return;

            if (clickednodeelem != null)
                _unsetSelected();
            			
           	clickednodeelem = sender;			
			_setSelected();
			isloading = false;
            
        } catch (e) {
            handleException(e);
        }
    }
	
	var _nodeDblClicked = function(sender){
		try {
			if (isloading) 
				return;
		
			if (!self.hasChildren(sender))
				return;
			
			isloading = true;		
			if (sender.getAttribute("expanded") == "false") {
				sender.setAttribute("expanded","true");
				
				if (clickednodeelem != null) 
					_unsetSelected();
					
				clickednodeelem = sender;						
					
				_setSelected();
				_expandNode(sender);
				_loadGroupItems();				
			} else {
				if (clickednodeelem != null) 
					_unsetSelected();	
				clickednodeelem = sender;
				sender.setAttribute("expanded","false");
				_unsetSelected();
				_collapseNode(sender);
				isloading = false;
			}
		} 
		catch (e) {
			handleException(e);
		}
	}
	
	var _setSelected = function() {
        if (clickednodeelem != null) {
            var nd1 = _getChildnode(clickednodeelem,"A");
			if (nd1 != null) {
				nd1.setAttribute("class", "selected");
            	nd1.setAttribute("className", "selected");
			}
        }
    }
    
    var _unsetSelected = function() {
        if (clickednodeelem != null) {
            var nd1 = _getChildnode(clickednodeelem,"A");
			if (nd1 != null) {
				nd1.removeAttribute("class");
				nd1.removeAttribute("className");
			}
        }
    }
	
	var _createChildnode = function(parent, child) {      
        var e1 = document.createElement("SPAN");				
		var a1 = document.createElement("A");
		var i1 = document.createElement("IMG");
        
		var tn = new TreeNode(e1,a1,i1);
					
		e1.Id = "tn_" + idx;
		idx++;
		
		_addObject(e1.Id,child);		
		a1.onclick = function() { _nodeClicked(this.parentNode) };
				
		e1.appendChild(i1);
        e1.appendChild(a1);
        if (parent != c_parentelement) {
			e1.setAttribute("class", "nodespan");
			e1.setAttribute("className", "nodespan");
		} else {
			e1.setAttribute("class", "rootnodespan");
			e1.setAttribute("className", "rootnodespan");
		}
        
		i1.setAttribute("src",child.icon_collapsed);
				
        parent.appendChild(e1);
		return tn;
    }
	
	var _createGroup = function(parent, child)
	{
		var nd1 = _createChildnode(parent,child);
		nd1.c_href.innerHTML = child.groupname;
						
		nd1.c_span.setAttribute("expanded","false");
				
		nd1.c_image.onclick = function() { _nodeDblClicked(this.parentNode) };
		nd1.c_href.ondblclick = function() { _nodeDblClicked(this.parentNode) };
			
		if (child.haschildren) {
			//nd1.c_image.setAttribute("src", "images/treeExpand_plus.gif");
			nd1.c_span.setAttribute("haschildren","true");
		}
		else {
			nd1.c_image.setAttribute("src", "images/treeExpand_none.gif");
			nd1.c_span.setAttribute("haschildren","false");
		}
		
		nd1.c_span.setAttribute("type","group");
		nd1.destroy;
	}
	
	var _createFile = function(parent,child) {
		var nd1 = _createChildnode(parent,child);
		if (child.description)
			nd1.c_href.innerHTML = child.description;	
		else
			nd1.c_href.innerHTML = child.filename;	
						
		//nd1.c_image.setAttribute("src", "images/gpxfile.gif");
				
		nd1.c_span.setAttribute("type","file");
				
		if (isOnMap(child)) {
			nd1.c_href.setAttribute("class","visibletrace");
		}		
		nd1.destroy;
	}
	
	var _createPoi = function(parent,child) {
		var nd1 = _createChildnode(parent,child);
		nd1.c_href.innerHTML = child.poiname;	
		//nd1.c_image.setAttribute("src", "images/poi.gif");
		
		nd1.c_span.setAttribute("type","poi");
		
		nd1.destroy;
	}
	
	
	
	/*
	 * public functions
	 *  
	 */
	
	this.addGroups = function(groups) {
		if (clickednodeelem == null) {
			_removeAllChilds(c_parentelement,"nodespan");
			for (var i=0;i<groups.length;i++) {
				var t1 = groups[i];
				_createGroup(c_parentelement,t1);
			}
		} else {
			clickednodeelem.setAttribute("haschildren","true");
			_collapseNode(clickednodeelem);
			/*
			if (this.isExpanded(clickednodeelem)) {
				removeChildnodes();
				for (var i = 0; i < groups.length; i++) {
					var t1 = groups[i];
					_createGroup(clickednodeelem.parentNode, t1);
				}
			} else {
				_collapseNode(clickednodeelem);
				clickednodeelem.setAttribute("haschildren","true");
			}
			*/
		}
	}
	
	this.isGroupSelected = function() {
		if (clickednodeelem != null) {
			if (clickednodeelem.getAttribute("type") == "group") 
			{
				return true;
			}
		}
		return false;	 
	}
	
	this.getSelectedGroupId = function() {
		if (this.isGroupSelected()) {
			if (clickednodeelem != null) {
				var obj = _getObject(clickednodeelem.Id);
				if (obj != null) {
					return obj.groupid;
				}
			}
		}
		return null;
	}
	
	this.isFileSelected = function() {
		if (clickednodeelem != null) {
			if (clickednodeelem.getAttribute("type") == "file") 
			{
				return true;
			}
		}
		return false;	 
	}
	
	this.getFileGroupId = function () {
		if (this.isFileSelected()) {
			//return clickednodeelem.getAttribute("groupid");
			return this.getSelectedParentGroupId();
		}
	}
	
	this.getFileName = function () {
		if (this.isFileSelected()) {
			var obj = _getObject(clickednodeelem.Id);
			if (obj != null) {
				return obj.filename;
			}
		}
		return null;
	}
	
	this.getFileDescription = function () {
		if (this.isFileSelected()) {
			var obj = _getObject(clickednodeelem.Id);
			if (obj != null) {
				return obj.description;
			}
		}
		return null;
	}
	
	this.isPoiSelected = function() {
		if (clickednodeelem != null) {
			if (clickednodeelem.getAttribute("type") == "poi") 
			{
				return true;
			}
		}
		return false;	 
	}
	
	this.getSelectedItem = function() {
		if (clickednodeelem != null) {
			return _getObject(clickednodeelem.Id);
		}
		return null;
	}
	
	this.getSelectedParentGroupId = function() {
		if (clickednodeelem != null) {
			var grp = _getParentgroup(clickednodeelem);
			if (grp != null) {
				var obj = _getObject(grp.Id);
				if (obj != null) {
					return obj.groupid;
				}
			}
		}
		return null;
	}
	
	this.getPoiLat = function () {
		if (this.isPoiSelected()) {
			var obj = _getObject(clickednodeelem.Id);
			if (obj != null) {
				return obj.lat;
			}
		}
	}
	
	this.getPoiLon = function () {
		if (this.isPoiSelected()) {
			var obj = _getObject(clickednodeelem.Id);
			if (obj != null) {
				return obj.lon;
			}
		}
	}
	
	this.getPoiId = function(){
		if (this.isPoiSelected()) {
			var obj = _getObject(clickednodeelem.Id);
			if (obj != null) {
				return obj.poiid;
			}
		}
	}
	
	this.addRootGroups = function(groups) {
		_removeAllChilds(c_parentelement,"nodespan");
		for (var i=0;i<groups.length;i++) {
			var t1 = groups[i];
			_createGroup(c_parentelement,t1);
		}
	}
		
	this.isExpanded = function(sender) {
		if (sender.getAttribute("expanded") == "true") {
			return true;
		}
		return false;
	}
	
	this.hasChildren = function(sender) {
		if (sender.getAttribute("haschildren") == "true") {
			return true;
		}
		return false;
	}
	
	this.collapseSelected = function(sethaschildren) {
		if (clickednodeelem != null) {
			clickednodeelem.setAttribute("expanded","false");
			if (sethaschildren)
				clickednodeelem.setAttribute("haschildren","true");
			else
				clickednodeelem.setAttribute("haschildren","false");
			
			_collapseNode(clickednodeelem);
			//removeChildnodes();
		}
	}
	
	this.collapseParent = function (sethaschildren) {
		if (clickednodeelem != null) {
			var grp = _getParentgroup(clickednodeelem);
			if (grp != null) {
				grp.setAttribute("expanded", "false");
				
				if (sethaschildren)
					grp.setAttribute("haschildren","true");
				else
					grp.setAttribute("haschildren","false");
					
				_collapseNode(grp);
				//_removeAllChilds(grp, "nodespan");
			}
		}
	}
	
	this.updateGroup = function(newgroup) {
		if (clickednodeelem != null) {
			if (this.isGroupSelected()) {
				var obj = _getObject(clickednodeelem.Id);
				if (obj != null) {
					_removeObject(clickednodeelem);
					_addObject(clickednodeelem.Id,newgroup);
				}
			}
		}
	}
	
	this.deleteSelected = function() {
		if (clickednodeelem != null) {
			//this.collapseParent(true);
			
			var prnt = clickednodeelem.parentNode;
			if (prnt) {
				prnt.removeChild(clickednodeelem);
			}
			
		}
		clickednodeelem = null;
		clickednode = null;
	}
	
	this.reset = function() {
		clickednodeelem = null;
		clickednode = null;
		_removeAllChilds(c_parentelement,"nodespan");
		_removeAllChilds(c_parentelement,"rootnodespan");
	}
 
 
 }