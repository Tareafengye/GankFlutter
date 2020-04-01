/**************************************************************************
** 	file name: 			shutdown_info.js
** 	file description: 	shundown infomation display javascript interface
** 	create time: 		2018.06.11
** 	author: 			kxu
** 	version: 			1.0
***************************************************************************/
var infos = new Array();
function Info(id,start,address,singal,station,end){
	this.id = id;
	this.start = start;
	this.address = address;
	this.singal = singal;
	this.station = station;
	this.end = end;
}

function select_type1(){
	var text_obj = document.getElementById("tab_left_text");
	$("#tab_right_mark").html("<i class='fa fa-caret-down' aria-hidden='true'></i>");
	$("#tab_right_mark").removeClass("green");
	$("#tab_right_text").removeClass("green");
	$("#select_div2").removeClass("select_div2_on");
	$("#select_div2").addClass("select_div2_off");
	
	var condition = text_obj.innerHTML;
	if($("#tab_left_mark").hasClass("green")){
		$("#tab_left_mark").html("<i class='fa fa-caret-down' aria-hidden='true'></i>");
		$("#tab_left_mark").removeClass("green");
		$("#tab_left_text").removeClass("green");
		$("#select_div1").removeClass("select_div1_on");
		$("#select_div1").addClass("select_div1_off");
		$("#discover").removeClass("discover_on");
		$("#discover").addClass("discover_off");
	}else{
		$("#tab_left_mark").html("<i class='fa fa-caret-up' aria-hidden='true'></i>");
		$("#tab_left_mark").addClass("green");
		$("#tab_left_text").addClass("green");
		$("#select_div1").removeClass("select_div1_off");
		$("#select_div1").addClass("select_div1_on");
		if(condition=='当前停运'){	
			$("#item_1").addClass("green");
			$("#item_2").removeClass("green");
			$("#item_mark_1").html("<i class='fa fa-check' aria-hidden='true'></i>");
			$("#item_mark_2").html("");
		}else if(condition=='历史停运'){
			$("#item_1").removeClass("green");
			$("#item_2").addClass("green");
			$("#item_mark_1").html("");
			$("#item_mark_2").html("<i class='fa fa-check' aria-hidden='true'></i>");
		}

		$("#discover").removeClass("discover_off");
		$("#discover").addClass("discover_on");
		
	}
}

function select_type2(){
	var text_obj = document.getElementById("tab_right_text");
	var condition = text_obj.innerHTML;
	$("#tab_left_mark").html("<i class='fa fa-caret-down' aria-hidden='true'></i>");
	$("#tab_left_mark").removeClass("green");
	$("#tab_left_text").removeClass("green");
	$("#select_div1").removeClass("select_div1_on");
	$("#select_div1").addClass("select_div1_off");
	if($("#tab_right_mark").hasClass("green")){
		$("#tab_right_mark").html("<i class='fa fa-caret-down' aria-hidden='true'></i>");
		$("#tab_right_mark").removeClass("green");
		$("#tab_right_text").removeClass("green");
		$("#select_div2").removeClass("select_div2_on");
		$("#select_div2").addClass("select_div2_off");
		$("#discover").removeClass("discover_on");
		$("#discover").addClass("discover_off");
	}else{
		$("#tab_right_mark").html("<i class='fa fa-caret-up' aria-hidden='true'></i>");
		$("#tab_right_mark").addClass("green");
		$("#tab_right_text").addClass("green");
		if(condition=='全部类型'){
			$("#item_3").addClass("green");
			$("#item_4").removeClass("green");
			$("#item_5").removeClass("green");
			$("#item_mark_3").html("<i class='fa fa-check' aria-hidden='true'></i>");
			$("#item_mark_4").html("");
			$("#item_mark_5").html("");
		}else if(condition=='计划停电'){
			$("#item_3").removeClass("green");
			$("#item_4").addClass("green");
			$("#item_5").removeClass("green");
			$("#item_mark_3").html("");
			$("#item_mark_4").html("<i class='fa fa-check' aria-hidden='true'></i>");
			$("#item_mark_5").html("");
		}else if(condition=='故障停电'){
			$("#item_3").removeClass("green");
			$("#item_4").removeClass("green");
			$("#item_5").addClass("green");
			$("#item_mark_3").html("");
			$("#item_mark_4").html("");
			$("#item_mark_5").html("<i class='fa fa-check' aria-hidden='true'></i>");
		}
		$("#select_div2").removeClass("select_div2_off");
		$("#select_div2").addClass("select_div2_on");
		$("#discover").removeClass("discover_off");
		$("#discover").addClass("discover_on");
	}
}

function change_item(i){
	if(i==1){
		if(!$("#item_bottom_1").hasClass("green")){
			$("#item_bottom_1").addClass("green");
			$("#item_bottom_2").removeClass("green");
			$("#item_bottom_3").removeClass("green");
			$("#item_top_1").html("<img style='height:20px;' src='img/pb_on.png'/>");	
			$("#item_top_2").html("<img style='height:20px;' src='img/xl_off.png'/>");
			$("#item_top_3").html("<img style='height:20px;' src='img/yhbx_off.png'/>");
			if($("#tab_left_text").html()=='当前停运'){
				showCurrentInfo();
			}else if($("#tab_left_text").html()=='历史停运'){
				showHistoryInfo();
			}
		}
	}
	if(i==2){
		if(!$("#item_bottom_2").hasClass("green")){
			$("#item_bottom_2").addClass("green");
			$("#item_bottom_1").removeClass("green");
			$("#item_bottom_3").removeClass("green");
			$("#item_top_2").html("<img style='height:20px;' src='img/xl_on.png'/>");
			$("#item_top_3").html("<img style='height:20px;' src='img/yhbx_off.png'/>");
			$("#item_top_1").html("<img style='height:20px;' src='img/pb_off.png'/>");
			if($("#tab_left_text").html()=='当前停运'){
				showCurrentInfo();
			}else if($("#tab_left_text").html()=='历史停运'){
				showHistoryInfo();
			}
		}
	}
	if(i==3){
		if(!$("#item_bottom_3").hasClass("green")){
			$("#item_bottom_3").addClass("green");
			$("#item_bottom_1").removeClass("green");
			$("#item_bottom_2").removeClass("green");
			$("#item_top_3").html("<img style='height:20px;' src='img/yhbx_on.png'/>");
			$("#item_top_1").html("<img style='height:20px;' src='img/pb_off.png'/>");
			$("#item_top_2").html("<img style='height:20px;' src='img/xl_off.png'/>");
			if($("#tab_left_text").html()=='当前停运'){
				showCurrentInfo();
			}else if($("#tab_left_text").html()=='历史停运'){
				showHistoryInfo();
			}
		}
	}
}

function select_type(i){
	$("#tab_left_mark").removeClass("green");
	$("#tab_left_text").removeClass("green");
	$("#tab_right_mark").removeClass("green");
	$("#tab_right_text").removeClass("green");
	$("#select_div1").removeClass("select_div1_on");
	$("#select_div1").addClass("select_div1_off");
	$("#select_div2").removeClass("select_div2_on");
	$("#select_div2").addClass("select_div2_off");
	$("#discover").removeClass("discover_on");
	$("#discover").addClass("discover_off");
	if(i==1){
		$("#tab_left_text").html("当前停运");
		showCurrentInfo();
	}else if(i==2){
		$("#tab_left_text").html("历史停运");
		showHistoryInfo();
	}else if(i==3){
		$("#tab_right_text").html("全部类型");
	}else if(i==4){
		$("#tab_right_text").html("计划停电");
	}else if(i==5){
		$("#tab_right_text").html("故障停电");
	}
	
}
var content = "<div class='select_item_left'>当前停运</div>";
content += "<div class='select_item_left'>历史停运</div>";

		
function turntogis(arg){
	var url = "shutdown_gis.html?id="+infos[arg].id;
	var devicetype;
	if($("#item_bottom_1").hasClass("green")){
		devicetype = 1;
	}else if($("#item_bottom_2").hasClass("green")){
		devicetype = 2;
	}else if($("#item_bottom_3").hasClass("green")){
		devicetype = 3;
	}
	url += "&type="+devicetype;
	//console.log(url);
	window.location.href = url; 
}

// 3800475135547278495
// 3800475135547278300
showCurrentInfo();
function showCurrentInfo(){
	var devicetype = 1;
	if($("#item_bottom_1").hasClass("green")){
		devicetype = 1;
		console.log("搜索配变当前停运信息");
	}else if($("#item_bottom_2").hasClass("green")){
		devicetype = 2;
		console.log("搜索低压线路当前停运信息");
	}else if($("#item_bottom_3").hasClass("green")){
		devicetype = 3;
		console.log("搜索用户表箱当前停运信息");
	}
	$.ajax({
		// url : "http://178.200.11.7:9000/osp/terminalController/rest/outageInfo/getCurrent/"+devicetype,
		url : "http://22.47.46.68:9000/osp/terminalController/rest/outageInfo/getCurrent/"+devicetype,
		type : "get",
		async: false,
		dataType : "jsonp",
		jsonp : "jsonpCallback",
		jsonpCallback : "successCallback",
		success : function(data) {
			if(data){
				infos = [];
				for(var i=0;i<data.length;i++){
					var id = data[i].rely_brk1;
					var start = data[i].powerOffTime;
					var address = data[i].feederName;
					var singal = data[i].name;
					var station = data[i].areaName;
					var end = "";
					
					var info = new Info(id,start,address,singal,station,end);
					infos.push(info);
				}
				
				var content = "";
				if(infos.length==0){
					
					content += "<div class='no_record'><img style='width:70px' src='img/norecord.png'/></br>暂无记录</div>";
				}else {
					for(var i=0;i<infos.length;i++){
						content += "<div class='info' id='info_"+i+"'>";
						content += "<div class='info_title' id='info_title_"+i+"'>";
						content += "<i class='fa fa-map-marker' aria-hidden='true'></i>&nbsp;";
						content += infos[i].address;
						content += "</div>";
						content += "<div class='power_body' onclick='turntogis("+i+")'>";
						content += "<div class='start_item'>";
						content += "<div class='start_img'>停</div>&nbsp";
						content += "<div class='start_value'>";
						content += infos[i].start;
						content += "</div></div>";
						content += "<div class='powercut_info'>";
						content += "<div class='property_info'>";
						content += "停电信号：" +infos[i].singal;
						content += "</div>";
						content += "<div class='station_info'>";
						content += "所属台区："+infos[i].station;
						content += "</div></div>";
						content += "<div class='end_item'>";
						content += "<div class='end_img'>复</div>&nbsp";
						content += "<div class='end_value'>";
						content += infos[i].end;
						content += "</div></div></div>";
						content += "<div class='navigation'></div></div>";			
					}
				}
				$("#infos_div").html(content);
			}
			else {
				var content = "暂无记录";
				$("#infos_div").html(content);
			}
		},
		error : function(){
			var content = "<div class='no_record'><img style='width:70px' src='img/norecord.png'/></br>暂无记录</div>";
			$("#infos_div").html(content);
		}
	});
}

function showHistoryInfo(){
	var devicetype;
	if($("#item_bottom_1").hasClass("green")){
		devicetype = 1;
		console.log("搜索配变历史停运信息");
	}else if($("#item_bottom_2").hasClass("green")){
		devicetype = 2;
		console.log("搜索低压线路历史停运信息");
	}else if($("#item_bottom_3").hasClass("green")){
		devicetype = 3;
		console.log("搜索用户表箱历史停运信息");
	}
	$.ajax({
		// url : "http://178.200.11.7:9000/osp/terminalController/rest/outageInfo/getHistory/"+devicetype,
		url : "http://22.47.46.68:9000/osp/terminalController/rest/outageInfo/getHistory/"+devicetype,
		type : "get",
		async: false,
		dataType : "jsonp",
		jsonp : "jsonpCallback",
		jsonpCallback : "successCallback",
		success : function(data) {
			if(data){
				infos = [];
				for(var i=0;i<data.length;i++){
					var id = data[i].rely_brk1;
					var start = data[i].powerOffTime;
					var address = data[i].feederName;
					var singal = data[i].name;
					var station = data[i].areaName;
					var end = data[i].powerOnTime;
					
					var info = new Info(id,start,address,singal,station,end);
					infos.push(info);
				}
				
				var content = "";

				if(infos.length==0){
					content += "<div class='no_record'><img style='width:70px' src='img/norecord.png'/></br>暂无记录</div>";
				}else {
					for(var i=0;i<infos.length;i++){
						content += "<div class='info' id='info_"+i+"'>";
						content += "<div class='info_title' id='info_title_"+i+"'>";
						content += "<i class='fa fa-map-marker' aria-hidden='true'></i>&nbsp;";
						content += infos[i].address;
						content += "</div>";
						content += "<div class='power_body' onclick='turntogis("+i+")'>";
						content += "<div class='start_item'>";
						content += "<div class='start_img'>停</div>&nbsp";
						content += "<div class='start_value'>";
						content += infos[i].start;
						content += "</div></div>";
						content += "<div class='powercut_info'>";
						content += "<div class='property_info'>";
						content += "停电信号：" +infos[i].singal;
						content += "</div>";
						content += "<div class='station_info'>";
						content += "所属台区："+infos[i].station;
						content += "</div></div>";
						content += "<div class='end_item'>";
						content += "<div class='end_img'>复</div>&nbsp";
						content += "<div class='end_value'>";
						content += infos[i].end;
						content += "</div></div></div>";
						content += "<div class='navigation'></div></div>";			
					}
				}
				$("#infos_div").html(content);
				
			}
		},
		error : function(){
			var content = "<div class='no_record'><img style='width:70px' src='img/norecord.png'/></br>暂无记录</div>";
			$("#infos_div").html(content);
		}
	});
}