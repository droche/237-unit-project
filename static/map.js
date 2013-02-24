/*
https://developers.google.com/maps/documentation/javascript/tutorial
Create a JavaScript object literal to hold a number of map properties.
Write a JavaScript function to create a "map" object.
Initialize the map object from the body tag's onload event.
*/

$('document').ready(function() {

//gloabals vars
var pixelLocationX;
var pixelLocationY;
var map;
	 /*
	LatLngControl class displays the LatLng and pixel coordinates
	underneath the mouse within a container anchored to it.
	@param {google.maps.Map} map Map to add custom control to.
	*/
	//use for debugging lat long location by printing value 
	function LatLngControl(map) {
		 //Offset the control container from the mouse by this amount.
		this.ANCHOR_OFFSET_ = new google.maps.Point(8, 8);		
		 //Pointer to the HTML container.		
		this.node_ = this.createHtmlNode_();		
		// Add control to the map. Position is irrelevant.
		map.controls[google.maps.ControlPosition.TOP].push(this.node_);		
		// Bind this OverlayView to the map so we can access MapCanvasProjection
		// to convert LatLng to Point coordinates.
		this.setMap(map);		
		// Register an MVC property to indicate whether this custom control
		// is visible or hidden. Initially hide control until mouse is over map.
		this.set('visible', false);
	}      
	// Extend OverlayView so we can access MapCanvasProjection.
	LatLngControl.prototype = new google.maps.OverlayView();
	LatLngControl.prototype.draw = function() {};
      
    //Helper function creates the HTML node which is the control container. return {HTMLDivElement}    
	LatLngControl.prototype.createHtmlNode_ = function() {
		var divNode = document.createElement('div');
		divNode.id = 'latlng-control';
		divNode.index = 100;
		return divNode;
	};
      
	//MVC property's state change handler function to show/hide the control container.
	LatLngControl.prototype.visible_changed = function() {
		this.node_.style.display = this.get('visible') ? '' : 'none';
	};
         
	//Specified LatLng value is used to calculate pixel coordinates and
	//update the control display. Container is also repositioned.
	//@param {google.maps.LatLng} latLng Position to display    
	LatLngControl.prototype.updatePosition = function(latLng) {
		var projection = this.getProjection();
		//console.log(projection);
		var point = projection.fromLatLngToContainerPixel(latLng);
		//console.log(this);
		//assign the locations to the global scope
		pixelLocationX = point.x; 
		pixelLocationY = point.y;
		//debugging function for console;
		//displayCordinates(pixelLocationX, pixelLocationY);
		// Update control position to be anchored next to mouse position.
		this.node_.style.left = point.x + this.ANCHOR_OFFSET_.x + 'px';
		this.node_.style.top = point.y + this.ANCHOR_OFFSET_.y + 'px';
		// Update control to display latlng and coordinates.
		this.node_.innerHTML = [
		latLng.toUrlValue(4),
		'<br/>',
		point.x,
		'px, ',
		point.y,
		'px'
		].join('');
		
		//get radious of the window container		
		var cordinates = this.getProjection().fromContainerPixelToLatLng(new google.maps.Point(point.x, point.y));
		//console.log('test: ' + cordinates);
		//calculate radius of screen
		var center = map.getCenter();
		//console.log("center: " + center);
		//console.log("point lat long: " + latLng);
		var distance = google.maps.geometry.spherical.computeDistanceBetween(center, latLng);
		//console.log(distance);
	};
	
	function zoomChanged() {		
		//need to get proper projection
		var overlay = new google.maps.OverlayView();
		
		overlay.draw = function(){};
		overlay.setMap(map);

		var radiusEndY = $(document).height()/2;
		var radiusEndX = $(document).width();

		var radiusEnd = overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(radiusEndX, radiusEndY));
		//create radius start point
		var radiusStart = map.getCenter();
		var radius = google.maps.geometry.spherical.computeDistanceBetween(radiusStart, radiusEnd);
		//This will work for the zoom, but will need to add a check that the keyword is setActive
		//also will need to set up a way to store the lat long so if the submit button is pressed the
		//lat and long will be passed....also need to have a start lat and lng
		sendQuery($("#query-input").val(),radiusStart.lat(),radiusStart.lng(),radius);
		console.log(radius);
		
	};
	zoomChanged.prototype = new google.maps.OverlayView();
	//Called on the intiial pageload.
	
	function init() {
		// Create a new StyledMapType object, passing it the array of styles,
		// as well as the name to be displayed on the map type control.
		var styledMap = new google.maps.StyledMapType(styles, {name: 'Chaz is a gangster'});        
		var startLocation = new google.maps.LatLng(40.7697, -73.9735);
		var startZoom = 3;
		var mapOptions = {
			zoom: startZoom,
			center: startLocation,
			mapTypeControlOptions: { mapTyapeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']}
		};       
		
		//MADE GLOBAL FOR NOW, CHANGE THIS
		map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);	
		
		//Associate the styled map with the MapTypeId and set it to display.
		map.mapTypes.set('map_style', styledMap);
		map.setMapTypeId('map_style');	
		
		// Create new control to display latlng and coordinates under mouse.
		var latLngControl = new LatLngControl(map);
		
		// Register event listeners
		google.maps.event.addListener(map, 'mouseover', function(mEvent) {
			latLngControl.set('visible', true);
		});
		google.maps.event.addListener(map, 'mouseout', function(mEvent) {
			latLngControl.set('visible', false);
		});
		google.maps.event.addListener(map, 'mousemove', function(mEvent) {
			latLngControl.updatePosition(mEvent.latLng);
		});
		
		//listener for idle
		google.maps.event.addListener(map, 'idle', function(event) {
			zoomChanged();			
		});
	

		
		/*	
	  //zoom to location impliment later		      
	  var marker = new google.maps.Marker({
	    position: map.getCenter(),
	    map: map,
	    title: 'Click to zoom'
	  });
	
	  google.maps.event.addListener(map, 'center_changed', function() {
	    // 3 seconds after the center of the map has changed, pan back to the
	    // marker.
	    window.setTimeout(function() {
	      map.panTo(marker.getPosition());
	    }, 3000);
	  });
	
	  google.maps.event.addListener(marker, 'click', function() {
	    map.setZoom(8);
	    map.setCenter(marker.getPosition());
	  });
	*/
		
		//call google event when center changes
		/*
		google.maps.event.addListener(map, 'center_changed', function(mEvent) {
			zoomChanged(mEvent);
		});
		*/
				
		var myCanvas;
		var myContainer = document.getElementById('map_canvas'); 
		createCanvasOverlay(myContainer);
		//console.log(myContainer);	
	}
      
      
	// Register an event listener to fire when the page finishes loading.
	google.maps.event.addDomListener(window, 'load', init);



	//draw canvas animation over google maps
	function createCanvasOverlay(canvasContainer) {     
		myCanvas = document.createElement('canvas');    
		myCanvas.style.width = canvasContainer.scrollWidth+"px";
		myCanvas.style.height = canvasContainer.scrollHeight+"px";
		myCanvas.width=canvasContainer.scrollWidth;
		myCanvas.height=canvasContainer.scrollHeight;    
		myCanvas.style.overflow = 'visible';
		myCanvas.style.position = 'absolute';
		myCanvas.style.zIndex="1000";
		myCanvas.style.pointerEvents="none";
		var context=myCanvas.getContext('2d');
		    

		//get animation framerate
		window.requestAnimFrame = (function(callback) {
			return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		})();
	
		var count = 1;
		var opacity = 0;
		//draw shit
		function animate() {	
			if (count > 500) {
				count = 1;
			}
			if(opacity < 1) {
				opacity += 0.005;
			} else {
				opacity = 0;
			}
			
			// update
			
			// clear
			context.clearRect(0, 0, myCanvas.width, myCanvas.height);
			
			// draw shit yo

			opacity = 0;
			context.fillStyle = "rgba(255, 255, 255," + opacity + ")";
			
			context.fillRect(0,0, myCanvas.width, myCanvas.height);
			context.beginPath();	  
			context.strokeStyle='rgba(255,255,255, 0.7)';  // a green line
			context.lineWidth= 0.75;                       // 4 pixels thickness
			context.moveTo(myCanvas.width/2, myCanvas.height/2);
			context.lineTo(pixelLocationX + count, pixelLocationY + count++);
			context.stroke();
			canvasContainer.appendChild(myCanvas);		
			// request new frame
			requestAnimFrame(function() {
			  animate();
			});
		}
		animate();
	}	
	

	
//end onload jQuerry
});

