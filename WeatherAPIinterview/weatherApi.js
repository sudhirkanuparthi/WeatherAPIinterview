
/*
 * IMPORT THE REQUIRED PACKAGES
 * version 0.3
 */
var express=require('express');
var weatherApp = express();
var bodyParser = require('body-parser');
var request = require('request');
var Winston = require('winston');

var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");

var subpath = express();
weatherApp.use(bodyParser());
weatherApp.use("/v1", subpath);
swagger.setAppHandler(subpath);

weatherApp.use(express.static('dist'));

swagger.setApiInfo({
    title: "example API",
    description: "API for calling yahoo service for weather info by giving the input of city name",
    termsOfServiceUrl: "",
    contact: "suddco@icloud.com",
    license: "",
    licenseUrl: ""
});

subpath.get('/', function (req, res) {
    res.sendfile(__dirname + '/dist/index.html');
});
swagger.configureSwaggerPaths('', 'api-docs', '');

var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".');
var applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0');

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