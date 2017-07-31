/*!
 * maptalks.customzoom v0.5.0
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
 */
/*!
 * requires maptalks@^0.25.0 
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks'], factory) :
	(factory((global.maptalks = global.maptalks || {}),global.maptalks));
}(this, (function (exports,maptalks) { 'use strict';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

//import { isInteger } from 'core/util';
//import { on, off, maptalks.DomUtil.createEl, maptalks.DomUtil.preventDefault, maptalks.DomUtil.getEventContainerPoint } from 'core/util/dom';
//import Map from 'map/Map';
//import Control from './Control';
//import maptalks.DragHandler from 'handler/Drag';
/**
 * @property {Object}   options - options
 * @property {String|Object}   [options.position='top-left']  - position of the zoom control.
 * @property {Boolean}  [options.slider=true]                         - Whether to display the slider
 * @property {Boolean}  [options.zoomLevel=true]                      - Whether to display the text box of zoom level
 * @memberOf control.CustomZoom
 * @instance
 */
var options = {
    'position': { top: 100, left: 200 },
    'slider': true,
    'zoomLevel': true,
    'navPan': true
};

var UNIT = 10;

/**
 * @classdesc
 * A zoom control with buttons to zoomin/zoomout and a slider indicator for the zoom level.
 * @category control
 * @extends control.Control
 * @memberOf control
 * @example
 * const zoomControl = new Zoom({
 *     position : 'top-left',
 *     slider : true,
 *     zoomLevel : false
 * }).addTo(map);
 */
var CustomZoom = function (_maptalks$control$Con) {
    _inherits(CustomZoom, _maptalks$control$Con);

    function CustomZoom() {
        _classCallCheck(this, CustomZoom);

        return _possibleConstructorReturn(this, _maptalks$control$Con.apply(this, arguments));
    }

    /**
     * method to build DOM of the control
     * @param  {Map} map map to build on
     * @return {HTMLDOMElement}
     */

    CustomZoom.prototype.buildOn = function buildOn(map) {
        var options = this.options;

        var dom = maptalks.DomUtil.createEl('div', 'maptalks-zoom');
        if (options['navPan']) {
            this._createNavPan(map, dom);
        }
        var zoomDOM = maptalks.DomUtil.createEl('div', 'maptalks-zoom-slider-custom');
        var zoomInButton = maptalks.DomUtil.createEl('a', 'maptalks-zoom-zoomin-custom');
        zoomInButton.href = 'javascript:;';
        zoomDOM.appendChild(zoomInButton);
        this._zoomInButton = zoomInButton;

        if (options['slider']) {
            var sliderDOM = maptalks.DomUtil.createEl('div', 'maptalks-zoom-slider-box-custom');
            var ruler = maptalks.DomUtil.createEl('div', 'maptalks-zoom-slider-ruler-custom');
            var reading = maptalks.DomUtil.createEl('span', 'maptalks-zoom-slider-reading-custom');
            var dot = maptalks.DomUtil.createEl('span', 'maptalks-zoom-slider-dot-custom');
            zoomDOM.appendChild(sliderDOM);
            ruler.appendChild(reading);
            ruler.appendChild(dot);
            sliderDOM.appendChild(ruler);
            this._sliderBox = sliderDOM;
            this._sliderRuler = ruler;
            this._sliderReading = reading;
            this._sliderDot = dot;
        }
        var zoomOutButton = maptalks.DomUtil.createEl('a', 'maptalks-zoom-zoomout-custom');
        zoomOutButton.href = 'javascript:;';
        //zoomOutButton.innerHTML = '-';
        zoomDOM.appendChild(zoomOutButton);
        this._zoomOutButton = zoomOutButton;

        dom.appendChild(zoomDOM);

        map.on('_zoomend _zoomstart _spatialreferencechange', this._update, this);

        this._update();
        this._registerDomEvents();

        return dom;
    };

    CustomZoom.prototype.onRemove = function onRemove() {
        this.getMap().off('_zoomend _zoomstart _spatialreferencechange', this._update, this);
        if (this._zoomInButton) {
            maptalks.DomUtil.off(this._zoomInButton, 'click', this._onZoomInClick, this);
        }
        if (this._zoomOutButton) {
            maptalks.DomUtil.off(this._zoomOutButton, 'click', this._onZoomOutClick, this);
        }
        if (this._sliderRuler) {
            maptalks.DomUtil.off(this._sliderRuler, 'click', this._onClickRuler, this);
            this.dotDragger.disable();
            delete this.dotDragger;
        }
    };

    CustomZoom.prototype._createNavPan = function _createNavPan(map, dom) {
        //const level = this._map.getZoom();
        var panDOM = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-custom');
        var leftPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-left-custom');
        leftPan.onmouseover = function () {
            leftPan.style.backgroundPosition = '-61px -19px';
        };
        leftPan.onmouseout = function () {
            leftPan.style.backgroundPosition = '-5px -19px';
        };
        leftPan.onclick = function () {
            this._PanTo({
                x: 200,
                y: 0
            });
        }.bind(this);
        var rightPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-right-custom');
        rightPan.onmouseover = function () {
            rightPan.style.backgroundPosition = '-92px -19px';
        };
        rightPan.onmouseout = function () {
            rightPan.style.backgroundPosition = '-36px -19px';
        };
        rightPan.onclick = function () {
            this._PanTo({
                x: -200,
                y: 0
            });
        }.bind(this);
        var upPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-up-custom');
        upPan.onmouseover = function () {
            upPan.style.backgroundPosition = '-75px -5px';
        };
        upPan.onmouseout = function () {
            upPan.style.backgroundPosition = '-19px -5px';
        };
        upPan.onclick = function () {
            this._PanTo({
                x: 0,
                y: 200
            });
        }.bind(this);
        var downPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-down-custom');
        downPan.onmouseover = function () {
            downPan.style.backgroundPosition = '-75px -32px';
        };
        downPan.onmouseout = function () {
            downPan.style.backgroundPosition = '-19px -32px';
        };
        downPan.onclick = function () {
            this._PanTo({
                x: 0,
                y: -200
            });
        }.bind(this);
        panDOM.appendChild(upPan);
        panDOM.appendChild(downPan);
        panDOM.appendChild(leftPan);
        panDOM.appendChild(rightPan);
        dom.appendChild(panDOM);
        this._panDOM = panDOM;
    };

    CustomZoom.prototype._PanTo = function _PanTo(offset) {
        //const map = this.getMap();
        //this._panCoord = (!this._panCoord) ? map.getCenter() : this._panCoord;
        //const _panPoint = map.coordinateToPoint(this._panCoord);
        //_panPoint.x += offset.x;
        //_panPoint.y += offset.y;
        //this._panCoord = map.pointToCoordinate(_panPoint, map.getZoom());
        //map.panTo(this._panCoord);
        var map = this.getMap();
        var _panCoord = map.getCenter();
        var _panPoint = map.coordinateToPoint(_panCoord);
        _panPoint.x += offset.x;
        _panPoint.y += offset.y;
        _panCoord = map.pointToCoordinate(_panPoint, map.getZoom());
        map.panTo(_panCoord);
    };

    CustomZoom.prototype._update = function _update() {
        var map = this.getMap();
        if (this._sliderBox) {
            var pxUnit = UNIT;
            var totalRange = (map.getMaxZoom() - map.getMinZoom()) * pxUnit;
            this._sliderBox.style.height = totalRange + 14 + 'px';
            this._sliderRuler.style.height = totalRange + 14 + 'px';
            var zoomRange = (map.getZoom() - map.getMinZoom()) * pxUnit;
            this._sliderReading.style.height = zoomRange + 'px';
            this._sliderDot.style.bottom = zoomRange + 'px';
        }
    };

    CustomZoom.prototype._updateText = function _updateText() {
        if (this._levelDOM) {
            var map = this.getMap();
            var zoom = map.getZoom();
            if (!maptalks.Util.isInteger(zoom)) {
                zoom = zoom.toFixed(1);
            }
            this._levelDOM.innerHTML = zoom;
        }
    };

    CustomZoom.prototype._registerDomEvents = function _registerDomEvents() {
        if (this._zoomInButton) {
            maptalks.DomUtil.on(this._zoomInButton, 'click', this._onZoomInClick, this);
        }
        if (this._zoomOutButton) {
            maptalks.DomUtil.on(this._zoomOutButton, 'click', this._onZoomOutClick, this);
        }
        /*if (this._sliderRuler) {
            maptalks.DomUtil.on(this._sliderRuler, 'click', this._onClickRuler, this);
            this.dotDragger = new maptalks.DragHandler(this._sliderDot, {
                'ignoreMouseleave' : true
            });
            this.dotDragger.on('dragstart', this._onDotDragstart, this)
                .on('dragend', this._onDotDrag, this)
                .enable();
        }*/
    };

    CustomZoom.prototype._onZoomInClick = function _onZoomInClick(e) {
        maptalks.DomUtil.preventDefault(e);
        this.getMap().zoomIn();
    };

    CustomZoom.prototype._onZoomOutClick = function _onZoomOutClick(e) {
        maptalks.DomUtil.preventDefault(e);
        this.getMap().zoomOut();
    };

    CustomZoom.prototype._onClickRuler = function _onClickRuler(e) {
        maptalks.DomUtil.preventDefault(e);
        var map = this.getMap(),
            point = maptalks.DomUtil.getEventContainerPoint(e, this._sliderRuler),
            h = point.y;
        var maxZoom = map.getMaxZoom(),
            zoom = Math.floor(maxZoom - h / UNIT);
        map.setZoom(zoom);
    };

    CustomZoom.prototype._onDotDragstart = function _onDotDragstart(e) {
        maptalks.DomUtil.preventDefault(e.domEvent);
        var map = this.getMap(),
            origin = map.getSize().toPoint()._multi(1 / 2);
        map.onZoomStart(map.getZoom(), origin);
    };

    CustomZoom.prototype._onDotDrag = function _onDotDrag(e) {
        maptalks.DomUtil.preventDefault(e.domEvent);
        var map = this.getMap(),
            origin = map.getSize().toPoint()._multi(1 / 2),
            point = maptalks.DomUtil.getEventContainerPoint(e.domEvent, this._sliderRuler),
            maxZoom = map.getMaxZoom(),
            minZoom = map.getMinZoom();
        var top = point.y,
            z = maxZoom - top / UNIT;

        if (maxZoom < z) {
            z = maxZoom;
            top = 0;
        } else if (minZoom > z) {
            z = minZoom;
            top = (maxZoom - minZoom) * UNIT;
        }

        if (e.type === 'dragging') {
            map.onZooming(z, origin, 1);
        } else if (e.type === 'dragend') {
            if (this.options['seamless']) {
                map.onZoomEnd(z, origin);
            } else {
                map.onZoomEnd(Math.round(z), origin);
            }
        }
        this._sliderDot.style.top = top + 'px';
        this._sliderReading.style.height = (map.getZoom() - minZoom) * UNIT + 'px';
    };

    return CustomZoom;
}(maptalks.control.Control);

CustomZoom.mergeOptions(options);

exports.CustomZoom = CustomZoom;

Object.defineProperty(exports, '__esModule', { value: true });

typeof console !== 'undefined' && console.log('maptalks.customzoom v0.5.0, requires maptalks@^0.25.0.');

})));
