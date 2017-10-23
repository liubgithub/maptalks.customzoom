# maptalks.customzoom.js

[![CircleCI](https://circleci.com/gh/maptalks/maptalks.customzoom.svg?style=shield)](https://circleci.com/gh/MapTalks/maptalks.customzoom)
[![NPM Version](https://img.shields.io/npm/v/maptalks.customzoom.svg)](https://github.com/maptalks/maptalks.customzoom)

A plugin of [maptalks.js](https://github.com/maptalks/maptalks.js) to set a custom zoom control which is different from maptalks's zoom control，and update some functions.

## Examples

* marker clusters of [50000 points](https://maptalks.github.io/maptalks.customzoom/demo/). (data from [Leaflet.Heat](https://github.com/Leaflet/Leaflet.heat))

## Install
  
* Install with npm: ```npm install maptalks.customzoom```. 
* Download from [dist directory](https://github.com/maptalks/maptalks.customzoom/tree/master/dist).
* Use unpkg CDN: ```https://unpkg.com/maptalks.customzoom/dist/maptalks.customzoom.min.js```

## Usage

As a plugin, ```maptalks.customzoom``` must be loaded after ```maptalks.js``` in browsers.
```html
<script type="text/javascript" src="https://unpkg.com/maptalks/dist/maptalks.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/maptalks.customzoom/dist/maptalks.customzoom.min.js"></script>
<script>
var zoom = new maptalks.CustomZoom({position: {
                    left: 100,
                    top: 50
                }
            }).addTo(map);
</script>
```

## Supported Browsers

IE 9-11, Chrome, Firefox, other modern and mobile browsers.

## API Reference

```CustomZoom``` is a subclass of [maptalks.control.Control](https://maptalks.github.io/docs/api/Control.html) and inherits all the methods of its parent.

### `Constructor`

```javascript
new maptalks.CustomZoom(options)
```

* options **Object** some config for the zoom control

## you can reference to demo in the 'demo' file

## Contributing

We welcome any kind of contributions including issue reportings, pull requests, documentation corrections, feature requests and any other helps.

## Develop

The only source file is ```index.js```.

It is written in ES6, transpiled by [babel](https://babeljs.io/) and tested with [mocha](https://mochajs.org) and [expect.js](https://github.com/Automattic/expect.js).

### Scripts

* Install dependencies
```shell
$ npm install
```

* Watch source changes and generate runnable bundle repeatedly
```shell
$ gulp watch
```

* Tests
```shell
$ npm test
```

* Watch source changes and run tests repeatedly
```shell
$ gulp tdd
```

* Package and generate minified bundles to dist directory
```shell
$ gulp minify
```

* Lint
```shell
$ npm run lint
```
