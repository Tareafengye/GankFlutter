/**************************************************************************
** 	file name: 			shutdown_gis.js
** 	file description: 	gis display javascript interface
** 	create time: 		2018.06.11
** 	author: 			kxu
** 	version: 			1.0
***************************************************************************/
function goback(){
	window.history.go(-1);
}
function gosinglegrap(){
	var url = "shutdown_singlegrap.html";
	// var url = "http://22.47.46.68:8000/PowerAppForWeb/index.jsp?graph=10kV镇广线单线图.sln.pic.g";
	window.location.href = url; 
}

var device_array = new Array();
var lineStrings = new Array();

var bx_geojson = {
'type': 'FeatureCollection',
'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
                                                                                
'features': [
{ 'type': 'Feature', 'properties': { 'OID_': 0, 'SBMC': '变电箱1', 'SSXL': '天宁区1', 'LDZT': 0, 'LDDY': '220V', 'LDDL': '150mA', 'LDGL': '33W', 'GLJS': 100, 'LJYXSJ': '10000分钟', 'BCYXSJ': '1000分钟', 'SFBZ': 0, 'BZDX': 0.000000, 'BZYS': 0, 'BZFW': 0, 'PLFS': 0, 'DHZS': 0, 'X': 0.000000, 'Y': 0.000000, 'FHDX': 0.000000, 'BZXSZD': null, 'BZNR': null, 'SSDS': null, 'KZFHID': 0, 'VERSIONID': 0 }, 'geometry': { 'type': 'Point', 'coordinates': [119.9721,31.7976] } }
]
};

var xl_geojson = {
'type': 'FeatureCollection',
'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
                                                                                
'features': [
{ 'type': 'Feature', 'properties': { 'OID_': 0, 'SBMC': '变电箱1', 'SSXL': '天宁区1', 'LDZT': 0, 'LDDY': '220V', 'LDDL': '150mA', 'LDGL': '33W', 'GLJS': 100, 'LJYXSJ': '10000分钟', 'BCYXSJ': '1000分钟', 'SFBZ': 0, 'BZDX': 0.000000, 'BZYS': 0, 'BZFW': 0, 'PLFS': 0, 'DHZS': 0, 'X': 0.000000, 'Y': 0.000000, 'FHDX': 0.000000, 'BZXSZD': null, 'BZNR': null, 'SSDS': null, 'KZFHID': 0, 'VERSIONID': 0 }, 'geometry': { 'type': 'Point', 'coordinates': [119.9721,31.7976] } },
{ 'type': 'Feature', 'properties': { 'OID_': 1, 'SBMC': '变电箱2', 'SSXL': '天宁区1', 'LDZT': 0, 'LDDY': '220V', 'LDDL': '150mA', 'LDGL': '33W', 'GLJS': 100, 'LJYXSJ': '10000分钟', 'BCYXSJ': '1000分钟', 'SFBZ': 0, 'BZDX': 0.000000, 'BZYS': 0, 'BZFW': 0, 'PLFS': 0, 'DHZS': 0, 'X': 0.000000, 'Y': 0.000000, 'FHDX': 0.000000, 'BZXSZD': null, 'BZNR': null, 'SSDS': null, 'KZFHID': 0, 'VERSIONID': 0 }, 'geometry': { 'type': 'Point', 'coordinates': [119.9721,31.8026] } },
{ 'type': 'Feature', 'properties': { 'OID_': 2, 'SBMC': '变电箱3', 'SSXL': '天宁区1', 'LDZT': 0, 'LDDY': '220V', 'LDDL': '150mA', 'LDGL': '33W', 'GLJS': 100, 'LJYXSJ': '10000分钟', 'BCYXSJ': '1000分钟', 'SFBZ': 0, 'BZDX': 0.000000, 'BZYS': 0, 'BZFW': 0, 'PLFS': 0, 'DHZS': 0, 'X': 0.000000, 'Y': 0.000000, 'FHDX': 0.000000, 'BZXSZD': null, 'BZNR': null, 'SSDS': null, 'KZFHID': 0, 'VERSIONID': 0 }, 'geometry': { 'type': 'Point', 'coordinates': [119.9768,31.8076] } }
]
}


// function InitBDMap(){//公网使用，加载百度底图
	// var resolutionsBd = [];
	// var tileSize = 256;
	// for (var i = 0; i < 19; i++) {
		// resolutionsBd[i] = Math.pow(2, 18 - i);
	// }
	// var tilegrid = new ol.tilegrid.TileGrid({
		// origin: [-1500,21800],
		// resolutions: resolutionsBd
	// });
	// var bdTileSource = new ol.source.TileImage({
		// tileGrid: tilegrid,
		// projection: ol.proj.get("EPSG:3857"),
		// tileUrlFunction: function (xyz, obj1, obj2) {
			// if (!xyz) {
				// return "";
			// }
			// var z = xyz[0];
			// var x = xyz[1];
			// var y = xyz[2];

			// if (x < 0) {
				// x = "M" + (-x);
			// }
			// if (y < 0) {
				// y = "M" + (-y);
			// }
			
			// return "http://online3.map.bdimg.com/tile/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20141119&scaler=1";
		// }
	// });	

	// var resolutions = new Array(19);
	// var matrixIds = new Array(19);
	// var res = 156543.03392804096153584694438047;
	// for (var z = 1; z <= 19; z++) {
		// res /= 2.0;
		// matrixIds[z - 1] = z;
		// resolutions[z - 1] = res;
	// }
	// return new ol.layer.Tile({
		// title: '百度地图',
		// source: bdTileSource
	// });
// }
// var map = new ol.Map({
	// zoomLevel : 7,
    // target: 'map',
 // });
// var baidumap_layer = InitBDMap();
// map.addLayer(baidumap_layer);


var mapOption = {//局域网使用，调用准实时平台GIS模块，加载Google底图
	centerXY : [119.9721,31.7976],
	zoomLevel : 10,
	mapDiv : 'map'
};
var map = nariMap.IBase.createPowerMap(mapOption);
// var gisServerAddr = '178.200.11.8:8090';
var gisServerAddr = '22.47.46.68:8090';
nariMap.IService.addWMTSLayer("http://"+ gisServerAddr + "/geowebcache/service/wmts", 'changzhou', map);
var url = window.location.href;  
var data = url.split("=");

var id_array = data[1].split("&");
var id = id_array[0];
var type = data[2];
	
var json = new ol.format.GeoJSON();
var all_features;
if(type==3){
	all_features = json.readFeatures(bx_geojson,{dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"});
}else{
	all_features = json.readFeatures(xl_geojson,{dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"});
}

var initDeviceLayer = function(geojson){
	var origin_center = all_features[0].getGeometry().getExtent();
	var view = new ol.View({
		center:origin_center,
		zoom: 15,
		minZoom:10,
		maxZoom: 17
	});

	map.setView(view);
	var vectorSource = new ol.source.Vector();
	vectorSource.addFeatures(all_features);
	
	return new ol.layer.Vector({
		source: vectorSource,
		// style:  new ol.style.Style({
			// image: new ol.style.Icon(({
				// anchor:[0.5,0.9],
				// scale:0.5,
				// src: 'img/icon.png'
			// }))
		// })
		
		style: new ol.style.Style({
           image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 0, 0, 1.0)',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'red'
                })
            }),
        })

	});
}


var stressmap = new ngis.stressMark({map:map});
for(var i=0;i<all_features.length;i++){	
	stressmap.addFeature(all_features[i].getGeometry().getCoordinates());
};

if(type==3){
	var device_layer = initDeviceLayer(bx_geojson);
	map.addLayer(device_layer);
}else{
	var device_layer = initDeviceLayer(xl_geojson);
	map.addLayer(device_layer);
}

		
var adddyxlLayer = function(){
	var dyxl_source = new ol.source.Vector();
	for(var i=1;i<all_features.length;i++){
		var point1 = all_features[i-1].getGeometry().getCoordinates();
		var point2 = all_features[i].getGeometry().getCoordinates();
		var line_feature = new ol.Feature({
			geometry: new ol.geom.LineString([point1,point2])	
		});
		lineStrings.push(line_feature);
		dyxl_source.addFeature(line_feature);
	}
	var dyxl_style = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(255,0,0,1)',
			width: 2
		})
	});
	var dyxl_layer = new ol.layer.Vector({  
		source: dyxl_source,
		style: dyxl_style
	});
	map.addLayer(dyxl_layer);
	setInterval(function(){
		
		if(dyxl_layer.getStyle().getStroke().getColor()==='rgba(255,0,0,1)')
		{	
			for(var i=0;i<lineStrings.length;i++){
				dyxl_layer.getSource().removeFeature(lineStrings[i]);
			}
			dyxl_layer.getStyle().getStroke().setColor('rgba(255,255,255,0)');
			for(var i=0;i<lineStrings.length;i++){
				dyxl_layer.getSource().addFeature(lineStrings[i]);
			}
		}
		else if(dyxl_layer.getStyle().getStroke().getColor()==='rgba(255,255,255,0)')
		{					
			for(var i=0;i<lineStrings.length;i++){
				dyxl_layer.getSource().removeFeature(lineStrings[i]);
			}
			dyxl_layer.getStyle().getStroke().setColor('rgba(255,0,0,1)');
			for(var i=0;i<lineStrings.length;i++){
				dyxl_layer.getSource().addFeature(lineStrings[i]);
			}				
		}

	},600);
}
adddyxlLayer();
map.on('click', function(evt) {
	$("#device_info").hide(200);
	var feature = map.forEachFeatureAtPixel(evt.pixel,
		function(feature) {
			return feature;
		});
	if(!feature){
		return;
	}
	//console.log(feature.getGeometry().getType());
	if(feature.getGeometry().getType()=='LineString'){
		return;
	}
    var name = feature.get("SBMC");
	var ssxl = feature.get("SSXL");
	
	if((name=="")||(name=='undefined')){
		//console.log(name);
		return;
	}
	$("#device_info_1_2").html(name);
	$("#device_info_2_2").html(ssxl);
	$("#device_info").show(200); 
});
