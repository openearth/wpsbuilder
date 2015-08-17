'use strict';

/* globals _, console, ol */

$((function(){
    // hide everything in a function for local scope
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
            var src2dst = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
            if (type === 'Polygon') {
                // we only transform the exterior (for now)....
                var exterior = feature.geometry.coordinates[0];
                feature.geometry.coordinates[0] = _.map(exterior, function(x){ return src2dst(x);});
            } else {
                // we replace the only coordiante
                var coordinates =  feature.geometry.coordinates;
                feature.geometry.coordinates = _.map(coordinates, function(x){ return src2dst(x);});


            }

            ev.detail.callback(ev.detail.identifier, writer.writeFeature(ev2.feature));
            map.removeInteraction(interaction);
        });


    });

})());
