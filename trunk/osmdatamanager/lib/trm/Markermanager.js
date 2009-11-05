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
dojo.provide("trm.MarkerManager");
dojo.require("trm.Serverconnection");

dojo.declare("trm.MarkerManager", trm.Serverconnection, {
        
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
		 * return true if marker with given latlon exists
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
		 * returns true if marker with given markerid exists
		 * @param {Object} markerid
		 */
		markerExistsById: function(markerid) {
			var m1 = this.getMarkerById(markerid);
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
		 * returns marker with given latlon
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
		 * returns marker with given markerid
		 * @param {Object} markerid
		 */
		getMarkerById: function(markerid) {
			for (var i=0;i<this.markerlist.length;i++) {
				var m1 = this.markerlist[i];
				
				if (m1.markerid) {
					if (m1.markerid == markerid) {
						return m1;
					}
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
		addMarker: function(latlon, popupClass, popupContentHTML, closeBox, overflow,layer,iconurl,markerid) {
				try {
					var feature = new OpenLayers.Feature(layer, latlon);
					feature.closeBox = closeBox;
					feature.popupClass = popupClass;
					feature.data.popupContentHTML = popupContentHTML;
					//feature.data.overflow = (overflow) ? "auto" : "hidden";
					
					//var marker = feature.createMarker();
					
					if ((iconurl != null) && (iconurl != "")) {
						var ico = new OpenLayers.Icon(iconurl, new OpenLayers.Size(16, 16), new OpenLayers.Pixel(0, -16));
						//ico.url = iconurl;
						var marker = new OpenLayers.Marker(latlon, ico);
						marker.feature = feature;
						marker.markerid = markerid;
					}
					else {
						var marker = new OpenLayers.Marker(latlon);
						marker.feature = feature;
						marker.markerid = markerid;
					}
					
					var markerClick = function(evt){
						if (this.popup == null) {
							this.popup = this.createPopup(this.closeBox);
							//this.popup.closeOnMove = true;
							//this.popup.setOpacity(0.8);
							gl_map.addPopup(this.popup);
						//this.popup.show();
						}
						else {
							this.popup.toggle();
						}
						//currentPopup = this.popup;
						OpenLayers.Event.stop(evt);
					};
					
					marker.events.register("mousedown", feature, markerClick);
					layer.addMarker(marker);
					this.markerlist.push(marker);
				} catch(e) {
					console.error(e);
				}
	    },
			
		/**
		 * removes all markers from given layer
		 * @param {Object} layer
		 */
		removeMarkers: function(layer) {
			for (var i=(markerlist.length-1);i>-1;i--) {
				var m1 = markerlist[i];
				//var f1 = m1.feature;
				if (m1) {
					layer.removeMarker(m1);
					this.markerlist.pop();
				}
			}
		},
		
		/**		
		 * removes given marker from layer
		 * @param {Object} layer
		 * @param {Object} marker
		 */
		removeMarker: function(layer, marker) {
			layer.removeMarker(marker);
			var idx = -1;
			for (var i=0;i<this.markerlist.length;i++){
				var m1 = this.markerlist[i];
				if (marker == m1) {
					idx = i;
					break;
				}
			}
			this.arrayRemove(this.markerlist,idx);
			marker.destroy();
		},
		
		arrayRemove: function(array, from, to) {		
		  var rest = array.slice((to || from) + 1 || array.length);
		  array.length = from < 0 ? array.length + from : from;
		  return array.push.apply(array, rest);
		},
					
		
		/**
		 * 
		 * @param {Object} latlon
		 * @param {Object} layer
		 * @param {Object} description
		 * @param {Object} iconname
		 */
		addPoiMarker: function(latlon, layer, description,iconname,markerid) {
			try {
				var popupClass = this.AutoSizeAnchoredBubble2;
				//popupContentHTML = '<img src="pic1.png"></img>';
				var popupContentHTML = "<p>" + description + "</p>";
				//alert(popupContentHTML);
				
				if (this.markerExists(latlon)) {
					this.updatePoiMarker(latlon, layer, description, iconname, markerid);
					return;
				}
				
				if (this.markerExistsById(markerid)) {
					this.updatePoiMarker(latlon, layer, description, iconname, markerid);
					return;
				}
				
				this.addMarker(latlon, popupClass, popupContentHTML, true, true, layer, iconname, markerid);
			} catch(e) {
				console.error(e);
			}
		},
		
		/**
		 * 
		 * @param {Object} latlon
		 * @param {Object} layer
		 * @param {Object} description
		 * @param {Object} iconname
		 */
		updatePoiMarker: function(latlon, layer, description,iconname,markerid) {
			var popupClass = this.AutoSizeAnchoredBubble2;
			var popupContentHTML = "<p>"+description+"</p>";
					
			var m1 = this.getMarker(latlon);
			if (! m1) {
				m1 = this.getMarkerById(markerid);
			}
			
			if (m1) {
				this.removeMarker(layer,m1);
				this.addMarker(latlon, popupClass, popupContentHTML, true, true, layer, iconname,markerid);
			} else {
				this.addPoiMarker(latlon, layer, description,iconname,markerid);
			}
		},
		
		/**
		 * 
		 * @param {Object} item
		 * @param {Object} layer
		 */
		/*
		addItem: function(item, layer, iconname) {
			var lonLat = new OpenLayers.LonLat(poi.lon, poi.lat).transform(new OpenLayers.Projection("EPSG:4326"), gl_map.getProjectionObject());	
			this.addPoiMarker(lonLat, layer, poi.description,iconname));
			
		}
		*/
		
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