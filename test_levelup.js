var express = require('express'),
    http = require('http'),
    path = require('path'),
    // errorHandler = require('errorhandler'),
    levelup = require('levelup'),
    leveldown = require('leveldown');
    // import * as encoding from 'encoding-down';
var app = express();
// var url = require('url');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// if(development == app.get('env')) {
//     app.use(errorHandler());
// }
// const encoded = encoding(leveldown('/tmp/test'), {
//     valueEncoding: 'json',
// });
var db = levelup(leveldown('/tmp/test'));
db.put('+359777123456', {
    "firstname": "Joe",
    "lastname": "Smith",
    "title": "Mr.",
    "company": "Dev Inc.",
   "jobtitle": "Developer",
   "primarycontactnumber": "+359777123456",
   "othercontactnumber": [ "+359777456789", "+359777112233" ],
   "primaryemailaddress": "joe.smith@xyz.com",
   "emailaddresses": [ "j.smith@xyz.com" ],
   "groups": [ "Dev", "Family" ]
});

app.get('/contacts/:number', (request, response) => {
    console.log(request.url + ' : querying for ' + request.params.number);
    db.get(request.params.number, (error, data) => {
        if (error) { 
            response.writeHead(404, {'Content-Type' : 'text/plain'});
            response.end('Not Found');
            return;
        }
        console.dir(data);
        response.setHeader('content-type', 'application/json');
        response.send(new Buffer(data).toString());
    });
});

console.log(`Running at port ${app.get('port')}`);
http.createServer(app).listen(app.get('port'));
