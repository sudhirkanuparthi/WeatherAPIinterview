/**
 * Spec file
 */
var request = require('request');
var weatherApi_ = require('../weatherApi.js');
var base_url = 'http://localhost:3000/';
var base_urlcity='http://localhost:3000/weather/fremont';
	
describe('Base server test', function() {
    describe('GET /', function() {
        it('returns status code 200 for base url', function(done) {
            request.get(base_url, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns type like localhost:3000/weather/cityname for base url', function(done) {
            request.get(base_url, function(error, response, body) {
                expect(body).toBe('type like localhost:3000/weather/cityname');
                done();
            });
        });
        it('returns type like localhost:3000/weather/cityname for base url', function(done) {
            request.get(base_urlcity, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});