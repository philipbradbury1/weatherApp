'use strict';

var express = require('express');

var app = express();


app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

app.get('/', function(req,res,next){
	res.render('index');
})


app.listen(3000, function(){
	console.log("The frontend server is running on port 3000");
});