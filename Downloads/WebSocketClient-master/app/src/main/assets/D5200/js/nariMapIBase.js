/**
 * 与基础地图有关的接口，基础地图包括地理底图和基本控件
 */
nariMap.IBase = {};

nariMap.IBase.createPowerMap = function(opt_options)
{
    var options = opt_options || {};
    this.centerXY_ = options.centerXY !== undefined ? options.centerXY : [110, 32];
    this.centerPrj_ = options.centerPrj !== undefined ? options.centerPrj : 'EPSG:4326';
    this.zoomLevel_ = options.zoomLevel !== undefined ? options.zoomLevel : 6;
    this.mapDiv_ = options.mapDiv;//  !== undefined ? options.mapDiv : 'map';

    var view = new ol.View({
		center: ol.proj.transform(this.centerXY_, this.centerPrj_ ,'EPSG:3857' ),
		zoom: this.zoomLevel_,
		projection: 'EPSG:3857'
	});
	var map = new ol.Map({
		target: this.mapDiv_,
		renderer: 'canvas',
		view: view,
		layers: [],
		controls: [
					new ol.control.Zoom(),
					new ol.control.ScaleLine(),
					new ol.control.MousePosition({
									coordinateFormat: ol.coordinate.createStringXY(4),
									projection: 'EPSG:4326'}),
					//new ol.control.LayerSwitcher(),
					new ol.control.OverviewMap({
						collapsible: true})
				]
    });

    return map;
}


nariMap.IBase.createThematicMap = function()
{

}