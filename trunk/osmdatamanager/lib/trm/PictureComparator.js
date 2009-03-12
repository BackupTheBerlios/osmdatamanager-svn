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

PictureComarator.prototype = new TRM.ServerConnection;
/**
 * PictureComarator (this is only a test)
 */
function PictureComarator(){
	var pictures = new Array();
	
	var _clear = function() {
		for (var i=pictures.length-1;i>-1;i--) {
			var p1 = pictures.pop();
			p1.destroy;
		}
	}
	
	var _loadPicturesOk = function(response, ioArgs){
		try {
			_clear();
			for (var i=0;i<response.length;i++) {
				var fl1 = response[i];
				pictures.push(fl1);
			}	
		}catch (e)
		{alert(e);}	
	}
	
	var _getDate = function(datetime) {
		var r1 = datetime.split("T");
		return r1[0];
	}
	
	var _getHour = function(datetime) {
		var r1 = datetime.split("T");
		var r2 = r1[1].split(":");
		
		if (r2[0][0] == "0") {
			return parseInt(r2[0][1]);
		}
		
		return parseInt(r2[0]);
	}
	
	var _getMinute = function(datetime) {
		var r1 = datetime.split("T");
		var r2 = r1[1].split(":");
		return parseInt(r2[1]);
	}
	
	this.resetPictures = function() {
		for (var i = 0; i < pictures.length; i++) {
			var pic1 = pictures[i];
			pic1.mapped = false;
		}	
	}
	
	this.pictureMatches = function(datetime) {
		for (var i=0;i<pictures.length;i++) {
			var pic1 = pictures[i];
			
			if (!pic1.mapped) {
				var dt1 = _getDate(datetime);
				var dt2 = _getDate(pic1.originaldate);
				
				if (dt2 == "2009-02-08") {
						var hx2 = _getHour(pic1.originaldate);
						if ((hx2 >20) && (hx2 < 24)) {
							dt2 = "2009-02-09";
						}	
				}
				
				if (dt1 == dt2) {
					var h1 = _getHour(datetime);
					var m1 = _getMinute(datetime);
					
					
					var h2 = _getHour(pic1.originaldate);
					var m2 = _getMinute(pic1.originaldate);
					/*
					if ((h2 >0) && (h2 < 8)) {
						h2 = h2 + 12;
						console.log(h1+"-"+h2);
					}
					
					if ((h2 >21) && (h2 < 24)) {
						h2 = h2 - 12;
					}
					*/
					
					
					
					if (dt2 == "2009-02-09") {
						if ((h2 >-1) && (h2 < 7)) {
							h2 = h2 + 12;
							m2-=1;
							//dt2 = "2009-02-09";
						}
						if ((h2 >20) && (h2 < 24)) {
							h2 = h2 - 12;
						}
						//console.log(h1+"-"+h2);	
					}
		
					if ((h1 + 1) == h2) {
						if ((m1 > (m2 - 2)) && (m1 < m2 + 2)) {
							//console.log(h1 + "-" + h2);
							pic1.mapped = true;
							return pic1;
						}
					}
				}
			}
		}
		return null;
	}
	
			
	this.loadPictures = function(sender,cb) {
			params = {
				"action":"msg.getgrpitems"
			}
			callback = cb;
			loadFromServer("exif.php",params,_loadPicturesOk);
	}
		
}
