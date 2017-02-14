/*!
 * maptalks.customzoom v2.0.0
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
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

var options = {
    'position': 'top-left',
    'slider': true,
    'zoomLevel': false,
    'navPan': true
};

var CustomZoom = function (_maptalks$control$Con) {
    _inherits(CustomZoom, _maptalks$control$Con);

    function CustomZoom(_options) {
        _classCallCheck(this, CustomZoom);

        var _this = _possibleConstructorReturn(this, _maptalks$control$Con.call(this));

        _this.options = options || _options;
        return _this;
    }

    CustomZoom.prototype.buildOn = function buildOn(map) {
        this._map = map;
        var options = this.options;

        var dom = maptalks.DomUtil.createEl('div', 'maptalks-zoom-custom');

        if (options['navPan']) {
            var level = this._map.getZoom();
            var panDOM = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-custom');
            var leftPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-left-custom');
            leftPan.onmouseover = function (e) {
                leftPan.style.backgroundPosition = "-61px -19px";
            };
            leftPan.onmouseout = function (e) {
                leftPan.style.backgroundPosition = "-5px -19px";
            };
            leftPan.onclick = function () {
                var center = map.getCenter();

                var distance = 4 / map.getZoom() * Math.pow(2, map.getZoom() - map.getMaxZoom());
                map.panTo(new maptalks.Coordinate([center.x - distance, center.y]));
            };
            var rightPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-right-custom');
            rightPan.onmouseover = function (e) {
                rightPan.style.backgroundPosition = "-92px -19px";
            };
            rightPan.onmouseout = function (e) {
                rightPan.style.backgroundPosition = "-36px -19px";
            };
            rightPan.onclick = function () {
                var center = map.getCenter();
                var distance = 4 / map.getZoom() * Math.pow(2, map.getZoom() - map.getMaxZoom());
                map.panTo(new maptalks.Coordinate([center.x + distance, center.y]));
            };
            var upPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-up-custom');
            upPan.onmouseover = function (e) {
                upPan.style.backgroundPosition = "-75px -5px";
            };
            upPan.onmouseout = function (e) {
                upPan.style.backgroundPosition = "-19px -5px";
            };
            upPan.onclick = function () {
                var center = map.getCenter();
                var distance = 4 / map.getZoom() * Math.pow(2, map.getZoom() - map.getMaxZoom());
                map.panTo(new maptalks.Coordinate([center.x, center.y + distance]));
            };
            var downPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-down-custom');
            downPan.onmouseover = function (e) {
                downPan.style.backgroundPosition = "-75px -32px";
            };
            downPan.onmouseout = function (e) {
                downPan.style.backgroundPosition = "-19px -32px";
            };
            downPan.onclick = function () {
                var center = map.getCenter();
                var distance = 4 / map.getZoom() * Math.pow(2, map.getZoom() - map.getMaxZoom());
                map.panTo(new maptalks.Coordinate([center.x, center.y - distance]));
            };
            panDOM.appendChild(upPan);
            panDOM.appendChild(downPan);
            panDOM.appendChild(leftPan);
            panDOM.appendChild(rightPan);
            dom.appendChild(panDOM);
            this._panDOM = panDOM;
        }

        if (options['zoomLevel']) {
            var levelDOM = maptalks.DomUtil.createEl('span', 'maptalks-zoom-zoomlevel-custom');
            dom.appendChild(levelDOM);
            this._levelDOM = levelDOM;
        }

        var zoomDOM = maptalks.DomUtil.createEl('div', 'maptalks-zoom-slider-custom');

        var zoomInButton = maptalks.DomUtil.createEl('a', 'maptalks-zoom-zoomin-custom');
        zoomInButton.href = 'javascript:;';
        //zoomInButton.innerHTML = '+';
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

        map.on('_zoomend _zoomstart _viewchange', this._update, this);

        this._update();
        this._registerDomEvents();

        return dom;
    };

    CustomZoom.prototype._update = function _update() {
        var map = this.getMap();
        if (this._sliderBox) {
            var pxUnit = 10;
            var totalRange = (map.getMaxZoom() - map.getMinZoom()) * pxUnit;
            //this._sliderBox.style.height = totalRange + 6 + 'px';
            //this._sliderRuler.style.height = totalRange + 'px';
            var zoomRange = (map.getZoom() - map.getMinZoom()) * pxUnit;
            this._sliderReading.style.height = zoomRange + 'px';
            this._sliderDot.style.bottom = zoomRange + 'px';
        }
        if (this._levelDOM) {
            this._levelDOM.innerHTML = map.getZoom();
        }
    };

    CustomZoom.prototype._registerDomEvents = function _registerDomEvents() {
        var map = this.getMap();
        if (this._zoomInButton) {
            maptalks.DomUtil.on(this._zoomInButton, 'click', map.zoomIn, map);
        }
        if (this._zoomOutButton) {
            maptalks.DomUtil.on(this._zoomOutButton, 'click', map.zoomOut, map);
        }
        //TODO slider dot拖放缩放逻辑还没有实现
    };

    CustomZoom.prototype.onRemove = function onRemove() {
        var map = this.getMap();
        if (this._zoomInButton) {
            maptalks.DomUtil.off(this._zoomInButton, 'click', map.zoomIn, map);
        }
        if (this._zoomOutButton) {
            maptalks.DomUtil.off(this._zoomOutButton, 'click', map.zoomOut, map);
        }
    };

    return CustomZoom;
}(maptalks.control.Control);

exports.CustomZoom = CustomZoom;

Object.defineProperty(exports, '__esModule', { value: true });

})));
