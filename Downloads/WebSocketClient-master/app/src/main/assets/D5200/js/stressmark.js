/**
 * Created by zfor on 2016/3/28.
 */
if (!window.ngis) {
    window.ngis = {};
}

var ngis = window.ngis;

ngis.stressMark = function(options){
    this.map = options.map;//地图对象
    this.renderNum = options.renderNum === undefined ? false : options.renderNum;//圆圈闪烁的次数，默认为一直闪烁
    this.isMulti = options.isMulti === undefined ? true : options.isMulti;//是否允许多个标记存在，默认为允许
    this.duration = options.duration === undefined ? 3000 : options.duration;//控制圆圈扩散的速度,默认3000
    this.feaArr = [];
    this.stop = true;
    this.source = new ol.source.Vector({
        wrapX: false
    });
    this.vector = new ol.layer.Vector({
        source: this.source
    });
    this.map.addLayer(this.vector);
    //添加监听事件,当feature被添加到source上时触发

    var parent = this;
    var createTextStyle = function(feature, resolution) {
        var sbmc = feature.get("SBMC");
        if(resolution > 3.0){
            sbmc = "";
        }
        var poly = feature.getGeometry();
        var ext = poly.getExtent();
        var hgt = ol.extent.getHeight(ext);
        var offsetY = hgt / resolution / 2.0 + 15;
        return new ol.style.Text({
            text: sbmc,
            offsetY : -offsetY,
            stroke: new ol.style.Stroke({color: 'rgba(174, 32, 171, 1.0)', width: 1})
			// stroke: new ol.style.Stroke({color: 'rgba(255, 50, 50, 1.0)', width: 1})
        });
    };

    var styleFunction = function(feature, resolution) {


        var sym =  new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 50, 50, 1.0)',
                width: 1
            }),

            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 50, 50, 1.0)',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'red'
                })
            }),
            geometry: function(feature) {
                var poly = feature.getGeometry();
                var ext = poly.getExtent();
                return new ol.geom.Point(ol.extent.getCenter(ext));
            },

            //text: createTextStyle(feature, resolution)
        });

        return [sym];
    };
    this.select = new ol.interaction.Select({
        multi : false,
        style:styleFunction
    });
    //this.map.addInteraction(this.select);
    this.source.on('addfeature', function(e) {
        parent.flash(e.feature);
    });
}
ngis.stressMark.prototype.setStop = function(){
    this.stop = false;
    this.map.removeLayer(this.vector);
//this.source.clear();
}
ngis.stressMark.prototype.setStart = function(){
    this.stop = true;
}
ngis.stressMark.prototype.flash = function(feature) {
    var parent = this;
    var start = new Date().getTime();
    var listenerKey;

    function animate(event) {
        if(!parent.stop){
            parent.map.unByKey("listenerKey");
            return ;
        }
        var vectorContext = event.vectorContext;
        //An object representing the current render frame state.
        var frameState = event.frameState;
        var flashGeom = feature.getGeometry().clone();

        //画布开始绘制的时间frameState.time
        var elapsed = frameState.time - start;
        var elapsedRatio = elapsed / parent.duration;
        // radius will be 5 at start and 30 at end.
        var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;

        //控制颜色透明度
        var opacity = ol.easing.easeOut(1 - elapsedRatio);

        var flashStyle = new ol.style.Circle({
            radius: radius,
            snapToPixel: false,
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, ' + opacity + ')',
                width: 1
            })
        });
        // Set the image style for subsequent draw operations. Pass null to remove the image style.
        vectorContext.setImageStyle(flashStyle);
        // Render a Point geometry into the canvas. Rendering is immediate and uses the current style.
        vectorContext.drawPointGeometry(flashGeom, null);
        if (elapsed > parent.duration) {
            if(parent.renderNum){
                if(parent.renderNum > 3){
                    ol.Observable.unByKey(listenerKey);
                    return;
                }
                parent.renderNum ++;
            }
            start = new Date().getTime();
        }
        parent.map.render();
    }
    listenerKey = parent.map.on('postcompose', animate);
};

ngis.stressMark.prototype.addFeature = function(coordinates){
    var parent = this;
    var geom = new ol.geom.Point(coordinates);
    var feature = new ol.Feature(geom);
    parent.source.addFeature(feature);

};

