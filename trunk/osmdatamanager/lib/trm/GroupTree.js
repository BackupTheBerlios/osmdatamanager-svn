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
	var dropdone = false;
	
	var treeobjects = new Array();
	var dropitem = null;
	
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
	
	var _getObjectByItemId = function(itemid, itemtype) {
		for (var i=0;i<treeobjects.length;i++) {
			var to = treeobjects[i];
			if ((to.c_object.itemid == itemid) && (to.c_object.itemtype == itemtype))
			  return to.c_object;
		}
		return null;
	}
	
	var _getNodeByItemId = function(itemid, itemtype) {
		console.debug(itemid);
		console.debug(itemtype);
		
		return document.getElementById("tn_" + itemtype + "_" + itemid);
		/*
		for (var i=0;i<treeobjects.length;i++) {
			var to = treeobjects[i];
			if ((to.c_object.itemid == itemid) && (to.c_object.itemtype == itemtype)) {
				console.debug(to.c_id);
				return document.getElementById("tn_" + to.c_id);
			}
		}
		return null;
		*/
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
		var to = _getObjectPos(node.id);
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
	
	var _classMatch = function(node, classname) {
		if (node.getAttribute("class") == classname) {
			return true;
		} else {
			var at1 = node.getAttribute("class");
			if (at1) {
				var lst1 = at1.split(" ");
				if (lst1) {
					for (var i = 0; i < lst1.length; i++) {
						var s1 = lst1[i];
						if (s1 == classname) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	
	var _removeAllChilds = function(node, classname) {
        if (node.hasChildNodes()) {
            for (var i = (node.childNodes.length - 1); i > -1; i--) {
				var e1 = node.childNodes[i];
				if (e1.nodeName != "#text") {
					if (_classMatch(e1,classname)) {
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
	
	/**
	 * add the expandend image to a given node
	 * @param {Object} node
	 */
	var _expandNode = function(node){
		//
		var n1 = _getChildnode(node,"IMG")
		if (n1 != null) {
			var obj = _getObject(clickednodeelem.id);
			if (obj != null) {
				//n1.setAttribute("src", obj.icon_expanded);
				n1.setAttribute("src",_getIconname2(obj));
			}
		}
	}
	
	/**
	 * add the collapsed image to a given node
	 * @param {Object} node
	 */
	var _collapseNode = function(node){
		//
		var n1 = _getChildnode(node,"TABLE")
		if (n1 != null) {
			var n2 = _getChildnode(node,"IMG");
			if (n2 != null) {
				if (node.getAttribute("haschildren") == "true") {
					var obj = _getObject(clickednodeelem.id);
					if (obj != null) {
						//n2.setAttribute("src", obj.icon_collapsed);
						n2.setAttribute("src",_getIconname1(obj));
					}
				}
				else {
					n1.setAttribute("src", "images/treeExpand_none.gif");
				}
			}
		}
		_removeAllChilds(node, "nodespan");
	}
	
	/**
	 * returns a childnode with the given nodename (recursiv call)
	 * @param {Object} node
	 * @param {Object} nodename
	 */
	var _getChildnode = function(node, nodename) {
		if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++) {
				var e1 = node.childNodes[i];
				if (e1.nodeName == nodename) {
					return e1;
				} else {
					var e2 = _getChildnode(e1,nodename);
					if (e2 != null) {
						return e2;
					}
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
	
	var _getIconname1 = function(child) {
		if (child.tags != null) {
			for (var x = 0; x < child.tags.length; x++) {
				var tag1 = child.tags[x];
				if (tag1.tagname == child.tagname) {
					return tag1.icon1;
				}
			}	
		}
		return "";
	}
	
	var _getIconname2 = function(child) {
		if (child.tags != null) {
			for (var x = 0; x < child.tags.length; x++) {
				var tag1 = child.tags[x];
				if (tag1.tagname == child.tagname) {
					return tag1.icon2;
				}
			}	
		}
		return "";
	}
	
	
	/**
	 * callback after _loadGroupItems 
	 * @param {Object} response
	 */
	var _cb_loadGroupItems = function(response) {
		if (response != "msg.failed") {
			
			var prnt = response[0]; //first item in the respnse is always the parent group
			var prntNode = _getNodeByItemId(prnt.itemid,prnt.itemtype); 
			if (prntNode){
				_removeAllChilds(prntNode, "nodespan"); //remove the children
			}
						
			for (var i = 1; i < response.length; i++) {
				//var poi1 = response[i];
				//createPoi(clickednodeelem.parentNode, poi1);
				var itm1 = response[i];
				/*
				var itm2 = _getObjectByItemId(itm1.itemid,itm1.itemtype);
				if (itm2) {
					_updateItem(clickednodeelem,itm1,itm2);
				}
				else {
				*/
				if (itm1.itemtype == "Poi") 
					_createPoi(clickednodeelem, itm1);
				
				if (itm1.itemtype == "File") 
					_createFile(clickednodeelem, itm1);
				
				if (itm1.itemtype == "Group") 
					_createGroup(clickednodeelem, itm1);
				
						
			}
		}
		isloading = false;
	}
	
	/**
	 * load all child items of a group
	 */	
	var _loadGroupItems = function() {
		//
		var grpId = self.getSelectedGroupId();
		if (grpId) {
			isloading = true;
			gl_groupmanager.getGroupItems(grpId,_cb_loadGroupItems);
		}
	}
	
	/**
	 * handle single click
	 * @param {Object} sender
	 */
	var _nodeClicked = function(sender) {
        try {
            if (isloading)
                return;
			            
			console.debug("_nodeClicked 1");
			
			if (clickednodeelem != null)
                _unsetSelected();
            
			clickednodeelem = sender;			
			_setSelected();
			isloading = false;
			
			console.debug("_nodeClicked 1");
            
        } catch (e) {
            handleException(e);
			console.debug(e);
        }
    }
	
	/**
	 * handle double click
	 * @param {Object} sender
	 */
	var _nodeDblClicked = function(sender){
		try {
			console.debug("loading: " + isloading);
			console.debug(sender.nodeName);
			if (isloading) 
				return;
		
			if (!self.hasChildren(sender))
				return;
						
			isloading = true;		
			console.debug(sender);
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
	
	/**
	 * set the classname to "selected"
	 */
	var _setSelected = function() {
        if (clickednodeelem != null) {
            var nd1 = _getChildnode(clickednodeelem,"A");
			if (nd1 != null) {
				nd1.setAttribute("class", "selected");
            	nd1.setAttribute("className", "selected");
			}
        }
    }
    
	/**
	 * remove classname "selected"
	 */
    var _unsetSelected = function() {
        if (clickednodeelem != null) {
            var nd1 = _getChildnode(clickednodeelem,"A");
			if (nd1 != null) {
				nd1.removeAttribute("class");
				nd1.removeAttribute("className");
			}
        }
    }
	
	/**
	 * creates a child node element
	 * @param {Object} parent
	 * @param {Object} child
	 */
	var _onDrop = function(sender) {
		
		if (dropdone)
			return;
		
		//alert("_onDrop");
		//dojo.dnd.manager().target == null;
		console.debug("_onDrop");
		//console.debug(sender);
		/*
		sender.selectNone();
		dojo.dnd.manager().source.selectNone();
		dojo.dnd.manager().target.selectNone();
		*/
		//dojo.dnd.manager().target.accept = false;
		/*
		if (dojo.dnd.manager().nodes) {
			console.debug(dojo.dnd.manager().nodes.length);
			//document.removeChild(dojo.dnd.manager().nodes[0]);
		}
		*/
		//console.debug(dojo.dnd.manager().source);
		
		
		var t = dojo.dnd.manager().target;
		//console.debug(t.parent.innerHTML);
		if (t) {
			var span = t.parent;
			if (span) {
				console.log("_nodeDblClicked");
				console.log(span.innerHTML);
				span.setAttribute("expanded","false");
				span.setAttribute("haschildren","true");
				_nodeDblClicked(span);
			}
		}
		dropdone = true;
	}
	
	var _mouseOver = function(sender) {
		//alert("ovr");
		/*
		dojo.dnd.manager().canDrop(true);
		if (dojo.dnd.manager().target) {
			var t = dojo.dnd.manager().target;
			console.debug(t.innerHTML);
		}
		if (dojo.dnd.nodes) {
			console.debug(dojo.dnd.nodes.length);
		}
		*/
		dropdone = false;
	}
	
	var _check = function(sender,arg) {
		/*
		if (dojo.dnd.manager().target) {
			var t = dojo.dnd.manager().target;
			
			console.debug(t);
			
		}
		
		if (dojo.dnd.manager().target) {
			var s = dojo.dnd.manager().source;
			console.debug(s.innerHTML);
		}
		*/
		return true;
	}
	
	var _updateItem = function (parent,oldchild,newchild) {
		alert("update");
	}
	
	var _createChildnode = function(parent, child) {      
        var e1 = dojo.doc.createElement("SPAN");				
		//var a1 = document.createElement("DIV");
		//var a1 = dojo.doc.createElement("div");
		var a1 = dojo.doc.createElement("A");
		
		var i1 = dojo.doc.createElement("IMG");
        
		var t1 = dojo.doc.createElement("TABLE");
		var r1 = dojo.doc.createElement("TR");
		var td1 = dojo.doc.createElement("TD");
		var td2 = dojo.doc.createElement("TD");
		try {
			/*
			var dnd = new dojo.dnd.Target(a1, {
				accept: ["dnd_source"]
			});
			*/
			//td2.id = "td_" + treeobjects.length;
			//td2.setAttribute("accept","dnd_source");
			
			var dnd = new dojo.dnd.Source(e1,{accept:["dnd_source"]});
			//dnd.parent = t1;
			dojo.connect(dnd, "onDndDrop", this, _onDrop);
			dnd.checkAcceptance = _check;
		//	a1.setAttribute("accept","dnd_source");
		} catch (e) {
			alert(e);
		}
		
		e1.appendChild(t1);
		t1.appendChild(r1);
		r1.appendChild(td1);
		r1.appendChild(td2);
		
		var tn = new TreeNode(e1,a1,i1);
					
		e1.id = "tn_" + child.itemtype + "_" + child.itemid;
		idx++;
		
		_addObject(e1.id,child);		    
		a1.onclick = function() { _nodeClicked(this.parentNode.parentNode.parentNode.parentNode) }; // a->td->tr->table->span
		a1.onmouseover = function() {_mouseOver(this)};
		
		e1.appendChild(i1);
        e1.appendChild(a1);
				
        if (parent != c_parentelement) {
			e1.setAttribute("class", "nodespan");
			e1.setAttribute("className", "nodespan");
		} else {
			e1.setAttribute("class", "rootnodespan");
			e1.setAttribute("className", "rootnodespan");
		}
        
		a1.innerHTML = child.itemname;
		e1.setAttribute("expanded","false");
		i1.setAttribute("src",_getIconname1(child));
		
		if (child.haschildren) {
			e1.setAttribute("haschildren","true");
		}
		else {
			//i1.setAttribute("src", "images/treeExpand_none.gif");
			e1.setAttribute("haschildren","false");			
		}
		
		e1.setAttribute("type",child.itemtype.toLowerCase());
		
		td1.appendChild(i1);
		td2.appendChild(a1);		
		
        parent.appendChild(e1);
		return tn;
    }
	
	/**
	 * creats a group element in the tree
	 * @param {Object} parent
	 * @param {Object} child
	 */
	var _createGroup = function(parent, child)
	{
		var nd1 = _createChildnode(parent,child);
							
		nd1.c_image.onclick = function() { _nodeDblClicked(this.parentNode.parentNode.parentNode.parentNode) };   // img->td->tr->table->span
		nd1.c_href.ondblclick = function() { _nodeDblClicked(this.parentNode.parentNode.parentNode.parentNode) }; // a->td->tr->table->span
		
		nd1.destroy;
	}
	
	/**
	 * creates a file element in the tree
	 * @param {Object} parent
	 * @param {Object} child
	 */
	var _createFile = function(parent,child) {
		var nd1 = _createChildnode(parent,child);
		/*
		if (child.description)
			nd1.c_href.innerHTML = child.description;	
		else
			nd1.c_href.innerHTML = child.filename;	
				
		nd1.c_span.setAttribute("type","file");
		if (isOnMap(child)) {
			nd1.c_href.setAttribute("class","visibletrace");
		}		
		*/
		nd1.destroy;
	}
	
	/**
	 * creates a poi element in the tree
	 * @param {Object} parent
	 * @param {Object} child
	 */
	var _createPoi = function(parent,child) {
		var nd1 = _createChildnode(parent,child);
		/*
		nd1.c_href.innerHTML = child.poiname;	
		//nd1.c_image.setAttribute("src", "images/poi.gif");
		
		nd1.c_span.setAttribute("type","poi");
		*/
		nd1.destroy;
	}
	
	
	
	/*
	 * public functions
	 *  
	 */
	
	this.onDrop = function() {
		alert("onDrop");
	}
	
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
				var obj = _getObject(clickednodeelem.id);
				if (obj != null) {
					return obj.itemid;
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
			var obj = _getObject(clickednodeelem.id);
			if (obj != null) {
				return obj.filename;
			}
		}
		return null;
	}
	
	this.getFileDescription = function () {
		if (this.isFileSelected()) {
			var obj = _getObject(clickednodeelem.id);
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
			return _getObject(clickednodeelem.id);
		}
		return null;
	}
	
	this.getSelectedParentGroupId = function() {
		if (clickednodeelem != null) {
			var grp = _getParentgroup(clickednodeelem);
			if (grp != null) {
				var obj = _getObject(grp.id);
				if (obj != null) {
					return obj.itemid;
				}
			}
		}
		return null;
	}
	
	this.getPoiLat = function () {
		if (this.isPoiSelected()) {
			var obj = _getObject(clickednodeelem.id);
			if (obj != null) {
				return obj.lat;
			}
		}
	}
	
	this.getPoiLon = function () {
		if (this.isPoiSelected()) {
			var obj = _getObject(clickednodeelem.id);
			if (obj != null) {
				return obj.lon;
			}
		}
	}
	
	this.getPoiId = function(){
		if (this.isPoiSelected()) {
			var obj = _getObject(clickednodeelem.id);
			if (obj != null) {
				return obj.itemid;
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
				var obj = _getObject(clickednodeelem.id);
				if (obj != null) {
					_removeObject(clickednodeelem);
					_addObject(clickednodeelem.id,newgroup);
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
	
	this.setDropItem = function(item) {
		dropitem = item;	
	}
	
	this.reset = function() {
		clickednodeelem = null;
		clickednode = null;
		_removeAllChilds(c_parentelement,"nodespan");
		_removeAllChilds(c_parentelement,"rootnodespan");
	}
 
 
 }