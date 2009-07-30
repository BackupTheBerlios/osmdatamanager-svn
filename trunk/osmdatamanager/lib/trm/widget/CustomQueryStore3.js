dojo.provide("trm.widget.CustomQueryStore");
dojo.require("dojox.data.QueryReadStore");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.declare("trm.widget.CustomQueryStore", [dojox.data.QueryReadStore], {
//dojo.declare("trm.widget.CustomQueryStore", [dojo.data.ItemFileWriteStore], {
	
	dndTargetItem: null,
	_saveInProgress: false,
	_loadFinished: false,
	
	postCreate: function() {
		this.inherited(arguments);
	},
	
	constructor: function(/* object */ keywordParameters){
		// For keeping track of changes so that we can implement isDirty and revert
		this._pending = {
			_newItems:{}, 
			_modifiedItems:{}, 
			_deletedItems:{}
		};
		/*
		this._storeRefPropName = "_S";  // Default name for the store reference to attach to every item.
		this._itemNumPropName = "_0"; // Default Item Id for isItem to attach to every item.
		this._rootItemPropName = "_RI"; // Default Item Id for isItem to attach to every item.
		*/
		this._storeRefPropName = "r";  // Default name for the store reference to attach to every item.
		this._itemNumPropName = "i"; // Default Item Id for isItem to attach to every item.
		this._rootItemPropName = "_RI"; // Default Item Id for isItem to attach to every item.
	},
	
	newItem___: function(keywordArgs, parentInfo) {
		console.debug("newItem");
				
		console.debug(keywordArgs);
		console.debug(parentInfo);
		console.debug(dojo.dnd.manager().source);
		console.debug(dojo.dnd.manager().target);
		console.debug("=== end newItem ====");
		
		return {itemname: "Halloaaa", name: "aloha", itemid: 255};
		/*
		console.debug(this.dndTargetItem);
		*/
		/*
		this.url = "groupfunctions.php?action=msg.getgrpitems&treedata=yes&groupid=" + 247;
		this.fetch({
					query: {
						'parentid': 247
					}
		});
		
		return null;
		*/
	},
	
	_forceLoad: function(){
		//	summary: 
		//		Internal function to force a load of the store if it hasn't occurred yet.  This is required
		//		for specific functions to work properly.  
		var self = this;
		if(this._jsonFileUrl){
				var getArgs = {
					url: self._jsonFileUrl, 
					handleAs: "json-comment-optional",
					sync: true
				};
			var getHandler = dojo.xhrGet(getArgs);
			getHandler.addCallback(function(data){
				try{
					//Check to be sure there wasn't another load going on concurrently 
					//So we don't clobber data that comes in on it.  If there is a load going on
					//then do not save this data.  It will potentially clobber current data.
					//We mainly wanted to sync/wait here.
					//TODO:  Revisit the loading scheme of this store to improve multi-initial
					//request handling.
					if (self._loadInProgress !== true && !self._loadFinished) {
						self._getItemsFromLoadedData(data);
						self._loadFinished = true;
					}
				}catch(e){
					console.log(e);
					throw e;
				}
			});
			getHandler.addErrback(function(error){
				throw error;
			});
		}else if(this._jsonData){
			self._getItemsFromLoadedData(self._jsonData);
			self._jsonData = null;
			self._loadFinished = true;
		} 
	},
	
	_assert: function(/* boolean */ condition){
		if(!condition) {
			throw new Error("assertion failed in ItemFileWriteStore");
		}
	},
	
	getFeatures: function(){
		return {
			'dojo.data.api.Read': true,
			'dojo.data.api.Identity': 'id'
		};
	},
	
	_getIdentifierAttribute: function(){
		try {
			var identifierAttribute = this.getFeatures()['dojo.data.api.Identity'];
			// this._assert((identifierAttribute === Number) || (dojo.isString(identifierAttribute)));
			console.debug("..." + identifierAttribute);
			return identifierAttribute;
		} catch (e) {
			console.error(e);
			return "";
		}
	},
	
	_getValueOrValues: function(/* item */ item, /* attribute-name-string */ attribute){
		var valueOrValues = undefined;
		if(this.hasAttribute(item, attribute)){
			var valueArray = this.getValues(item, attribute);
			if(valueArray.length == 1){
				valueOrValues = valueArray[0];
			}else{
				valueOrValues = valueArray;
			}
		}
		return valueOrValues;
	},
	
	_setValueOrValues: function(/* item */ item, /* attribute-name-string */ attribute, /* anything */ newValueOrValues, /*boolean?*/ callOnSet){
		this._assert(!this._saveInProgress);
		
		// Check for valid arguments
		this._assertIsItem(item);
		this._assert(dojo.isString(attribute));
		this._assert(typeof newValueOrValues !== "undefined");

		// Make sure the user isn't trying to change the item's identity
		var identifierAttribute = this._getIdentifierAttribute();
		if(attribute == identifierAttribute){
			throw new Error("ItemFileWriteStore does not have support for changing the value of an item's identifier.");
		}

		// To implement the Notification API, we need to make a note of what
		// the old attribute value was, so that we can pass that info when
		// we call the onSet method.
		var oldValueOrValues = this._getValueOrValues(item, attribute);

		var identity = this.getIdentity(item);
		if(!this._pending._modifiedItems[identity]){
			// Before we actually change the item, we make a copy of it to 
			// record the original state, so that we'll be able to revert if 
			// the revert method gets called.  If the item has already been
			// modified then there's no need to do this now, since we already
			// have a record of the original state.
			var copyOfItemState = {};
			for(var key in item){
				if((key === this._storeRefPropName) || (key === this._itemNumPropName) || (key === this._rootItemPropName)){
					copyOfItemState[key] = item[key];
				}else{
					var valueArray = item[key];
					var copyOfValueArray = [];
					for(var i = 0; i < valueArray.length; ++i){
						copyOfValueArray.push(valueArray[i]);
					}
					copyOfItemState[key] = copyOfValueArray;
				}
			}
			// Now mark the item as dirty, and save the copy of the original state
			this._pending._modifiedItems[identity] = copyOfItemState;
		}
		
		// Okay, now we can actually change this attribute on the item
		var success = false;
		if(dojo.isArray(newValueOrValues) && newValueOrValues.length === 0){
			// If we were passed an empty array as the value, that counts
			// as "unsetting" the attribute, so we need to remove this 
			// attribute from the item.
			success = delete item[attribute];
			newValueOrValues = undefined; // used in the onSet Notification call below
		}else{
			var newValueArray = [];
			if(dojo.isArray(newValueOrValues)){
				var newValues = newValueOrValues;
				// Unforunately, it's not safe to just do this:
				//    newValueArray = newValues;
				// Instead, we need to take each value in the values array and copy 
				// it into the new array, so that our internal data structure won't  
				// get corrupted if the user mucks with the values array *after*
				// calling setValues().
				for(var j = 0; j < newValues.length; ++j){
					newValueArray.push(newValues[j]);
				}
			}else{
				var newValue = newValueOrValues;
				newValueArray.push(newValue);
			}
			item[attribute] = newValueArray;
			success = true;
		}

		// Now we make the dojo.data.api.Notification call
		if(callOnSet){
			this.onSet(item, attribute, oldValueOrValues, newValueOrValues); 
		}
		return success; // boolean
	},
	
	newItem: function(/* Object? */ keywordArgs, /* Object? */ parentInfo){
		// summary: See dojo.data.api.Write.newItem()
		console.debug(keywordArgs);
		console.debug(parentInfo);
		console.debug("items");
		console.debug(this._items);
		
		
		this._assert(!this._saveInProgress);

		if (!this._loadFinished){
			// We need to do this here so that we'll be able to find out what
			// identifierAttribute was specified in the data file.
			this._forceLoad();
		}

		if(typeof keywordArgs != "object" && typeof keywordArgs != "undefined"){
			throw new Error("newItem() was passed something other than an object");
		}
		var newIdentity = null;
		var identifierAttribute = this._getIdentifierAttribute();
		if(identifierAttribute === Number){
			//newIdentity = this._arrayOfAllItems.length;
			newIdentity = this._items.length;
		}else{
			newIdentity = keywordArgs[identifierAttribute];
			console.debug("newIdentity: "+  newIdentity);
			if (typeof newIdentity === "undefined"){
				throw new Error("newItem() was not passed an identity for the new item");
			}
			if (dojo.isArray(newIdentity)){
				throw new Error("newItem() was not passed an single-valued identity");
			}
		}
		
		// make sure this identity is not already in use by another item, if identifiers were 
		// defined in the file.  Otherwise it would be the item count, 
		// which should always be unique in this case.
		if(this._itemsByIdentity){
			this._assert(typeof this._itemsByIdentity[newIdentity] === "undefined");
		}
		this._assert(typeof this._pending._newItems[newIdentity] === "undefined");
		this._assert(typeof this._pending._deletedItems[newIdentity] === "undefined");
		
		var newItem = {};
		newItem[this._storeRefPropName] = this;		
		newItem[this._itemNumPropName] = {}; //this._items.length; //this._arrayOfAllItems.length;
		if(this._itemsByIdentity){
			this._itemsByIdentity[newIdentity] = newItem;
		}
		//this._arrayOfAllItems.push(newItem);
		this._items.push(newItem);

		//We need to construct some data for the onNew call too...
		var pInfo = null;
		
		// Now we need to check to see where we want to assign this thingm if any.
		if(parentInfo && parentInfo.parent && parentInfo.attribute){
			pInfo = {
				item: parentInfo.parent,
				attribute: parentInfo.attribute,
				oldValue: undefined
			};

			//See if it is multi-valued or not and handle appropriately
			//Generally, all attributes are multi-valued for this store
			//So, we only need to append if there are already values present.
			var values = this.getValues(parentInfo.parent, parentInfo.attribute);
			if(values && values.length > 0){
				var tempValues = values.slice(0, values.length);
				if(values.length === 1){
					pInfo.oldValue = values[0];
				}else{
					pInfo.oldValue = values.slice(0, values.length);
				}
				tempValues.push(newItem);
				this._setValueOrValues(parentInfo.parent, parentInfo.attribute, tempValues, false);
				pInfo.newValue = this.getValues(parentInfo.parent, parentInfo.attribute);
			}else{
				this._setValueOrValues(parentInfo.parent, parentInfo.attribute, newItem, false);
				pInfo.newValue = newItem;
			}
		}else{
			//Toplevel item, add to both top list as well as all list.
			newItem[this._rootItemPropName]=true;
			//this._arrayOfTopLevelItems.push(newItem);
			console.debug("checkhere !!!!!!");	
			this._items.push(newItem);
		}
		
		this._pending._newItems[newIdentity] = newItem;
		
		//Clone over the properties to the new item
		for(var key in keywordArgs){
			if(key === this._storeRefPropName || key === this._itemNumPropName){
				// Bummer, the user is trying to do something like
				// newItem({_S:"foo"}).  Unfortunately, our superclass,
				// ItemFileReadStore, is already using _S in each of our items
				// to hold private info.  To avoid a naming collision, we 
				// need to move all our private info to some other property 
				// of all the items/objects.  So, we need to iterate over all
				// the items and do something like: 
				//    item.__S = item._S;
				//    item._S = undefined;
				// But first we have to make sure the new "__S" variable is 
				// not in use, which means we have to iterate over all the 
				// items checking for that.
				throw new Error("encountered bug in ItemFileWriteStore.newItem");
			}
			var value = keywordArgs[key];
			if(!dojo.isArray(value)){
				console.debug(value);
				value = [value];
				
			}
			newItem[this._itemNumPropName][key] = value[0];
			console.debug(value);
		}
		this.onNew(newItem, pInfo); // dojo.data.api.Notification call
		console.debug("new: ");
		console.debug(newItem);
		console.debug(this._items);
		this._assertIsItem(newItem);
		return newItem; // item
	}
	
	
});