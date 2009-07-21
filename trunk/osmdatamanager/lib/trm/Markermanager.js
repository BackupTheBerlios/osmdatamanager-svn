dojo.declare("MarkerManager", Serverconnection, {
        
		/**
		 * Markermanager constructor
		 */
		constructor: function(){
     		this.markerlist = new Array();
			this.AutoSizeAnchoredBubble = OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, {
		            'autoSize': true
		        });
				
			this.AutoSizeAnchoredBubble2 = OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, {
		            'autoSize': true,	
					'minSize': new OpenLayers.Size(380,300)
		        });		
			
			this.AutoSizeFramedCloud = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
		            'autoSize': true
		        });
		},
		
			
		/***********************************************************************************************
		 * PUBLIC FUNCTIONS
		 ***********************************************************************************************/
		
		/**
		 * 
		 * @param {Object} latlon
		 */
		markerExists: function(latlon) {
			var m1 = this.getMarker(latlon);
			if (m1 != null)
				return true;
			else
				return false;
		},
		
		/**
		 * 
		 * @param {Object} latlon
		 */
		getFeature: function(latlon) {
			var m1 = this.getMarker(latlon);
			if (m1 != null) {
				if (m1.feature) {
					return m1.feature;
				}
			}
			return null;
		},
		
		/**
		 * 
		 * @param {Object} latlon
		 */
		getMarker: function(latlon) {
			for (var i=0;i<this.markerlist.length;i++) {
				var m1 = this.markerlist[i];
							
				if ((m1.lonlat.lat == latlon.lat) && (m1.lonlat.lon == latlon.lon)) {
					return m1;
				}
			}
			return null;
		},
	
		
		/**
		 * 
		 * @param {Object} latlon
		 * @param {Object} layer
		 * @param {Object} popupContentHTML
		 */
		updateMarker: function(latlon,layer,popupContentHTML) {
			var f1 = this.getFeature(latlon);
			if (f1 != null) {
				alert(popupContentHTML);
				f1.data.popupContentHTML = popupContentHTML;
				alert(f1.data.popupContentHTML);
			}
			/*
			var f1 = this.getFeature(latlon);
			if (f1 != null) {
				f1.data.popupContentHTML = popupContentHTML;
				alert(f1.data.popupContentHTML);
			}
			
			alert(latlon);
			var m1 = this.getMarker(latlon);
			if (m1 != null) {
				this.removeMarker(layer,m1);
			}
			
			this.addPoiMarker(latlon, layer, popupContentHTML);
			*/
		},
		
		/**
		 * 
		 * @param {Object} latlon
		 * @param {Object} popupClass
		 * @param {Object} popupContentHTML
		 * @param {Object} closeBox
		 * @param {Object} overflow
		 * @param {Object} layer
		 * @param {Object} iconurl
		 */
		addMarker: function(latlon, popupClass, popupContentHTML, closeBox, overflow,layer,iconurl) {
	
	            var feature = new OpenLayers.Feature(layer, latlon); 
	            feature.closeBox = closeBox;
	            feature.popupClass = popupClass;
	            feature.data.popupContentHTML = popupContentHTML;
	            //feature.data.overflow = (overflow) ? "auto" : "hidden";
	                    
	            //var marker = feature.createMarker();
	            			
				if ((iconurl != null) && (iconurl != "")) {
					var ico = new OpenLayers.Icon(iconurl, new OpenLayers.Size(16, 16),  new OpenLayers.Pixel(0, -16));
					//ico.url = iconurl;
					var marker = new OpenLayers.Marker(latlon,ico);
					marker.feature = feature;
				} else {
					var marker = new OpenLayers.Marker(latlon);
					marker.feature = feature;	
				}
				
				var markerClick = function (evt) {
					if (this.popup == null) {
	                    this.popup = this.createPopup(this.closeBox);
						//this.popup.closeOnMove = true;
						//this.popup.setOpacity(0.8);
						gl_map.addPopup(this.popup);
	                    //this.popup.show();
	                } else {
	                    this.popup.toggle();
	                }
	                //currentPopup = this.popup;
	                OpenLayers.Event.stop(evt);
	            };
	            
				marker.events.register("mousedown", feature, markerClick);
				layer.addMarker(marker);
				this.markerlist.push(marker);
	    },
		
		/**
		 * 
		 * @param {Object} latlon
		 * @param {Object} layer
		 */		
		addTestmarker: function(latlon, layer) {
			popupClass = OpenLayers.Popup.AnchoredBubble;
	        popupContentHTML = '<img src="pic1.png"></img>';
			
			this.addMarker(latlon,popupClass, popupContentHTML, true,true,layer); 		
		},
		
		/**	
		 * 
		 * @param {Object} latlon
		 * @param {Object} layer
		 * @param {Object} description
		 */
		addTestmarker2:function(latlon, layer, description) {
			popupClass = OpenLayers.Popup.FramedCloud;
	        popupContentHTML = "<p>"+description+"</p>";
			this.addMarker(latlon,popupClass, popupContentHTML, true,true,layer); 		
		},
		
		/**
		 * 
		 * @param {Object} layer
		 */
		removeMarkers: function(layer) {
			for (var i=(markerlist.length-1);i>-1;i--) {
				var m1 = markerlist[i];
				//var f1 = m1.feature;
				if (m1) {
					layer.removeMarker(m1);
					this.markerlist.pop(m1);
				}
			}
		},
		
		/**		
		 * 
		 * @param {Object} layer
		 * @param {Object} marker
		 */
		removeMarker: function(layer, marker) {
			layer.removeMarker(marker);
			this.markerlist.pop(marker);
			marker.destroy();
		},
		
		/**
		 * 
		 * @param {Object} latlon
		 * @param {Object} layer
		 * @param {Object} description
		 * @param {Object} iconname
		 */
		addPoiMarker: function(latlon, layer, description,iconname) {
			var popupClass = this.AutoSizeAnchoredBubble2;
	        //popupContentHTML = '<img src="pic1.png"></img>';
			var popupContentHTML = "<p>"+description+"</p>";
			//alert(popupContentHTML);
			
			if (this.markerExists(latlon)) {
				this.updatePoiMarker(latlon, layer, description,iconname);
				return;
			}
			
			this.addMarker(latlon,popupClass, popupContentHTML, true,true,layer,iconname); 		
		},
		
		/**
		 * 
		 * @param {Object} latlon
		 * @param {Object} layer
		 * @param {Object} description
		 * @param {Object} iconname
		 */
		updatePoiMarker: function(latlon, layer, description,iconname) {
			var popupClass = this.AutoSizeAnchoredBubble2;
			var popupContentHTML = "<p>"+description+"</p>";
					
			var m1 = this.getMarker(latlon);
			if (m1) {
				this.removeMarker(layer,m1);
				this.addMarker(latlon, popupClass, popupContentHTML, true, true, layer, iconname);
			} else {
				this.addPoiMarker(latlon, layer, description,iconname);
			}
		},
		
		/**
		 * 
		 * @param {Object} georssurl
		 * @param {Object} layer
		 */
		addGeoRssMarker: function(georssurl, layer) {
			/*
			popupClass = OpenLayers.Popup.FramedCloud;
	        popupContentHTML = '<img src="pic1.png"></img>';
			this.addMarker(latlon,popupClass, popupContentHTML, true,true,layer); 		
			*/
			//var value = "borken.xml";
			var value = georssurl;
			var parts = georssurl;
			
			var newl = new OpenLayers.Layer.GeoRSS(parts, value);
	        map.addLayer(newl);
		}
		
});