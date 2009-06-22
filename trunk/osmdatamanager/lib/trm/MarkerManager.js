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

Markermanager.prototype = new TRM.ServerConnection;
/**
 * Markermanager
 */
function Markermanager() {
	
	var featurelist = new Array();
	var self = this;
	
	var AutoSizeAnchoredBubble = OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, {
            'autoSize': true
        });
		
	var AutoSizeAnchoredBubble2 = OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, {
            'autoSize': true,	
			'minSize': new OpenLayers.Size(380,300)
        });		
	
	var AutoSizeFramedCloud = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
            'autoSize': true
        });

	/***********************************************************************************************
	 * PUBLIC FUNCTIONS
	 ***********************************************************************************************/
	
	this.markerExists = function(latlon) {
		var m1 = this.getMarker(latlon);
		if (m1 != null)
			return true;
		else
			return false;
	}
	
	this.getMarker = function(latlon) {
		var f1 = this.getFeature(latlon);
		if (f1 != null) {
			if (f1.marker) {
				return f1.marker;
			}
		}
		return null;
	}
	
	this.getFeature = function(latlon) {
		for (var i=0;i<featurelist.length;i++) {
			var f1 = featurelist[i];
			var m1 = f1.marker;
			if (m1) {
				if ((m1.lonlat.lat == latlon.lat) && (m1.lonlat.lon == latlon.lon)) {
					return f1;
				}
			}
		}
		return null;
	}

	this.updateMarker = function(latlon,layer,popupContentHTML) {
		/*
		var f1 = this.getFeature(latlon);
		if (f1 != null) {
			f1.data.popupContentHTML = popupContentHTML;
			alert(f1.data.popupContentHTML);
		}
		*/
		var m1 = this.getMarker(latlon);
		if (m1 != null) {
			this.removeMarker(layer,m1);
		}
		
		this.addPoiMarker(latlon, layer, popupContentHTML);
	}
	
	this.addMarker = function(latlon, popupClass, popupContentHTML, closeBox, overflow,layer,iconurl) {

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
			featurelist.push(feature);
    }
	
	this.addTestmarker = function(latlon, layer) {
		popupClass = OpenLayers.Popup.AnchoredBubble;
        popupContentHTML = '<img src="pic1.png"></img>';
		
		this.addMarker(latlon,popupClass, popupContentHTML, true,true,layer); 		
	}
	
	/*
	 * var newl = new OpenLayers.Layer.GeoRSS( parts[parts.length-1], value);
                map.addLayer(newl);

	 */

	//popupClass = 
	this.addTestmarker2 = function(latlon, layer, description) {
		popupClass = OpenLayers.Popup.FramedCloud;
        popupContentHTML = "<p>"+description+"</p>";
		this.addMarker(latlon,popupClass, popupContentHTML, true,true,layer); 		
	}
	
	this.removeMarkers = function(layer) {
		for (var i=(featurelist.length-1);i>-1;i--) {
			var f1 = featurelist[i];
			var m1 = f1.marker;
			if (m1) {
				layer.removeMarker(m1);
				featurelist.pop(m1);
			}
		}
	}
	
	this.removeMarker = function(layer, marker) {
		layer.removeMarker(marker);
		featurelist.pop(marker);
		marker.destroy();
	}
	
	this.addPoiMarker = function(latlon, layer, description,iconname) {
		popupClass = AutoSizeAnchoredBubble2;
        //popupContentHTML = '<img src="pic1.png"></img>';
		popupContentHTML = "<p>"+description+"</p>";
		//alert(popupContentHTML);
		
		if (this.markerExists(latlon)) 
			return;
		
		this.addMarker(latlon,popupClass, popupContentHTML, true,true,layer,iconname); 		
	}
	
	this.addGeoRssMarker = function(georssurl, layer) {
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

}