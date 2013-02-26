/*
https://developers.google.com/maps/documentation/javascript/tutorial
Create a JavaScript object literal to hold a number of map properties.
Write a JavaScript function to create a "map" object.
Initialize the map object from the body tag's onload event.
*/

$('document').ready(function() {

//gloabals vars

var map;
var radiusStart;
var radius;

//for animation
var nyPxl;
var mapZoom;

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
		'lat + lng',
		'<br/>',
		latLng.toUrlValue(4),
		//point.x,
		//'px, ',
		//point.y,
		//'px'
		
		].join('');
		
		//get radious of the window container		
		//var cordinates = this.getProjection().fromContainerPixelToLatLng(new google.maps.Point(point.x, point.y));
		//console.log('test: ' + cordinates);
		//calculate radius of screen
		//var center = map.getCenter();
		//console.log("center: " + center);
		//console.log("point lat long: " + latLng);
		//var distance = google.maps.geometry.spherical.computeDistanceBetween(center, latLng);
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
		radiusStart = map.getCenter();
		radius = google.maps.geometry.spherical.computeDistanceBetween(radiusStart, radiusEnd);
		//This will work for the zoom, but will need to add a check that the keyword is setActive
		//also will need to set up a way to store the lat long so if the submit button is pressed the
		//lat and long will be passed....also need to have a start lat and lng
		sendQuery($("#query-input").val(),radiusStart.lat(),radiusStart.lng(),radius);
		console.log(radius);
		
		
		/*
		//test functions 
		var nyLatLng = new google.maps.LatLng(40.7697, -73.9735);
		console.log(nyLatLng);
		nyPxl = overlay.getProjection().fromLatLngToContainerPixel(nyLatLng);
		mapZoom = map.getZoom();
		console.log(mapZoom);
		*/
		
		/*
		var nyPxlObject = {
			lat: nyPxl.lat(),
			lng: nyPxl.lng()
		}
		console.log(nyPxlObject);
		*/
		
		//another test
		/*
		var tweetLocationsLong = [];
		var tweetLocationsLat = [];
		//for now
		//create random points based on dom
		//convert points to 
		var tweetsPixel = [];
		
		for (var i = 0; i < 50; i++) {
			//push values to tweetLocations array			
			tweetsPixel.push(new google.maps.Point(
			Math.random()* $(document).width(),
			Math.random()* $(document).height()
			));
			
		}
		console.log(tweetsPixel);
		*/
	};
	zoomChanged.prototype = new google.maps.OverlayView();
	//Called on the intiial pageload.
	
	function updateCanvas () {
		//console.log("updateCanvas");
		//test functions 
		var overlay = new google.maps.OverlayView();
		overlay.draw = function(){};
		overlay.setMap(map);		
		var nyLatLng = new google.maps.LatLng(40.7697, -73.9735);
		console.log(nyLatLng);
		nyPxl = overlay.getProjection().fromLatLngToContainerPixel(nyLatLng);
		mapZoom = map.getZoom();
		console.log(mapZoom);		
	}
	updateCanvas.prototype = new google.maps.OverlayView();
	
	function init() {
		// Create a new StyledMapType object, passing it the array of styles,
		// as well as the name to be displayed on the map type control.
		var styledMap = new google.maps.StyledMapType(styles, {name: 'Chaz is a gangster'});        
		var startLocation = new google.maps.LatLng(40.7697, -73.9735);
		var startZoom = 3;
		var mapOptions = {
			zoom: startZoom,
			center: startLocation,
			disableDefaultUI: true,
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
		//listener for animation
		google.maps.event.addListener(map, 'drag', function(event){
			updateCanvas();			
		});
		google.maps.event.addListener(map, 'zoom_changed', function(event){
			updateCanvas();
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
	

		
		
		//tweet animation
		//replace with array of tweets coming from server
		var tweetsLength = 10;
		var tweets= [];
		
	
		function tweetCircle (x, y) {
			//change to input
			this.x = x;
			this.y = y;
			this.radius = 5;
		}
		
		function createTweets () {
			for (var i = 0; i < tweetsLength; i++) {
				//push based on location lat and long
				tweets.push(new tweetCircle (
				Math.floor(Math.random()*myCanvas.width), 	
				Math.floor(Math.random()*myCanvas.height)));
			}
		}
		
		function drawTweets(ctx, myCanvas, rad) {
			var radius = rad;
			//while (radius > 1) {
			if (radius > 0) {	
				for (var i = 0; i < tweets.length; i++) {
					tweet = tweets[i];
					ctx.beginPath();
					ctx.fillStyle = "rgba(255, 255, 255," + 0.5 + ")";
					ctx.arc(tweet.x, tweet.y, radius, 0, 2 * Math.PI, false);
					ctx.fill();
					//ctx.stroke();
				}
			}
		} 
		
		createTweets ();
		console.log(tweets);
	
		//draw shit
		var centerRingOpacity = 0.02;
		var crossHairsOpacity = 0.5;	
		var direction = 1;	
		var rotation = 1;
		
		function animate() {	
			//var mapRange = radius;
			//console.log(mapRange);
			
			// CLEAR
			context.clearRect(0, 0, myCanvas.width, myCanvas.height);
			
			// DRAW		
			
			//location test
			if (nyPxl != undefined) {
				context.lineWidth = 5;
				context.strokeStyle= "rgba(0, 230, 255," + 1 + ")";
				context.beginPath();
					context.arc(nyPxl.x, nyPxl.y, mapZoom * 10, 0, 2 * Math.PI, false);
				context.stroke();
			}
			
			//animation circle test	
			drawTweets(context, myCanvas, centerRingOpacity * 20);
						
			//ungualte transparency				
			centerRingOpacity += 0.009 * direction;
			if (centerRingOpacity >= 1) {
				direction = -1;
				
			}
			if (centerRingOpacity <= 0) {
				direction = 1;
			}
			//draw center rings
			context.lineWidth = 1;
			context.strokeStyle= "rgba(0, 230, 255," + centerRingOpacity + ")";
			context.beginPath();
				context.arc(myCanvas.width/2, myCanvas.height/2, myCanvas.width/3, 0, 2 * Math.PI, false);
			context.stroke();
			
					
			
			//rotating cirlce
			context.save();
				context.translate(myCanvas.width / 2, myCanvas.height / 2);
	      		rotation++;
	      		context.rotate((Math.PI / 180) * rotation);
				context.beginPath();
					context.arc(0, 0,  myCanvas.width/3 - 5, 1.1 * Math.PI, 1.9 * Math.PI, false);
				context.stroke();
			context.restore();			
			
			
			//draw cross hairs
			context.beginPath();
				context.lineWidth = 1;
				//context.setLineDash([1,2]);
				context.strokeStyle = "rgba(0, 230, 255," + crossHairsOpacity + ")";
				context.moveTo(myCanvas.width/2 - 10, myCanvas.height/2);
				context.lineTo(myCanvas.width/2 + 10, myCanvas.height/2);
			context.stroke();
			
			context.beginPath();
				context.lineWidth = 1;
				context.strokeStyle = "rgba(0, 230, 255," + crossHairsOpacity + ")";
				context.moveTo(myCanvas.width/2, myCanvas.height/2 - 10);
				context.lineTo(myCanvas.width/2, myCanvas.height/2 + 10);
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

