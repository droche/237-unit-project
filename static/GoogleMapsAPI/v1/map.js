$('document').ready(function() {





      var map;
      function initialize() {	
	      	// Create a new StyledMapType object, passing it the array of styles,
	      	// as well as the name to be displayed on the map type control.
	      	console.log(styles);
	      	var styledMap = new google.maps.StyledMapType(styles, {name: 'Chaz is a gangster'});		
	      	// Create a map object, and include the MapTypeId to add
			// to the map type control.
			var test = new google.maps.LatLng(40.7697, -73.9735);
			var mapOptions = {
				zoom: 11,
				center: test,
				mapTypeControlOptions: {
						mapTyapeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
				}
			};
			map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);	
			//Associate the styled map with the MapTypeId and set it to display.
			map.mapTypes.set('map_style', styledMap);
			map.setMapTypeId('map_style');	
			
			//create new marker
			var myLatlng = new google.maps.LatLng(40.7697, -73.9735);
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
				title:'Hello World!'
			});  
		}
	
 		

	
	
	
	initialize();

 	
 	
 var myCanvas;
 var myContainer = document.getElementById('map_canvas'); 
 createCanvasOverlay(myContainer);

 function createCanvasOverlay(canvasContainer){
      superContainer=canvasContainer;      
      myCanvas = document.createElement('canvas');    
      myCanvas.style.width = superContainer.scrollWidth+"px";
      myCanvas.style.height = superContainer.scrollHeight+"px";
      // You must set this otherwise the canvas will be streethed to fit the container
      myCanvas.width=superContainer.scrollWidth;
      myCanvas.height=superContainer.scrollHeight;    
      //surfaceElement.style.width=window.innerWidth; 
      myCanvas.style.overflow = 'visible';
      myCanvas.style.position = 'absolute';
      myCanvas.style.zIndex="1000";
      myCanvas.style.pointerEvents="none";
                
      var context=myCanvas.getContext('2d');
      context.fillStyle = "rgba(250, 0, 0, 0.5)";
      context.fillRect(0,0, myCanvas.width, myCanvas.height);
      context.beginPath();	  
      context.strokeStyle='rgb(0,255,0)';  // a green line
      context.lineWidth=4;                       // 4 pixels thickness
      context.moveTo(50,50);
      context.lineTo(550,550);
      context.stroke();
      canvasContainer.appendChild(myCanvas);
}
	

	
	

});

