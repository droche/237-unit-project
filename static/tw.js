var response;

function Location(lat, lon){
	this.lat = lat;
	this.lon = lon;
	this.setPosition = function(pos){
		this.lat = pos.lat;
		this.lon = pos.lon;
	};
	this.getPosition = function(){
		return {
			"lat": this.lat,
			"lon": this.lon
		};
	};
}

function getLocation(){
	var loc = new Location(0,0);
	if(navigator.geolocation){
		var timeout = 10 * 1000 * 1000;
		navigator.geolocation.getCurrentPosition(
			setLocation,
			displayError,
			{
				enableHighAccuracy: true,
				timeout: timeout,
				maximumAge: 0
			});
	}
	else{
		console.log("Can't do location LAME");
	}

	function setLocation(position){
		loc.setPosition({
			"lat": position.coords.latitude,
			"lon": position.coords.longitude
		});
		console.log("Latitude: " + loc.lat + ", Longitude: " + loc.lon);
		getVenues(loc);

	}

	function displayError(error) {
		var errors = {
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
		};
		alert("Error: " + errors[error.code]);
	}

	return loc;
}

function refreshDOM(){
	console.log("refreshDOM!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );//+ response);
	$(response.results).each(function(i,tweet){
		var liEl = $("<li>").html(tweet.text);
		$('#tweetcontainer').append(liEl);
	});
	//$("#tweetcontainer").append(response.results);
	// var listItem;
	// var paraItem;
	// /*
	// $(response.results.each(function(){
		// var liEl = $("<li>").html(tweet.text);
		// $('')
	// });
	// */
	// for(var i = 0; i < response.results.length; i++){
		// console.log(response.results[i].text);
		// listItem = $('<li>').html(response.results[i].text);
		// if(response.results[i].geo === null){
			// paraItem = $('<p>').html("null");
		// }
		// else{
			// paraItem = $('<p>').html(response.results[i].geo);
		// }
		// listItem.append(paraItem);
		// $("#tweetcontainer").append(listItem);
	//}
}


function getJSON(){
	console.log("haha");
}

function getVenues(loc){
	$.ajax({
		type: "get",
		url: "/venues/search?lat=" + encodeURI(loc.lat) + "&lon=" +  encodeURI(loc.lon),
		success: function(response){
			console.log(JSON.parse(response.data));
			//refreshDOM();
		}
	});
}

function post(q){
	$.ajax({
		type: "post",
		url: "/search.json",
		data: {
			"query": q
		},
		success: function(data){
			console.log("post success " + data);
		}
	});
}

function get(keyword){
	$.ajax({
		type: "get",
		url: "/search/" + encodeURI(keyword),
		//url: "/place/" + encodeURI(keyword),
		datatype: "json",
		success: function(data){
			//response = JSON.parse(data.data);
			//console.log(JSON.parse(data.data));
			
			temp = data.data;
			//temp= temp.replace(/\n/g, '');
			//temp = temp.replace(/\r/g, '');
			//temp = temp.replace("a href", '', "g");
			console.log(temp);
			response = temp;
			refreshDOM();
		},
		error: function(msg){
			console.log("error:" + msg);
			response = JSON.parse(data.data);
			//$("#tweetcontainer").append('<li>').html(data);
			//$("t")
			console.log(JSON.parse(data.data));
			refreshDOM();
		}
	});
}








function sendQuery(keyword, lat, lon){
	$.ajax({
		type: "post",
		url: "/new",
		data:{
			"keyword": keyword,
			"lat": lat,
			"lon": lon
		},
		datatype: "json",
		success: function(data){
			console.log("query sent successfully");
		}
	});
}

function getTweet(){
	$.ajax({
		type: "get",
		url:"/tweet",

	});
}


$(document).ready(function(){
	//post("kanye");
	$("#submitButton").click(function(){
		console.log($("#query-input").val());
		get($("#query-input").val());
		//post($("#query-input").val());
	});
	//getLocation();
});