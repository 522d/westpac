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


app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Aha_Moment_Labs') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})


app.post('/webhook/', function (req, res) {
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

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



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
