import * as maptalks from 'maptalks';

const options={
    'position'  : 'top-left',
    'slider': true,
    'zoomLevel': false,
    'navPan':true
}

export class CustomZoom extends maptalks.control.Control{
    constructor(_options){
        super(_options);
    }
    buildOn(map) {
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
                
                var distance =4/map.getZoom() * Math.pow(2, map.getZoom() - map.getMaxZoom());
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
                var distance =4/map.getZoom() * Math.pow(2, map.getZoom() - map.getMaxZoom());
                map.panTo(new maptalks.Coordinate([center.x + distance, center.y]))
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
                var distance =4/map.getZoom() * Math.pow(2, map.getZoom() - map.getMaxZoom());
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
                var distance = 4/map.getZoom() * Math.pow(2, map.getZoom() - map.getMaxZoom());
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
    }
    _update() {
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
    }
    _registerDomEvents() {
        var map = this.getMap();
        if (this._zoomInButton) {
            maptalks.DomUtil.on(this._zoomInButton, 'click', map.zoomIn, map);
        }
        if (this._zoomOutButton) {
            maptalks.DomUtil.on(this._zoomOutButton, 'click', map.zoomOut, map);
        }
            //TODO slider dot拖放缩放逻辑还没有实现
    }
    onRemove() {
        var map = this.getMap();
        if (this._zoomInButton) {
            maptalks.DomUtil.off(this._zoomInButton, 'click', map.zoomIn, map);
        }
        if (this._zoomOutButton) {
            maptalks.DomUtil.off(this._zoomOutButton, 'click', map.zoomOut, map);
        }
    }
}

CustomZoom.mergeOptions(options);
