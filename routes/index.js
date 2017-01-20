var express = require('express');
var router = express.Router();
var tables = require(__dirname + '/../public/javascripts/controllers/tables');
require('body-parser');
/* GET home page. */
var  p1 = [];
var  p2 = [];
var defaults = { title: 'Express',Pay1:p1,Pay2:p2};
var homePage = function(){

	
	router.get('/', function(req, res, next) {
		res.render('tables', 
			defaults);
	});
}


homePage();

//Go To Page
router.get('/tables', function(req, res, next) {
	res.render('tables', 
		 {title: 'Tables'});
});


router.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Aha_Moment_Labs') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})


router.get('/redirect_adobe/', function(req,res){
        if(req.query['redirect_uri'] == ''){
                req.send(req.query['something'])
        }

        res.send('Error, wrong token');
});

router.post('/redirect_adobe/', function (req, res) {
    res.sendStatus(200)
});

router.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'hi') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "parrot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = " enter token here"

// function to echo back messages - added by Stefan



/*
router.post('/tables/getTableLists', function(req, res, next) {

	var par = res.body.Checker_Database;
	console.log(res.body);
	tables.getTableLists(par,function(recordset1){
		res.json('A',{'Table1':recordset1[0]})
	});
});
*/


module.exports = router;
