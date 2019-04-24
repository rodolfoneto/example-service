var mongoose = require('mongoose');

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

var jonh_douglas = new Contact({
    "firstname": "Jonh",
    "lastname": "Douglas",
    "title": "Mr.",
    "company": "Dev Inc.",
   "jobtitle": "Developer",
   "primarycontactnumber": "+3597772",
   "othercontactnumber": [],
   "primaryemailaddress": "jonh.douglas@xyz.com",
   "emailaddresses": ["j.douglas@xyz.com"],
   "groups": ["Dev"]
});
// var db = mongoose.connection;
mongoose.connect('mongodb://localhost:28017/contact', {useNewUrlParser:true});
// jonh_douglas.save((error) => {
//     if(error) {
//         console.log(error);
//     } else {
//         jonh_douglas.save();
//         console.log('contact for Mr J has been saved');
        
//     }
// });

Contact.find({groups: 'Dev', title: 'Mr.'}, (error, result) => {
    if(error) {
        console.log(error);
    } else {
        console.dir(result[0].primarycontactnumber);
    }
    mongoose.disconnect();
});
