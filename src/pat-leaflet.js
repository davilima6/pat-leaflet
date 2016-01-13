(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "jquery",
            "pat-base",
            "pat-registry",
            "pat-parser",
            "pat-logger",
            "leaflet",
            "L.fullscreen",
            "L.providers",
            "L.geosearch",
            "L.geosearch.esri",
            "L.markercluster",
            "L.awesomemarkers",
            "L.locatecontrol",
            "L.minimap",
            "L.sleep"
        ], function() {
            return factory.apply(this, arguments);
        });
    } else {
        // If require.js is not available, you'll need to make sure that these
        // global variables are available.
        factory($, patterns.Base, patterns, patterns.Parser, patterns.logger,
            patterns.Leaflet, patterns.L.fullscreen, patterns.L.providers,
            patterns.L.geosearch, patterns.L.geosearch.esri,
            patterns.L.markercluster, patterns.L.awesomemarkers);
    }
}(this, function($, Base, registry, Parser, logger, L) {
    "use strict";

    var log = logger.getLogger("pat-leaflet");
    log.debug("pattern loaded");

    var parser = new Parser("leaflet");

    parser.addArgument("latitude", "0.0");
    parser.addArgument("longitude", "0.0");
    parser.addArgument("zoom", "1");

    // default controls
    parser.addArgument("fullscreencontrol", true);
    parser.addArgument("locatecontrol", true);
    parser.addArgument("zoomcontrol", true);

    // disabled controls
    parser.addArgument("autolocate", false);
    parser.addArgument("minimap", false);

    // map layers
    parser.addArgument("map_layers", [
        {"title": "Map", "id": "OpenStreetMap.Mapnik"},
        {"title": "Satellite", "id": "Esri.WorldImagery"},
        {"title": "Topographic", "id": "OpenTopoMap"},
        {"title": "Toner", "id": "Stamen.Toner"}
    ]);

    parser.addArgument("image_path", "src/bower_components/Leaflet.awesome-markers/dist/images");

    parser.addArgument("editable", false);
    parser.addArgument("input_latitude_selector", undefined);
    parser.addArgument("input_longitude_selector", undefined);

    return Base.extend({
        name: "leaflet",
        trigger: ".pat-leaflet",
        map: undefined,

        init: function initUndefined () {
            var options = this.options = parser.parse(this.$el);

            var baseLayers,
                geopoints,
                markers,
                bounds,
                geosearch;

            // MAP INIT
            var map = this.map = new L.Map(this.$el[0], {
                fullscreenControl: options.fullscreencontrol,
                zoomControl: options.zoomcontrol,
                // Leaflet.Sleep options
                sleep: true,
                sleepNote: false,
                hoverToWake: false,
                sleepOpacity: 1
            });

            L.Icon.Default.imagePath = options.image_path;

            // Layers
            // Must be an array
            if ($.isArray(options.map_layers)) {
                baseLayers = {};
                for (var cnt = 0; cnt < options.map_layers.length; cnt++) {
                    // build layers object with tileLayer instances
                    baseLayers[options.map_layers[cnt].title] = L.tileLayer.provider(options.map_layers[cnt].id);
                    if (cnt===0) {
                        baseLayers[options.map_layers[cnt].title].addTo(map); // default map
                    }
                }
                if (options.map_layers.length > 1) {
                    L.control.layers(baseLayers).addTo(map);
                }
            }

            // ADD MARKERS
            geopoints = this.$el.data().geopoints;
            if (geopoints) {
                markers = this.create_markers(geopoints, options.editable);
                map.addLayer(markers);

                // autozoom
                bounds = markers.getBounds();
                map.fitBounds(bounds);
            } else {
                map.setView(
                    [options.latitude, options.longitude],
                    options.zoom
                );
            }

            if (options.minimap) {
                var minimap = new L.Control.MiniMap(L.tileLayer.provider("OpenStreetMap.Mapnik"), {}, {sleep: false}).addTo(map);
            }

            if (options.locatecontrol || options.autolocate) {
                var locatecontrol = L.control.locate({icon: "fa fa-crosshairs"}).addTo(map);
                if (options.autolocate) {
                    locatecontrol.start();
                }
            }

            if (options.editable) {
                map.on("geosearch_showlocation", function(e) {
                    if (markers) {
                        map.removeLayer(markers);
                    }
                    var coords = e.Location;
                    this.update_inputs(coords.Y, coords.X);
                    this.bind_draggable_marker(e.Marker);
                });

                // GEOSEARCH
                geosearch = new L.Control.GeoSearch({
                    showMarker: true,
                    draggable: options.editable,
                    provider: new L.GeoSearch.Provider.Esri()
                    //provider: new L.GeoSearch.Provider.Google()
                    //provider: new L.GeoSearch.Provider.OpenStreetMap()
                });
                geosearch.addTo(map);
            }

            log.debug("pattern initialized");
        },

        green_marker: L.AwesomeMarkers.icon({
            markerColor: "green"
        }),

        update_inputs: function(lat, lng) {
            $(this.options.input_latitude_selector).attr("value", lat);
            $(this.options.input_longitude_selector).attr("value", lng);
        },

        bind_draggable_marker: function(marker) {
            marker.on("dragend", function(e) {
                var coords = e.target.getLatLng();
                this.update_inputs(coords.lat, coords.lng);
            });
        },

        create_markers: function(geopoints, editable) {
            // return MarkerClusterGroup from geopoints
            // geopoints = [{lat: NUMBER, lng: NUMBER, popup: STRING}]
            var markers = new L.MarkerClusterGroup();
            for (var i = 0, size = geopoints.length; i < size; i++) {
                var geopoint = geopoints[i],
                    marker;
                marker = new L.Marker([geopoint.lat, geopoint.lng], {
                    icon: this.green_marker,
                    draggable: editable
                });
                if (geopoint.popup) {
                    marker.bindPopup(geopoint.popup);
                }
                if (editable) {
                    this.bind_draggable_marker(marker);
                }
                markers.addLayer(marker);
            }
            return markers;
        }

    });
}));
