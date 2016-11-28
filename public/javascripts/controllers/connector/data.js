var sql = require('mssql');
///Config
module.exports = {};

module.exports.CheckConnection = function(arr,callback){
	var checkConn = {
		user : arr[1],
		password : arr[2],
		database :arr[3],
		server : arr[0]
	};

	var connection = new sql.Connection(checkConn,function(err)
	{
		callback(err);
	});
}

module.exports.getList1 = function(arg,conn,callback){
	var connStr = {
		user : conn[1],
		password :conn[2],
		database :conn[3],
		server : conn[0]
	};

	var payrollCon = new sql.Connection(connStr,function(err)
	{
		var request = new sql.Request(payrollCon);
		request.query(arg,function(err,recordset,result){
			callback(recordset);
		});
	})
}

module.exports.getList2 = function(arg,conn,callback){
	var connStr = {
		user : conn[1],
		password :conn[2],
		database :conn[3],
		server : conn[0]
	};
	var payrollCon = new sql.Connection(connStr,function(err)
	{
		var request = new sql.Request(payrollCon);
		request.query(arg,function(err,recordset,result){
			callback(recordset);
		});
	})
}
return module;