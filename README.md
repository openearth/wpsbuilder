# WPS Builder
Application that generates forms for Web Processing Services.

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1. You can use several `yo` commands, see `yo --help` for details.

Requires:
- [npm](http://npmjs.com)
- [Grunt](http://gruntjs.com/),  (see [windows](http://www.codebelt.com/javascript/install-grunt-js-on-windows/) install instructions)
- [Bower](http://bower.io)


## Build & development

Before starting run
- `npm install`
- `bower install`
- `grunt build`

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with the karma runner and the jasmine tests.

[![Build Status](https://travis-ci.org/openearth/wpsbuilder.svg?branch=master)](https://travis-ci.org/openearth/wpsbuilder)

## Implementing Map callback

In order to make the Select on Map button work you have to listen to the `getFeature` event on the document and call it's `event.detail.callback` with the `event.detail.identifier` and a `feature` (geojson).
See the `leaflet.html` and `openlayers.html` examples.
