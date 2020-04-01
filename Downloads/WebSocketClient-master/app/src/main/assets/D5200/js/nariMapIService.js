/**
 * 与3W服务有关的接口
 */
nariMap.IService = {};

var response = 'undefined'; 

// Request GeCapabilities 
// Should use a promesis instead 
nariMap.IService.GetVendorWMTSCapabilities = function(url,mapServiceName,map)//idx
{
    var request = "SERVICE=WMTS&REQUEST=getcapabilities&TILED=true";
    if (response == 'undefined')
    {
        var xhr = new XMLHttpRequest();
		xhr.open('GET', url+ "?" + request);
		xhr.onload = function (e) {
            response = xhr.response;
            nariMap.IService.loadLayerFromParameter(response,url,mapServiceName,map);			
        };
        xhr.send();
		return ;
    }
    nariMap.IService.loadLayerFromParameter(response,url,mapServiceName,map);	
}
	
// trick cause find don't work when name has :
nariMap.IService.getNameInNodeList = function(nodeList,i,nodeName)
{
    var child =$(nodeList[i]).children();
    for (var j=0;j<child.length;j++){
        if($(child[j]).context.nodeName==nodeName)
            return $(child[j]).text();
    }
    return "Null";
}
	
// Call GetVendorWMSCapabilities
nariMap.IService.addWMTSLayer = function(url,mapServiceName,map)
{
    nariMap.IService.GetVendorWMTSCapabilities(url,mapServiceName,map);		
}

// Get the Index of the Layer in the layer set which has mapServiceName as name
nariMap.IService.getLayerIdx = function(Layer,mapServiceName)
{
    for (var i=0;i<Layer.length;i++) {
        var layerName = nariMap.IService.getNameInNodeList(Layer,i,"OWS:IDENTIFIER");
		var sublayers = $(Layer[i]).find("Layer");
		if (sublayers.length == 0 &&  layerName == mapServiceName)
			return i;	
	}
	return -1
}
	
// Get the projection
nariMap.IService.getProjection = function(capabilitiesResponse,myTileMatrixSet)
{
    var TileMatrixSet = $(capabilitiesResponse).find("TileMatrixSet");
	for (var i=0;i<TileMatrixSet.length;i++) {
		var TileMatrixSetName = nariMap.IService.getNameInNodeList(TileMatrixSet,i,"OWS:IDENTIFIER");
		if (TileMatrixSetName==myTileMatrixSet)
		{
            var supportedCRS = nariMap.IService.getNameInNodeList(TileMatrixSet,i,"OWS:SUPPORTEDCRS");
			var codeEPSG = supportedCRS.split(':');
			return epsgCode = "EPSG:" + codeEPSG[codeEPSG.length-1];
		}
	}
	// Usual Default for Tile
	return  "EPSG:3857";
}
	
	// Get the limits of each tile matrix
nariMap.IService.getTileMatrixLimit = function(TileMatrixLimits,name)
{
    var TileLimitList =[];
	for (var i=0;i<TileMatrixLimits.length;i++) {
		var myTileMatrix = $(TileMatrixLimits[i]).find("TileMatrix").text();	
		if (name==myTileMatrix)
		{
			var MinTileRow = $(TileMatrixLimits[i]).find("MinTileRow").text();	
			var MinTileCol = $(TileMatrixLimits[i]).find("MinTileCol").text();	
			var MaxTileRow = $(TileMatrixLimits[i]).find("MaxTileRow").text();	
			var MaxTileCol = $(TileMatrixLimits[i]).find("MaxTileCol").text();		
			TileLimitList = [MinTileRow,MinTileCol,MaxTileRow,MaxTileCol];
		}
	}
	return TileLimitList;
}
	
// Get the tileSize by level
nariMap.IService.getTileSizes =	function(capabilitiesResponse,myTileMatrixSet)
{
    var TileSizeList =[];
	var TileMatrixSet = $(capabilitiesResponse).find("TileMatrixSet");
	for (var i=0;i<TileMatrixSet.length;i++) {
		var TileMatrixSetName = nariMap.IService.getNameInNodeList(TileMatrixSet,i,"OWS:IDENTIFIER");
        if (TileMatrixSetName==myTileMatrixSet)
        {
            var tms = $(TileMatrixSet[i]).find('TileWidth');
			for (var k=0;k<tms.length;k++)
			{
                var b = parseInt($(tms[k]).text());
				TileSizeList.push(b);
			}
		}
	}
    return  TileSizeList;
}
	
//Get the origins of each level
nariMap.IService.getOrigines = function(capabilitiesResponse,myTileMatrixSet)
{
    var origins =[];
	var TileMatrixSet = $(capabilitiesResponse).find("TileMatrixSet");
	for (var i=0;i<TileMatrixSet.length;i++) {
		var TileMatrixSetName = nariMap.IService.getNameInNodeList(TileMatrixSet,i,"OWS:IDENTIFIER");
		if (TileMatrixSetName==myTileMatrixSet)
		{
            var tms = $(TileMatrixSet[i]).find('TopLeftCorner');
			for (var k=0;k<tms.length;k++)
			{
                var ori = $(tms[k]).text().split(' ');
				var left = parseFloat(ori[0]);
				var top = parseFloat(ori[1]);
				origins.push([left,top]);
			}
		}
	}
    return  origins;
}
	
nariMap.IService.TileToWGS84 = function( xTile, yTile, level)
{
    var m= Math.pow(2.0, level);
    var n = Math.PI - ((2.0 * Math.PI * yTile) / m);
    var lon = (xTile / m * 360.0) - 180.0;
    var lat = 180.0 / Math.PI * Math.atan(Math.sinh(n));
	return [lon,lat]; 
}
    
// decode GetCapabilities and create the map, view and layer
// for mapServiceName layer
nariMap.IService.loadLayerFromParameter = function(capabilitiesResponse,uRLServer,mapServiceName,map)
{
    // Get All Layers from GetCapabilities
	var Layers = $(capabilitiesResponse).find("Layer");
		
	// Retrieve my layer index from the selected name 
    var i = nariMap.IService.getLayerIdx(Layers,mapServiceName);	
    var myFormat = $(Layers[i]).find("Format").text();		
	var TileMatrix = $(Layers[i]).find("TileMatrix");
	
	var TileMatrixIds = [];
    for (var t=0;t<TileMatrix.length;t++)
    {
        TileMatrixIds.push(	$(TileMatrix[t]).text());
    }
    var myTileMatrixSet = $(Layers[i]).find("TileMatrixSet").text();		
	var epsg_projection = nariMap.IService.getProjection(capabilitiesResponse,myTileMatrixSet);
	var projection = ol.proj.get(epsg_projection);
	var projectionExtent = projection.getExtent();
		
	var tileSizeListe = nariMap.IService.getTileSizes(capabilitiesResponse,myTileMatrixSet);
	var origines = nariMap.IService.getOrigines(capabilitiesResponse,myTileMatrixSet);
	
	// Retrieve 256 as TileSize in the GetCapabilities
	var widthE =ol.extent.getWidth(projectionExtent) ; 
		
	var nbReso = TileMatrixIds.length;
	var resolutions = new Array(nbReso);
	var matrixIds = new Array(nbReso);
	for (var z = 0; z < nbReso; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        var size = widthE  / tileSizeListe[z];
		resolutions[z] = size / Math.pow(2, z);
	}
	//var resolutions=[132291.9312505292, 66145.9656252646, 26458.386250105836, 19843.789687579378, 13229.193125052918, 5291.677250021167, 2645.8386250105837, 1984.3789687579376, 1322.9193125052918, 529.1677250021168, 264.5838625010584, 132.2919312505292];

    /* Not Use Yet */ 
    var TileMatrixLimits = $(Layers[i]).find("TileMatrixLimits");
    nariMap.IService.getTileMatrixLimit(TileMatrixLimits,TileMatrixIds[1]);
    var tileGrg  = new ol.tilegrid.WMTS({
                    origins: origines,
		            resolutions: resolutions,
		            matrixIds: TileMatrixIds,
		            tileSizes:tileSizeListe
		          });			
	var WMTSsource = new ol.source.WMTS({
					url: uRLServer ,
					layer: mapServiceName,
					matrixSet: myTileMatrixSet,
					format: myFormat,
					projection: projection,
					tileGrid: tileGrg,
					style: 'default'//,
					//crossOrigin: 'anonymous'
				  });
	var tileLayer =  new ol.layer.Tile({
				  title: '地理底图',
				  extent: projectionExtent,
				  source: WMTSsource,
				  zIndex: -1
				});
	map.addLayer(tileLayer);
}
	
