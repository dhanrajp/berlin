// Author: Dhanraj 
// 27-FEb-2016
// 
// Description: Exercies from "Web Development with Node and Express" Ch-03

var express = require('express');
var app = express();

var handlebars = require('express-handlebars')
	.create({defaultLayout:'main'});
app.set('port',process.env.PORT || 8088);

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.get('/',function(req,res){
  res.render('home');
});

var fortunes = [
  "Conquer your fears or they will conquer you",
  "Rivers need springs",
  "Do not fear what you don't know",
  "You will have a pleasant surprise",
  "Keep it simple",
  ];

app.get('/about',function(req,res){
var randomFortune = 
  fortunes[Math.floor(Math.random()*fortunes.length)];
  res.render('about', {fortune: randomFortune});
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
