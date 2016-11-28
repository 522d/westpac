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
