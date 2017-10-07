
/*
 * IMPORT THE REQUIRED PACKAGES
 * version 0.3
 */
var weatherApp = require('express')();
var bodyParser = require('body-parser');
var request = require('request');
var Winston = require('winston');

module.exports = {};



var logger = new Winston.Logger({
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


weatherApp.get('/', function(req, res) {
    res.send('type like localhost:3000/weather/cityname');
    return res;
});
weatherApp.get('/weather/:city', function(req, res) {
    var city = req.params.city;
    logger.info('City/Location request: ' + city);
    var apiurl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + city + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';   
    request(apiurl, function(error, response, body) { 	
        var temperaturedetails = JSON.parse(body);
        if (body.indexOf('temp') <0) {
            logger.error('City/Location response: City does not exist');
            res.send('CITY DOES NOT EXIST' + body);
        } else {
            logger.info('City/Location response: ' + temperaturedetails.query.results.channel.item.condition.temp);
            res.send(body);
        }
       
    });
    //res.end()
});



function errorHandler(err,
    req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    logger.error('Error: ' + err);
    res.render('error', {
        error: err
    });
}

weatherApp.listen(3000);