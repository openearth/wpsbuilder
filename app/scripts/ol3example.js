'use strict';

/* globals _, console, ol */

$((function(){

    // initialize the map on the "map" div with a given center and zoom
    var raster = new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'sat'})
    });

    var source = new ol.source.Vector();

    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    var map = new ol.Map({
        layers: [raster, vector],
        target: 'map',
        view: new ol.View({
            center: [-11000000, 4600000],
            zoom: 4
        })
    });


    var draw; // global so we can remove it later
    function addInteraction(type) {
        draw = new ol.interaction.Draw({
            source: source,
            type: type
        });
        map.addInteraction(draw);
        return draw;
    }



    // Listen for getFeature events
    document.addEventListener('getFeature', function(ev){
        console.log('feature request', ev);
        var type = 'Polygon';
        if (ev.detail.identifier.indexOf('point') >= 0) {
            type = 'Point';
        }
        var interaction = addInteraction(type);
        draw.once('drawend', function(ev2){
            console.log(ev2);
            // Return feature to the callback
            var writer = new ol.format.GeoJSON();
            var feature = ev2.feature;
            var geometry = feature.getGeometry();
            var src2dst = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
            geometry.applyTransform(src2dst);
            feature.setGeometry(geometry);
            ev.detail.callback(ev.detail.identifier, writer.writeFeature(ev2.feature));
            map.removeInteraction(interaction);
        });


    });

    // What to do with the output
    document.addEventListener('response', function(evt){
        var scope = evt.detail.scope;
        var text = evt.detail.output.responseText;
        var xml = $.parseXML(text);
        // why is this necessary?
        var root = xml.children[0];
        var statusLocation = root.getAttribute('statusLocation');
        console.log('statusLocation', statusLocation);


        if (statusLocation) {
            // Wait a moment, it might not be there yet.....
            setTimeout(
                function(){
                    // what to do after we wait...
                    // this should be ready by now....
                    // this works for rawdataoutput... or something..
                    $.get(statusLocation, function(data){
                        scope.output = data;
                    });
                    console.log('scope', scope);
                    // You don't want to know...
                    // See https://angularjs.org/
                    // http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                    if(!scope.$$phase) {
                        scope.$digest();
                    }
                },
                5000
            );
        } else {
        }

    });

})());
