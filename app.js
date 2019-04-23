var express = require('express'),
    // routes = require('routes'),
    // user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    contacts = require('./modules/contacts'),
    cors = require('cors'),
    url = require('url');

var app = express();
// all enviromente
app.set('port', process.env.PORT || 3000);
app.use(cors())
// app.set('views', __dirname + './views');
// app.set('view engine', 'jade');
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/contacts', (request, response) => {
    var get_params = url.parse(request.url, true).query;
    if(Object.keys(get_params).length == 0) {
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify(contacts.list()));
    } else {
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify(contacts.query_by_arg(get_params.arg, get_params.value)));
    }
});

app.get('/contacts/:number', (request, response) => {
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(contacts.query(request.params.number)));
});

app.get('/groups', (request, response) => {
    console.log('groups');
    response.format({
        'text/xml' : function() {
            response.send(contacts.list_groups_in_xml);
        },
        'application/json' : function () {
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(contacts.list_groups()));
        },
        'default' : function() {
            response.status(406).send('Not acceptable');
        }
    })

});

app.get('/groups/:name', (request, response) => {
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(contacts.get_members(request.params.name)));
});

// development only
// if('development' == app.get('env')) {
//     app.use(express.errorHandler());
// }

// app.get('/', routes.index);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});
