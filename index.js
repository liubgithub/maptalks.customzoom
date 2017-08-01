//import { isInteger } from 'core/util';
//import { on, off, maptalks.DomUtil.createEl, maptalks.DomUtil.preventDefault, maptalks.DomUtil.getEventContainerPoint } from 'core/util/dom';
//import Map from 'map/Map';
//import Control from './Control';
//import maptalks.DragHandler from 'handler/Drag';
import * as maptalks from 'maptalks';

/**
 * @property {Object}   options - options
 * @property {String|Object}   [options.position='top-left']  - position of the zoom control.
 * @property {Boolean}  [options.slider=true]                         - Whether to display the slider
 * @property {Boolean}  [options.zoomLevel=true]                      - Whether to display the text box of zoom level
 * @memberOf control.CustomZoom
 * @instance
 */
const options = {
    'position': 'top-left',
    'slider': true,
    'zoomLevel': false,
    'navPan': true
};

const UNIT = 10;

/**
 * @classdesc
 * A custom zoom control which is designed specially.
 * @category control
 * @extends control.Control
 * @memberOf control
 * @example
 * const zoomControl = new CustomZoom({
 *     position : 'top-left',
 *     slider : true,
 *     zoomLevel : false
 * }).addTo(map);
 */
export class CustomZoom extends maptalks.control.Control {

    constructor(options = {}) {
        super(options);
    }
    /**
     * method to build DOM of the control
     * @param  {Map} map map to build on
     * @return {HTMLDOMElement}
     */
    buildOn(map) {
        const options = this.options;

        const dom = maptalks.DomUtil.createEl('div', 'maptalks-zoom');
        if (options['navPan']) {
            this._createNavPan(map, dom);
        }
        const zoomDOM = maptalks.DomUtil.createEl('div', 'maptalks-zoom-slider-custom');
        const zoomInButton = maptalks.DomUtil.createEl('a', 'maptalks-zoom-zoomin-custom');
        zoomInButton.href = 'javascript:;';
        zoomDOM.appendChild(zoomInButton);
        this._zoomInButton = zoomInButton;

        if (options['slider']) {
            const sliderDOM = maptalks.DomUtil.createEl('div', 'maptalks-zoom-slider-box-custom');
            const ruler = maptalks.DomUtil.createEl('div', 'maptalks-zoom-slider-ruler-custom');
            const reading = maptalks.DomUtil.createEl('span', 'maptalks-zoom-slider-reading-custom');
            const dot = maptalks.DomUtil.createEl('span', 'maptalks-zoom-slider-dot-custom');
            zoomDOM.appendChild(sliderDOM);
            ruler.appendChild(reading);
            ruler.appendChild(dot);
            sliderDOM.appendChild(ruler);
            this._sliderBox = sliderDOM;
            this._sliderRuler = ruler;
            this._sliderReading = reading;
            this._sliderDot = dot;
        }
        const zoomOutButton = maptalks.DomUtil.createEl('a', 'maptalks-zoom-zoomout-custom');
        zoomOutButton.href = 'javascript:;';
        //zoomOutButton.innerHTML = '-';
        zoomDOM.appendChild(zoomOutButton);
        this._zoomOutButton = zoomOutButton;

        dom.appendChild(zoomDOM);

        map.on('_zoomend _zoomstart _spatialreferencechange', this._update, this);

        this._update();
        this._registerDomEvents();

        return dom;
    }

    onRemove() {
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
    }

    _createNavPan(map, dom) {
        const panDOM = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-custom');
        const leftPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-left-custom');
        leftPan.onmouseover = function () {
            leftPan.style.backgroundPosition = '-61px -19px';
        };
        leftPan.onmouseout = function () {
            leftPan.style.backgroundPosition = '-5px -19px';
        };
        leftPan.onclick = function () {
            this._PanTo({
                x:-200,
                y:0
            });
        }.bind(this);
        const rightPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-right-custom');
        rightPan.onmouseover = function () {
            rightPan.style.backgroundPosition = '-92px -19px';
        };
        rightPan.onmouseout = function () {
            rightPan.style.backgroundPosition = '-36px -19px';
        };
        rightPan.onclick = function () {
            this._PanTo({
                x:200,
                y:0
            });
        }.bind(this);
        const upPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-up-custom');
        upPan.onmouseover = function () {
            upPan.style.backgroundPosition = '-75px -5px';
        };
        upPan.onmouseout = function () {
            upPan.style.backgroundPosition = '-19px -5px';
        };
        upPan.onclick = function () {
            this._PanTo({
                x:0,
                y:-200
            });
        }.bind(this);
        const downPan = maptalks.DomUtil.createEl('div', 'maptalks-zoom-zoomPan-down-custom');
        downPan.onmouseover = function () {
            downPan.style.backgroundPosition = '-75px -32px';
        };
        downPan.onmouseout = function () {
            downPan.style.backgroundPosition = '-19px -32px';
        };
        downPan.onclick = function () {
            this._PanTo({
                x:0,
                y:200
            });
        }.bind(this);
        panDOM.appendChild(upPan);
        panDOM.appendChild(downPan);
        panDOM.appendChild(leftPan);
        panDOM.appendChild(rightPan);
        dom.appendChild(panDOM);
        this._panDOM = panDOM;
    }

    _PanTo(offset) {
        const map = this.getMap();
        let _panCoord =  map.getCenter();
        const _panPoint = map.coordinateToPoint(_panCoord);
        _panPoint.x += offset.x;
        _panPoint.y += offset.y;
        _panCoord = map.pointToCoordinate(_panPoint, map.getZoom());
        map.panTo(_panCoord);
    }
    _update() {
        const map = this.getMap();
        if (this._sliderBox) {
            const pxUnit =  UNIT;
            const totalRange = (map.getMaxZoom() - map.getMinZoom()) * pxUnit;
            this._sliderBox.style.height = totalRange + 14 + 'px';
            this._sliderRuler.style.height = totalRange + 14 + 'px';
            const zoomRange = (map.getZoom() - map.getMinZoom()) * pxUnit;
            this._sliderReading.style.height = zoomRange + 'px';
            this._sliderDot.style.top = (totalRange - zoomRange) + 'px';
        }
    }

    _updateText() {
        if (this._levelDOM) {
            const map = this.getMap();
            let zoom = map.getZoom();
            if (!maptalks.Util.isInteger(zoom)) {
                zoom = zoom.toFixed(1);
            }
            this._levelDOM.innerHTML = zoom;
        }
    }

    _registerDomEvents() {
        if (this._zoomInButton) {
            maptalks.DomUtil.on(this._zoomInButton, 'click', this._onZoomInClick, this);
        }
        if (this._zoomOutButton) {
            maptalks.DomUtil.on(this._zoomOutButton, 'click', this._onZoomOutClick, this);
        }
        if (this._sliderRuler) {
            maptalks.DomUtil.on(this._sliderRuler, 'click', this._onClickRuler, this);
            this.dotDragger = new maptalks.DragHandler(this._sliderDot, {
                'ignoreMouseleave' : true
            });
            this.dotDragger.on('dragstart', this._onDotDragstart, this)
                .on('dragend', this._onDotDrag, this)
                .enable();
        }
    }

    _onZoomInClick(e) {
        maptalks.DomUtil.preventDefault(e);
        this.getMap().zoomIn();
    }

    _onZoomOutClick(e) {
        maptalks.DomUtil.preventDefault(e);
        this.getMap().zoomOut();
    }

    _onClickRuler(e) {
        maptalks.DomUtil.preventDefault(e);
        const map = this.getMap(),
            point = maptalks.DomUtil.getEventContainerPoint(e, this._sliderRuler),
            h = point.y;
        const maxZoom = map.getMaxZoom(),
            zoom = Math.floor(maxZoom - h / UNIT);
        map.setZoom(zoom);
    }

    _onDotDragstart(e) {
        maptalks.DomUtil.preventDefault(e.domEvent);
        const map = this.getMap(),
            origin = map.getSize().toPoint()._multi(1 / 2);
        map.onZoomStart(map.getZoom(), origin);
    }

    _onDotDrag(e) {
        maptalks.DomUtil.preventDefault(e.domEvent);
        const map = this.getMap(),
            origin = map.getSize().toPoint()._multi(1 / 2),
            point = maptalks.DomUtil.getEventContainerPoint(e.domEvent, this._sliderRuler),
            maxZoom = map.getMaxZoom(),
            minZoom = map.getMinZoom();
        let top = point.y,
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
    }
}

CustomZoom.mergeOptions(options);
