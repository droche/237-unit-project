var response;
var tweetInterval;

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

function refreshDOM(tweet){
	console.log("refreshDOM!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );//+ response);
<<<<<<< HEAD
	$(response.results).each(function(i,tweet){
		var liEl = $("<li>").html(tweet.text);
		var userID = $("<h3>").html(tweet.from_user_name).css("font-weight","bold");
		liEl.append(userID);
<<<<<<< HEAD
		$('#tweetcontainer').prepend(liEl);
=======
		$('#tweetcontainer').append(liEl);
>>>>>>> hope this works!
	});
=======
	// $(response.results).each(function(i,tweet){
		// var liEl = $("<li>").html(tweet.text);
		// var userID = $("<h3>").html(tweet.from_user_name).css("font-weight","bold");
		// liEl.append(userID);
		// $('#tweetcontainer').prepend(liEl);
	// });
>>>>>>> b9b7545f272e9d2eccc566d5c771f1e62ccce5ad
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
	var liEl = $("<li>").html(tweet.text);
	var userID = $("<h3>").html(tweet.username).css("font-weight","bold");
	var geoID = $("<h3>").html(tweet.geo).css("font-weight","bold");
	liEl.append(userID).append(geoID);
	$('#tweetcontainer').prepend(liEl);
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
			console.log(data.data);
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

function sendQuery(keyword, lat, lon, radius){
	$.ajax({
		type: "post",
		url: "/new",
		data:{
			"keyword": keyword,
			"lat": lat,
			"lon": lon,
			"radius": radius
		},
		datatype: "json",
		success: function(data){
<<<<<<< HEAD
		//NEED TO HAVE IT COUNT ON THE SERVER HOW MANY IT HAS SENT SO THAT WHEN IT RUNS 
		//OUT IT AUTO MAKES ANOTHER REQUEST
			if(tweetInterval !== "undefined"){
				clearInterval(tweetInterval);
			}
			tweetInterval = setInterval(getTweet,1500);
=======
			//setInterval(getTweet,;
>>>>>>> adding-sessions
			//console.log("query sent successfully");
		}
	});
}

function getTweet(){
	$.ajax({
		type: "get",
		url:"/tweet" ,
		datatype: "json",
		success: function(data){
			//response = data.data;
			//console.log(data.data);
			//refreshDOM();
			refreshDOM(data.data);
		},
		error: function(msg){
			console.log("error:" + msg);
		}
	});
}


$(document).ready(function(){
	//post("kanye");
	$("#submitButton").click(function(){
		console.log($("#query-input").val());
		//sendQuery($("#query-input").val(),37.781157,-122.398720,25km);
		console.log(radiusStart.lat(),radiusStart.lng());
		//sendQuery($("#query-input").val(),radiusStart.lat(),radiusStart.lng());
		//get($("#query-input").val());
		//post($("#query-input").val());
	});
	//getLocation();
});