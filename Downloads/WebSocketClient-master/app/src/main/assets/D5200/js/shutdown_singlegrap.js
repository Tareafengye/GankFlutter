/**************************************************************************
** 	file name: 			shutdown_ginglegrap.js
** 	file description: 	single grap javascript interface
** 	create time: 		2018.06.28
** 	author: 			kxu
** 	version: 			1.0
***************************************************************************/

var vConsole = new VConsole();
function goback(){
	window.history.go(-1);
}

    //$('#grap').load('http://22.47.46.68:8000/PowerAppForWeb/index.jsp?graph=10kV镇广线单线图.sln.pic.g');
	 document.getElementById("grap").innerHTML = '<object type="text/html"  data="http://22.47.46.68:8000/PowerAppForWeb/index.jsp?graph=10kV迎春线单线图.sln.pic.g" width="100%" height="100%"></object>';

