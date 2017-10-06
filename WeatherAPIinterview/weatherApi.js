/*
 * APPLICATION: 
 * 
 * OBJECTIVE- TO GET THE RESPONSE FROM WEATHER API PUBLISHED 
 * BY YAHOO and IMPLEMENT
 * a) Logging
 * b) Unit and Integration testing ( framework of your choice)
 * c) API Documentation ( of your choice) preferable swagger
 * d) ESLint
 * 
 * GOAL- TO PASS THE INTERVIEW AND JOIN CTS
 * 
 * SOLUTION:
 * A. APPLICATION GETS THE INPUT FROM THE USER FROM THE PROMPT
 * B. VALIDATES THE INPUT FOR NULL
 * C. SENDS A GET REQUEST TO YAHOO APIS FOR WEATHER QUERY 
 * ex:-https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22london%2C%20uk%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
 *
 * */


/*
 * version 0.1 Deactivated
 * 
 *
 var http = require('https');
var jsonQuery = require('json-query');


function getWeatherInfo(location){
	return http.get('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"'+location+'\")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
       , function(response) {
        //Continuously update stream with data
         
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            //Data reception is done, do whatever with it!
             
            var parsed = JSON.parse(body);
            callback(parsed);
        });
    });
};


function callback(temperaturedetails){
	//Temperature
	console.log("Termperature at "+city+", "+state+" is: "+JSON.stringify(temperaturedetails.query.results.channel.item.condition.temp) +"F");
	//All details including forecast
	//console.log(JSON.stringify(temperaturedetails));	
}

process.argv.forEach(function (val, index, array) {
	  console.log(index + ': ' + val);
	});
var city = process.argv[2];
var state = process.argv[3];
console.log('city: ' + city +" state / country: " +state);

getWeatherInfo(city+", "+state);
 */
/*
 * IMPORT THE REQUIRED PACKAGES
 * version 0.2
 */
var weatherApp = require('express')();
var http = require('http').Server(weatherApp);
var bodyParser = require('body-parser');
var request = require('request');
var Winston = require('winston');


const logger = new Winston.Logger({
    level: 'verbose',
    transports: [
        new Winston.transports.Console({
            timestamp: true
        }),
        new Winston.transports.File({
            filename: 'weatherApi.log',
            timestamp: true
        })
    ]
});

logger.info('Starting server at 3000');

weatherApp.use(bodyParser.json());
weatherApp.use(bodyParser.urlencoded({
    extended: true
}));
weatherApp.use(errorHandler);

http.listen(9999, function() {
    console.log('listening...');
});
weatherApp.get('/', function(req, res) {
	res.send("type like localhost:3000/weather/cityname ");
});
weatherApp.get('/weather/:city', function(req, res) {
    var city = req.params.city;
    logger.info('City/Location request: ' + city);
    var apiurl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + city + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
    request(apiurl, function(error, response, body) {
        var temperaturedetails = JSON.parse(body);
         if (body.indexOf("\"temp\"") <0) {
            logger.error('City/Location response: City does not exist');
            res.send("CITY DOES NOT EXIST" + body);
        } else {
            logger.info('City/Location response: ' + temperaturedetails.query.results.channel.item.condition.temp);
            res.send(body);
        }
    })
    //res.end()
})


function errorHandler(err,
    req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    logger.error('Error: ' + err);
    res.render('error', {
        error: err
    })
}

weatherApp.listen(3000)