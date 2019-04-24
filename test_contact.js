var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    dataservice = require('./modules/contactdataservice');
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

app.get('/contact/:number', (request, response) => {
    console.log(`${request.url}: querying for ${request.params.number}`);
    dataservice.findByNumber(Contact, request.params.number);
});

app.post('/contact', (request, response) => {
    dataservice.update(Contact, request.params.number);
});

app.put('/contact', (request, response) => {
    dataservice.create(Contact, request.body, response);
});

app.del('/contacts/:primarycontactnumber', (request, response) => {
    dataservice.remove(Contact, request.params.primarycontactnumber, response);
});

app.get('/contact', (request, response) => {
    console.log(`Listing all contacts with ${request.params.key}=${request.params.value}`);
    dataservice.list(Contact, response);
});

console.log(`Runing ta port ${app.get('port')}`);
http.createServer(app).listen(app.get('port'));