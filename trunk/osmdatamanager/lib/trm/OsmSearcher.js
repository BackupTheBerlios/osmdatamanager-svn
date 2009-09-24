dojo.require("dojox.xml.parser");
dojo.require("dojox.dtl.filter.strings");

dojo.declare("OsmSearcher", Application, {

		constructor: function(){
			this.callback = null;
			this.searchresult = null;
        },
		
		/**
		 * callback after a search, parse result as xml file
		 * @param {Object} response
		 * @param {Object} ioArgs
		 */
		_cb_search: function(response, ioArgs) {
			try {
				if (response != null) {
					var d1 = dojox.xml.parser.parse(response);
					this.searchresult = d1;
					if (this.callback != null) {
						this.callback(d1);
					}
				}
			} catch(e) {
				console.error(e);
			}
		},
		
		/**
		 * 
		 * @param {Object} searchtext
		 */
		_execSearch: function(searchtext) { 
	      this.searchresult = null;
		  
		  dojo.xhrGet( {
	        // Using the transport.php file for a cross domain call
	        url: "transport.php?method=get&url=http://gazetteer.openstreetmap.org/namefinder/search.xml&find="+searchtext,
			handleAs: "text",
			
	        timeout: 30000, // Time in milliseconds
	
	        // The LOAD function will be called on a successful response.
	        load: dojo.hitch(this,this._cb_search),
			
	        // The ERROR function will be called in an error case.
	        error: function(response, ioArgs) { // ➃
	          console.error("HTTP status code: ", ioArgs.xhr.status); // ➆
	          this.searchresult = null;
			  dojo.hitch(this,this._cb_search);
			  return response; // ➅
	          }
	        });
	    },

		/**
		 * returns a list of all elements with the tagname "named" => this is the resultlist
		 */
		getResultList: function() {
			if (this.searchresult != null) {
				//return dojo.query("named", this.searchresult.firstChild);
				return dojo.query("> named", this.searchresult.firstChild);
			}
			return null;
		},
		
		/**
		 * returns the first child element of the searchresult
		 */
		getFirstChild: function() {
			if (this.searchresult != null) {
				return this.searchresult.firstChild;
			}
			return null;
		},
		
		/**
		 * search for given searchtext
		 * @param {Object} searchtext
		 * @param {Object} cb
		 */
		search: function(searchtext,cb) {
			if (String(searchtext).trim() == "")
				return;
			
			this.callback = cb;   
		    var txt1 = dojox.dtl.filter.strings.urlencode(searchtext);
			this._execSearch(txt1);
		}

});