/**
 * adds a new file to a existing gml layer
 * @param {Object} url
 */ 
OpenLayers.Layer.GML.prototype.testloadURL =  function(url)
{
	this.url = url;
	var results = OpenLayers.loadURL(this.url, null, this, this.requestSuccess, this.requestFailure);	
}

/**
 * a click handler class
 */
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
	defaultHandlerOptions: {
	    'single': true,
	    'double': false,
	    'pixelTolerance': 0,
	    'stopSingle': false,
	    'stopDouble': false,
		'clickhandler':null
	},
	
	initialize: function(options) {		
		this.handlerOptions = OpenLayers.Util.extend(
	        {}, this.defaultHandlerOptions
	    );
	    OpenLayers.Control.prototype.initialize.apply(
	        this, arguments
	    ); 
	    this.handler = new OpenLayers.Handler.Click(
	        this, {
	            'click': this.onClick,
	            'dblclick': this.onDblclick 
	        }, this.handlerOptions
	    );
	}, 
	
	onClick: function(evt) {
	    if (this.handlerOptions.clickhandler != null)
			this.handlerOptions.clickhandler(evt);
	},
	
	onDblclick: function(evt) {  
		if (this.handlerOptions.clickhandler != null)
			this.handlerOptions.clickhandler(evt);
		
	}   
});
