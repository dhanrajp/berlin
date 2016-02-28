// Author: Dhanraj 
// 27-FEb-2016
// 
// Description: Exercies from "Web Development with Node and Express" Ch-03

var express = require('express');
var app = express();
var fortune = require('./lib/fortune.js');
var handlebars = require('express-handlebars')
	.create({defaultLayout:'main'});
var formidable = require('formidable');
var aws = require('aws-sdk');
var S3 = new aws.S3();

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({ extended: true }));
 
app.set('port',process.env.PORT || 8088);

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(function(req, res, next){
        res.locals.showTests = app.get('env') !== 'production' &&
                req.query.test === '1';
    if (res.locals.showTests) {
     console.log("test");
    } else {
     console.log("We're Live!");
    }
    next();
});

app.get('/',function(req,res){
  res.render('home');
});

app.get('/contest/vacation-photo',function(req,res){
    var now = new Date();
    res.render('contest/vacation-photo',{
        year: now.getFullYear(),month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) {
            res.session.flash = {
                type: 'danger',
                intro: 'Oops!',
                message: 'There was an error processing your submission. ' +
                    'Please try again.',
            };
            return res.redirect(303, '/contest/vacation-photo');
        }  // if (err)
        var photo = files.photo;
        //var dir = vacationPhotoDir + '/' + Date.now();
        //var path = dir + '/' + photo.name;
console.log ('uploading file - ' +photo.path);

    var params = {Bucket: 'dp1lab', Key: photo.name, Body: photo.path};
    
    S3.putObject(params, function(err, data) {
      if (err) 
	console.log(err);
      else
        console.log("successfully uploaded to dp1lab/"+photo.name);
     });
        //req.session.flash = {
         //   type: 'success',
          //  intro: 'Good luck!',
       //     message: 'You have been entered into the contest.',
       // };
        res.redirect(303, '/thank-you');
    });
});


app.get('/newsletter', function(req, res){
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
 });

app.post('/process', function(req, res){
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you');
});

app.get('/about',function(req,res){
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
    });
  
});

app.use(function(req,res,next){
  res.status(404);
  res.render('404');
});

app.use(function(req,res,next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'),function(){
  console.log('Express started on '+app.get('port') + '; press Ctrl-C to terminate');
});
