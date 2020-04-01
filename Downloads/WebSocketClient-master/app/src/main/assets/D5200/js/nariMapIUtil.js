if (!window.nariMap) {
    window.nariMap = {};
}
var nariMap = window.nariMap;

/**
 * 公用操作接口
 */
nariMap.IUtil = {};

/**
 * 电压等级色映射表
 */
nariMap.IUtil.voltageColor = {};

/**
 * 转换数值型的颜色值到HTML中识别的颜色表示
 */
nariMap.IUtil.decimalColorToHTMLcolor = function(number) {
    //converts to a integer
    var intnumber = number - 0;
 
    // isolate the colors - really not necessary
    var red, green, blue;
 
    // needed since toString does not zero fill on left
    var template = "#000000";
 
    // in the MS Windows world RGB colors
    // are 0xBBGGRR because of the way Intel chips store bytes
    red = (intnumber&0x0000ff) << 16;
    green = intnumber&0x00ff00;
    blue = (intnumber&0xff0000) >>> 16;
 
    // mask out each color and reverse the order
    intnumber = red|green|blue;
 
    // toString converts a number to a hexstring
    var HTMLcolor = intnumber.toString(16);
 
    //template adds # for standard HTML #RRGGBB
    HTMLcolor = template.substring(0,7 - HTMLcolor.length) + HTMLcolor;
 
    return HTMLcolor;
} 
