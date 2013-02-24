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
var lastTweet = 0;
var tweets;

var fsclientId = "VU0DICU13IR5L5YWZ23OGBCIMSUA2CCQILVXMV2QRQGRGKHN";
var fsclientSecret = "3UB2V5MNWB0QUCGNA5DDIH05YU0BSOOE0DI05GISLLWWGN0D";

var twclientId = "Bt2qpXMrCsbctcTSwxVU8Q";
var twclientSecret = "j2EweBmhK7cknxr3WvIAZLl1SjVs7YmDKd0k66okVdA";

function TweetQuery(keyword, lat, lon){
	this.keyword = keyword;
	this.lat = lat;
	this.lon = lon;
	this.time = new Date();
	this.setTime = function(setTime){
		this.time = setTime;
	};
}
// var options = {
	// host: 'search.twitter.com',
	// port: 443,
	// path: '/search.json',
	// method: 'GET',
	// headers: {
		// 'Content-Type': 'application/json'
	// }
// };


function trendsGetter(){
	console.log("Getting some trends...............................................");
	var options = {
		host: 'api.twitter.com',
		path: "/1.1/trends/12763673.json?",
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	console.log("path option: " + options.path);
	callback = function(response){
		console.log("Trends callback");
		var trendsStr = '';
		response.on('data', function(chunk){
			if(chunk){
				trendsStr += chunk;
			}
		});

		response.on('end', function(){
			console.log(trendsStr);
			callBack2(trendsStr);
		});

		// console.log(http.request(options, callback));
	};
	// return http.request(options, callback).end();
	return https.request(options, callback).end();
}


function tweetGetter(tq, callBack2){
	console.log("current query " + requestQuery);
	
	var options = {
		host: 'search.twitter.com',
		path: "/search.json?q=" + tq.keyword + "&result_type=mixed&rpp=100&geocode=" + tq.lat + "," + tq.lon + ",25mi",
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
			}
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
		//console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
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



app.post('/new', function(request, response){
	var tq = new TweetQuery(
		request.body.keyword,
		request.body.lat,
		request.body.lon
		);
	tweetGetter(tq, function(str){
		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		parseData(str);
		trendsGetter();
		response.send({
			//data: parseData(str),
			success: (str !== undefined)
		});	
	});
});


app.get('/tweet', function(request, response){

	response.send({
		data: tweets,
		success: (tweets !== undefined)
	});
});



function parseData(str){
	console.log(str);
	tweets = JSON.parse(str);
	lastTweet = tweets.max_id_str;
	//return tweets;
	
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