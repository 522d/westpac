var express = require('express');
var router = express.Router();
/* GET users listing. */
var tables = require(__dirname + '/../public/javascripts/controllers/tables');
require('body-parser');

var _conn =[];
var _conn2 =[];
var perc = 0;
var perSP = [0,0,0,0]

var tf = [];


function arr_diff (a1, a2) {
	var a = [], diff = [];
	var b =[], diffMain = [];
	for (var i = 0; i < a1.length; i++) {
		a[a1[i]] = true;
	}
	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			b.push(a2[i]);
			delete a[a2[i]];
		} else {
			a[a2[i]] = true;
		}
	}
	for (var k in a) {
		diff.push(k);
	}

	diffMain.push(diff)
	diffMain.push(b)
	return diffMain;
};

var CheckDBConn  = function(_conn,_conn2,callback){
	var _result  = [];
	tables.CheckConnection(_conn,function(_connChecker){
		_result.push(_connChecker);
		tables.CheckConnection(_conn2,function(_connChecker2){
			_result.push(_connChecker);
			callback(_result);
		});
	});
}

var GetTables = function(par,_conn,_conn2,callback){

	tables.getTableLists(par,_conn,_conn2,function(recordset){
		tables.compareDatabase('',_conn,_conn2,function(diff){
			CompareFields(diff,_conn,_conn2,function(records){

				callback({'Type': 'tables','TableList1':recordset[0],'TableList2':recordset[1],'_Diff_Tables': records,'ConnStatus': null});

			});
		})
	});
}

var GetSps = function(arg,_conn,_conn2,callback){
	tables.getSPList(arg,_conn,_conn2,function(recordset){
		callback(recordset);
	});

}

router.post('/getStoredProcs', function(req, res, next) {
	_conn.push(req.body.DB_Server);
	_conn.push(req.body.DB_User);
	_conn.push(req.body.DB_Password);
	_conn.push(req.body.DB_Database);

	_conn2.push(req.body.DB2_Server);
	_conn2.push(req.body.DB2_User);
	_conn2.push(req.body.DB2_Password);
	_conn2.push(req.body.DB2_Database);

	var _conMessage = [];
	var _conMessage2 = [];
	CheckDBConn(_conn,_conn2,function(_result){
		if(_result[0] == null && _result[1] == null)
		{

			var sp1 = [];
			var sp2 = [];
			GetSps('P',_conn,_conn2,function(_records){
				_records[0].map(function(a){
					sp1.push(a.name);
				});
				_records[1].map(function(a){
					sp2.push(a.name);
				});
				var diff = arr_diff(sp1,sp2);
				console.log(diff[0]);
				var Differences;		
				tables.compareScripts(diff[1],'P',_conn,_conn2,function(_compareResult)
				{

					diff[0].map(function(name){
						_compareResult.push({'name':name,'message': 'script missing from other database'});
						diff[1].push(name);
					})

					res.json({'diffList':_compareResult,'records': diff[1], 'line': null});
				})
			})
			
		}
		else
		{
			res.json('hhhhh');
		}
	})
});


router.post('/getFunctions', function(req, res, next) {
	_conn.push(req.body.DB_Server);
	_conn.push(req.body.DB_User);
	_conn.push(req.body.DB_Password);
	_conn.push(req.body.DB_Database);

	_conn2.push(req.body.DB2_Server);
	_conn2.push(req.body.DB2_User);
	_conn2.push(req.body.DB2_Password);
	_conn2.push(req.body.DB2_Database);

	var _conMessage = [];
	var _conMessage2 = [];
	CheckDBConn(_conn,_conn2,function(_result){
		if(_result[0] == null && _result[1] == null)
		{

			var sp1 = [];
			var sp2 = [];
			GetSps('TF',_conn,_conn2,function(_records){
				_records[0].map(function(a){
					sp1.push(a.name);
				});
				_records[1].map(function(a){
					sp2.push(a.name);
				});
				var diff = arr_diff(sp1,sp2);
				console.log(diff[0]);
				
				var Differences;		
				tables.compareScripts(diff[1],'TF',_conn,_conn2,function(_compareResult)
				{

					diff[0].map(function(name){
						_compareResult.push({'name':name,'message': 'script missing from other database'});
						diff[1].push(name);
					})

					res.json({'diffList':_compareResult,'records': diff[1], 'line': null});
				})
			})
			
		}
		else
		{
			res.json('hhhhh');
		}
	})
});


router.post('/getTriggers', function(req, res, next) {
	_conn.push(req.body.DB_Server);
	_conn.push(req.body.DB_User);
	_conn.push(req.body.DB_Password);
	_conn.push(req.body.DB_Database);

	_conn2.push(req.body.DB2_Server);
	_conn2.push(req.body.DB2_User);
	_conn2.push(req.body.DB2_Password);
	_conn2.push(req.body.DB2_Database);

	var _conMessage = [];
	var _conMessage2 = [];
	CheckDBConn(_conn,_conn2,function(_result){
		if(_result[0] == null && _result[1] == null)
		{

			var sp1 = [];
			var sp2 = [];
			GetSps('TR',_conn,_conn2,function(_records){
				_records[0].map(function(a){
					sp1.push(a.name);
				});
				_records[1].map(function(a){
					sp2.push(a.name);
				});
				var diff = arr_diff(sp1,sp2);
				console.log(diff[0]);
				
				var Differences;		
				tables.compareScripts(diff[1],'TR',_conn,_conn2,function(_compareResult)
				{

					diff[0].map(function(name){
						_compareResult.push({'name':name,'message': 'script missing from other database'});
						diff[1].push(name);
					})

					res.json({'diffList':_compareResult,'records': diff[1], 'line': null});
				})
			})
			
		}
		else
		{
			res.json('hhhhh');
		}
	})
});


router.post('/getViews', function(req, res, next) {
	_conn.push(req.body.DB_Server);
	_conn.push(req.body.DB_User);
	_conn.push(req.body.DB_Password);
	_conn.push(req.body.DB_Database);

	_conn2.push(req.body.DB2_Server);
	_conn2.push(req.body.DB2_User);
	_conn2.push(req.body.DB2_Password);
	_conn2.push(req.body.DB2_Database);

	var _conMessage = [];
	var _conMessage2 = [];
	CheckDBConn(_conn,_conn2,function(_result){
		if(_result[0] == null && _result[1] == null)
		{

			var sp1 = [];
			var sp2 = [];
			GetSps('V',_conn,_conn2,function(_records){
				_records[0].map(function(a){
					sp1.push(a.name);
				});
				_records[1].map(function(a){
					sp2.push(a.name);
				});
				var diff = arr_diff(sp1,sp2);
				console.log(diff[0]);
				
				var Differences;		
				tables.compareScripts(diff[1],'V',_conn,_conn2,function(_compareResult)
				{

					diff[0].map(function(name){
						_compareResult.push({'name':name,'message': 'script missing from other database'});
						diff[1].push(name);
					})

					res.json({'diffList':_compareResult,'records': diff[1], 'line': null});
				})
			})
			
		}
		else
		{
			res.json('hhhhh');
		}
	})
});
/*var running  =function(callback){
	
	setInterval(function(){
		tables.running(function(rec){
			console.log(rec.CurrentRes)
			callback(rec);
		});
	},1000)
};
*/
//running();
var TableDiffRES = []
router.post('/runningValue',function(req,res,next){

	tables.running(function(rec){

		var dummy  = TableDiffRES;
		TableDiffRES = [];
		if( dummy != [])
		{
			rec.CurrentRes.push(dummy);
		}
		res.json({'runningVal':perc ,
			'Cur': rec.CurrentRes,'sqlP':rec.sqlP , 'sqlTF': rec.sqlTF ,'sqlTR': rec.sqlTR , 'sqlV': rec.sqlV} );
	});
});
router.post('/getTableList', function(req, res, next) {

	var par = req.body.Checker_Database;

	console.log(req.body)
	
	_conn.push(req.body.DB_Server);
	_conn.push(req.body.DB_User);
	_conn.push(req.body.DB_Password);
	_conn.push(req.body.DB_Database);

	_conn2.push(req.body.DB2_Server);
	_conn2.push(req.body.DB2_User);
	_conn2.push(req.body.DB2_Password);
	_conn2.push(req.body.DB2_Database);

	var _conMessage = [];
	var _conMessage2 = [];
	CheckDBConn(_conn,_conn2,function(_result){
		if(_result[0] == null && _result[1] == null)
		{
			GetTables(par,_conn,_conn2,function(recodset){
				res.json(recodset.Type,{'TableList1':recodset.TableList1,'TableList2':recodset.TableList2,'_Diff_Tables':recodset._Diff_Tables,'ConnStatus': null ,'ConnStatus2': null});
			});


		}
		else
		{
			res.json('tables',{'TableList1':[],'TableList2':[],'_Diff_Tables': [],'ConnStatus':  _result[0], 'ConnStatus2': _result[1]});
		}

	})
	

});


router.post('/CheckConnection',function(req,res,next){
	var par =[]
	console.log(req.body)
	par.push(req.body.DB_Server);
	par.push(req.body.DB_User);
	par.push(req.body.DB_Password);
	par.push(req.body.DB_Database);

	console.log(par)
	tables.CheckConnection(par,function(recordset){
		res.json(recordset);	
	});


});

router.post('/CheckConnection2',function(req,res,next){
	var par =[]
	console.log(req.body)
	par.push(req.body.DB2_Server);
	par.push(req.body.DB2_User);
	par.push(req.body.DB2_Password);
	par.push(req.body.DB2_Database);

	console.log(par)
	tables.CheckConnection(par,function(recordset){
		res.json(recordset);	
	});


});


router.post('/getTableList/:field', function(req, res, next) {


	console.log(req.body)
	
	_conn.push(req.body.DB_Server);
	_conn.push(req.body.DB_User);
	_conn.push(req.body.DB_Password);
	_conn.push(req.body.DB_Database);

	_conn2.push(req.body.DB2_Server);
	_conn2.push(req.body.DB2_User);
	_conn2.push(req.body.DB2_Password);
	_conn2.push(req.body.DB2_Database);
	var par = req.params.field;

	tables.getTableLists_Fields(par,_conn,_conn2,function(recordset){
		tables.compareDatabase(par,_conn,_conn2,function(diff)
		{
			CompareFields(diff,_conn,_conn2,function(records){
				res.json('tables',{'TableList1':recordset[0],'TableList2':recordset[1],'_Field_Diff':records});	
			})
			
		});

	});

});


var CompareFields = function(diff,_conn,_conn2,callback){


	var tbCol1= []
	var tbCol2= []
	var recLen = [];
	if(diff.length == 2){
		var count= 0;
		var tableDiffFields = [];
		tf = [];
		for(var _table_diff in diff[0])
		{
			tf.push([diff[0][_table_diff],"Table Missing from the other DataBase"]);
			TableDiffRES.push(diff[0][_table_diff] + ": Table Missing from the other DataBase")
		}
		diff[1].push([]);
		var DoFindFields = function(j){

			console.log(((j/ diff[1].length )*100).toFixed(2));
			perc = ((j/ diff[1].length )*100).toFixed(2);

			if(j != diff[1].length){
				tables.getTableLists_Fields(diff[1][j],_conn,_conn2,function(record){

					recLen.push(record[0].length + " " + record[1].length);
					var countCol = 0;
					if(record[0].length != record[1].length)
					{
						tf.push([diff[1][j],"Field Count Not Equal" ])
						TableDiffRES.push(diff[1][j] +": Field Count Not Equal")
					}
					else
					{
						var k = 0;

						//console.log(val.TABLE_NAME+" " +val.COLUMN_NAME + " "+ _column_Properties[1].TABLE_CATALOG + " " + _column_Properties[0].TABLE_CATALOG);
						record[0].map(function(val,num,idfk){
							tables.getTableLists_Fields_Each(diff[1][j],val.COLUMN_NAME,_conn,_conn2,function(_column_Properties){

 								//console.log(val.COLUMN_NAME,_column_Properties[0][0].IS_NULLABLE + " " + _column_Properties[1][0].IS_NULLABLE);
 								if(_column_Properties[0][0].DATA_TYPE != _column_Properties[1][0].DATA_TYPE){
 									tf.push([diff[1][j],val.COLUMN_NAME, "Check Field Propery","Check Data Type"]);
 									TableDiffRES.push(diff[1][j],val.COLUMN_NAME + ": Check Field Propery - Check Data Type");

 								}
 								if(((_column_Properties[0][0].CHARACTER_MAXIMUM_LENGTH != null)?_column_Properties[0][0].CHARACTER_MAXIMUM_LENGTH :
 									((_column_Properties[0][0].NUMERIC_PRECISION  != null)?_column_Properties[0][0].NUMERIC_PRECISION + ""  + ((  _column_Properties[0][0].NUMERIC_SCALE != null)?","+ _column_Properties[0][0].NUMERIC_SCALE:
 										"") : "")) 
 									!= ((_column_Properties[1][0].CHARACTER_MAXIMUM_LENGTH != null)?  _column_Properties[1][0].CHARACTER_MAXIMUM_LENGTH : 
 										((_column_Properties[1][0].NUMERIC_PRECISION  != null)?_column_Properties[1][0].NUMERIC_PRECISION + ""  + ((  _column_Properties[1][0].NUMERIC_SCALE != null)?","+ _column_Properties[1][0].NUMERIC_SCALE:
 											"") : "")))
 								{

 									tf.push([diff[1][j],val.COLUMN_NAME, "Check Field Propery" , "Check Character Requirement OR Numerical Precision"]);
 									TableDiffRES.push(diff[1][j],val.COLUMN_NAME + ": Check Field Propery - Check Character Requirement OR Numerical Precision");
 								}
 								if(_column_Properties[0][0].IS_NULLABLE != _column_Properties[1][0].IS_NULLABLE){
 									tf.push([diff[1][j],val.COLUMN_NAME, "Check Field Propery","Check Nullability"]);
 									TableDiffRES.push(diff[1][j],val.COLUMN_NAME + ": Check Field Propery - Check Nullability");
 								}
 								

 							});});

							/*
 							
							*/
						}
 					//tableDiffFields.push();

 					DoFindFields(j+1);
 					
 				});}else{
 					//console.log(tableDiffFields);
 					callback(tf);
 				}
 			}
 			DoFindFields(count);


 		}
 	}



 	module.exports = router;