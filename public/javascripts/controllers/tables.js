 var data = require('./connector/data');
 module.exports = {};

 var perc= 0;

 var tf = [];
 var percSP = [0,0,0,0];
 var sqlP = 0;
 var sqlTF = 0;
 var sqlTR = 0;
 var sqlV = 0;
 module.exports.running = function(callback){
 	 sqlV  =(sqlV == 'NaN')? 100.00: sqlV;
 	 sqlP  =(sqlP == 'NaN')? 100.00: sqlP;
 	 sqlTF  =(sqlTF == 'NaN')? 100.00: sqlTF;
 	 sqlTR  =(sqlTR == 'NaN')? 100.00: sqlTR;
 	 var tfDummy = tf
 	 tf = [];
 	callback({'runningVal' :perc,'CurrentRes':tfDummy ,'sqlP':sqlP , 'sqlTF': sqlTF ,'sqlTR': sqlTR , 'sqlV': sqlV});
 }


 var trimThis = function (item) {
 	return ((item != null && item != '')? item.replace(/^\s+|\s+|\t+|\n+$/g, '') : '');
 };

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
 module.exports.getTableLists= function (arg1,_conn,conn2,callback) {
 	//getList1
 	var p = []
 	arg1 = "SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_NAME = ISNULL("+ ((arg1 != '')? "'"+ arg1 +"'" : "NULL")+",TABLE_NAME) ORDER BY TABLE_NAME";
 	data.getList1(arg1,_conn,function(recordset){
 		p.push(recordset);
 		data.getList1(arg1,conn2,function(recordset1){
 			p.push(recordset1);
 			callback(p);
 		});
 		
 	});

 };

 module.exports.getSPList = function (arg1,_conn,_conn2,callback){
 	var p = [];
 	arg1 = "SELECT DISTINCT sysobjects.name AS 'name' "+
 	" , case when sysobjects.xtype = 'P' then 'P' "+
 	" when sysobjects.xtype = 'TF' then 'TF' "+
 	" when sysobjects.xtype = 'TR' OR sysobjects.xtype = 'FN' then 'TR' "+
 	" when sysobjects.xtype = 'V' then 'V' end as 'Type' "+
 	" FROM sysobjects,syscomments WHERE sysobjects.id = syscomments.id  "+
 	" AND sysobjects.type in ('P','TF','FN','TR','V') AND sysobjects.category = 0 " +
 	" AND sysobjects.type in " + ((arg1 != null)?((arg1 == "TF") ?   "('TF','FN')" : "('"+ arg1 +"')") :"('P','TF','TR','V')" );

 	data.getList1(arg1,_conn,function(recordset){
 		p.push(recordset);
 		data.getList1(arg1,_conn2,function(recordset1){
 			p.push(recordset1);
 			callback(p);
 		});
 		
 	});



 };

 module.exports.CheckConnection = function(arg,callback){
 	data.CheckConnection(arg,function(recordset){
 		callback(recordset)
 	});

 }

 module.exports.getTableLists_Fields= function (arg1,conn,conn2,callback) {
 	//getList1
 	var p = []
 	
 	arg1 = "select * from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '" + arg1 +"' ORDER BY ORDINAL_POSITION";

 	data.getList1(arg1,conn,function(recordset){
 		p.push(recordset);
 		data.getList2(arg1,conn2,function(recordset1){
 			p.push(recordset1);
 			callback(p);
 		});
 		
 	});

 };


 module.exports.getTableLists_Fields_Each= function (arg1,colName,conn,conn2,callback) {
 	//getList1
 	var p = []
 	
 	arg1 = "select * from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '" + arg1 +"' AND COLUMN_NAME = '" + colName +"' ORDER BY ORDINAL_POSITION";

 	data.getList1(arg1,conn,function(recordset){
 		p.push(recordset);
 		data.getList2(arg1,conn2,function(recordset1){
 			p.push(recordset1);
 			callback(p);
 		});
 		
 	});

 };

 var getScript = function(arg1,_conn,_conn2,callback){
 	var p = []
 	arg1 = 'sp_helptext '+arg1
 	data.getList1(arg1,_conn,function(recordset){
 		p.push(recordset);
 		data.getList2(arg1,_conn2,function(recordset1){
 			p.push(recordset1);
 			callback(p);
 		});
 		
 	});

 }

//get all scripts that both database have
module.exports.compareScripts = function(scriptList,type,_conn,_conn2,callback){
	var Diff =[];
 	//G	
 	var CheckList = function(j){
 		getScript(scriptList[j],_conn,_conn2,function(recordset){

 			var scrLen = scriptList.length;
 			var p =((j/scrLen) * 100).toFixed(2);

 			if(type == 'V')
 			{
 				sqlV = p;
 			}
 			else  if(type == 'TF')
 			{
 				sqlTF = p;
 			}
 			else  if(type == 'TR')
 			{
 				sqlTR = p;
 			}
 			else  if(type == 'P')
 			{
 				sqlP = p;
 			}

 			var scr =[];
 			var scr1 =[];

 			if(j == scriptList.length){
 				callback(Diff);
 			}
 			else{
 				for(var k in recordset[0])
 				{
 					if(trimThis(recordset[0][k].Text) != '')
 					{
 						scr.push(recordset[0][k].Text);
 					}
 				}
 				for(var k in recordset[1])
 				{
 					if(trimThis(recordset[1][k].Text) != '')
 					{
 						scr1.push(recordset[1][k].Text);
 					}
 				}

 				var len  = ((scr1.length>scr.length)?scr1.length:scr.length) -1

 				for(var i = 0; i<len ;i++)
 				{




 					if(trimThis(scr1[i]) != trimThis(scr[i]))
 					{
 						Diff.push({'name': scriptList[j], 'message': 'scripts differ from ln.\n a:' + trimThis(scr[i]) +'\n b:' +   trimThis(scr1[i])  , 'line': i+1});
 						CheckList(j+1);
 						tf.push('broken ' + scriptList[j]);

 						break;		
 					}
 					else if(trimThis(scr1[i]) ==  trimThis(scr[i]) && len -1 == i)
 					{
 						tf.push('same ' + scriptList[j]);
 						CheckList(j+1);
 						break;
 					}
 				}
 				
 			}


 		});	

};
CheckList(0);
}


module.exports.compareDatabase =function(arg1,_conn,_conn2,callback){

	var tableList = [];
	var table = [];

	var diff =  [];

	module.exports.getTableLists(arg1,_conn,_conn2,function(recordset){
		tableList.push(recordset);
		var tables = [];
		var tb1 = [];
		var tb2 = [];

		tableList.map(function(a,b,c){

			a.map(function(d,e,f){
 				//console.log("d" +d.length);

 				tables.push(d);
				//d.map(function(g,h,i){
				//});
		});

 			//tables.push(a.TABLE_NAME);
 			tables[0].map(function(g,h,i){
 				tb1.push(g.TABLE_NAME);
 			});
 			tables[1].map(function(g,h,i){
 				tb2.push(g.TABLE_NAME);
 			});


 		});	

		var m = [];
		diff =	arr_diff(tb1,tb2);
 		//console.log(tables);
 		callback(diff)


 	});


}


return module;