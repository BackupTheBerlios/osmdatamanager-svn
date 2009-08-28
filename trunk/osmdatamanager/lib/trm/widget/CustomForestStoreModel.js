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

dojo.provide("trm.widget.CustomForestStoreModel");
dojo.require("dijit.Tree");

dojo.declare("trm.widget.CustomForestStoreModel", [dijit.tree.ForestStoreModel], {
	
	//doload: true,
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	/**
	 * 
	 * @param {Object} item
	 */
	mayHaveChildren: function(item) {
		try {
			var val = this.inherited(arguments);
			if (item.root != true) {	
				if (this.store.getValue(item, 'haschildren') == true) 
					return true;
			}
		
		} catch (e) {
			console.error(e);
		}
		return false;
	},
	
	/**
	 * 
	 * @param {Object} keywordArgs
	 * @param {Object} parentInfo
	 */
	beforeNewItem: function(keywordArgs, parentInfo) {
		
	},
	
	/**
	 * 
	 * @param {Object} args
	 * @param {Object} parent
	 */
	newItem: function(args, parent) {
		this.beforeNewItem(args, /* Object? */ parent);
		return this.inherited(arguments);
	},
				
	/**
	 * 
	 * @param {Object} parentItem
	 * @param {Object} complete_cb
	 * @param {Object} error_cb
	 */
	getChildren: function(parentItem, complete_cb, error_cb) {
		try {
			if (parentItem.root != true) {
				//if (this.doload) {
					var parentid = this.store.getValue(parentItem, 'itemid');
					if (parentid != -1) {
						//this.store.close();
						this.store.url = "groupfunctions.php?action=msg.getgrpitems&treedata=yes&groupid=" + parentid;
						this.store.fetch({
							query: {
								'parentid': parentid
							},
							onComplete: complete_cb,
							onError: error_cb
						});
					}
			} else {
				this.store.url = "groupfunctions.php?action=msg.getgrpitems&treedata=yes&groupid=" + parentid;
						this.store.fetch({
							query: {
								'parentid': -1
							},
							onComplete: complete_cb,
							onError: error_cb
						});
			}
			return this.inherited(arguments);
		} catch (e) {
			console.error(e);
		}
	}
	
});