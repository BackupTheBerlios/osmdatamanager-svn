dojo.provide("trm.widget.CustomQueryStore");
dojo.require("dojox.data.QueryReadStore");
dojo.require("dojo.data.ItemFileWriteStore");

//dojo.declare("trm.widget.CustomQueryStore", [dojox.data.QueryReadStore], {
dojo.declare("trm.widget.CustomQueryStore", [dojo.data.ItemFileWriteStore], {
	
	constructor: function(/* object */keywordParameters){
		//this.inherited(arguments);
		this.requestMethod = "get";
		this._arrayOfAllItems = [];
		this._rootcall = true;
		this.id_offset = 1;
		this.dofetch = true;
	},
	
	_fetchItems_2: function(request, fetchHandler, errorHandler){
		try {
			console.debug("_fetchItems");
			console.debug(request);
			console.debug(fetchHandler);
			console.debug("_loadInProgress");
			console.debug(this._loadInProgress);
			console.debug("_fetchItems");
			
			//this._fetchItems__(request, fetchHandler, errorHandler);
			
			if (this._loadFinished)
				this._rootcall = false;
			
			//this._loadFinished = false;
			if ((this.url != null) && (this.url != "")) 
				this._jsonFileUrl = this.url;
			
			console.debug("url: " + this.url);
			console.debug(this._arrayOfAllItems);
			this.inherited(arguments);
			console.debug(this._arrayOfAllItems);
		} catch (e) {
			console.error(e);
		}
	},
	
	beforeNewItem: function(/* Object? */ keywordArgs, /* Object? */ parentInfo) {
		
	},
	
	newItem: function(/* Object? */ keywordArgs, /* Object? */ parentInfo){
		
		console.debug("newItem");
		console.debug(keywordArgs);
		console.debug(parentInfo);
		/*
		var id1 = keywordArgs.id;
		keywordArgs.id = id1 + "_" + this.id_offset;
		keywordArgs["tagname"] = "Group";
		this.id_offset++;
		
		this._loadFinished = true;
		*/
		
		this.beforeNewItem(keywordArgs, /* Object? */ parentInfo);
				
		//console.debug(keywordArgs);
		var val = this.inherited(arguments);
		console.debug(val);
		console.debug("::: end newItem");
		return val;
	},
	
	_getItemsArray: function(/*object?*/queryOptions){
		//	summary: 
		//		Internal function to determine which list of items to search over.
		//	queryOptions: The query options parameter, if any.
		console.debug("_getItemsArray");
		return this.inherited(arguments);
		
		console.debug(queryOptions);
		return this._arrayOfAllItems; 
		
		if(queryOptions && queryOptions.deep) {
			return this._arrayOfAllItems; 
		}
		return this._arrayOfTopLevelItems;
	},
		
	_fetchItems: function(	/* Object */ keywordArgs, 
							/* Function */ findCallback, 
							/* Function */ errorCallback){
		
		/*
		if (!this.dofetch)
			return;
		*/
			
		console.debug("_fetchItems");
		console.debug(keywordArgs);
		console.debug(findCallback);
		return this.inherited(arguments);
		
		if (this._loadFinished)
				this._rootcall = false;
			
			this._loadFinished = false;
			if ((this.url != null) && (this.url != "")) 
				this._jsonFileUrl = this.url;
		
		
		//	summary: 
		//		See dojo.data.util.simpleFetch.fetch()
		var self = this;
		var filter = function(requestArgs, arrayOfItems){
			console.debug("filter");
			var rslt = false;
			
			var items = [];
			if(requestArgs.query){
				var ignoreCase = requestArgs.queryOptions ? requestArgs.queryOptions.ignoreCase : false; 

				//See if there are any string values that can be regexp parsed first to avoid multiple regexp gens on the
				//same value for each item examined.  Much more efficient.
				var regexpList = {};
				for(var key in requestArgs.query){
					var value = requestArgs.query[key];
					if(typeof value === "string"){
						regexpList[key] = dojo.data.util.filter.patternToRegExp(value, ignoreCase);
					}
				}

				for(var i = 0; i < arrayOfItems.length; ++i){
					var match = true;
					var candidateItem = arrayOfItems[i];
					console.debug(candidateItem);
					if(candidateItem === null){
						match = false;
					}else{
						for(var key in requestArgs.query) {
							var value = requestArgs.query[key];
							if (!self._containsValue(candidateItem, key, value, regexpList[key])){
								match = false;
							}
						}
					}
					if(match){
						console.debug("match");
						items.push(candidateItem);
						rslt = true;
					}
				}
				if (rslt) {
					findCallback(items, requestArgs);
				}
				return rslt;
			}else{
				console.debug("no query");
				
				// We want a copy to pass back in case the parent wishes to sort the array. 
				// We shouldn't allow resort of the internal list, so that multiple callers 
				// can get lists and sort without affecting each other.  We also need to
				// filter out any null values that have been left as a result of deleteItem()
				// calls in ItemFileWriteStore.
				for(var i = 0; i < arrayOfItems.length; ++i){
					var item = arrayOfItems[i];
					if(item !== null){
						items.push(item);
					}
				}
				findCallback(items, requestArgs);
			}
		};

		//if(this._loadFinished){
		if (filter(keywordArgs, this._getItemsArray(keywordArgs.queryOptions))) {
			return;
		}else{

			if(this._jsonFileUrl){
				//If fetches come in before the loading has finished, but while
				//a load is in progress, we have to defer the fetching to be 
				//invoked in the callback.
				if(this._loadInProgress){
					console.debug("_loadInProgress")
					this._queuedFetches.push({args: keywordArgs, filter: filter});
				}else{
					console.debug("not _loadInProgress")
					this._loadInProgress = true;
					var getArgs = {
							url: self._jsonFileUrl, 
							handleAs: "json-comment-optional"
						};
					var getHandler = dojo.xhrGet(getArgs);
					getHandler.addCallback(function(data){
						try{
							self._getItemsFromLoadedData(data);
							self._loadFinished = true;
							self._loadInProgress = false;
							console.debug("callfilter");
							filter(keywordArgs, self._getItemsArray(keywordArgs.queryOptions));
							self._handleQueuedFetches();
						}catch(e){
							self._loadFinished = true;
							self._loadInProgress = false;
							errorCallback(e, keywordArgs);
						}
					});
					getHandler.addErrback(function(error){
						self._loadInProgress = false;
						errorCallback(error, keywordArgs);
					});
				}
			}else if(this._jsonData){
				try{
					console.debug("_jsonData");
					this._loadFinished = true;
					this._getItemsFromLoadedData(this._jsonData);
					this._jsonData = null;
					filter(keywordArgs, this._getItemsArray(keywordArgs.queryOptions));
				}catch(e){
					errorCallback(e, keywordArgs);
				}
			}else{
				errorCallback(new Error("dojo.data.ItemFileReadStore: No JSON source data was provided as either URL or a nested Javascript object."), keywordArgs);
			}
		}
	},
	
	_getItemsFromLoadedData: function(/* Object */ dataObject){
		
		console.debug("_getItemsFromLoadedData");
		//	summary:
		//		Function to parse the loaded data into item format and build the internal items array.
		//	description:
		//		Function to parse the loaded data into item format and build the internal items array.
		//
		//	dataObject:
		//		The JS data object containing the raw data to convery into item format.
		//
		// 	returns: array
		//		Array of items in store item format.
		
		// First, we define a couple little utility functions...
				
		function valueIsAnItem(/* anything */ aValue){
			// summary:
			//		Given any sort of value that could be in the raw json data,
			//		return true if we should interpret the value as being an
			//		item itself, rather than a literal value or a reference.
			// examples:
			// 		false == valueIsAnItem("Kermit");
			// 		false == valueIsAnItem(42);
			// 		false == valueIsAnItem(new Date());
			// 		false == valueIsAnItem({_type:'Date', _value:'May 14, 1802'});
			// 		false == valueIsAnItem({_reference:'Kermit'});
			// 		true == valueIsAnItem({name:'Kermit', color:'green'});
			// 		true == valueIsAnItem({iggy:'pop'});
			// 		true == valueIsAnItem({foo:42});
			var isItem = (
				(aValue != null) &&
				(typeof aValue == "object") &&
				(!dojo.isArray(aValue)) &&
				(!dojo.isFunction(aValue)) &&
				(aValue.constructor == Object) &&
				(typeof aValue._reference == "undefined") && 
				(typeof aValue._type == "undefined") && 
				(typeof aValue._value == "undefined")
			);
			return isItem;
		}
		
		var self = this;
		function addItemAndSubItemsToArrayOfAllItems(/* Item */ anItem){
			self._arrayOfAllItems.push(anItem);
			for(var attribute in anItem){
				var valueForAttribute = anItem[attribute];
				if(valueForAttribute){
					if(dojo.isArray(valueForAttribute)){
						var valueArray = valueForAttribute;
						for(var k = 0; k < valueArray.length; ++k){
							var singleValue = valueArray[k];
							if(valueIsAnItem(singleValue)){
								addItemAndSubItemsToArrayOfAllItems(singleValue);
							}
						}
					}else{
						if(valueIsAnItem(valueForAttribute)){
							addItemAndSubItemsToArrayOfAllItems(valueForAttribute);
						}
					}
				}
			}
		}
		
		function _itemLoaded(item) {
			for (var i=0;i<self._arrayOfAllItems.length;++i) {
				var itm1 = self._arrayOfAllItems[i];
				if (itm1.id === item.id) {
					console.debug("_itemLoaded");
					return true;
				}
			}
			return false;
		}

		this._labelAttr = dataObject.label;

		// We need to do some transformations to convert the data structure
		// that we read from the file into a format that will be convenient
		// to work with in memory.

		// Step 1: Walk through the object hierarchy and build a list of all items
		var i;
		var item;
		
		
		//this._arrayOfAllItems = [];
		if (this._rootcall) {
			this._arrayOfAllItems = [];	
			this._arrayOfTopLevelItems = dataObject.items;
			
			for (var i = 0; i < this._arrayOfTopLevelItems.length; ++i) {
				item = this._arrayOfTopLevelItems[i];
				addItemAndSubItemsToArrayOfAllItems(item);
				item[this._rootItemPropName] = true;
			}
		} else {
			try {
				for (var i = 0; i < dataObject.items.length; ++i) {
					item = dataObject.items[i];
					if (!_itemLoaded(item)) {
						addItemAndSubItemsToArrayOfAllItems(item);
						item[this._rootItemPropName] = true;
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
		

		// Step 2: Walk through all the attribute values of all the items, 
		// and replace single values with arrays.  For example, we change this:
		//		{ name:'Miss Piggy', pets:'Foo-Foo'}
		// into this:
		//		{ name:['Miss Piggy'], pets:['Foo-Foo']}
		// 
		// We also store the attribute names so we can validate our store  
		// reference and item id special properties for the O(1) isItem
		var allAttributeNames = {};
		var key;

		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i];
			for(key in item){
				if (key !== this._rootItemPropName)
				{
					var value = item[key];
					if(value !== null){
						if(!dojo.isArray(value)){
							item[key] = [value];
						}
					}else{
						item[key] = [null];
					}
				}
				allAttributeNames[key]=key;
			}
		}

		// Step 3: Build unique property names to use for the _storeRefPropName and _itemNumPropName
		// This should go really fast, it will generally never even run the loop.
		while(allAttributeNames[this._storeRefPropName]){
			this._storeRefPropName += "_";
		}
		while(allAttributeNames[this._itemNumPropName]){
			this._itemNumPropName += "_";
		}

		// Step 4: Some data files specify an optional 'identifier', which is 
		// the name of an attribute that holds the identity of each item. 
		// If this data file specified an identifier attribute, then build a 
		// hash table of items keyed by the identity of the items.
		var arrayOfValues = null;

		var identifier = dataObject.identifier;
		this._itemsByIdentity = {};
		if(identifier){
			this._features['dojo.data.api.Identity'] = identifier;
			for(i = 0; i < this._arrayOfAllItems.length; ++i){
				item = this._arrayOfAllItems[i];
				arrayOfValues = item[identifier];
				var identity = arrayOfValues[0];
				if(!this._itemsByIdentity[identity]){
					this._itemsByIdentity[identity] = item;
				}else{
					if(this._jsonFileUrl){
						throw new Error("dojo.data.ItemFileReadStore:  The json data as specified by: [" + this._jsonFileUrl + "] is malformed.  Items within the list have identifier: [" + identifier + "].  Value collided: [" + identity + "]");
					}else if(this._jsonData){
						throw new Error("dojo.data.ItemFileReadStore:  The json data provided by the creation arguments is malformed.  Items within the list have identifier: [" + identifier + "].  Value collided: [" + identity + "]");
					}
				}
			}
		}else{
			this._features['dojo.data.api.Identity'] = Number;
		}

		// Step 5: Walk through all the items, and set each item's properties 
		// for _storeRefPropName and _itemNumPropName, so that store.isItem() will return true.
		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i];
			item[this._storeRefPropName] = this;
			item[this._itemNumPropName] = i;
		}

		// Step 6: We walk through all the attribute values of all the items,
		// looking for type/value literals and item-references.
		//
		// We replace item-references with pointers to items.  For example, we change:
		//		{ name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
		// into this:
		//		{ name:['Kermit'], friends:[miss_piggy] } 
		// (where miss_piggy is the object representing the 'Miss Piggy' item).
		//
		// We replace type/value pairs with typed-literals.  For example, we change:
		//		{ name:['Nelson Mandela'], born:[{_type:'Date', _value:'July 18, 1918'}] }
		// into this:
		//		{ name:['Kermit'], born:(new Date('July 18, 1918')) } 
		//
		// We also generate the associate map for all items for the O(1) isItem function.
		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i]; // example: { name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
			for(key in item){
				arrayOfValues = item[key]; // example: [{_reference:{name:'Miss Piggy'}}]
				for(var j = 0; j < arrayOfValues.length; ++j) {
					value = arrayOfValues[j]; // example: {_reference:{name:'Miss Piggy'}}
					if(value !== null && typeof value == "object"){
						if(value._type && value._value){
							var type = value._type; // examples: 'Date', 'Color', or 'ComplexNumber'
							var mappingObj = this._datatypeMap[type]; // examples: Date, dojo.Color, foo.math.ComplexNumber, {type: dojo.Color, deserialize(value){ return new dojo.Color(value)}}
							if(!mappingObj){ 
								throw new Error("dojo.data.ItemFileReadStore: in the typeMap constructor arg, no object class was specified for the datatype '" + type + "'");
							}else if(dojo.isFunction(mappingObj)){
								arrayOfValues[j] = new mappingObj(value._value);
							}else if(dojo.isFunction(mappingObj.deserialize)){
								arrayOfValues[j] = mappingObj.deserialize(value._value);
							}else{
								throw new Error("dojo.data.ItemFileReadStore: Value provided in typeMap was neither a constructor, nor a an object with a deserialize function");
							}
						}
						if(value._reference){
							var referenceDescription = value._reference; // example: {name:'Miss Piggy'}
							if(dojo.isString(referenceDescription)){
								// example: 'Miss Piggy'
								// from an item like: { name:['Kermit'], friends:[{_reference:'Miss Piggy'}]}
								arrayOfValues[j] = this._itemsByIdentity[referenceDescription];
							}else{
								// example: {name:'Miss Piggy'}
								// from an item like: { name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
								for(var k = 0; k < this._arrayOfAllItems.length; ++k){
									var candidateItem = this._arrayOfAllItems[k];
									var found = true;
									for(var refKey in referenceDescription){
										if(candidateItem[refKey] != referenceDescription[refKey]){ 
											found = false; 
										}
									}
									if(found){ 
										arrayOfValues[j] = candidateItem; 
									}
								}
							}
						}
					}
				}
			}
		}
		
		console.debug(this._arrayOfAllItems.length);
		console.debug(this._arrayOfAllItems);
	},
	
	/**
	 * _fetchItems function from dojox.data.QueryReadStore
	 * @param {Object} request
	 * @param {Object} fetchHandler
	 * @param {Object} errorHandler
	 */
	_fetchItems__: function(request, fetchHandler, errorHandler){
		//	summary:
		// 		The request contains the data as defined in the Read-API.
		// 		Additionally there is following keyword "serverQuery".
		//
		//	The *serverQuery* parameter, optional.
		//		This parameter contains the data that will be sent to the server.
		//		If this parameter is not given the parameter "query"'s
		//		data are sent to the server. This is done for some reasons:
		//		- to specify explicitly which data are sent to the server, they
		//		  might also be a mix of what is contained in "query", "queryOptions"
		//		  and the paging parameters "start" and "count" or may be even
		//		  completely different things.
		//		- don't modify the request.query data, so the interface using this
		//		  store can rely on unmodified data, as the combobox dijit currently
		//		  does it, it compares if the query has changed
		//		- request.query is required by the Read-API
		//
		// 		I.e. the following examples might be sent via GET:
		//		  fetch({query:{name:"abc"}, queryOptions:{ignoreCase:true}})
		//		  the URL will become:   /url.php?name=abc
		//
		//		  fetch({serverQuery:{q:"abc", c:true}, query:{name:"abc"}, queryOptions:{ignoreCase:true}})
		//		  the URL will become:   /url.php?q=abc&c=true
		//		  // The serverQuery-parameter has overruled the query-parameter
		//		  // but the query parameter stays untouched, but is not sent to the server!
		//		  // The serverQuery contains more data than the query, so they might differ!
		//

		var serverQuery = typeof request["serverQuery"]=="undefined" ? request.query : request.serverQuery;
		// Compare the last query and the current query by simply json-encoding them,
		// so we dont have to do any deep object compare ... is there some dojo.areObjectsEqual()???
		if(this.doClientPaging && this._lastServerQuery!==null &&
			dojo.toJson(serverQuery)==dojo.toJson(this._lastServerQuery)
			){
			fetchHandler(this._items, request);
		}else{
			var xhrFunc = this.requestMethod.toLowerCase()=="post" ? dojo.xhrPost : dojo.xhrGet;
			var xhrHandler = xhrFunc({url:this.url, handleAs:"json-comment-optional", content:serverQuery});
			var self = this;
			xhrHandler.addCallback(function(data){
				self._items = [];
				// Store a ref to "this" in each item, so we can simply check if an item
				// really origins form here (idea is from ItemFileReadStore, I just don't know
				// how efficient the real storage use, garbage collection effort, etc. is).
				for(var i in data.items){
					self._items.push({i:data.items[i], r:self});
				}
	// TODO actually we should do the same as dojo.data.ItemFileReadStore._getItemsFromLoadedData() to sanitize
	// (does it really sanititze them) and store the data optimal. should we? for security reasons???
				fetchHandler(self._items, request);
			});
			xhrHandler.addErrback(function(error){
				errorHandler(error, request);
			});
			this.lastRequestTimestamp = new Date().getTime();
			this._lastServerQuery = serverQuery;
		}
	}
	
});