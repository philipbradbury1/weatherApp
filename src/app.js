'use strict';

var express = require('express');
var https = require('https')
var bodyParser = require("body-parser")

var app = express();


var lon;
var lat;


app.use('/static', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');


app.get('/', function(req,res,next){
	res.render('index', {
							location: "Location",
							temperature: 0,
							humidity: 0,
							wind: 0
						});
});

app.post('/', function(req,res,next){

	var search = req.body.search;

	if(search == ""){
		var err = new Error("Please enter a location to search");
		err.status = 404;
		next(err);
	} else {
	
		function google(callback){

			var api = "AIzaSyDVFgT73SU5an-JPKEkPSQX1j8xbwzhF0A";

			var url = https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=${api}`, function(res3){

				var body = "";
				var googleResults;

				res3.on('data', function(data){
					body += data.toString();
				})

				res3.on('end', function(){

					googleResults = JSON.parse(body);
					//console.log("body " + googleResults);

					if(googleResults.results[0] == undefined){
						var err = new Error("That location seems incorrect");
						err.status = 404;
						next(err);
					} else {
					var lon = googleResults.results[0].geometry.location.lng;
					var lat = googleResults.results[0].geometry.location.lat;

					var location = googleResults.results[0].formatted_address;

						//console.log(location);
					callback(lat,lon,location);
					}
				})

			});

		}


		google(function(lat,lon,location){

		//connectc to API URL()
			var request = https.get(`https://api.darksky.net/forecast/4f797c8c0c026e79a4221cd6a1c4f7a5/${lat},${lon}?units=si`, function(res2){
			
			//console.log(lon + " help " + lat)
						var body = "";
						var weather;
						//Read the data
						res2.on('data', function(err, data){
							//if(err){
							//	var err = new Error("Hmmmm we cant get the weather today");
							//	err.status = 500;
							//	next(err);
						//	} 
								body += err.toString();
							
						})

						res2.on('end', function(){
								//Parse the data
							 weather = JSON.parse(body);
							 console.log("icon " + weather.currently.icon)
							//Print data
								res.render('lay', {
									location: location,
									img: JSON.stringify(weather.currently.icon),
									temperature: Math.round(weather.currently.temperature),
									humidity: weather.currently.humidity,
									wind: Math.round(weather.currently.windSpeed)
								});
							
						})	
			});
		});
	}
});


app.get("/test", function(req,res,next){
		res.render('error', {location: "Location",
							temperature: 0,
							humidity: 0,
							wind: "test", 
							error: "cheess"
  })
	})

app.use(function(req,res,next){
	if(!req.route){
	var err = new Error("Cant find that page");
		err.status = 404;
		next(err);
	}
})

app.use(function(err,req,res,next){
 //res.send({error: err.message});
 res.render('error', {location: "Location",
							temperature: 0,
							humidity: 0,
							wind: 0, 
							error: err.message
  })

});


app.listen(3000, function(){
	console.log("The frontend server is running on port 3000");
});