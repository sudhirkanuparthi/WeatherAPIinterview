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
 * IMPORT THE REQUIRED PACKAGES
 */
var http = require('https');
var jsonQuery = require('json-query');

function getWeatherInfo(location){
	return http.get('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"'+location+'\")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
       , function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            callback(parsed);
        });
    });
};


function callback(temperaturedetails){
	/*Temperature*/
	console.log("Termperature at "+city+", "+state+" is: "+JSON.stringify(temperaturedetails.query.results.channel.item.condition.temp) +"F");
	/*All details including forecast*/
	//console.log(JSON.stringify(temperaturedetails));	
}
 
process.argv.forEach(function (val, index, array) {
	  console.log(index + ': ' + val);
	});
var city = process.argv[2];
var state = process.argv[3];
console.log('city: ' + city +" state / country: " +state);

getWeatherInfo(city+", "+state);