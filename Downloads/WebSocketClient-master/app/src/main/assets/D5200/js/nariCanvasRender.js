// FIXME test, especially polygons with holes and multipolygons
// FIXME need to handle large thick features (where pixel size matters)
// FIXME add offset and end to ol.geom.flat.transform.transform2D?

if (!window.ngis) {
    window.ngis = {};
}
var ngis = window.ngis;

/**
 * @classdesc
 * 该类对原生的ol.render.canvas.NariImmediate做了一个扩展，主要是增加了对弧的绘制，其它没有区别
 *
 * @constructor
 * @extends {ol.render.VectorContext}
 * @param {CanvasRenderingContext2D} context Context.
 * @param {number} pixelRatio Pixel ratio.
 * @param {ol.Extent} extent Extent.
 * @param {goog.vec.Mat4.Number} transform Transform.
 * @param {number} viewRotation View rotation.
 * @struct
 */
ngis.NariCanvasImmediate = function(context, pixelRatio, extent, transform, viewRotation) {

    /**
     * @private
     * @type {!Object.<string,
   *        Array.<function(ngis.NariCanvasImmediate)>>}
     */
    this.callbacksByZIndex_ = {};

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    this.context_ = context;

    /**
     * @private
     * @type {number}
     */
    this.pixelRatio_ = pixelRatio;

    /**
     * @private
     * @type {ol.Extent}
     */
    this.extent_ = extent;

    /**
     * @private
     * @type {goog.vec.Mat4.Number}
     */
    this.transform_ = transform;

    /**
     * @private
     * @type {number}
     */
    this.viewRotation_ = viewRotation;

    /**
     * @private
     * @type {?ol.render.canvas.FillState}
     */
    this.contextFillState_ = null;

    /**
     * @private
     * @type {?ol.render.canvas.StrokeState}
     */
    this.contextStrokeState_ = null;

    /**
     * @private
     * @type {?ol.render.canvas.TextState}
     */
    this.contextTextState_ = null;

    /**
     * @private
     * @type {?ol.render.canvas.FillState}
     */
    this.fillState_ = null;

    /**
     * @private
     * @type {?ol.render.canvas.StrokeState}
     */
    this.strokeState_ = null;

    /**
     * @private
     * @type {HTMLCanvasElement|HTMLVideoElement|Image}
     */
    this.image_ = null;

    /**
     * @private
     * @type {number}
     */
    this.imageAnchorX_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageAnchorY_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageHeight_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageOpacity_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageOriginX_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageOriginY_ = 0;

    /**
     * @private
     * @type {boolean}
     */
    this.imageRotateWithView_ = false;

    /**
     * @private
     * @type {number}
     */
    this.imageRotation_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageScale_ = 0;

    /**
     * @private
     * @type {boolean}
     */
    this.imageSnapToPixel_ = false;

    /**
     * @private
     * @type {number}
     */
    this.imageWidth_ = 0;

    /**
     * @private
     * @type {string}
     */
    this.text_ = '';

    /**
     * @private
     * @type {number}
     */
    this.textOffsetX_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.textOffsetY_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.textRotation_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.textScale_ = 0;

    /**
     * @private
     * @type {?ol.render.canvas.FillState}
     */
    this.textFillState_ = null;

    /**
     * @private
     * @type {?ol.render.canvas.StrokeState}
     */
    this.textStrokeState_ = null;

    /**
     * @private
     * @type {?ol.render.canvas.TextState}
     */
    this.textState_ = null;

    /**
     * @private
     * @type {Array.<number>}
     */
    this.pixelCoordinates_ = [];

    /**
     * @private
     * @type {!goog.vec.Mat4.Number}
     */
    this.tmpLocalTransform_ = goog.vec.Mat4.createNumber();

};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @private
 */
ngis.NariCanvasImmediate.prototype.drawImages_ = function(flatCoordinates, offset, end, stride) {
    if (!this.image_) {
        return;
    }
    goog.asserts.assert(offset === 0, 'offset should be 0');
    goog.asserts.assert(end == flatCoordinates.length,
        'end should be equal to the length of flatCoordinates');
    var pixelCoordinates = ol.geom.flat.transform.transform2D(
        flatCoordinates, offset, end, 2, this.transform_,
        this.pixelCoordinates_);
    var context = this.context_;
    var localTransform = this.tmpLocalTransform_;
    var alpha = context.globalAlpha;
    if (this.imageOpacity_ != 1) {
        context.globalAlpha = alpha * this.imageOpacity_;
    }
    var rotation = this.imageRotation_;
    if (this.imageRotateWithView_) {
        rotation += this.viewRotation_;
    }
    var i, ii;
    for (i = 0, ii = pixelCoordinates.length; i < ii; i += 2) {
        var x = pixelCoordinates[i] - this.imageAnchorX_;
        var y = pixelCoordinates[i + 1] - this.imageAnchorY_;
        if (this.imageSnapToPixel_) {
            x = Math.round(x);
            y = Math.round(y);
        }
        if (rotation !== 0 || this.imageScale_ != 1) {
            var centerX = x + this.imageAnchorX_;
            var centerY = y + this.imageAnchorY_;
            ol.vec.Mat4.makeTransform2D(localTransform,
                centerX, centerY, this.imageScale_, this.imageScale_,
                rotation, -centerX, -centerY);
            context.setTransform(
                goog.vec.Mat4.getElement(localTransform, 0, 0),
                goog.vec.Mat4.getElement(localTransform, 1, 0),
                goog.vec.Mat4.getElement(localTransform, 0, 1),
                goog.vec.Mat4.getElement(localTransform, 1, 1),
                goog.vec.Mat4.getElement(localTransform, 0, 3),
                goog.vec.Mat4.getElement(localTransform, 1, 3));
        }
        context.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_,
            this.imageWidth_, this.imageHeight_, x, y,
            this.imageWidth_, this.imageHeight_);
    }
    if (rotation !== 0 || this.imageScale_ != 1) {
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
    if (this.imageOpacity_ != 1) {
        context.globalAlpha = alpha;
    }
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @private
 */
ngis.NariCanvasImmediate.prototype.drawText_ = function(flatCoordinates, offset, end, stride) {
    if (!this.textState_ || this.text_ === '') {
        return;
    }
    if (this.textFillState_) {
        this.setContextFillState_(this.textFillState_);
    }
    if (this.textStrokeState_) {
        this.setContextStrokeState_(this.textStrokeState_);
    }
    this.setContextTextState_(this.textState_);
    goog.asserts.assert(offset === 0, 'offset should be 0');
    goog.asserts.assert(end == flatCoordinates.length,
        'end should be equal to the length of flatCoordinates');
    var pixelCoordinates = ol.geom.flat.transform.transform2D(
        flatCoordinates, offset, end, stride, this.transform_,
        this.pixelCoordinates_);
    var context = this.context_;
    for (; offset < end; offset += stride) {
        var x = pixelCoordinates[offset] + this.textOffsetX_;
        var y = pixelCoordinates[offset + 1] + this.textOffsetY_;
        if (this.textRotation_ !== 0 || this.textScale_ != 1) {
            var localTransform = ol.vec.Mat4.makeTransform2D(this.tmpLocalTransform_,
                x, y, this.textScale_, this.textScale_, this.textRotation_, -x, -y);
            context.setTransform(
                goog.vec.Mat4.getElement(localTransform, 0, 0),
                goog.vec.Mat4.getElement(localTransform, 1, 0),
                goog.vec.Mat4.getElement(localTransform, 0, 1),
                goog.vec.Mat4.getElement(localTransform, 1, 1),
                goog.vec.Mat4.getElement(localTransform, 0, 3),
                goog.vec.Mat4.getElement(localTransform, 1, 3));
        }
        if (this.textStrokeState_) {
            context.strokeText(this.text_, x, y);
        }
        if (this.textFillState_) {
            context.fillText(this.text_, x, y);
        }
    }
    if (this.textRotation_ !== 0 || this.textScale_ != 1) {
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {boolean} close Close.
 * @private
 * @return {number} end End.
 */
ngis.NariCanvasImmediate.prototype.moveToLineTo_ = function(flatCoordinates, offset, end, stride, close) {
    var context = this.context_;
    var pixelCoordinates = ol.geom.flat.transform.transform2D(
        flatCoordinates, offset, end, stride, this.transform_,
        this.pixelCoordinates_);
    context.moveTo(pixelCoordinates[0], pixelCoordinates[1]);
    var i;
    for (i = 2; i < pixelCoordinates.length; i += 2) {
        context.lineTo(pixelCoordinates[i], pixelCoordinates[i + 1]);
    }
    if (close) {
        context.lineTo(pixelCoordinates[0], pixelCoordinates[1]);
    }
    return end;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @private
 * @return {number} End.
 */
ngis.NariCanvasImmediate.prototype.drawRings_ = function(flatCoordinates, offset, ends, stride) {
    var context = this.context_;
    var i, ii;
    for (i = 0, ii = ends.length; i < ii; ++i) {
        offset = this.moveToLineTo_(
            flatCoordinates, offset, ends[i], stride, true);
        context.closePath(); // FIXME is this needed here?
    }
    return offset;
};


/**
 * Register a function to be called for rendering at a given zIndex.  The
 * function will be called asynchronously.  The callback will receive a
 * reference to {@link ngis.NariCanvasImmediate} context for drawing.
 *
 * @param {number} zIndex Z index.
 * @param {function(ngis.NariCanvasImmediate)} callback Callback.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawAsync = function(zIndex, callback) {
    var zIndexKey = zIndex.toString();
    var callbacks = this.callbacksByZIndex_[zIndexKey];
    if (callbacks !== undefined) {
        callbacks.push(callback);
    } else {
        this.callbacksByZIndex_[zIndexKey] = [callback];
    }
};


/**
 * Render a circle geometry into the canvas.  Rendering is NariImmediate and uses
 * the current fill and stroke styles.
 *
 * @param {ol.geom.Circle} circleGeometry Circle geometry.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawCircleGeometry = function(circleGeometry) {
    if (!ol.extent.intersects(this.extent_, circleGeometry.getExtent())) {
        return;
    }
    if (this.fillState_ || this.strokeState_) {
        if (this.fillState_) {
            this.setContextFillState_(this.fillState_);
        }
        if (this.strokeState_) {
            this.setContextStrokeState_(this.strokeState_);
        }
        var pixelCoordinates = ol.geom.transformSimpleGeometry2D(
            circleGeometry, this.transform_, this.pixelCoordinates_);
        var dx = pixelCoordinates[2] - pixelCoordinates[0];
        var dy = pixelCoordinates[3] - pixelCoordinates[1];
        var radius = Math.sqrt(dx * dx + dy * dy);
        var context = this.context_;
        context.beginPath();
        context.arc(
            pixelCoordinates[0], pixelCoordinates[1], radius, 0, 2 * Math.PI);
        if (this.fillState_) {
            context.fill();
        }
        if (this.strokeState_) {
            context.stroke();
        }
    }
    if (this.text_ !== '') {
        this.drawText_(circleGeometry.getCenter(), 0, 2, 2);
    }
};


/**
 * Render a feature into the canvas.  In order to respect the zIndex of the
 * style this method draws asynchronously and thus *after* calls to
 * drawXxxxGeometry have been finished, effectively drawing the feature
 * *on top* of everything else.  You probably should be using an
 * {@link ol.layer.Vector} instead of calling this method directly.
 *
 * @param {ol.Feature} feature Feature.
 * @param {ol.style.Style} style Style.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawFeature = function(feature, style) {
    var geometry = style.getGeometryFunction()(feature);
    if (!geometry ||
        !ol.extent.intersects(this.extent_, geometry.getExtent())) {
        return;
    }
    var zIndex = style.getZIndex();
    if (zIndex === undefined) {
        zIndex = 0;
    }
    this.drawAsync(zIndex, function(render) {
        render.setFillStrokeStyle(style.getFill(), style.getStroke());
        render.setImageStyle(style.getImage());
        render.setTextStyle(style.getText());
        var renderGeometry =
            ngis.NariCanvasImmediate.GEOMETRY_RENDERERS_[geometry.getType()];
        goog.asserts.assert(renderGeometry !== undefined,
            'renderGeometry should be defined');
        renderGeometry.call(render, geometry, null);
    });
};


/**
 * Render a GeometryCollection to the canvas.  Rendering is NariImmediate and
 * uses the current styles appropriate for each geometry in the collection.
 *
 * @param {ol.geom.GeometryCollection} geometryCollectionGeometry Geometry
 *     collection.
 * @param {ol.Feature} feature Feature.
 */
ngis.NariCanvasImmediate.prototype.drawGeometryCollectionGeometry = function(geometryCollectionGeometry, feature) {
    var geometries = geometryCollectionGeometry.getGeometriesArray();
    var i, ii;
    for (i = 0, ii = geometries.length; i < ii; ++i) {
        var geometry = geometries[i];
        var geometryRenderer =
            ngis.NariCanvasImmediate.GEOMETRY_RENDERERS_[geometry.getType()];
        goog.asserts.assert(geometryRenderer !== undefined,
            'geometryRenderer should be defined');
        geometryRenderer.call(this, geometry, feature);
    }
};


/**
 * Render a Point geometry into the canvas.  Rendering is NariImmediate and uses
 * the current style.
 *
 * @param {ol.geom.Point|ol.render.Feature} pointGeometry Point geometry.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawPointGeometry = function(pointGeometry) {
    var flatCoordinates = pointGeometry.getFlatCoordinates();
    var stride = pointGeometry.getStride();
    if (this.image_) {
        this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
    if (this.text_ !== '') {
        this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
};


/**
 * Render a MultiPoint geometry  into the canvas.  Rendering is NariImmediate and
 * uses the current style.
 *
 * @param {ol.geom.MultiPoint|ol.render.Feature} multiPointGeometry MultiPoint
 *     geometry.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawMultiPointGeometry = function(multiPointGeometry) {
    var flatCoordinates = multiPointGeometry.getFlatCoordinates();
    var stride = multiPointGeometry.getStride();
    if (this.image_) {
        this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
    if (this.text_ !== '') {
        this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
};


/**
 * Render a LineString into the canvas.  Rendering is NariImmediate and uses
 * the current style.
 *
 * @param {ol.geom.LineString|ol.render.Feature} lineStringGeometry Line
 *     string geometry.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawLineStringGeometry = function(lineStringGeometry) {
    if (!ol.extent.intersects(this.extent_, lineStringGeometry.getExtent())) {
        return;
    }
    if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        var context = this.context_;
        var flatCoordinates = lineStringGeometry.getFlatCoordinates();
        context.beginPath();
        this.moveToLineTo_(flatCoordinates, 0, flatCoordinates.length,
            lineStringGeometry.getStride(), false);
        context.stroke();
    }
    if (this.text_ !== '') {
        var flatMidpoint = lineStringGeometry.getFlatMidpoint();
        this.drawText_(flatMidpoint, 0, 2, 2);
    }
};


/**
 * Render a MultiLineString geometry into the canvas.  Rendering is NariImmediate
 * and uses the current style.
 *
 * @param {ol.geom.MultiLineString|ol.render.Feature} multiLineStringGeometry
 *     MultiLineString geometry.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawMultiLineStringGeometry = function(multiLineStringGeometry) {
    var geometryExtent = multiLineStringGeometry.getExtent();
    if (!ol.extent.intersects(this.extent_, geometryExtent)) {
        return;
    }
    if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        var context = this.context_;
        var flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
        var offset = 0;
        var ends = multiLineStringGeometry.getEnds();
        var stride = multiLineStringGeometry.getStride();
        context.beginPath();
        var i, ii;
        for (i = 0, ii = ends.length; i < ii; ++i) {
            offset = this.moveToLineTo_(
                flatCoordinates, offset, ends[i], stride, false);
        }
        context.stroke();
    }
    if (this.text_ !== '') {
        var flatMidpoints = multiLineStringGeometry.getFlatMidpoints();
        this.drawText_(flatMidpoints, 0, flatMidpoints.length, 2);
    }
};


/**
 * Render a Polygon geometry into the canvas.  Rendering is NariImmediate and uses
 * the current style.
 *
 * @param {ol.geom.Polygon|ol.render.Feature} polygonGeometry Polygon
 *     geometry.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawPolygonGeometry = function(polygonGeometry) {
    if (!ol.extent.intersects(this.extent_, polygonGeometry.getExtent())) {
        return;
    }
    if (this.strokeState_ || this.fillState_) {
        if (this.fillState_) {
            this.setContextFillState_(this.fillState_);
        }
        if (this.strokeState_) {
            this.setContextStrokeState_(this.strokeState_);
        }
        var context = this.context_;
        context.beginPath();
        this.drawRings_(polygonGeometry.getOrientedFlatCoordinates(),
            0, polygonGeometry.getEnds(), polygonGeometry.getStride());
        if (this.fillState_) {
            context.fill();
        }
        if (this.strokeState_) {
            context.stroke();
        }
    }
    if (this.text_ !== '') {
        var flatInteriorPoint = polygonGeometry.getFlatInteriorPoint();
        this.drawText_(flatInteriorPoint, 0, 2, 2);
    }
};


/**
 * Render MultiPolygon geometry into the canvas.  Rendering is NariImmediate and
 * uses the current style.
 * @param {ol.geom.MultiPolygon} multiPolygonGeometry MultiPolygon geometry.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawMultiPolygonGeometry = function(multiPolygonGeometry) {
    if (!ol.extent.intersects(this.extent_, multiPolygonGeometry.getExtent())) {
        return;
    }
    if (this.strokeState_ || this.fillState_) {
        if (this.fillState_) {
            this.setContextFillState_(this.fillState_);
        }
        if (this.strokeState_) {
            this.setContextStrokeState_(this.strokeState_);
        }
        var context = this.context_;
        var flatCoordinates = multiPolygonGeometry.getOrientedFlatCoordinates();
        var offset = 0;
        var endss = multiPolygonGeometry.getEndss();
        var stride = multiPolygonGeometry.getStride();
        var i, ii;
        for (i = 0, ii = endss.length; i < ii; ++i) {
            var ends = endss[i];
            context.beginPath();
            offset = this.drawRings_(flatCoordinates, offset, ends, stride);
            if (this.fillState_) {
                context.fill();
            }
            if (this.strokeState_) {
                context.stroke();
            }
        }
    }
    if (this.text_ !== '') {
        var flatInteriorPoints = multiPolygonGeometry.getFlatInteriorPoints();
        this.drawText_(flatInteriorPoints, 0, flatInteriorPoints.length, 2);
    }
};


/**
 * @inheritDoc
 */
ngis.NariCanvasImmediate.prototype.drawText = goog.abstractMethod;


/**
 * FIXME: empty description for jsdoc
 */
ngis.NariCanvasImmediate.prototype.flush = function() {
    /** @type {Array.<number>} */
    var zs = Object.keys(this.callbacksByZIndex_).map(Number);
    zs.sort(ol.array.numberSafeCompareFunction);
    var i, ii, callbacks, j, jj;
    for (i = 0, ii = zs.length; i < ii; ++i) {
        callbacks = this.callbacksByZIndex_[zs[i].toString()];
        for (j = 0, jj = callbacks.length; j < jj; ++j) {
            callbacks[j](this);
        }
    }
};


/**
 * @param {ol.render.canvas.FillState} fillState Fill state.
 * @private
 */
ngis.NariCanvasImmediate.prototype.setContextFillState_ = function(fillState) {
    var context = this.context_;
    var contextFillState = this.contextFillState_;
    if (!contextFillState) {
        context.fillStyle = fillState.fillStyle;
        this.contextFillState_ = {
            fillStyle: fillState.fillStyle
        };
    } else {
        if (contextFillState.fillStyle != fillState.fillStyle) {
            contextFillState.fillStyle = context.fillStyle = fillState.fillStyle;
        }
    }
};


/**
 * @param {ol.render.canvas.StrokeState} strokeState Stroke state.
 * @private
 */
ngis.NariCanvasImmediate.prototype.setContextStrokeState_ = function(strokeState) {
    var context = this.context_;
    var contextStrokeState = this.contextStrokeState_;
    if (!contextStrokeState) {
        context.lineCap = strokeState.lineCap;
        if (ol.has.CANVAS_LINE_DASH) {
            context.setLineDash(strokeState.lineDash);
        }
        context.lineJoin = strokeState.lineJoin;
        context.lineWidth = strokeState.lineWidth;
        context.miterLimit = strokeState.miterLimit;
        context.strokeStyle = strokeState.strokeStyle;
        this.contextStrokeState_ = {
            lineCap: strokeState.lineCap,
            lineDash: strokeState.lineDash,
            lineJoin: strokeState.lineJoin,
            lineWidth: strokeState.lineWidth,
            miterLimit: strokeState.miterLimit,
            strokeStyle: strokeState.strokeStyle
        };
    } else {
        if (contextStrokeState.lineCap != strokeState.lineCap) {
            contextStrokeState.lineCap = context.lineCap = strokeState.lineCap;
        }
        if (ol.has.CANVAS_LINE_DASH) {
            if (!ol.array.equals(
                    contextStrokeState.lineDash, strokeState.lineDash)) {
                context.setLineDash(contextStrokeState.lineDash = strokeState.lineDash);
            }
        }
        if (contextStrokeState.lineJoin != strokeState.lineJoin) {
            contextStrokeState.lineJoin = context.lineJoin = strokeState.lineJoin;
        }
        if (contextStrokeState.lineWidth != strokeState.lineWidth) {
            contextStrokeState.lineWidth = context.lineWidth = strokeState.lineWidth;
        }
        if (contextStrokeState.miterLimit != strokeState.miterLimit) {
            contextStrokeState.miterLimit = context.miterLimit =
                strokeState.miterLimit;
        }
        if (contextStrokeState.strokeStyle != strokeState.strokeStyle) {
            contextStrokeState.strokeStyle = context.strokeStyle =
                strokeState.strokeStyle;
        }
    }
};


/**
 * @param {ol.render.canvas.TextState} textState Text state.
 * @private
 */
ngis.NariCanvasImmediate.prototype.setContextTextState_ = function(textState) {
    var context = this.context_;
    var contextTextState = this.contextTextState_;
    if (!contextTextState) {
        context.font = textState.font;
        context.textAlign = textState.textAlign;
        context.textBaseline = textState.textBaseline;
        this.contextTextState_ = {
            font: textState.font,
            textAlign: textState.textAlign,
            textBaseline: textState.textBaseline
        };
    } else {
        if (contextTextState.font != textState.font) {
            contextTextState.font = context.font = textState.font;
        }
        if (contextTextState.textAlign != textState.textAlign) {
            contextTextState.textAlign = context.textAlign = textState.textAlign;
        }
        if (contextTextState.textBaseline != textState.textBaseline) {
            contextTextState.textBaseline = context.textBaseline =
                textState.textBaseline;
        }
    }
};


/**
 * Set the fill and stroke style for subsequent draw operations.  To clear
 * either fill or stroke styles, pass null for the appropriate parameter.
 *
 * @param {ol.style.Fill} fillStyle Fill style.
 * @param {ol.style.Stroke} strokeStyle Stroke style.
 * @api
 */
ngis.NariCanvasImmediate.prototype.setFillStrokeStyle = function(fillStyle, strokeStyle) {
    if (!fillStyle) {
        this.fillState_ = null;
    } else {
        var fillStyleColor = fillStyle.getColor();
        this.fillState_ = {
            fillStyle: ol.colorlike.asColorLike(fillStyleColor ?
                fillStyleColor : ol.render.canvas.defaultFillStyle)
        };
    }
    if (!strokeStyle) {
        this.strokeState_ = null;
    } else {
        var strokeStyleColor = strokeStyle.getColor();
        var strokeStyleLineCap = strokeStyle.getLineCap();
        var strokeStyleLineDash = strokeStyle.getLineDash();
        var strokeStyleLineJoin = strokeStyle.getLineJoin();
        var strokeStyleWidth = strokeStyle.getWidth();
        var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
        this.strokeState_ = {
            lineCap: strokeStyleLineCap !== undefined ?
                strokeStyleLineCap : ol.render.canvas.defaultLineCap,
            lineDash: strokeStyleLineDash ?
                strokeStyleLineDash : ol.render.canvas.defaultLineDash,
            lineJoin: strokeStyleLineJoin !== undefined ?
                strokeStyleLineJoin : ol.render.canvas.defaultLineJoin,
            lineWidth: this.pixelRatio_ * (strokeStyleWidth !== undefined ?
                strokeStyleWidth : ol.render.canvas.defaultLineWidth),
            miterLimit: strokeStyleMiterLimit !== undefined ?
                strokeStyleMiterLimit : ol.render.canvas.defaultMiterLimit,
            strokeStyle: ol.color.asString(strokeStyleColor ?
                strokeStyleColor : ol.render.canvas.defaultStrokeStyle)
        };
    }
};


/**
 * Set the image style for subsequent draw operations.  Pass null to remove
 * the image style.
 *
 * @param {ol.style.Image} imageStyle Image style.
 * @api
 */
ngis.NariCanvasImmediate.prototype.setImageStyle = function(imageStyle) {
    if (!imageStyle) {
        this.image_ = null;
    } else {
        var imageAnchor = imageStyle.getAnchor();
        // FIXME pixel ratio
        var imageImage = imageStyle.getImage(1);
        var imageOrigin = imageStyle.getOrigin();
        var imageSize = imageStyle.getSize();
        goog.asserts.assert(imageAnchor, 'imageAnchor must be truthy');
        goog.asserts.assert(imageImage, 'imageImage must be truthy');
        goog.asserts.assert(imageOrigin, 'imageOrigin must be truthy');
        goog.asserts.assert(imageSize, 'imageSize must be truthy');
        this.imageAnchorX_ = imageAnchor[0];
        this.imageAnchorY_ = imageAnchor[1];
        this.imageHeight_ = imageSize[1];
        this.image_ = imageImage;
        this.imageOpacity_ = imageStyle.getOpacity();
        this.imageOriginX_ = imageOrigin[0];
        this.imageOriginY_ = imageOrigin[1];
        this.imageRotateWithView_ = imageStyle.getRotateWithView();
        this.imageRotation_ = imageStyle.getRotation();
        this.imageScale_ = imageStyle.getScale();
        this.imageSnapToPixel_ = imageStyle.getSnapToPixel();
        this.imageWidth_ = imageSize[0];
    }
};


/**
 * Set the text style for subsequent draw operations.  Pass null to
 * remove the text style.
 *
 * @param {ol.style.Text} textStyle Text style.
 * @api
 */
ngis.NariCanvasImmediate.prototype.setTextStyle = function(textStyle) {
    if (!textStyle) {
        this.text_ = '';
    } else {
        var textFillStyle = textStyle.getFill();
        if (!textFillStyle) {
            this.textFillState_ = null;
        } else {
            var textFillStyleColor = textFillStyle.getColor();
            this.textFillState_ = {
                fillStyle: ol.colorlike.asColorLike(textFillStyleColor ?
                    textFillStyleColor : ol.render.canvas.defaultFillStyle)
            };
        }
        var textStrokeStyle = textStyle.getStroke();
        if (!textStrokeStyle) {
            this.textStrokeState_ = null;
        } else {
            var textStrokeStyleColor = textStrokeStyle.getColor();
            var textStrokeStyleLineCap = textStrokeStyle.getLineCap();
            var textStrokeStyleLineDash = textStrokeStyle.getLineDash();
            var textStrokeStyleLineJoin = textStrokeStyle.getLineJoin();
            var textStrokeStyleWidth = textStrokeStyle.getWidth();
            var textStrokeStyleMiterLimit = textStrokeStyle.getMiterLimit();
            this.textStrokeState_ = {
                lineCap: textStrokeStyleLineCap !== undefined ?
                    textStrokeStyleLineCap : ol.render.canvas.defaultLineCap,
                lineDash: textStrokeStyleLineDash ?
                    textStrokeStyleLineDash : ol.render.canvas.defaultLineDash,
                lineJoin: textStrokeStyleLineJoin !== undefined ?
                    textStrokeStyleLineJoin : ol.render.canvas.defaultLineJoin,
                lineWidth: textStrokeStyleWidth !== undefined ?
                    textStrokeStyleWidth : ol.render.canvas.defaultLineWidth,
                miterLimit: textStrokeStyleMiterLimit !== undefined ?
                    textStrokeStyleMiterLimit : ol.render.canvas.defaultMiterLimit,
                strokeStyle: ol.color.asString(textStrokeStyleColor ?
                    textStrokeStyleColor : ol.render.canvas.defaultStrokeStyle)
            };
        }
        var textFont = textStyle.getFont();
        var textOffsetX = textStyle.getOffsetX();
        var textOffsetY = textStyle.getOffsetY();
        var textRotation = textStyle.getRotation();
        var textScale = textStyle.getScale();
        var textText = textStyle.getText();
        var textTextAlign = textStyle.getTextAlign();
        var textTextBaseline = textStyle.getTextBaseline();
        this.textState_ = {
            font: textFont !== undefined ?
                textFont : ol.render.canvas.defaultFont,
            textAlign: textTextAlign !== undefined ?
                textTextAlign : ol.render.canvas.defaultTextAlign,
            textBaseline: textTextBaseline !== undefined ?
                textTextBaseline : ol.render.canvas.defaultTextBaseline
        };
        this.text_ = textText !== undefined ? textText : '';
        this.textOffsetX_ =
            textOffsetX !== undefined ? (this.pixelRatio_ * textOffsetX) : 0;
        this.textOffsetY_ =
            textOffsetY !== undefined ? (this.pixelRatio_ * textOffsetY) : 0;
        this.textRotation_ = textRotation !== undefined ? textRotation : 0;
        this.textScale_ = this.pixelRatio_ * (textScale !== undefined ?
                textScale : 1);
    }
};


/**
 * 在OL的基础上扩展了绘制弧段的函数
 * Render a arc geometry into the canvas.  Rendering is NariImmediate and uses
 * the current fill and stroke styles.
 *
 * @param {ol.geom.Circle} circleGeometry : Circle geometry.
 * @param {number} startRad: 开始弧度.
 * @param {number} endRad: 结束弧度.
 * @api
 */
ngis.NariCanvasImmediate.prototype.drawArcGeometry = function(circleGeometry, startRad, endRad) {
    if (!ol.extent.intersects(this.extent_, circleGeometry.getExtent())) {
        return;
    }
    if (this.fillState_ || this.strokeState_) {
        if (this.fillState_) {
            this.setContextFillState_(this.fillState_);
        }
        if (this.strokeState_) {
            this.setContextStrokeState_(this.strokeState_);
        }
        var pixelCoordinates = ol.geom.transformSimpleGeometry2D(
            circleGeometry, this.transform_, this.pixelCoordinates_);
        var dx = pixelCoordinates[2] - pixelCoordinates[0];
        var dy = pixelCoordinates[3] - pixelCoordinates[1];
        var radius = Math.sqrt(dx * dx + dy * dy);
        var context = this.context_;
        context.beginPath();

        context.arc(
            pixelCoordinates[0], pixelCoordinates[1], radius, startRad, endRad, true);

        if (this.strokeState_) {
            context.stroke();
        }
    }
    if (this.text_ !== '') {
        this.drawText_(circleGeometry.getCenter(), 0, 2, 2);
    }
};

/**
 * @const
 * @private
 * @type {Object.<ol.geom.GeometryType,
 *     function(this: ngis.NariCanvasImmediate,
 *         (ol.geom.Geometry|ol.render.Feature), Object)>}
 */
ngis.NariCanvasImmediate.GEOMETRY_RENDERERS_ = {
    'Point': ngis.NariCanvasImmediate.prototype.drawPointGeometry,
    'LineString': ngis.NariCanvasImmediate.prototype.drawLineStringGeometry,
    'Polygon': ngis.NariCanvasImmediate.prototype.drawPolygonGeometry,
    'MultiPoint': ngis.NariCanvasImmediate.prototype.drawMultiPointGeometry,
    'MultiLineString': ngis.NariCanvasImmediate.prototype.drawMultiLineStringGeometry,
    'MultiPolygon': ngis.NariCanvasImmediate.prototype.drawMultiPolygonGeometry,
    'GeometryCollection': ngis.NariCanvasImmediate.prototype.drawGeometryCollectionGeometry,
    'Circle': ngis.NariCanvasImmediate.prototype.drawCircleGeometry,
    'Arc': ngis.NariCanvasImmediate.prototype.drawArcGeometry
};


/**
 * 该类仿造原生的ol.render.toContext，生成ngis.NariCanvasImmediate
 *
 * The units for geometry coordinates are css pixels relative to the top left
 * corner of the canvas element.
 * ```js
 * var canvas = document.createElement('canvas');
 * var render = ol.render.toContext(canvas.getContext('2d'),
 *     { size: [100, 100] });
 * render.setFillStrokeStyle(new ol.style.Fill({ color: blue }));
 * render.drawPolygonGeometry(
 *     new ol.geom.Polygon([[[0, 0], [100, 100], [100, 0], [0, 0]]]));
 * ```
 *
 * Note that {@link ol.render.canvas.Immediate#drawAsync} and
 * {@link ol.render.canvas.Immediate#drawFeature} cannot be used.
 *
 * @param {CanvasRenderingContext2D} context Canvas context.
 * @param {olx.render.ToContextOptions=} opt_options Options.
 * @return {ol.render.canvas.Immediate} Canvas Immediate.
 * @api
 */
ngis.toNariContext = function(context, opt_options) {
    var canvas = context.canvas;
    var options = opt_options ? opt_options : {};
    var pixelRatio = options.pixelRatio || ol.has.DEVICE_PIXEL_RATIO;
    var size = options.size;
    if (size) {
        canvas.width = size[0] * pixelRatio;
        canvas.height = size[1] * pixelRatio;
        canvas.style.width = size[0] + 'px';
        canvas.style.height = size[1] + 'px';
    }
    var extent = [0, 0, canvas.width, canvas.height];
    var transform = ol.vec.Mat4.makeTransform2D(goog.vec.Mat4.createNumber(),
        0, 0, pixelRatio, pixelRatio, 0, 0, 0);
    return new ngis.NariCanvasImmediate(context, pixelRatio, extent, transform,
        0);
};

