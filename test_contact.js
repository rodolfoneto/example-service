var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    _v1 = require('./modules/contactdataservice_1');
var app = express();

app.set('port', process.env.port || 3000);
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:28017/contact', {useNewUrlParser:true});

var contactSchema = new mongoose.Schema({
    "primarycontactnumber": {type: String, index: {unique: true}},
    "firstname": String,
    "lastname": String,
    "title": String,
    "company": String,
    "jobtitle": String,
    "othercontactnumber": [String],
    "primaryemailaddress": String,
    "emailaddresses": [String],
    "groups": [String]
});

var Contact = mongoose.model('Contact', contactSchema);

app.get('/v1/contact/:number', (request, response) => {
    console.log(`${request.url}: querying for ${request.params.number}`);
    _v1.findByNumber(Contact, request.params.number);
});

app.post('/v1/contact', (request, response) => {
    _v1.update(Contact, request.params.number);
});

app.put('/v1/contact', (request, response) => {
    _v1.create(Contact, request.body, response);
});

app.del('/v1/contacts/:primarycontactnumber', (request, response) => {
    _v1.remove(Contact, request.params.primarycontactnumber, response);
});

app.get('/v1/contact', (request, response) => {
    console.log(`Listing all contacts with ${request.params.key}=${request.params.value}`);
    _v1.list(Contact, response);
});

app.get('/contact', (request, response) => {
    response.writeHead(301, {'Location': '/v1/contacts'});
    response.end('Version 1 is moved to /contacts/: ');
});

console.log(`Runing ta port ${app.get('port')}`);
http.createServer(app).listen(app.get('port'));