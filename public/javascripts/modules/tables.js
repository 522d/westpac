Array.prototype.unique = function() {
	var a = this.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i] === a[j])
				a.splice(j--, 1);
		}
	}

	return a;
};
var trimThis = function (item) {
	return item.replace(/^\s+|\s+|\t+|\n+$/g, '');
};

var containers = $(".scont");

containers.scroll(function() {
	containers.scrollLeft($(this).scrollLeft());
	containers.scrollTop($(this).scrollTop());

});

function arr_diff (a1, a2) {
	var a = [], diff = [];

	for (var i = 0; i < a1.length; i++) {
		a[a1[i]] = true;
	}

	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			delete a[a2[i]];
		} else {
			a[a2[i]] = true;
		}
	}

	for (var k in a) {
		diff.push(k);
	}

	return diff;
};




var textFile = null,
makeTextFile = function (text) {
	text = text.replace(/\n/g, "\r\n");
	var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
    	window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
};


var create = document.getElementById('create'),
textbox = document.getElementById('txt');
spd = document.getElementById('SpDifferences');
tfd = document.getElementById('TFDifferences');
trd = document.getElementById('TRDifferences');
vd = document.getElementById('VDifferences');

create.addEventListener('click', function () {
	var link = document.getElementById('downloadlink');
	link.href = makeTextFile( "--Tables\n" + textbox.value + "\n--Stored Procedures\n" +
		spd.value + " \n--Functions\n" +
		tfd.value + " \n--Triggers\n" +
		trd.value + "\n--Views" +
		vd.value );
	$('#downloadlink').removeClass('hidden');
}, false);

var LoadTables = function(){
	$("#tableStatus").text('Starting..').addClass('toBlue')
	$("#SPStatus").text('Starting..').addClass('toBlue')
	$("#TFStatus").text('Starting..').addClass('toBlue')
	$("#TRStatus").text('Starting..').addClass('toBlue')
	$("#VStatus").text('Starting..').addClass('toBlue')
	var params = $("#Checker_Form").serialize() + "&" + $("#Database1").serialize() + "&" + $("#Database2").serialize();
	console.log(params);
	$.post('/tables/getStoredProcs',params,function(response){
		var BuildSPBody = "";
		var BuildText = "";
		$("#SPStatus").text('Done').addClass('toGreen')
		var txtD = document.getElementById('SpDifferences');
		txtD.value = "";
		response.diffList.map(function(_diff){

			txtD.value += _diff.name + " " + _diff.message + "\n";
		})
		response.records.map(function(_name){
			var Stat = "";
			response.diffList.map(function(_diff){
				if(_diff.name == _name){
					Stat ='toRed';
				}
			})
			BuildSPBody += "<tr><td class='col-sm-12'><a class='"+ Stat +"'>" + _name+ "</a></td><tr>";
		})
		$("#compP").html(BuildSPBody);
	});
	$.post('/tables/getFunctions',params,function(response){
		var BuildSPBody = "";
		var BuildText = "";
		$("#TFStatus").text('Done').addClass('toGreen')
		var txtD = document.getElementById('TFDifferences');
		txtD.value = "";
		response.diffList.map(function(_diff){

			txtD.value += _diff.name + " " + _diff.message + "\n";
		})
		response.records.map(function(_name){
			var Stat = "";
			response.diffList.map(function(_diff){
				if(_diff.name == _name){
					Stat ='toRed';
				}
			})
			BuildSPBody += "<tr><td class='col-sm-12'><a class='"+ Stat +"'>" + _name+ "</a></td><tr>";
		})
		$("#compTF").html(BuildSPBody);
	});
	$.post('/tables/getTriggers',params,function(response){
		var BuildSPBody = "";
		var BuildText = "";
		$("#TRStatus").text('Done').addClass('toGreen')
		var txtD = document.getElementById('TRDifferences');
		txtD.value = "";
		response.diffList.map(function(_diff){

			txtD.value += _diff.name + " " + _diff.message + "\n";
		})
		response.records.map(function(_name){
			var Stat = "";
			response.diffList.map(function(_diff){
				if(_diff.name == _name){
					Stat ='toRed';
				}
			})
			BuildSPBody += "<tr><td class='col-sm-12'><a class='"+ Stat +"'>" + _name+ "</a></td><tr>";
		})
		$("#compTR").html(BuildSPBody);
	});
	$.post('/tables/getViews',params,function(response){
		var BuildSPBody = "";
		var BuildText = "";
		$("#VStatus").text('Done').addClass('toGreen')
		var txtD = document.getElementById('VDifferences');
		txtD.value = "";
		response.diffList.map(function(_diff){

			txtD.value += _diff.name + " " + _diff.message + "\n";
		})
		response.records.map(function(_name){
			var Stat = "";
			response.diffList.map(function(_diff){
				if(_diff.name == _name){
					Stat ='toRed';
				}
			})
			BuildSPBody += "<tr><td class='col-sm-12'><a class='"+ Stat +"'>" + _name+ "</a></td><tr>";
		})
		$("#compV").html(BuildSPBody);
	});
	var opts = {
		url:  '/tables/getTableList', timeout: 120000
	}
	$.post(opts,params,function(response){
		if(response.ConnStatus != null){
			$("#ErrorLog").text(response.ConnStatus.message);
		}
		$("#tableStatus").text('Done');
		$("#tableStatus").addClass('toGreen');
		$("#compTable").html('')
		var max = ((response.TableList1.length > response.TableList2.length)? response.TableList1.length : response.TableList2.length);
		var buildRows = "";
		var a = [];
		var b = [];
		for(var x=0 ; x < max ; x++)
		{
			if(response.TableList1.length > x){
				a.push(response.TableList1[x].TABLE_NAME)
			}
			if(response.TableList2.length > x){
				b.push(response.TableList2[x].TABLE_NAME)
			}
		}

		var txt = document.getElementById('txt');
		txt.value = "";
		var txtD = document.getElementById('textDifferences');
		txtD.value = "";
		for(var  i in response._Diff_Tables)
		{
			if(i < response._Diff_Tables.length -1)
			{
				txt.value += response._Diff_Tables[i] + "\n";
				txtD.value  += response._Diff_Tables[i] + "\n";
			}
		}
		var diff = arr_diff(a,b)

		var c =  a.concat(b).unique().sort();
		console.log();
		for(var x=0 ; x < max ; x++){

			var statRed1 = ""
			var statRed2 = ""
			$.each(response._Diff_Tables,function(w,y,z){

				if( y[0] == c[x])
				{
					statRed1 = 'toRed'
				}
			});

			//if((response.TableList1.length > x) &&)
			buildRows += "<tr><td class='col-sm-12'>"+
			((c.length > x)? "<a class='tbName "+ statRed1 +"' href='/tables/getTableList/"+c[x]+"' onclick='getTableName(event); return false;'>" + c[x] + "</a>" : '')
			+"</td><tr>";
		}
		$("#compTable").html(buildRows);
		$("#Checker_Submit").prop('disabled',false);
		$("#create").removeClass('hidden');
		$("#Checker_Submit").val('Compare Database')

	});

}
var runningVal = function(){
	setInterval(function(){
		$.post('tables/runningValue',function(res)
		{
			if(res.runningVal != 0 && res.runningVal != 100){
				$("#tableStatus").text(res.runningVal)
			}
			if(res.sqlP != 0  && res.sqlP != 100){
				$("#SPStatus").text(Number(res.sqlP).toFixed(2))
			}
			if(res.sqlTF != 0 && res.sqlTF != 100){
				$("#TFStatus").text(Number(res.sqlTF).toFixed(2))
			}
			if(res.sqlTR != 0 && res.sqlTR != 100){
				$("#TRStatus").text(Number(res.sqlTR).toFixed(2))
			}
			if(res.sqlV != 0  && res.sqlV != 100){
				$("#VStatus").text(Number(res.sqlV).toFixed(2))
			}
			//$('#consoleDetails').val('');
			var details = '';
			$.map(res.Cur,function(item)
			{
				if(item != '')
				{
					details += item +'\r\n';
				}
			});
			$('#consoleDetails').val( $('#consoleDetails').val() + details);
			//$('#consoleDetails').scrollTop($('#consoleDetails').scrollHeight);
			document.getElementById("consoleDetails").scrollTop = document.getElementById("consoleDetails").scrollHeight
		})
	},10000);
}

runningVal();
var getTableName = function(e){
	var param = $("#Database1").serialize() + "&" + $("#Database2").serialize();
	$("#tableStatus").text('Starting..');
	$("#tableStatus").addClass('toBlue');
	$.post('/tables/getTableList/'+ e.toElement.text ,param,function(response){
		$("#tableStatus").text('Done');
		$("#tableStatus").addClass('toGreen');
		var max = ((response.TableList1.length > response.TableList2.length)? response.TableList1.length : response.TableList2.length);
		var buildRows = "";
		var a = [];
		var b = [];
		var pos1 = [];
		var pos2 = [];
		t1Sort = response.TableList1;
		t2Sort = response.TableList2;
		console.log(response._Field_Diff);
		for(var x=0 ; x < max ; x++)
		{
			if(t1Sort.length > x){
				a.push(t1Sort[x])
				pos1.push(t1Sort[x].COLUMN_NAME);
			}
			else
			{
				a.push([]);
			}
			if(t2Sort.length > x){
				b.push(t2Sort[x]);
				pos2.push(t2Sort[x].COLUMN_NAME);
			}else
			{
				a.push([]);
			}


		}
		var diff = arr_diff(pos1,pos2);
		buildRows += "<thead><tr><th class='col-sm-2'><strong>COLUMN NAME</strong></th>"+
		"<th class='col-sm-2'><strong>DATA TYPE</strong></th>"+
		"<th class='col-sm-2'><strong>NULLABLE</strong></th>"+
		"<th class='col-sm-2'><strong>MAX LENGTH</strong></th>"+
		"<tr></thead>";
		var buildRows2 = "<thead><tr><th class='col-sm-2'><strong>COLUMN NAME</strong></th>"+
		"<th class='col-sm-2'><strong>DATA TYPE</strong></th>"+
		"<th class='col-sm-2'><strong>NULLABLE</strong></th>"+
		"<th class='col-sm-2'><strong>MAX LENGTH</strong></th>"+
		"<tr></thead>";
		for(var x=0 ; x < max ; x++){
			var statRed1 = "";
			$.each(diff,function(w,y,z){
				if((a.length > x) && y == a[x].COLUMN_NAME)
				{
					statRed1 = 'toRed'
				}
			});

			buildRows += "<tr><td class='col-sm-2'>"+
			((a.length > x)? "<a class='tbName "+statRed1+"' onclick='; return false;'>"  + a[x].COLUMN_NAME + "</a>" : '')
			+"</td>"+
			"<td class='col-sm-2'>"+
			((a.length > x)? "<a class='tbName' onclick='; return false;'>" + a[x].DATA_TYPE + "</a>" : '')
			+"</td>"+
			"<td class='col-sm-2'>"+
			((a.length > x)? "<a class='tbName' onclick='; return false;'>" + a[x].IS_NULLABLE + "</a>" : '')
			+"</td>"+
			"<td class='col-sm-2'>"+
			((a.length > x)? "<a class='tbName' onclick='; return false;'>" + ((a[x].CHARACTER_MAXIMUM_LENGTH != null)? a[x].CHARACTER_MAXIMUM_LENGTH :((a[x].NUMERIC_PRECISION  != null)?a[x].NUMERIC_PRECISION + ((  a[x].NUMERIC_SCALE != null)?","+ a[x].NUMERIC_SCALE:"") : "")) + "</a>" : '')
			+"</td><tr>";
		}

		for(var x=0 ; x < max ; x++){
			var statRed1 = "";
			$.each(diff,function(w,y,z){
				if((b.length > x) && y == b[x].COLUMN_NAME)
				{
					statRed1 = 'toRed'
				}
			});

			buildRows2 += "<tr><td class='col-sm-2'>"+
			((b.length > x)? "<a class='tbName "+statRed1+"' onclick='; return false;'>"  + b[x].COLUMN_NAME + "</a>" : '')
			+"</td>"+
			"<td class='col-sm-2'>"+
			((b.length > x)? "<a class='tbName' onclick='; return false;'>" + b[x].DATA_TYPE + "</a>" : '')
			+"</td>"+
			"<td class='col-sm-2'>"+
			((b.length > x)? "<a class='tbName' onclick='; return false;'>" + b[x].IS_NULLABLE + "</a>" : '')
			+"</td>"+
			"<td class='col-sm-2'>"+
			((b.length > x)? "<a class='tbName' onclick='; return false;'>" + ((b[x].CHARACTER_MAXIMUM_LENGTH != null)? b[x].CHARACTER_MAXIMUM_LENGTH :((b[x].NUMERIC_PRECISION  != null)?b[x].NUMERIC_PRECISION + ((  b[x].NUMERIC_SCALE != null)?","+ b[x].NUMERIC_SCALE:"") : "")) + "</a>" : '')
			+"</td><tr>";
		}
		$("#compTable_details").html(buildRows)

		$("#compTable_details2").html(buildRows2)
	});
}


$("#Checker_Submit").on('click',function(){
	$(this).html('Comparing Databases...')
	$(this).val('Comparing Databases...')
	$(this).prop('disabled',true)
	LoadTables();
});
$('#DB1_Form').click(function () {
	$("#ErrorLog").text("");
	var params = $("#Database1").serialize();
	$.post('/tables/CheckConnection',params,function(response){
		if (response != null)
		{
			console.log(response);
			$("#ErrorLog").text(response.message);
			$("#ErrorLog").removeClass("toGreen");
			$("#ErrorLog").addClass("toRed");
		}
		else
		{
			$("#ErrorLog").text("Success!");
			$("#ErrorLog").removeClass("toRed");
			$("#ErrorLog").addClass("toGreen");
		}
	});
});
$('#DB2_Form').click(function () {
	$("#ErrorLog").text("");
	var params = $("#Database2").serialize();
	$.post('/tables/CheckConnection2',params,function(response){
		if (response != null)
		{
			console.log(response);
			$("#ErrorLog").text(response.message);
			$("#ErrorLog").removeClass("toGreen");
			$("#ErrorLog").addClass("toRed");
		}
		else
		{
			$("#ErrorLog").text("Success!");
			$("#ErrorLog").removeClass("toRed");
			$("#ErrorLog").addClass("toGreen");
		}
	});
});



//onLoad defaults  
var server = 'WestPAC-QA\\DEV';
var user = 'sa'
var pw = 'Password1'
var DB1 = 'PayrollDev'
var DB2 = 'BuffalowIngsDev_Noservice'
$("#DB1_Server").val(server);
$("#DB1_User").val(user);
$("#DB1_Password").val(pw);
$("#DB1_Database").val(DB1);
$("#DB2_Server").val(server);
$("#DB2_User").val(user);
$("#DB2_Password").val(pw);
$("#DB2_Database").val(DB2);
