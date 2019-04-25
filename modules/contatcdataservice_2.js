exports.remove = function (model, _primarycontactnumber, response) {
    console.log(`Deleting contact ${_primarycontactnumber}`);
    model.findOne({primarycontactnumber: _primarycontactnumber}, (error, data) => {
        if (error) {
            console.log(error);
            if(response != null) {
                response.writeHead(500, {'content-type' : 'text/plain'});
                response.end('Internal server error');
            }
            return;
        } else {
            if(!data) {
                console.log('Not found');
                if(response != null) {
                    response.writeHead(404, {'content-type':'text/plain'});
                    response.end('Not found');
                }
                return;
            } else {
                data.remove( (error) => {
                    if(!error) {
                        data.remove();
                    } else {
                        console.log(error);
                    }
                });
                if(response != null) {
                    response.send('Deleted');
                }
                return;
            }
        }
    });
}

exports.update = function (model, requestBody, response) {
    var primarynumber = requestBody.primarycontactnumber;
    model.findOne({primarycontactnumber: primarynumber}, (error, data) => {
        if(error) {
            console.log(error);
            if(response != null) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end('Internal Server Error');
            }
            return;
        } else {
            var contact = toContact(resquestBody, model);
            if(!data) {
                console.log(`Contact with the number ${primarynumber} not existe, will be created.`);
                contact.save((error) => {
                    if(!error) {
                        contact.save();
                    }
                });

                if(response != null) {
                    response.writeHead(201, {'Content-Type': 'text/plain'});
                    response.end('Created');
                }
                return;
            }
            //Poulate the document with the updated values
            data.firstname = contact.firstname;
            data.lastname = contact.lastname;
            data.title = contact.title;
            data.company = contact.company;
            data.jobtitle = contact.jobtitle;
            data.primarycontactnumber = contact.primarycontactnumber;
            data.othercontactnumber = contact.othercontactnumber;
            data.primaryemailaddress = contact.primaryemailaddress;
            data.emailaddresses = contact.emailaddresses;
            data.groups = contact.groups;

            //save now
            data.save((error) => {
                if(!error) {
                    console.log(`Successfully updated contact with primary number ${primarynumber}`);
                    data.save();
                } else {
                    console.log('Error on Save');
                }
            });
            if(response != null) {
                response.send('Updated');
            }
        }
    });
}

exports.create = function (model, requestBody, response) {
    var primarynumber = requestBody.primarycontactnumber;
    var contact = toContact(resquestBody, model);

    contact.save((error) => {
        if(!error) {
            contact.save();
        } else {
            console.log(`Chicking if contact saving failed due to already existing primary number ${primarynumber}`);
            model.findOne({primarycontactnumber: primarynumber}, (error, data) => {
                if(error) {
                    console.log(error);
                    if(response != null) {
                        response.writeHead(500, {'Content-Type': 'text/plain'});
                        response.end('Internal server Error');
                    }
                    return;
                } else {
                    var contact = toContact(requestBody, model);
                    if(!data) {
                        console.log('The contact does not exist. I will be created');
                        contact.save((error) => {
                            if(!error) {
                                contact.save();
                            } else {
                                console.log(error);
                            }
                        });
                        if(response != null) {
                            response.writeHead(201, {'Content-Type': 'text/plain'});
                            response.end('Created');
                        }
                        return;
                    } else {
                        console.log('Updateing contact with primary contact number' + primarynumber);
                        data.firstname = contact.firstname;
                        data.lastname = contact.lastname;
                        data.title = contact.title;
                        data.company = contact.company;
                        data.jobtitle = contact.jobtitle;
                        data.primarycontactnumber = contact.primarycontactnumber;
                        data.othercontactnumber = contact.othercontactnumber;
                        data.primaryemailaddress = contact.primaryemailaddress;
                        data.emailaddresses = contact.emailaddresses;
                        data.groups = contact.groups;

                        data.save((error) => {
                            if(!error) {
                                data.save();
                                response.end('Updated');
                                console.log('Successfully Updated contact with primary contact number '+ primarynumber);
                            } else {
                                console.log('Error while saving contact with primary contact number ' + primarynumber);
                            }
                        });
                    }
                }
            });
        }
    });
}

exports.findByNumber = function (model, _primarycontactnumber, response) {
    model.findOne({primarycontactnumber: _primarycontactnumber}, (error, result) => {
        if(error) {
            console.log(error);
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end('Internal server error');
            return;
        } else {
            if(!result) {
                if(response != null) {
                    response.writeHead(404, {'Content-Type': 'text/plain'});
                    response.end('Not Found');
                }
                return;
            }
            if(response != null) {
                response.setHeader('Content-Type', 'application/json');
                response.send(result);
            }
            console.log(result);
        }
    });
}

exports.query_by_arg = function(model, key, value, response) {
    var filterArg = `{"${key}":"${value}"}`;
    var filter = JSON.parse(filterArg);
    model.find(filter, (error, result) {
        if(error) {
            console.log(error);
            response.writeHead(500, {'Content-Type' : 'text/plain'});
            response.end('Internal server error');
            return;
        } else {
            if(!result) {
                if(response != null) {
                    response.writeHead(404, {'Content-Type':'text/plain'});
                    response.end('Not Found');
                }
                return;
            }
            if(response != null) {
                response.setHeader('Content-Type', 'application/json');
                response.end(result);
            }
        }
    });
}

exports.list = function (model, response) {
    model.find({}, (error, result) => {
        if(error) {
            console.log(error);
            return null;
        }
        if(response != null) {
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(result));
        }
        return JSON.stringify(result);
    });
}

function toContact(body, Contact) {
    return new Contact({
        firstname : body.firstname,
        lastname : body.lastname,
        title : body.title,
        company : body.company,
        jobtitle : body.jobtitle,
        primarycontactnumber : body.primarycontactnumber,
        othercontactnumber : body.othercontactnumber,
        primaryemailaddress : body.primaryemailaddress,
        emailaddresses : body.emailaddresses,
        groups : body.groups
    });
}