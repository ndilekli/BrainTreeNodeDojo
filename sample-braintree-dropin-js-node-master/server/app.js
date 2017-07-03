'use strict';

var express = require('express');
var app = express();

var braintree = require('braintree');

var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({
  extended: false
});

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '7f4dk7f8t937py25',
    publicKey:    'xsc4psx2bcgyyzjx',
    privateKey:   '1e53b2e990540fc5722f1757f78c6213'
});



app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  gateway.clientToken.generate({}, function (err, res) {
    response.render('index', {
      clientToken: res.clientToken
    });
  });
  console.log("sent client token: " + gateway.clientToken);

});

app.get('/getClientToken', function (request, response) {

  gateway.clientToken.generate({}, function (err, res) {
    console.log("Client requested token");
    response.send(res.clientToken.toString());
  });
});

app.post('/test', function (request, response) {

  //console.log(request);
  //console.log(response);
  response = "this is my response";
});

app.post('/process', function (request, response) {
  console.log("received payment info");
  console.log("Naci");
  console.log(parseUrlEnconded);
  var transaction = request.body;

  gateway.transaction.sale({
    amount: transaction.amount,
    paymentMethodNonce: transaction.payment_method_nonce
  }, function (err, result) {

    if (err) throw err;

    if (result.success) {

      console.log(result);

      response.sendFile('success.html', {
        root: './public'
      });
    } else {
      response.sendFile('error.html', {
        root: './public'
      });
    }
  });

});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});

module.exports = app;