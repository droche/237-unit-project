var express = require('express'),
    app = express();

app.use(express.logger());
app.use(express.bodyParser());

var http = require('http'),
	https = require('https');

app.get("/static/:filename", function(request, response){
	response.sendfile("static/" + request.params.filename);
});

var requestQuery;
var latestTweet = 0;

var fsclientId = "VU0DICU13IR5L5YWZ23OGBCIMSUA2CCQILVXMV2QRQGRGKHN";
var fsclientSecret = "3UB2V5MNWB0QUCGNA5DDIH05YU0BSOOE0DI05GISLLWWGN0D";

var twclientId = "Bt2qpXMrCsbctcTSwxVU8Q";
var twclientSecret = "j2EweBmhK7cknxr3WvIAZLl1SjVs7YmDKd0k66okVdA";

// var options = {
	// host: 'search.twitter.com',
	// port: 443,
	// path: '/search.json',
	// method: 'GET',
	// headers: {
		// 'Content-Type': 'application/json'
	// }
// };


function tweetGetter(callBack2){
	console.log("current query " + requestQuery);
	var options = {
		host: 'search.twitter.com',
		path: "/search.json?q=" + requestQuery + "&rpp=100&geocode=37.781157,-122.398720,25mi",
		// host: 'api.twitter.com',
		// path: "/1.1/trends/place.json?id=" + requestQuery + "&rpp=100",
		// path: "api.twitter.com/1.1/trends/place.json?id="+requestQuery,
		//path: "https://api.twitter.com/1.1/trends/place.json?id=1",
	//	host: 'search.twitter.com',
		// path: "/search.json?rpp=100&q=" + requestQuery,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	console.log("path option: " + options.path);
	callback = function(response){
		console.log("I enter callback");
		var str = '';
		response.on('data', function(chunk){
			if(chunk){
				str += chunk;
				// responseJSON += chunk;
			}
			// responseJSON += chunk;
		});

		response.on('end', function(){
			callBack2(str);
		});

		// console.log(http.request(options, callback));
	};
	// return http.request(options, callback).end();
	return https.request(options, callback).end();

}

function venueGetter(query, callback2){
	console.log("current query" + query);
	var options = {
		host: "api.foursquare.com",
		path: "/v2/venues/search?ll=" + query + "&client_id=" + fsclientId + "&client_secret=" + fsclientSecret + "&v=20130222",
		// path: "/v2/venues/search?ll=" + query,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Connection': 'close'
		}
	};
	console.log("path option: " + options.path);
	callback = function(response){
		console.log("I enter venue callback");
		var str = '';
		response.on('data', function(chunk){
			if(chunk){
				str += chunk;
			}
			
			responseJSON += chunk;
		});

		response.on('end', function(){
			console.log(str);
			callback2(str);
		});

		response.on('err', function(){
			console.log("We gotta error gettin the venues yo");
		});
		// console.log(http.request(options, callback));
	};
	console.log("Gonna call the next line");
	return https.request(options, callback).end();
}

app.get('/search/:keyword', function(request, response){
	requestQuery = request.params.keyword;
	tweetGetter(function(str){
		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		response.send({
			data: parseData(str),
			success: (str !== undefined)
		});
	});
});



app.get('/venues/search', function(request, response){
	var lat = request.query.lat;
	var lon = request.query.lon;
	console.log("params = " + request.query);
	console.log(lat + " " + lon);
	venueGetter(lat + ',' + lon, function(resp){
		// console.log("***********VENUES************" + venues);
		parseData(resp);
		response.send({
			data: resp,
			success: (resp !== undefined)
		});
	});
});

// app.get('/search', function(request, response){
	// console.log("********Le response JSON*******" + responseJSON);
	// if(responseJSON.substring(0,5) === 'false'){
		// responseJSON = responseJSON.substring(5);
	// }
	// response.send({
		// data: responseJSON,
		// success: (responseJSON !== undefined)
	// });
// });

function parseData(str){
	// if(responseJSON.substring(0,5) === 'false'){
		// responseJSON = responseJSON.substring(5);
	// }
	// else if (responseJSON.substring(0,9) === 'undefined'){
		// responseJSON = responseJSON.substring(9);
	// }
	console.log(str);
	str = JSON.parse(str);
	return str;
	
}


app.post('/search', function(request, response){
	requestQuery = request.body.query;
	console.log("request: " + request.body.query);
	responseJSON = tweetGetter();
	console.log("!!response: " + responseJSON);
	response.send({
		success: responseJSON !== undefined
	});
});

app.listen(8889);
//console.log('Express server started on port %s', app.address().port);